// Core Gameplay Controller for ARROW ESCAPE
// Multi-segment arrows of various lengths and shapes (straight, corner, U-turn, winding)
// Player taps an arrow -> if its escape line is clear, it glides forward off the board!
// If blocked -> shakes red, counts 1 mistake, removes 1 attempt.
class GameManager {
    constructor() {
        this.currentLevel = 1;
        this.levelData = null;
        this.attempts = 3;
        this.mistakes = 0;
        this.escapedArrowsCount = 0;
        this.hintsUsed = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.elapsedSeconds = 0;
        this.undoStack = []; // Stack for Undo
        this.isGameOver = false;
        this.isLevelComplete = false;
        this.isPaused = false;
        this.gameMode = 'normal';
        this.timeLimit = 0;
        this.boardWrapper = null;
        this.activeCells = new Map(); // "r,c" -> arrowId
        this.activeArrows = new Map(); // arrowId -> arrow
        this.comboCount = 0;
        this.lastEscapeTime = 0;
        this.isLaserMode = false;
        this.challengeStage = 1; // Challenge stage currently being played
    }

    init() {
        this.boardWrapper = document.getElementById('puzzle-grid');
    }

    startLevel(levelNumber, mode = 'normal') {
        this.currentLevel = levelNumber;
        if (mode === 'normal') {
            window.storageManager.setCurrentLevel(levelNumber);
        }
        this.gameMode = mode;
        this.attempts = 3;
        this.mistakes = 0;
        this.escapedArrowsCount = 0;
        this.hintsUsed = 0;
        this.comboCount = 0;
        this.lastEscapeTime = 0;
        this.isLaserMode = false;
        this.undoStack = [];
        this.isGameOver = false;
        this.isLevelComplete = false;
        this.isPaused = false;
        this.elapsedSeconds = 0;

        const gridEl = document.getElementById('puzzle-grid');
        if (gridEl) gridEl.classList.remove('laser-targeting-active');
        
        // Renew resources per user request: exactly 1 Hint and 1 Laser zap per level
        window.storageManager.renewLevelResources();
        this.updateBadges();

        // Generate level with long and short arrows
        this.levelData = window.levelGenerator.generateLevel(levelNumber);

        // Populate active maps
        this.activeCells.clear();
        this.activeArrows.clear();
        this.levelData.arrows.forEach(a => {
            a.isEscaped = false;
            this.activeArrows.set(a.id, a);
            a.segments.forEach(seg => {
                this.activeCells.set(`${seg.r},${seg.c}`, a.id);
            });
        });

        // Challenge mode configuration (time limit derived from the stage being played)
        if (mode === 'challenge') {
            const st = window.storageManager;
            if (!this.challengeStage) this.challengeStage = st.getChallengePlayableStage();
            this.timeLimit = st.getChallengeTimeLimitForStage(this.challengeStage);
            this.elapsedSeconds = this.timeLimit;
        }

        this.startTimer();
        this.renderGameplayUI();
        this.renderBoard();
        this.updateAttemptsUI();
        this.updateProgressUI();

        // Increment stats
        const storage = window.storageManager;
        storage.data.stats.totalRotations = storage.data.stats.totalRotations || 0;
        storage.save();
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            if (this.isPaused || this.isGameOver || this.isLevelComplete) return;

            if (this.gameMode === 'challenge') {
                this.elapsedSeconds--;
                if (this.elapsedSeconds <= 0) {
                    this.elapsedSeconds = 0;
                    this.onLevelFailed('timeout');
                }
            } else {
                this.elapsedSeconds++;
            }
            this.updateTimerUI();
        }, 1000);
        this.updateTimerUI();
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    renderGameplayUI() {
        const lvlEl = document.getElementById('hud-level-number');
        if (lvlEl) lvlEl.textContent = this.currentLevel;

        const isBoss = !!(this.levelData && this.levelData.isBoss);
        const bossBanner = document.getElementById('hud-boss-banner');
        if (bossBanner) {
            bossBanner.style.display = isBoss ? 'flex' : 'none';
        }

        const worldBadge = document.getElementById('hud-world-badge');
        if (worldBadge && this.levelData && this.levelData.worldInfo) {
            worldBadge.innerHTML = `${this.levelData.worldInfo.icon} ${this.levelData.worldInfo.name}`;
            worldBadge.style.display = 'inline-flex';
            if (this.levelData.worldInfo.color) {
                worldBadge.style.color = this.levelData.worldInfo.color;
                worldBadge.style.borderColor = this.levelData.worldInfo.color;
            }
        }

        const diffBadge = document.getElementById('hud-difficulty-badge');
        if (diffBadge && this.levelData && this.levelData.difficulty) {
            diffBadge.innerHTML = `${this.levelData.difficulty.icon} ${this.levelData.difficulty.name}`;
            diffBadge.style.display = 'inline-flex';
            if (this.levelData.difficulty.color) {
                diffBadge.style.color = this.levelData.difficulty.color;
                diffBadge.style.borderColor = this.levelData.difficulty.color;
            }
        }

        const shapeBadge = document.getElementById('hud-shape-badge');
        if (shapeBadge) {
            shapeBadge.style.display = 'none';
        }

        const isChallenge = (this.gameMode === 'challenge');
        const timerBadge = document.getElementById('hud-timer-badge');
        if (timerBadge) {
            timerBadge.style.display = isChallenge ? 'inline-flex' : 'none';
            timerBadge.classList.remove('urgent-timer');
        }

        const targetEl = document.getElementById('hud-target-moves');
        if (targetEl) targetEl.textContent = this.levelData.totalArrows;

        const movesEl = document.getElementById('hud-moves');
        if (movesEl) movesEl.textContent = this.escapedArrowsCount;

        this.updateScoreUI();
    }

    updateTimerUI() {
        const timerEl = document.getElementById('hud-timer');
        if (!timerEl) return;
        const mins = Math.floor(this.elapsedSeconds / 60);
        const secs = this.elapsedSeconds % 60;
        timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        const timerBadge = document.getElementById('hud-timer-badge');
        if (timerBadge) {
            if (this.gameMode === 'challenge') {
                if (this.elapsedSeconds <= 15) {
                    timerBadge.classList.add('urgent-timer');
                } else {
                    timerBadge.classList.remove('urgent-timer');
                }
            } else {
                timerBadge.classList.remove('urgent-timer');
            }
        }

        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) {
            if (this.gameMode === 'challenge' && this.elapsedSeconds <= 10) {
                gameScreen.classList.add('ambient-alarm-pulse');
            } else {
                gameScreen.classList.remove('ambient-alarm-pulse');
            }
        }
    }

    updateScoreUI() {
        const scoreEl = document.getElementById('hud-score');
        if (!scoreEl) return;
        const base = Math.max(100, 10000 + (this.escapedArrowsCount * 350) - (this.mistakes * 500));
        scoreEl.textContent = base.toLocaleString();
    }

    updateStarsUI() {
        const star1 = document.getElementById('hud-star-1');
        const star2 = document.getElementById('hud-star-2');
        const star3 = document.getElementById('hud-star-3');

        if (star1 && star2 && star3) {
            // Star 1 is active if mistakes < 3
            if (this.mistakes < 3) {
                star1.className = 'hud-star active';
            } else {
                star1.className = 'hud-star lost';
            }

            // Star 2 is active if mistakes < 2
            if (this.mistakes < 2) {
                star2.className = 'hud-star active';
            } else {
                star2.className = 'hud-star lost';
            }

            // Star 3 is active if mistakes < 1 (0 mistakes)
            if (this.mistakes < 1) {
                star3.className = 'hud-star active';
            } else {
                star3.className = 'hud-star lost';
            }
        }
    }

    updateAttemptsUI() {
        this.updateStarsUI();
    }

    updateProgressUI() {
        const total = this.levelData ? this.levelData.totalArrows : 1;
        const percent = Math.min(100, Math.round((this.escapedArrowsCount / Math.max(1, total)) * 100));

        const bar = document.getElementById('hud-progress-bar');
        if (bar) bar.style.width = `${percent}%`;

        // Update 3 Stars live indicators
        this.updateStarsUI();
    }

    // Render Full Arrow Maze Board with Background Grid Matrix and SVG Arrows
    renderBoard() {
        const gridEl = document.getElementById('puzzle-grid');
        if (!gridEl) return;
        const rows = this.levelData.rows || this.levelData.size;
        const cols = this.levelData.cols || this.levelData.size;

        gridEl.innerHTML = '';
        gridEl.className = `puzzle-grid size-${Math.max(rows, cols)} arrow-maze-board`;

        // Render full SVG board container (scalable coordinate system per cell)
        this.cellSize = 100;
        const cellSize = this.cellSize;
        const width = cols * cellSize;
        const height = rows * cellSize;
        const dotRadius = Math.max(1.6, Math.round(cellSize * 0.020 * 10) / 10);
        // Draw Matrix Dots tinted with the current world's signature color
        const worldColor = (this.levelData.worldInfo && this.levelData.worldInfo.color) || 'var(--neon-cyan)';
        const boardEl = document.getElementById('puzzle-grid');
        if (boardEl) boardEl.style.setProperty('--world-color', worldColor);

        let dotsSvg = '';
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cx = (c + 0.5) * cellSize;
                const cy = (r + 0.5) * cellSize;
                dotsSvg += `<circle cx="${cx}" cy="${cy}" r="${dotRadius}" fill="${worldColor}" opacity="0.45"/>`;
            }
        }

        // Draw Mystery Crate if present in this level
        let crateSvg = '';
        if (this.levelData.mysteryCrate && !this.levelData.mysteryCrate.opened) {
            const cr = this.levelData.mysteryCrate;
            const cx = (cr.c + 0.5) * cellSize;
            const cy = (cr.r + 0.5) * cellSize;
            const sz = cellSize * 0.72;
            crateSvg = `
                <g id="mystery-crate-marker" class="mystery-crate-neon" transform="translate(${cx}, ${cy})">
                    <rect x="${-sz/2}" y="${-sz/2}" width="${sz}" height="${sz}" rx="${sz*0.18}" fill="#140826" stroke="#ffd700" stroke-width="3" filter="url(#maze-orange-glow)" />
                    <!-- Neon Crate Cross Ribbons -->
                    <line x1="${-sz/2}" y1="0" x2="${sz/2}" y2="0" stroke="#ff007f" stroke-width="2.5" />
                    <line x1="0" y1="${-sz/2}" x2="0" y2="${sz/2}" stroke="#ff007f" stroke-width="2.5" />
                    <circle cx="0" cy="0" r="${sz*0.24}" fill="#ffd700" />
                    <text x="0" y="${sz*0.09}" font-family="sans-serif" font-weight="900" font-size="${sz*0.3}" text-anchor="middle" fill="#140826">?</text>
                </g>
            `;
        }

        // Draw Arrows (100% full coverage of grid)
        let arrowsSvg = '';
        this.levelData.arrows.forEach(arrow => {
            if (!arrow.isEscaped) {
                arrowsSvg += this.generateArrowSVG(arrow, cellSize);
            }
        });

        gridEl.innerHTML = `
            <svg id="board-matrix-svg" viewBox="0 0 ${width} ${height}" class="board-svg-canvas" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <filter id="maze-cyan-glow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id="maze-orange-glow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <g class="matrix-dots-layer">${dotsSvg}</g>
                <g id="crates-layer">${crateSvg}</g>
                <g id="arrows-layer">${arrowsSvg}</g>
            </svg>
        `;

        // Attach click listeners to all arrow elements
        this.levelData.arrows.forEach(arrow => {
            if (!arrow.isEscaped) {
                const el = document.getElementById(`arrow-group-${arrow.id}`);
                if (el) {
                    el.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.onArrowClick(arrow, el);
                    });
                    el.addEventListener('pointerdown', () => {
                        el.classList.add('arrow-active-touched');
                    });
                    const removeTouchHighlight = () => el.classList.remove('arrow-active-touched');
                    el.addEventListener('pointerup', removeTouchHighlight);
                    el.addEventListener('pointerleave', removeTouchHighlight);
                    el.addEventListener('pointercancel', removeTouchHighlight);
                }
            }
        });

        // Living Grid Neon Touch Ripple
        if (!gridEl._rippleBound) {
            gridEl._rippleBound = true;
            gridEl.addEventListener('pointerdown', (e) => {
                const rect = gridEl.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const ripple = document.createElement('div');
                ripple.className = 'grid-touch-ripple';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                gridEl.appendChild(ripple);
                setTimeout(() => {
                    if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
                }, 380);
            });
        }
    }

    // Generate continuous multi-segment SVG path for an arrow with dynamic mobile-proportional scaling
    renderHeadMeshSvg(cx, cy, rot, colorVar, filterId, cellSize, skin = 'classic', isTail = false) {
        // Scaled sharp arrowhead (compact & refined)
        const tipLen = Math.round(cellSize * 0.20);
        const baseHalf = Math.round(cellSize * 0.12);
        const baseH = Math.round(cellSize * 0.045);
        const cls0 = isTail ? 'arrowhead-mesh arrowhead-tail-mesh' : 'arrowhead-mesh';
        const wrap = (inner) => `
            <g class="${cls0}" data-skin="${skin}" style="transform: translate(${cx}px, ${cy}px) rotate(${rot}deg); transform-origin: 0 0;">${inner}</g>`;
        const s = cellSize;
        const f = (n) => Math.round(n * 10) / 10;

        if (skin === 'snake') {
            return wrap(`
                <path d="M 0 ${f(-s*0.36)} L 0 ${f(-s*0.44)} M 0 ${f(-s*0.44)} L ${f(-s*0.05)} ${f(-s*0.5)} M 0 ${f(-s*0.44)} L ${f(s*0.05)} ${f(-s*0.5)}" stroke="#ff2d55" stroke-width="${f(Math.max(1.5, s*0.025))}" stroke-linecap="round" fill="none" />
                <ellipse cx="0" cy="${f(-s*0.1)}" rx="${f(s*0.2)}" ry="${f(s*0.27)}" fill="${colorVar}" filter="${filterId}" opacity="0.85" />
                <ellipse cx="0" cy="${f(-s*0.1)}" rx="${f(s*0.18)}" ry="${f(s*0.25)}" fill="${colorVar}" />
                <circle cx="${f(-s*0.085)}" cy="${f(-s*0.17)}" r="${f(s*0.055)}" fill="#ffffff" />
                <circle cx="${f(s*0.085)}" cy="${f(-s*0.17)}" r="${f(s*0.055)}" fill="#ffffff" />
                <ellipse cx="${f(-s*0.085)}" cy="${f(-s*0.17)}" rx="${f(s*0.016)}" ry="${f(s*0.042)}" fill="#111" />
                <ellipse cx="${f(s*0.085)}" cy="${f(-s*0.17)}" rx="${f(s*0.016)}" ry="${f(s*0.042)}" fill="#111" />
                <circle cx="${f(-s*0.04)}" cy="${f(-s*0.31)}" r="${f(s*0.012)}" fill="#111" opacity="0.6" />
                <circle cx="${f(s*0.04)}" cy="${f(-s*0.31)}" r="${f(s*0.012)}" fill="#111" opacity="0.6" />`);
        }
        if (skin === 'worm') {
            return wrap(`
                <circle cx="0" cy="${f(-s*0.06)}" r="${f(s*0.22)}" fill="${colorVar}" filter="${filterId}" opacity="0.85" />
                <circle cx="0" cy="${f(-s*0.06)}" r="${f(s*0.2)}" fill="${colorVar}" />
                <circle cx="${f(-s*0.075)}" cy="${f(-s*0.12)}" r="${f(s*0.05)}" fill="#ffffff" />
                <circle cx="${f(s*0.075)}" cy="${f(-s*0.12)}" r="${f(s*0.05)}" fill="#ffffff" />
                <circle cx="${f(-s*0.07)}" cy="${f(-s*0.135)}" r="${f(s*0.024)}" fill="#111" />
                <circle cx="${f(s*0.07)}" cy="${f(-s*0.135)}" r="${f(s*0.024)}" fill="#111" />
                <path d="M ${f(-s*0.07)} ${f(-s*0.02)} Q 0 ${f(s*0.05)} ${f(s*0.07)} ${f(-s*0.02)}" stroke="#111" stroke-width="${f(Math.max(1.2, s*0.02))}" fill="none" stroke-linecap="round" opacity="0.75" />`);
        }
        if (skin === 'heart') {
            const h = s * 0.27, w = s * 0.32;
            const d = `M 0 ${f(-h)} C ${f(-w)} ${f(-h*0.3)} ${f(-w)} ${f(h*0.6)} 0 ${f(h*0.25)} C ${f(w)} ${f(h*0.6)} ${f(w)} ${f(-h*0.3)} 0 ${f(-h)} Z`;
            return wrap(`
                <path d="${d}" fill="${colorVar}" filter="${filterId}" opacity="0.9" transform="translate(0 ${f(-s*0.05)}) scale(1.08)" />
                <path d="${d}" fill="${colorVar}" transform="translate(0 ${f(-s*0.05)})" />
                <path d="${d}" fill="#ffffff" opacity="0.9" transform="translate(0 ${f(-s*0.05)}) scale(0.45)" />`);
        }
        if (skin === 'trident') {
            const sw = f(Math.max(2, s * 0.05));
            return wrap(`
                <path d="M ${f(-baseHalf)} ${f(-tipLen*0.55)} L ${f(-baseHalf)} ${f(-tipLen*0.1)} Q ${f(-baseHalf)} ${f(baseH*1.2)} 0 ${f(baseH*1.2)} Q ${f(baseHalf)} ${f(baseH*1.2)} ${f(baseHalf)} ${f(-tipLen*0.1)} L ${f(baseHalf)} ${f(-tipLen*0.55)} M 0 ${f(baseH*1.2)} L 0 ${f(-tipLen*0.8)}" stroke="${colorVar}" stroke-width="${sw}" fill="none" stroke-linecap="round" filter="${filterId}" />
                <polygon points="0,${f(-tipLen*1.25)} ${f(s*0.06)},${f(-tipLen*0.75)} ${f(-s*0.06)},${f(-tipLen*0.75)}" fill="${colorVar}" />
                <polygon points="${f(-baseHalf)},${f(-tipLen*0.95)} ${f(-baseHalf+s*0.055)},${f(-tipLen*0.5)} ${f(-baseHalf-s*0.055)},${f(-tipLen*0.5)}" fill="${colorVar}" />
                <polygon points="${f(baseHalf)},${f(-tipLen*0.95)} ${f(baseHalf+s*0.055)},${f(-tipLen*0.5)} ${f(baseHalf-s*0.055)},${f(-tipLen*0.5)}" fill="${colorVar}" />
                <circle cx="0" cy="${f(-tipLen*0.95)}" r="${f(s*0.02)}" fill="#ffffff" />`);
        }
        if (skin === 'crown') {
            const b = baseHalf * 1.15, t = tipLen * 1.05;
            const pts = `${f(-b)},${f(baseH*1.2)} ${f(b)},${f(baseH*1.2)} ${f(b)},${f(-t*0.75)} ${f(b*0.5)},${f(-t*0.3)} 0,${f(-t)} ${f(-b*0.5)},${f(-t*0.3)} ${f(-b)},${f(-t*0.75)}`;
            return wrap(`
                <polygon points="${pts}" fill="${colorVar}" filter="${filterId}" opacity="0.85" />
                <polygon points="${pts}" fill="${colorVar}" stroke="#ffffff" stroke-width="1" stroke-linejoin="round" />
                <circle cx="0" cy="${f(-t)}" r="${f(s*0.03)}" fill="#ffffff" />
                <circle cx="${f(-b)}" cy="${f(-t*0.75)}" r="${f(s*0.025)}" fill="#ffffff" />
                <circle cx="${f(b)}" cy="${f(-t*0.75)}" r="${f(s*0.025)}" fill="#ffffff" />
                <circle cx="0" cy="${f(-t*0.15)}" r="${f(s*0.035)}" fill="#ff2d55" stroke="#ffffff" stroke-width="0.8" />`);
        }
        if (skin === 'rocket') {
            const b = baseHalf, t = tipLen * 1.2;
            const bodyD = `M 0 ${f(-t)} C ${f(b*1.1)} ${f(-t*0.6)} ${f(b*0.85)} ${f(baseH)} ${f(b*0.6)} ${f(baseH*2)} L ${f(-b*0.6)} ${f(baseH*2)} C ${f(-b*0.85)} ${f(baseH)} ${f(-b*1.1)} ${f(-t*0.6)} 0 ${f(-t)} Z`;
            return wrap(`
                <polygon points="${f(b*0.6)},${f(-baseH)} ${f(b*1.35)},${f(baseH*2.4)} ${f(b*0.55)},${f(baseH*2)}" fill="${colorVar}" />
                <polygon points="${f(-b*0.6)},${f(-baseH)} ${f(-b*1.35)},${f(baseH*2.4)} ${f(-b*0.55)},${f(baseH*2)}" fill="${colorVar}" />
                <path d="${bodyD}" fill="${colorVar}" filter="${filterId}" opacity="0.85" />
                <path d="${bodyD}" fill="#ffffff" opacity="0.92" />
                <circle cx="0" cy="${f(-t*0.35)}" r="${f(s*0.055)}" fill="${colorVar}" stroke="#ffffff" stroke-width="1" />
                <path d="M ${f(-b*0.45)} ${f(-t*0.72)} Q 0 ${f(-t*0.6)} ${f(b*0.45)} ${f(-t*0.72)}" stroke="${colorVar}" stroke-width="1.4" fill="none" />`);
        }
        if (skin === 'star') {
            const R = s * 0.24, r = R * 0.45, cy0 = -s * 0.08;
            let pts = '';
            for (let i = 0; i < 10; i++) {
                const ang = -Math.PI / 2 + i * Math.PI / 5;
                const rad = (i % 2 === 0) ? R : r;
                pts += `${f(Math.cos(ang) * rad)},${f(cy0 + Math.sin(ang) * rad)} `;
            }
            return wrap(`
                <polygon points="${pts}" fill="${colorVar}" filter="${filterId}" opacity="0.85" />
                <polygon points="${pts}" fill="${colorVar}" stroke="#ffffff" stroke-width="1" stroke-linejoin="round" />
                <circle cx="0" cy="${f(cy0)}" r="${f(r * 0.55)}" fill="#ffffff" />`);
        }
        if (skin === 'chevron') {
            const sw = f(Math.max(2.5, s * 0.07));
            const b = baseHalf * 1.1;
            return wrap(`
                <path d="M ${f(-b)} ${f(baseH)} L 0 ${f(-tipLen*0.45)} L ${f(b)} ${f(baseH)}" stroke="${colorVar}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round" filter="${filterId}" />
                <path d="M ${f(-b)} ${f(-tipLen*0.35)} L 0 ${f(-tipLen*1.15)} L ${f(b)} ${f(-tipLen*0.35)}" stroke="${colorVar}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M ${f(-b*0.6)} ${f(-tipLen*0.55)} L 0 ${f(-tipLen*1.0)} L ${f(b*0.6)} ${f(-tipLen*0.55)}" stroke="#ffffff" stroke-width="${f(sw*0.35)}" fill="none" stroke-linecap="round" />`);
        }
        if (skin === 'drop') {
            const b = baseHalf * 1.1, t = tipLen * 1.15;
            const d = `M 0 ${f(-t)} C ${f(b*0.6)} ${f(-t*0.5)} ${f(b*1.1)} ${f(-t*0.1)} ${f(b)} ${f(baseH*0.6)} A ${f(b)} ${f(b)} 0 0 1 ${f(-b)} ${f(baseH*0.6)} C ${f(-b*1.1)} ${f(-t*0.1)} ${f(-b*0.6)} ${f(-t*0.5)} 0 ${f(-t)} Z`;
            return wrap(`
                <path d="${d}" fill="${colorVar}" filter="${filterId}" opacity="0.85" />
                <path d="${d}" fill="${colorVar}" />
                <ellipse cx="${f(-b*0.35)}" cy="${f(-t*0.15)}" rx="${f(b*0.18)}" ry="${f(b*0.38)}" fill="#ffffff" opacity="0.9" />`);
        }
        if (skin === 'cat') {
            const R = s * 0.19, cy0 = -s * 0.06;
            return wrap(`
                <polygon points="${f(-R*0.95)},${f(cy0-R*0.3)} ${f(-R*0.75)},${f(cy0-R*1.45)} ${f(-R*0.15)},${f(cy0-R*0.85)}" fill="${colorVar}" />
                <polygon points="${f(R*0.95)},${f(cy0-R*0.3)} ${f(R*0.75)},${f(cy0-R*1.45)} ${f(R*0.15)},${f(cy0-R*0.85)}" fill="${colorVar}" />
                <circle cx="0" cy="${f(cy0)}" r="${f(R*1.05)}" fill="${colorVar}" filter="${filterId}" opacity="0.85" />
                <circle cx="0" cy="${f(cy0)}" r="${f(R)}" fill="${colorVar}" />
                <ellipse cx="${f(-R*0.4)}" cy="${f(cy0-R*0.15)}" rx="${f(R*0.2)}" ry="${f(R*0.28)}" fill="#ffffff" />
                <ellipse cx="${f(R*0.4)}" cy="${f(cy0-R*0.15)}" rx="${f(R*0.2)}" ry="${f(R*0.28)}" fill="#ffffff" />
                <ellipse cx="${f(-R*0.4)}" cy="${f(cy0-R*0.15)}" rx="${f(R*0.07)}" ry="${f(R*0.22)}" fill="#111" />
                <ellipse cx="${f(R*0.4)}" cy="${f(cy0-R*0.15)}" rx="${f(R*0.07)}" ry="${f(R*0.22)}" fill="#111" />
                <polygon points="${f(-R*0.12)},${f(cy0+R*0.3)} ${f(R*0.12)},${f(cy0+R*0.3)} 0,${f(cy0+R*0.45)}" fill="#ff6fa8" />`);
        }
        if (skin === 'moon') {
            const R = s * 0.22, c = -s * 0.12;
            const d = `M ${f(-R)} ${f(c)} A ${f(R)} ${f(R)} 0 0 0 ${f(R)} ${f(c)} A ${f(R*1.3)} ${f(R*1.3)} 0 0 1 ${f(-R)} ${f(c)} Z`;
            return wrap(`
                <path d="${d}" fill="${colorVar}" filter="${filterId}" opacity="0.85" />
                <path d="${d}" fill="${colorVar}" stroke="#ffffff" stroke-width="1" />
                <circle cx="${f(R*0.55)}" cy="${f(c - R*0.75)}" r="${f(s*0.025)}" fill="#ffffff" />
                <circle cx="${f(-R*0.6)}" cy="${f(c - R*0.95)}" r="${f(s*0.018)}" fill="#ffffff" />`);
        }
        if (skin === 'ghost') {
            const w = s * 0.19, top = -s * 0.1, b = s * 0.12;
            const d = `M ${f(-w)} ${f(b)} L ${f(-w)} ${f(top)} A ${f(w)} ${f(w)} 0 0 1 ${f(w)} ${f(top)} L ${f(w)} ${f(b)} L ${f(w*0.5)} ${f(b*0.55)} L 0 ${f(b)} L ${f(-w*0.5)} ${f(b*0.55)} Z`;
            return wrap(`
                <path d="${d}" fill="${colorVar}" filter="${filterId}" opacity="0.85" />
                <path d="${d}" fill="#ffffff" opacity="0.92" />
                <ellipse cx="${f(-w*0.4)}" cy="${f(top)}" rx="${f(w*0.17)}" ry="${f(w*0.26)}" fill="#111" />
                <ellipse cx="${f(w*0.4)}" cy="${f(top)}" rx="${f(w*0.17)}" ry="${f(w*0.26)}" fill="#111" />
                <ellipse cx="0" cy="${f(top + w*0.55)}" rx="${f(w*0.12)}" ry="${f(w*0.16)}" fill="${colorVar}" />`);
        }
        if (skin === 'flower') {
            const cy0 = -s * 0.1, pr = s * 0.09, dist = s * 0.12;
            let petals = '';
            for (let i = 0; i < 5; i++) {
                const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
                petals += `<circle cx="${f(Math.cos(a) * dist)}" cy="${f(cy0 + Math.sin(a) * dist)}" r="${f(pr)}" fill="${colorVar}" stroke="#ffffff" stroke-width="0.8" />`;
            }
            return wrap(`
                <circle cx="0" cy="${f(cy0)}" r="${f(dist + pr)}" fill="${colorVar}" filter="${filterId}" opacity="0.45" />
                ${petals}
                <circle cx="0" cy="${f(cy0)}" r="${f(s*0.075)}" fill="#ffd84d" stroke="#ffffff" stroke-width="1" />`);
        }
        if (skin === 'leaf') {
            const b = baseHalf * 1.05, t = tipLen * 1.2;
            const d = `M 0 ${f(-t)} Q ${f(b*1.5)} ${f(-t*0.35)} 0 ${f(baseH*2)} Q ${f(-b*1.5)} ${f(-t*0.35)} 0 ${f(-t)} Z`;
            return wrap(`
                <path d="${d}" fill="${colorVar}" filter="${filterId}" opacity="0.85" />
                <path d="${d}" fill="${colorVar}" stroke="#ffffff" stroke-width="1" />
                <path d="M 0 ${f(-t*0.85)} L 0 ${f(baseH*1.6)} M 0 ${f(-t*0.45)} L ${f(b*0.45)} ${f(-t*0.7)} M 0 ${f(-t*0.45)} L ${f(-b*0.45)} ${f(-t*0.7)} M 0 ${f(-t*0.1)} L ${f(b*0.55)} ${f(-t*0.35)} M 0 ${f(-t*0.1)} L ${f(-b*0.55)} ${f(-t*0.35)}" stroke="#ffffff" stroke-width="${f(Math.max(1, s*0.018))}" stroke-linecap="round" fill="none" />`);
        }
        if (skin === 'shield') {
            const b = baseHalf * 1.15, t = tipLen * 1.1;
            const d = `M 0 ${f(-t)} L ${f(b)} ${f(-t*0.55)} L ${f(b*0.85)} 0 Q ${f(b*0.55)} ${f(baseH*1.6)} 0 ${f(baseH*2.2)} Q ${f(-b*0.55)} ${f(baseH*1.6)} ${f(-b*0.85)} 0 L ${f(-b)} ${f(-t*0.55)} Z`;
            return wrap(`
                <path d="${d}" fill="${colorVar}" filter="${filterId}" opacity="0.85" />
                <path d="${d}" fill="${colorVar}" stroke="#ffffff" stroke-width="1.2" stroke-linejoin="round" />
                <path d="M 0 ${f(-t*0.7)} L 0 ${f(baseH*1.4)} M ${f(-b*0.55)} ${f(-t*0.3)} L ${f(b*0.55)} ${f(-t*0.3)}" stroke="#ffffff" stroke-width="${f(Math.max(1.5, s*0.035))}" stroke-linecap="round" />`);
        }

        let outerPoly = `0,${-tipLen} ${baseHalf},${baseH} ${-baseHalf},${baseH}`;
        let solidPoly = `0,${-Math.round(tipLen * 0.90)} ${Math.round(baseHalf * 0.88)},${Math.round(baseH * 0.88)} ${-Math.round(baseHalf * 0.88)},${Math.round(baseH * 0.88)}`;
        let corePoly = `0,${-Math.round(tipLen * 0.65)} ${Math.round(baseHalf * 0.48)},${Math.round(baseH * 0.5)} ${-Math.round(baseHalf * 0.48)},${Math.round(baseH * 0.5)}`;

        if (skin === 'lightning') {
            outerPoly = `0,${-tipLen * 1.15} ${baseHalf},${-tipLen * 0.25} ${baseHalf * 0.3},${-tipLen * 0.15} ${baseHalf * 0.95},${baseH} 0,${baseH * 0.4} ${-baseHalf * 0.95},${baseH} ${-baseHalf * 0.3},${-tipLen * 0.15} ${-baseHalf},${-tipLen * 0.25}`;
            solidPoly = `0,${-tipLen * 0.98} ${baseHalf * 0.85},${-tipLen * 0.22} ${baseHalf * 0.25},${-tipLen * 0.12} ${baseHalf * 0.8},${baseH * 0.85} 0,${baseH * 0.3} ${-baseHalf * 0.8},${baseH * 0.85} ${-baseHalf * 0.25},${-tipLen * 0.12} ${-baseHalf * 0.85},${-tipLen * 0.22}`;
            corePoly = `0,${-tipLen * 0.65} ${baseHalf * 0.5},${-tipLen * 0.15} ${baseHalf * 0.15},${-tipLen * 0.08} ${baseHalf * 0.45},${baseH * 0.5} 0,${baseH * 0.18} ${-baseHalf * 0.45},${baseH * 0.5} ${-baseHalf * 0.15},${-tipLen * 0.08} ${-baseHalf * 0.5},${-tipLen * 0.15}`;
        } else if (skin === 'diamond') {
            outerPoly = `0,${-tipLen * 1.2} ${baseHalf * 1.05},0 0,${baseH * 1.2} ${-baseHalf * 1.05},0`;
            solidPoly = `0,${-tipLen * 0.98} ${baseHalf * 0.85},0 0,${baseH * 0.95} ${-baseHalf * 0.85},0`;
            corePoly = `0,${-tipLen * 0.62} ${baseHalf * 0.5},0 0,${baseH * 0.5} ${-baseHalf * 0.5},0`;
        } else if (skin === 'flame') {
            outerPoly = `0,${-tipLen * 1.22} ${baseHalf * 1.15},${-tipLen * 0.12} ${baseHalf * 0.9},${baseH * 1.15} 0,${baseH * 0.32} ${-baseHalf * 0.9},${baseH * 1.15} ${-baseHalf * 1.15},${-tipLen * 0.12}`;
            solidPoly = `0,${-tipLen * 1.02} ${baseHalf * 0.95},${-tipLen * 0.08} ${baseHalf * 0.72},${baseH * 0.92} 0,${baseH * 0.25} ${-baseHalf * 0.72},${baseH * 0.92} ${-baseHalf * 0.95},${-tipLen * 0.08}`;
            corePoly = `0,${-tipLen * 0.68} ${baseHalf * 0.58},${-tipLen * 0.04} ${baseHalf * 0.42},${baseH * 0.55} 0,${baseH * 0.15} ${-baseHalf * 0.42},${baseH * 0.55} ${-baseHalf * 0.58},${-tipLen * 0.04}`;
        } else if (skin === 'blade') {
            outerPoly = `0,${-tipLen * 1.3} ${baseHalf * 1.25},${-tipLen * 0.15} ${baseHalf * 0.7},${baseH * 1.15} 0,${-tipLen * 0.08} ${-baseHalf * 0.7},${baseH * 1.15} ${-baseHalf * 1.25},${-tipLen * 0.15}`;
            solidPoly = `0,${-tipLen * 1.08} ${baseHalf * 1.02},${-tipLen * 0.12} ${baseHalf * 0.55},${baseH * 0.92} 0,${-tipLen * 0.06} ${-baseHalf * 0.55},${baseH * 0.92} ${-baseHalf * 1.02},${-tipLen * 0.12}`;
            corePoly = `0,${-tipLen * 0.72} ${baseHalf * 0.6},${-tipLen * 0.08} ${baseHalf * 0.32},${baseH * 0.55} 0,${-tipLen * 0.04} ${-baseHalf * 0.32},${baseH * 0.55} ${-baseHalf * 0.6},${-tipLen * 0.08}`;
        } else if (skin === 'plasma') {
            outerPoly = `0,${-tipLen * 1.25} ${baseHalf * 0.35},${-tipLen * 0.25} ${baseHalf * 1.2},0 ${baseHalf * 0.35},${baseH * 0.7} 0,${baseH * 1.3} ${-baseHalf * 0.35},${baseH * 0.7} ${-baseHalf * 1.2},0 ${-baseHalf * 0.35},${-tipLen * 0.25}`;
            solidPoly = `0,${-tipLen * 1.05} ${baseHalf * 0.28},${-tipLen * 0.2} ${baseHalf * 0.95},0 ${baseHalf * 0.28},${baseH * 0.55} 0,${baseH * 1.05} ${-baseHalf * 0.28},${baseH * 0.55} ${-baseHalf * 0.95},0 ${-baseHalf * 0.28},${-tipLen * 0.2}`;
            corePoly = `0,${-tipLen * 0.68} ${baseHalf * 0.18},${-tipLen * 0.12} ${baseHalf * 0.58},0 ${baseHalf * 0.18},${baseH * 0.35} 0,${baseH * 0.65} ${-baseHalf * 0.18},${baseH * 0.35} ${-baseHalf * 0.58},0 ${-baseHalf * 0.18},${-tipLen * 0.12}`;
        }

        const cls = isTail ? 'arrowhead-mesh arrowhead-tail-mesh' : 'arrowhead-mesh';
        return `
            <g class="${cls}" data-skin="${skin}" style="transform: translate(${cx}px, ${cy}px) rotate(${rot}deg); transform-origin: 0 0;">
                <polygon points="${outerPoly}" fill="${colorVar}" filter="${filterId}" opacity="0.85" />
                <polygon points="${solidPoly}" fill="${colorVar}" />
                <polygon points="${corePoly}" fill="#ffffff" opacity="0.95" />
            </g>
        `;
    }

    // Generate continuous multi-segment SVG path for an arrow with dynamic mobile-proportional scaling
    generateArrowSVG(arrow, cellSize, opts = {}) {
        const segs = arrow.segments;
        const isCyan = (arrow.color === 'cyan');
        const colorVar = isCyan ? 'var(--neon-cyan)' : 'var(--neon-orange)';
        const filterId = opts.noFilter ? 'none' : (isCyan ? 'url(#maze-cyan-glow)' : 'url(#maze-orange-glow)');
        const activeSkin = opts.head || (window.storageManager && window.storageManager.data.activeArrowHead) || 'classic';
        const bodyStyle = opts.body || (window.storageManager && window.storageManager.data.activeArrowBody) || 'tube';

        // Refined slimmer arrow dimensions per user request ("صغر حجم السهم اضعف قليل"):
        const altColor = isCyan ? 'var(--neon-orange)' : 'var(--neon-cyan)';
        const bodyScale = { snake: 1.35, worm: 1.45, beads: 0.4, rope: 1.1, hollow: 1.25, double: 1.4, caterpillar: 0.4, chain: 1.2, laser: 0.55, zebra: 1.2, rainbow: 1.2 }[bodyStyle] || 1;
        const baseBodyWidth = Math.max(6, Math.round(cellSize * 0.13)); // 13% of cell: refined & slimmer
        const bodyWidth = Math.max(3, Math.round(baseBodyWidth * bodyScale));
        const auraWidth = Math.max(10, Math.round(cellSize * 0.20 * Math.max(1, bodyScale))); // smooth neon aura
        const coreWidth = ['snake', 'worm', 'beads', 'hollow', 'double', 'caterpillar', 'chain', 'zebra', 'rainbow'].includes(bodyStyle)
            ? 0 : (bodyStyle === 'laser' ? Math.max(1.5, Math.round(baseBodyWidth * 0.28)) : Math.max(2, Math.round(cellSize * 0.035 * 10) / 10)); // Inner bright core
        const hitWidth = Math.max(34, Math.round(cellSize * 0.70));
        const hitRadius = Math.max(22, Math.round(cellSize * 0.40));

        // Build continuous body line from tail to head
        let bodyPathD = '';
        for (let i = 0; i < segs.length; i++) {
            const cx = (segs[i].c + 0.5) * cellSize;
            const cy = (segs[i].r + 0.5) * cellSize;
            if (i === 0) {
                bodyPathD += `M ${cx} ${cy}`;
            } else {
                bodyPathD += ` L ${cx} ${cy}`;
            }
        }

        // Head position and angle
        const head = segs[segs.length - 1];
        const headCx = (head.c + 0.5) * cellSize;
        const headCy = (head.r + 0.5) * cellSize;
        const headRot = arrow.headDir * 90; // 0: Up, 1: Right, 2: Down, 3: Left

        // Decorative body pattern layers (fade out on escape)
        const r1 = (n) => Math.max(1, Math.round(n * 10) / 10);
        const decoPath = (attrs) => `<path class="arrow-deco" d="${bodyPathD}" fill="none" stroke-linejoin="round" ${attrs} />`;
        let decoSvg = '';
        if (bodyStyle === 'snake') {
            decoSvg = decoPath(`stroke="rgba(0,0,0,0.32)" stroke-width="${r1(bodyWidth * 0.82)}" stroke-dasharray="${r1(cellSize * 0.07)} ${r1(cellSize * 0.11)}"`)
                + decoPath(`stroke="rgba(255,255,255,0.55)" stroke-width="${r1(bodyWidth * 0.18)}" stroke-linecap="round"`);
        } else if (bodyStyle === 'worm') {
            decoSvg = decoPath(`stroke="rgba(0,0,0,0.28)" stroke-width="${r1(bodyWidth)}" stroke-dasharray="${r1(Math.max(2, cellSize * 0.03))} ${r1(cellSize * 0.13)}"`)
                + decoPath(`stroke="rgba(255,255,255,0.35)" stroke-width="${r1(bodyWidth * 0.3)}" stroke-linecap="round"`);
        } else if (bodyStyle === 'candy') {
            decoSvg = decoPath(`stroke="#ffffff" opacity="0.85" stroke-width="${r1(bodyWidth * 0.9)}" stroke-dasharray="${r1(cellSize * 0.1)} ${r1(cellSize * 0.1)}"`);
        } else if (bodyStyle === 'beads') {
            decoSvg = decoPath(`stroke="${colorVar}" stroke-width="${r1(baseBodyWidth * 1.45)}" stroke-linecap="round" stroke-dasharray="0 ${r1(cellSize * 0.33)}"`)
                + decoPath(`stroke="#ffffff" opacity="0.9" stroke-width="${r1(baseBodyWidth * 0.55)}" stroke-linecap="round" stroke-dasharray="0 ${r1(cellSize * 0.33)}"`);
        } else if (bodyStyle === 'hollow') {
            decoSvg = decoPath(`stroke="var(--bg-dark)" stroke-width="${r1(bodyWidth * 0.5)}" stroke-linecap="round"`);
        } else if (bodyStyle === 'rope') {
            decoSvg = decoPath(`stroke="rgba(255,255,255,0.6)" stroke-width="${r1(bodyWidth * 0.9)}" stroke-dasharray="${r1(cellSize * 0.05)} ${r1(cellSize * 0.09)}"`)
                + decoPath(`stroke="rgba(0,0,0,0.25)" stroke-width="${r1(bodyWidth * 0.9)}" stroke-dasharray="${r1(cellSize * 0.05)} ${r1(cellSize * 0.09)}" stroke-dashoffset="${r1(cellSize * 0.07)}"`);
        } else if (bodyStyle === 'electric') {
            decoSvg = decoPath(`class="arrow-deco deco-flow" stroke="#ffffff" stroke-width="${r1(bodyWidth * 0.35)}" stroke-linecap="round" stroke-dasharray="${r1(cellSize * 0.12)} ${r1(cellSize * 0.18)}"`).replace('class="arrow-deco" ', '');
        } else if (bodyStyle === 'dotted') {
            decoSvg = decoPath(`stroke="#ffffff" stroke-width="${r1(bodyWidth * 0.45)}" stroke-linecap="round" stroke-dasharray="0 ${r1(cellSize * 0.17)}"`);
        } else if (bodyStyle === 'double') {
            decoSvg = decoPath(`stroke="var(--bg-dark)" stroke-width="${r1(bodyWidth * 0.62)}" stroke-linecap="round"`)
                + decoPath(`stroke="${colorVar}" stroke-width="${r1(bodyWidth * 0.16)}" stroke-linecap="round"`);
        } else if (bodyStyle === 'caterpillar') {
            const gap = r1(cellSize * 0.26);
            decoSvg = decoPath(`stroke="${colorVar}" stroke-width="${r1(baseBodyWidth * 1.5)}" stroke-linecap="round" stroke-dasharray="0 ${gap}"`)
                + decoPath(`stroke="${altColor}" stroke-width="${r1(baseBodyWidth * 1.2)}" stroke-linecap="round" stroke-dasharray="0 ${r1(gap * 2)}" stroke-dashoffset="${gap}"`)
                + decoPath(`stroke="#ffffff" opacity="0.85" stroke-width="${r1(baseBodyWidth * 0.4)}" stroke-linecap="round" stroke-dasharray="0 ${gap}"`);
        } else if (bodyStyle === 'chain') {
            decoSvg = decoPath(`stroke="var(--bg-dark)" stroke-width="${r1(bodyWidth * 0.42)}" stroke-linecap="round" stroke-dasharray="${r1(cellSize * 0.1)} ${r1(cellSize * 0.16)}"`)
                + decoPath(`stroke="var(--bg-dark)" stroke-width="${r1(bodyWidth * 1.05)}" stroke-dasharray="1.5 ${r1(cellSize * 0.26 - 1.5)}" stroke-dashoffset="${r1(cellSize * 0.18)}"`);
        } else if (bodyStyle === 'laser') {
            decoSvg = decoPath(`stroke="#ffffff" opacity="0.5" stroke-width="${r1(baseBodyWidth * 0.8)}" stroke-linecap="round" class="arrow-deco deco-flow" stroke-dasharray="${r1(cellSize * 0.04)} ${r1(cellSize * 0.2)}"`).replace('class="arrow-deco" ', '');
        } else if (bodyStyle === 'zebra') {
            decoSvg = decoPath(`stroke="rgba(0,0,0,0.42)" stroke-width="${r1(bodyWidth)}" stroke-dasharray="${r1(cellSize * 0.05)} ${r1(cellSize * 0.07)}"`);
        } else if (bodyStyle === 'dna') {
            const d = r1(cellSize * 0.09);
            decoSvg = decoPath(`stroke="#ffffff" stroke-width="${r1(bodyWidth * 0.85)}" stroke-dasharray="${d} ${r1(d * 3)}"`)
                + decoPath(`stroke="${altColor}" stroke-width="${r1(bodyWidth * 0.85)}" stroke-dasharray="${d} ${r1(d * 3)}" stroke-dashoffset="${r1(d * 2)}"`);
        } else if (bodyStyle === 'rainbow') {
            const d = r1(cellSize * 0.08);
            const cols = ['#ff3b5c', '#ffb400', '#3dff7a', '#38bdf8', '#c084fc'];
            decoSvg = cols.map((c, i) => decoPath(`stroke="${c}" stroke-width="${r1(bodyWidth * 0.92)}" stroke-dasharray="${d} ${r1(d * (cols.length - 1))}" stroke-dashoffset="${Math.round(d * i * 10) / 10}"`)).join('');
        } else if (bodyStyle === 'stitch') {
            decoSvg = decoPath(`stroke="#ffffff" stroke-width="${r1(bodyWidth * 0.2)}" stroke-linecap="round" stroke-dasharray="${r1(cellSize * 0.06)} ${r1(cellSize * 0.07)}"`);
        } else if (bodyStyle === 'glass') {
            decoSvg = decoPath(`stroke="#ffffff" opacity="0.35" stroke-width="${r1(bodyWidth * 0.7)}" stroke-linecap="round"`)
                + decoPath(`stroke="#ffffff" opacity="0.9" stroke-width="${r1(bodyWidth * 0.15)}" stroke-linecap="round"`);
        } else if (bodyStyle === 'ladder') {
            decoSvg = decoPath(`stroke="var(--bg-dark)" stroke-width="${r1(bodyWidth * 0.55)}" stroke-linecap="round"`)
                + decoPath(`stroke="${colorVar}" stroke-width="${r1(bodyWidth * 0.6)}" stroke-dasharray="${r1(Math.max(2, cellSize * 0.03))} ${r1(cellSize * 0.12)}"`);
        } else if (bodyStyle === 'pulse') {
            decoSvg = decoPath(`class="arrow-deco deco-flow" stroke="${altColor}" stroke-width="${r1(bodyWidth * 0.6)}" stroke-linecap="round" stroke-dasharray="${r1(cellSize * 0.06)} ${r1(cellSize * 0.24)}"`).replace('class="arrow-deco" ', '');
        } else if (bodyStyle === 'fire') {
            decoSvg = decoPath(`class="arrow-deco deco-flow" stroke="#ffcc00" stroke-width="${r1(bodyWidth * 0.65)}" stroke-linecap="round" stroke-dasharray="${r1(cellSize * 0.14)} ${r1(cellSize * 0.08)}"`).replace('class="arrow-deco" ', '')
                + decoPath(`class="arrow-deco deco-flow" stroke="#ff3b30" stroke-width="${r1(bodyWidth * 0.3)}" stroke-linecap="round" stroke-dasharray="${r1(cellSize * 0.08)} ${r1(cellSize * 0.14)}"`).replace('class="arrow-deco" ', '');
        }

        const headMeshSvg = this.renderHeadMeshSvg(headCx, headCy, headRot, colorVar, filterId, cellSize, activeSkin, false);

        // Double-headed arrow tail mesh
        let tailMeshSvg = '';
        if (arrow.isDoubleHeaded && segs.length >= 2) {
            const tail = segs[0];
            const tailCx = (tail.c + 0.5) * cellSize;
            const tailCy = (tail.r + 0.5) * cellSize;
            const tailRot = (arrow.tailDir !== undefined ? arrow.tailDir : (arrow.headDir + 2) % 4) * 90;
            tailMeshSvg = this.renderHeadMeshSvg(tailCx, tailCy, tailRot, colorVar, filterId, cellSize, activeSkin, true);
        }

        // Key Badge Marker
        let keyBadgeSvg = '';
        if (arrow.isKey) {
            const midIdx = Math.floor(segs.length / 2);
            const mx = (segs[midIdx].c + 0.5) * cellSize;
            const my = (segs[midIdx].r + 0.5) * cellSize;
            const r = Math.round(cellSize * 0.26);
            keyBadgeSvg = `
                <g class="key-badge-marker" transform="translate(${mx}, ${my})">
                    <circle cx="0" cy="0" r="${r}" fill="#0b1329" stroke="#ffd700" stroke-width="2.5" />
                    <!-- Vector Golden Key Icon -->
                    <circle cx="-5" cy="0" r="5" fill="none" stroke="#ffd700" stroke-width="2" />
                    <line x1="0" y1="0" x2="9" y2="0" stroke="#ffd700" stroke-width="2" stroke-linecap="round" />
                    <line x1="5" y1="0" x2="5" y2="3.5" stroke="#ffd700" stroke-width="1.8" stroke-linecap="round" />
                    <line x1="8" y1="0" x2="8" y2="3.5" stroke="#ffd700" stroke-width="1.8" stroke-linecap="round" />
                </g>
            `;
        }

        // Lock Badge Marker
        let lockBadgeSvg = '';
        if (arrow.isLocked) {
            const midIdx = Math.floor(segs.length / 2);
            const mx = (segs[midIdx].c + 0.5) * cellSize;
            const my = (segs[midIdx].r + 0.5) * cellSize;
            const r = Math.round(cellSize * 0.27);
            lockBadgeSvg = `
                <g class="lock-badge-marker" transform="translate(${mx}, ${my})">
                    <circle cx="0" cy="0" r="${r}" fill="#180712" stroke="#ff0055" stroke-width="2.5" />
                    <!-- Vector Padlock Icon -->
                    <path d="M -5 -2 L -5 -6 A 5 5 0 0 1 5 -6 L 5 -2" fill="none" stroke="#ffd700" stroke-width="2" stroke-linecap="round" />
                    <rect x="-7" y="-2" width="14" height="11" rx="2.5" fill="#ff0055" stroke="#ffffff" stroke-width="1" />
                    <circle cx="0" cy="3" r="1.5" fill="#ffffff" />
                    <line x1="0" y1="4" x2="0" y2="6.5" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" />
                </g>
            `;
        }

        // Ice Crystal Badge Marker
        let iceBadgeSvg = '';
        if (arrow.isFrozen) {
            const midIdx = Math.floor(segs.length / 2);
            const mx = (segs[midIdx].c + 0.5) * cellSize;
            const my = (segs[midIdx].r + 0.5) * cellSize;
            const r = Math.round(cellSize * 0.28);
            iceBadgeSvg = `
                <g class="ice-badge-marker" transform="translate(${mx}, ${my})">
                    <circle cx="0" cy="0" r="${r}" fill="#051c2e" stroke="#00f0ff" stroke-width="2.5" />
                    <!-- Neon Snowflake Crystal Icon -->
                    <line x1="0" y1="-7" x2="0" y2="7" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
                    <line x1="-7" y1="0" x2="7" y2="0" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
                    <line x1="-5" y1="-5" x2="5" y2="5" stroke="#7dd3fc" stroke-width="1.8" stroke-linecap="round" />
                    <line x1="-5" y1="5" x2="5" y2="-5" stroke="#7dd3fc" stroke-width="1.8" stroke-linecap="round" />
                    <circle cx="0" cy="0" r="2.5" fill="#00f0ff" />
                </g>
            `;
        }

        // Rotating Arrow Badge
        let rotatingBadgeSvg = '';
        if (arrow.isRotating) {
            const midIdx = Math.floor(segs.length / 2);
            const mx = (segs[midIdx].c + 0.5) * cellSize;
            const my = (segs[midIdx].r + 0.5) * cellSize;
            const r = Math.round(cellSize * 0.26);
            rotatingBadgeSvg = `
                <g class="rotating-badge-marker" transform="translate(${mx}, ${my})">
                    <circle cx="0" cy="0" r="${r}" fill="#0f172a" stroke="#00ff66" stroke-width="2.2" />
                    <path d="M -4 -2 A 5 5 0 1 1 -4 2" fill="none" stroke="#00ff66" stroke-width="2" stroke-linecap="round" />
                    <polygon points="-6,-4 -2,-2 -5,0" fill="#00ff66" />
                </g>
            `;
        }

        // EMP / Bomb Arrow Badge
        let bombBadgeSvg = '';
        if (arrow.isBomb) {
            const midIdx = Math.floor(segs.length / 2);
            const mx = (segs[midIdx].c + 0.5) * cellSize;
            const my = (segs[midIdx].r + 0.5) * cellSize;
            const r = Math.round(cellSize * 0.26);
            bombBadgeSvg = `
                <g class="bomb-badge-marker" transform="translate(${mx}, ${my})">
                    <circle cx="0" cy="0" r="${r}" fill="#260408" stroke="#ff3b30" stroke-width="2.2" />
                    <circle cx="0" cy="1.5" r="4.2" fill="#ff3b30" />
                    <line x1="0" y1="-2.5" x2="2.5" y2="-5" stroke="#facc15" stroke-width="1.6" stroke-linecap="round" />
                    <circle cx="3" cy="-5.5" r="1.2" fill="#facc15" />
                </g>
            `;
        }

        // Quantum Portal Arrow Badge
        let portalBadgeSvg = '';
        if (arrow.isPortal) {
            const midIdx = Math.floor(segs.length / 2);
            const mx = (segs[midIdx].c + 0.5) * cellSize;
            const my = (segs[midIdx].r + 0.5) * cellSize;
            const r = Math.round(cellSize * 0.26);
            portalBadgeSvg = `
                <g class="portal-badge-marker" transform="translate(${mx}, ${my})">
                    <circle cx="0" cy="0" r="${r}" fill="#110526" stroke="#b026ff" stroke-width="2.2" />
                    <circle cx="0" cy="0" r="4" fill="none" stroke="#00f3ff" stroke-width="1.5" stroke-dasharray="3,2" />
                    <circle cx="0" cy="0" r="1.8" fill="#b026ff" />
                </g>
            `;
        }

        // Phantom Arrow Badge (Ghost/Phase)
        let phantomBadgeSvg = '';
        if (arrow.isPhantom) {
            const midIdx = Math.floor(segs.length / 2);
            const mx = (segs[midIdx].c + 0.5) * cellSize;
            const my = (segs[midIdx].r + 0.5) * cellSize;
            const r = Math.round(cellSize * 0.26);
            phantomBadgeSvg = `
                <g class="phantom-badge-marker" transform="translate(${mx}, ${my})">
                    <circle cx="0" cy="0" r="${r}" fill="#1c0738" stroke="#d946ef" stroke-width="2.2" />
                    <path d="M -4 3 L -4 -2 A 4 4 0 0 1 4 -2 L 4 3 L 2 2 L 0 3 L -2 2 Z" fill="#e879f9" />
                    <circle cx="-1.5" cy="-1" r="0.8" fill="#1c0738" />
                    <circle cx="1.5" cy="-1" r="0.8" fill="#1c0738" />
                </g>
            `;
        }

        // Magnetic Arrow Badge (Magnet/Polarity)
        let magneticBadgeSvg = '';
        if (arrow.isMagnetic) {
            const midIdx = Math.floor(segs.length / 2);
            const mx = (segs[midIdx].c + 0.5) * cellSize;
            const my = (segs[midIdx].r + 0.5) * cellSize;
            const r = Math.round(cellSize * 0.26);
            magneticBadgeSvg = `
                <g class="magnetic-badge-marker" transform="translate(${mx}, ${my})">
                    <circle cx="0" cy="0" r="${r}" fill="#061c2b" stroke="#00f3ff" stroke-width="2.2" />
                    <path d="M -4 3 L -4 -1 A 4 4 0 0 1 4 -1 L 4 3 L 2 3 L 2 -1 A 2 2 0 0 0 -2 -1 L -2 3 Z" fill="#ef4444" stroke="#ffffff" stroke-width="0.8" />
                    <rect x="-4" y="2" width="2" height="1.8" fill="#ffffff" />
                    <rect x="2" y="2" width="2" height="1.8" fill="#00f3ff" />
                </g>
            `;
        }

        const doubleCls = arrow.isDoubleHeaded ? 'arrow-double-headed' : '';
        const lockedCls = arrow.isLocked ? 'arrow-locked' : '';
        const keyCls = arrow.isKey ? 'arrow-key' : '';
        const frozenCls = arrow.isFrozen ? 'arrow-frozen' : '';
        const rotatingCls = arrow.isRotating ? 'arrow-rotating' : '';
        const bombCls = arrow.isBomb ? 'arrow-bomb' : '';
        const portalCls = arrow.isPortal ? 'arrow-portal' : '';
        const phantomCls = arrow.isPhantom ? 'arrow-phantom' : '';
        const magneticCls = arrow.isMagnetic ? 'arrow-magnetic' : '';

        return `
            <g id="arrow-group-${arrow.id}" class="maze-arrow-entity arrow-${arrow.color} ${doubleCls} ${lockedCls} ${keyCls} ${frozenCls} ${rotatingCls} ${bombCls} ${portalCls} ${phantomCls} ${magneticCls}" data-arrow-id="${arrow.id}">
                <!-- Invisible broad touch target for easy tapping on mobile -->
                <path class="arrow-hit-area" d="${bodyPathD}" fill="none" stroke="transparent" stroke-width="${hitWidth}" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="${headCx}" cy="${headCy}" r="${hitRadius}" fill="transparent" />

                <!-- Outer Glowing Aura -->
                <path class="arrow-track-line arrow-aura" d="${bodyPathD}" fill="none" stroke="${colorVar}" stroke-width="${auraWidth}" stroke-linecap="round" stroke-linejoin="round" filter="${filterId}" opacity="0.45" />
                <!-- Solid Neon Tube Body -->
                <path class="arrow-track-line arrow-body" d="${bodyPathD}" fill="none" stroke="${colorVar}" stroke-width="${bodyWidth}" stroke-linecap="round" stroke-linejoin="round" />
                <!-- Inner Bright Glass Core -->
                <path class="arrow-track-line arrow-core" d="${bodyPathD}" fill="none" stroke="#ffffff" stroke-width="${coreWidth}" stroke-linecap="round" stroke-linejoin="round" />
                ${decoSvg}

                <!-- Arrowhead pointing in headDir -->
                ${headMeshSvg}

                <!-- Tail Arrowhead if Double-Headed -->
                ${tailMeshSvg}

                <!-- Feature Badges -->
                ${keyBadgeSvg}
                ${lockBadgeSvg}
                ${iceBadgeSvg}
                ${rotatingBadgeSvg}
                ${bombBadgeSvg}
                ${portalBadgeSvg}
                ${phantomBadgeSvg}
                ${magneticBadgeSvg}
            </g>
        `;
    }

    // When player taps an arrow
    onArrowClick(arrow, arrowEl) {
        if (this.isGameOver || this.isLevelComplete || this.isPaused || arrow.isEscaped) return;

        // If Laser Booster is active, zap and vaporize selected arrow
        if (this.isLaserMode) {
            this.executeLaserZap(arrow, arrowEl);
            return;
        }

        // Locked Arrow cannot move until Key Arrow escapes
        if (arrow.isLocked) {
            arrowEl.classList.remove('shake-error');
            void arrowEl.offsetWidth;
            arrowEl.classList.add('shake-error');
            window.soundEngine.playBlocked();
            window.soundEngine.vibrate([30, 20, 30]);
            const isAr = window.storageManager.data.settings.lang === 'ar';
            window.uiController.showToast(
                isAr ? '🔒 هذا السهم مقيد بقفل! ابحث عن السهم المفتاح 🔑 وحرره أولاً!' : '🔒 Locked arrow! Find and release the Key Arrow 🔑 first!'
            );
            return;
        }

        // Frozen Ice Arrow: requires 1 tap to crack the ice, 2nd tap to escape
        if (arrow.isFrozen) {
            arrow.isFrozen = false;
            arrowEl.classList.remove('arrow-frozen');
            arrowEl.classList.add('ice-thaw-pulse');
            window.soundEngine.playIceCrack();
            window.soundEngine.vibrate([35, 20]);
            const iceBadge = arrowEl.querySelector('.ice-badge-marker');
            if (iceBadge) {
                iceBadge.classList.add('ice-shatter');
                setTimeout(() => {
                    if (iceBadge.parentNode) iceBadge.parentNode.removeChild(iceBadge);
                }, 380);
            }
            const isAr = window.storageManager.data.settings.lang === 'ar';
            window.uiController.showToast(
                isAr ? '❄️ انكسر الجليد! السهم جاهز الآن للانطلاق!' : '❄️ Ice shattered! Arrow is ready to escape!'
            );
            return;
        }

        // Double-headed arrow check
        const rows = this.levelData.rows || this.levelData.size;
        const cols = this.levelData.cols || this.levelData.size;
        if (arrow.isDoubleHeaded) {
            const res = window.levelGenerator.canDoubleHeadedEscape(arrow, rows, this.activeCells, cols, this.activeArrows);
            if (res.canEscape) {
                if (res.dir === 'tail') {
                    // Escape backwards out tail
                    arrow.segments.reverse();
                    const tmp = arrow.headDir;
                    arrow.headDir = arrow.tailDir;
                    arrow.tailDir = tmp;
                    arrow._escapedBackwards = true;
                } else {
                    arrow._escapedBackwards = false;
                }
                this.executeArrowEscape(arrow, arrowEl);
                return;
            } else {
                this.handleBlockedMistake(arrow, arrowEl);
                return;
            }
        }

        // Normal Arrow escape check (including portal tunneling and phantom pass-through)
        const canEscape = window.levelGenerator.checkArrowCanEscape(
            arrow,
            rows,
            this.activeCells,
            'head',
            cols,
            this.activeArrows
        );

        // CASE A: BLOCKED ARROW!
        if (!canEscape) {
            // Rotating Arrow Feature: Tap rotates arrow 90 degrees clockwise without penalizing mistakes!
            if (arrow.isRotating) {
                arrow.headDir = (arrow.headDir + 1) % 4;
                window.soundEngine.playRotate();
                window.soundEngine.vibrate([20]);

                const newSvgHtml = this.generateArrowSVG(arrow, this.cellSize || 50, { skin: window.storageManager.data.activeArrowHead });
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = `<svg>${newSvgHtml}</svg>`;
                const newEl = tempDiv.querySelector('.maze-arrow-entity');
                if (newEl && arrowEl.parentNode) {
                    newEl.classList.add('arrow-pivot-spin');
                    arrowEl.parentNode.replaceChild(newEl, arrowEl);
                    newEl.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.onArrowClick(arrow, newEl);
                    });
                }
                const isAr = window.storageManager.data.settings.lang === 'ar';
                window.uiController.showToast(isAr ? '🔄 دار السهم 90°! تفقد مسار الهروب' : '🔄 Arrow rotated 90°! Check escape path');
                return;
            }

            this.handleBlockedMistake(arrow, arrowEl);
            return;
        }

        // CASE B: CLEAR ESCAPE ROUTE!
        this.executeArrowEscape(arrow, arrowEl);
    }

    handleBlockedMistake(arrow, arrowEl) {
        if (this.isGameOver || this.isLevelComplete) return;

        this.mistakes++;
        this.comboCount = 0; // Reset streak on mistake
        if (window.storageManager && window.storageManager.data && window.storageManager.data.stats) {
            window.storageManager.data.stats.mistakesCount = (window.storageManager.data.stats.mistakesCount || 0) + 1;
        }

        // Play short error buzz sound
        window.soundEngine.playBlocked();

        // Shake animation + red flash on the arrow
        arrowEl.classList.remove('shake-error');
        void arrowEl.offsetWidth; // Reflow
        arrowEl.classList.add('shake-error');

        // Flash the blocking obstacle arrow to clearly show what blocked the path
        try {
            const blockerId = this.findObstacleArrowId(arrow);
            if (blockerId) {
                const blockerEl = document.getElementById(`arrow-group-${blockerId}`);
                if (blockerEl) {
                    blockerEl.classList.remove('clash-warning');
                    void blockerEl.offsetWidth; // Reflow
                    blockerEl.classList.add('clash-warning');
                    setTimeout(() => {
                        if (blockerEl) blockerEl.classList.remove('clash-warning');
                    }, 420);
                }
            }
        } catch (err) {
            console.warn('Error highlighting obstacle arrow:', err);
        }

        this.updateStarsUI();
        this.updateScoreUI();

        // Check if 3 mistakes reached -> 0 stars left -> Level Failed!
        if (this.mistakes >= 3) {
            this.updateStarsUI();
            this.onLevelFailed('mistakes');
        }
    }

    findObstacleArrowId(arrow) {
        if (!arrow || !arrow.segments || arrow.segments.length === 0) return null;
        const head = arrow.segments[arrow.segments.length - 1];
        const delta = window.levelGenerator.DIR_DELTA[arrow.headDir];
        if (!delta) return null;
        let currR = head.r + delta.r;
        let currC = head.c + delta.c;
        const rows = this.levelData.rows || this.levelData.size;
        const cols = this.levelData.cols || this.levelData.size;

        while (currR >= 0 && currR < rows && currC >= 0 && currC < cols) {
            const key = `${currR},${currC}`;
            const occupant = this.activeCells.get(key);
            if (occupant !== undefined && occupant !== null && occupant !== arrow.id) {
                // If occupant is a phantom arrow and hit cell is NOT its head, pass through
                if (this.activeArrows && this.activeArrows.has(occupant)) {
                    const occArrow = this.activeArrows.get(occupant);
                    if (occArrow && occArrow.isPhantom && occArrow.segments) {
                        const occHead = occArrow.segments[occArrow.segments.length - 1];
                        if (occHead.r !== currR || occHead.c !== currC) {
                            currR += delta.r;
                            currC += delta.c;
                            continue;
                        }
                    }
                }
                return occupant;
            }
            currR += delta.r;
            currC += delta.c;
        }
        return null;
    }

    updateBadges() {
        const storage = window.storageManager;
        const hintBadge = document.getElementById('btn-hint-badge');
        if (hintBadge) hintBadge.textContent = storage.data.hints !== undefined ? storage.data.hints : 2;
        const laserBadge = document.getElementById('btn-laser-badge');
        if (laserBadge) laserBadge.textContent = storage.data.lasers !== undefined ? storage.data.lasers : 2;
        const xrayBadge = document.getElementById('btn-xray-badge');
        if (xrayBadge) xrayBadge.textContent = storage.data.xrays !== undefined ? storage.data.xrays : 1;
    }

    activateLaserBooster() {
        if (this.isGameOver || this.isLevelComplete || this.isPaused) return;
        const storage = window.storageManager;
        const lasers = storage.data.lasers !== undefined ? storage.data.lasers : 2;
        if (lasers <= 0) {
            // Player ran out of laser zaps: prompt to watch ad per user requirement
            window.uiController.showAdOfferModal('laser');
            return;
        }

        this.isLaserMode = !this.isLaserMode;
        const gridEl = document.getElementById('puzzle-grid');
        if (gridEl) {
            if (this.isLaserMode) {
                gridEl.classList.add('laser-targeting-active');
                window.uiController.showToast(
                    storage.data.settings.lang === 'ar' ? 'وضع الليزر نشط: انقر على أي سهم لتدميره! ⚡' : 'Laser Active: Tap any arrow to zap it! ⚡'
                );
            } else {
                gridEl.classList.remove('laser-targeting-active');
            }
        }
    }

    executeLaserZap(arrow, arrowEl) {
        this.isLaserMode = false;
        const gridEl = document.getElementById('puzzle-grid');
        if (gridEl) gridEl.classList.remove('laser-targeting-active');

        window.storageManager.useLaser();
        this.updateBadges();

        window.soundEngine.playLaserZap();
        arrow.isEscaped = true;

        this.activeArrows.delete(arrow.id);
        arrow.segments.forEach(seg => {
            this.activeCells.delete(`${seg.r},${seg.c}`);
        });

        arrowEl.classList.add('laser-vaporize');
        setTimeout(() => {
            if (arrowEl.parentNode) arrowEl.parentNode.removeChild(arrowEl);
        }, 450);

        this.escapedArrowsCount++;
        window.storageManager.incrementArrowsReleased();
        const movesEl = document.getElementById('hud-moves');
        if (movesEl) movesEl.textContent = this.escapedArrowsCount;

        this.updateProgressUI();
        this.updateScoreUI();

        if (this.escapedArrowsCount >= this.levelData.totalArrows) {
            setTimeout(() => {
                this.onLevelComplete();
            }, 550);
        }
    }

    executeArrowEscape(arrow, arrowEl) {
        arrow.isEscaped = true;

        // Remove from active maps immediately so subsequent arrows can pass through
        this.activeArrows.delete(arrow.id);
        arrow.segments.forEach(seg => {
            this.activeCells.delete(`${seg.r},${seg.c}`);
        });

        // Key arrow released -> shatter electric lock on corresponding arrow!
        if (arrow.isKey) {
            this.handleKeyArrowUnlocked(arrow);
        }

        this.undoStack.push(arrow);
        this.escapedArrowsCount++;
        window.storageManager.data.stats.totalRotations++;
        window.storageManager.incrementArrowsReleased();

        // Harmonic musical escape chime
        if (window.soundEngine && typeof window.soundEngine.playHarmonicEscape === 'function') {
            window.soundEngine.playHarmonicEscape(this.escapedArrowsCount);
        }

        // Daily mission: arrows released
        if (window.storageManager && typeof window.storageManager.updateMissionProgress === 'function') {
            window.storageManager.updateMissionProgress('arrows', 1);
        }

        // Quantum portal sound
        if (arrow.isPortal && window.soundEngine && typeof window.soundEngine.playPortal === 'function') {
            window.soundEngine.playPortal();
        }

        // EMP / Bomb shockwave detonation
        if (arrow.isBomb) {
            this.triggerBombExplosion(arrow);
        }

        // Magnetic Arrow Polarity Pulse
        if (arrow.isMagnetic) {
            this.triggerMagneticPull(arrow);
        }

        // Mystery Crate In-Grid Collection Check
        if (this.levelData.mysteryCrate && !this.levelData.mysteryCrate.opened) {
            const cr = this.levelData.mysteryCrate;
            const touchesSeg = arrow.segments.some(seg => seg.r === cr.r && seg.c === cr.c);
            let rayTouches = false;
            if (!touchesSeg) {
                const head = arrow.segments[arrow.segments.length - 1];
                const d = window.levelGenerator.DIR_DELTA[arrow.headDir];
                if (d) {
                    let r = head.r + d.r, c = head.c + d.c;
                    const rows = this.levelData.rows || this.levelData.size;
                    const cols = this.levelData.cols || this.levelData.size;
                    while (r >= 0 && r < rows && c >= 0 && c < cols) {
                        if (r === cr.r && c === cr.c) {
                            rayTouches = true;
                            break;
                        }
                        r += d.r;
                        c += d.c;
                    }
                }
            }
            if (touchesSeg || rayTouches) {
                this.triggerMysteryCrateOpen(cr);
            }
        }

        // Combo streak calculation
        const now = Date.now();
        if (this.lastEscapeTime && (now - this.lastEscapeTime < 2800)) {
            this.comboCount++;
        } else {
            this.comboCount = 1;
        }
        this.lastEscapeTime = now;

        if (this.comboCount >= 2) {
            window.storageManager.data.stats.bestCombo = Math.max(window.storageManager.data.stats.bestCombo || 0, this.comboCount);
            this.showComboEffect(this.comboCount);
            window.soundEngine.playCombo(this.comboCount);
            // Award combo rush bonus coins
            const bonusCoins = Math.min(5, this.comboCount - 1);
            window.storageManager.addCoins(bonusCoins);

            if (this.comboCount >= 3 && window.storageManager.updateMissionProgress) {
                window.storageManager.updateMissionProgress('combos', this.comboCount);
            }
        }

        const movesEl = document.getElementById('hud-moves');
        if (movesEl) movesEl.textContent = this.escapedArrowsCount;

        // Play smooth snake slither escape animation
        this.animateArrowSlitherEscape(arrow, arrowEl);

        this.updateProgressUI();
        this.updateScoreUI();

        // Check WIN CONDITION: All arrows escaped!
        if (this.escapedArrowsCount >= this.levelData.totalArrows) {
            setTimeout(() => {
                this.onLevelComplete();
            }, 680);
        }
    }

    triggerBombExplosion(bombArrow) {
        if (window.soundEngine && typeof window.soundEngine.playBomb === 'function') {
            window.soundEngine.playBomb();
        }

        const gridEl = document.getElementById('puzzle-grid');
        if (gridEl) {
            gridEl.classList.remove('bomb-grid-shake');
            void gridEl.offsetWidth;
            gridEl.classList.add('bomb-grid-shake');
            setTimeout(() => {
                if (gridEl) gridEl.classList.remove('bomb-grid-shake');
            }, 450);
        }

        // Crack ice on all frozen arrows immediately
        this.activeArrows.forEach(a => {
            if (a.isFrozen) {
                a.isFrozen = false;
                const el = document.getElementById(`arrow-group-${a.id}`);
                if (el) {
                    el.classList.remove('arrow-frozen');
                    el.classList.add('ice-thaw-pulse');
                    const iceB = el.querySelector('.ice-badge-marker');
                    if (iceB && iceB.parentNode) iceB.parentNode.removeChild(iceB);
                }
            }
        });

        // Find 1 adjacent obstacle arrow that touched this bomb arrow and vaporize it
        let targetAdj = null;
        for (const [key, occupantId] of this.activeCells.entries()) {
            if (occupantId && occupantId !== bombArrow.id) {
                const [r, c] = key.split(',').map(Number);
                const isAdj = bombArrow.segments.some(seg => Math.abs(seg.r - r) <= 1 && Math.abs(seg.c - c) <= 1);
                if (isAdj) {
                    targetAdj = this.activeArrows.get(occupantId);
                    if (targetAdj) break;
                }
            }
        }

        if (targetAdj) {
            const targetEl = document.getElementById(`arrow-group-${targetAdj.id}`);
            if (targetEl) {
                targetAdj.isEscaped = true;
                this.activeArrows.delete(targetAdj.id);
                targetAdj.segments.forEach(seg => {
                    this.activeCells.delete(`${seg.r},${seg.c}`);
                });
                targetEl.classList.add('laser-vaporize');
                setTimeout(() => {
                    if (targetEl.parentNode) targetEl.parentNode.removeChild(targetEl);
                }, 400);
                this.escapedArrowsCount++;
                const movesEl = document.getElementById('hud-moves');
                if (movesEl) movesEl.textContent = this.escapedArrowsCount;
            }
        }

        const isAr = window.storageManager.data.settings.lang === 'ar';
        window.uiController.showToast(isAr ? '💥 انفجار قنبلة الـ EMP! تم تحطيم الحواجز المجاورة!' : '💥 EMP Bomb Detonation! Cleared adjacent obstacles!');
    }

    handleKeyArrowUnlocked(keyArrow) {
        let unlockedTarget = null;
        for (const target of this.activeArrows.values()) {
            if (target.isLocked && (target.lockedById === keyArrow.id || !target.lockedById)) {
                unlockedTarget = target;
                break;
            }
        }
        if (!unlockedTarget) {
            for (const target of this.activeArrows.values()) {
                if (target.isLocked) {
                    unlockedTarget = target;
                    break;
                }
            }
        }

        if (unlockedTarget) {
            unlockedTarget.isLocked = false;
            window.soundEngine.playUnlock();
            window.soundEngine.vibrate([25, 30, 45]);

            const targetEl = document.getElementById(`arrow-group-${unlockedTarget.id}`);
            if (targetEl) {
                targetEl.classList.remove('arrow-locked');
                targetEl.classList.add('unlock-pulse');
                const lockBadge = targetEl.querySelector('.lock-badge-marker');
                if (lockBadge) {
                    lockBadge.classList.add('lock-shatter');
                    setTimeout(() => {
                        if (lockBadge.parentNode) lockBadge.parentNode.removeChild(lockBadge);
                    }, 520);
                }
            }

            const isAr = window.storageManager.data.settings.lang === 'ar';
            window.uiController.showToast(isAr ? '🔓 تم تحرير المفتاح وانكسر القفل الكهربائي!' : '🔓 Key released! Electric lock broken!');
        }
    }

    showComboEffect(comboCount) {
        const overlay = document.getElementById('combo-display-overlay');
        if (!overlay) return;
        overlay.innerHTML = '';

        const badge = document.createElement('div');
        badge.className = `combo-floating-badge ${comboCount >= 3 ? 'combo-fire' : ''}`;

        const isAr = (window.storageManager && window.storageManager.data.settings.lang === 'ar');
        let label = `x${comboCount} COMBO!`;
        if (isAr) {
            if (comboCount === 2) label = `🔥 كومبو x2!`;
            else if (comboCount === 3) label = `⚡ كومبو ناري x3! 🔥`;
            else if (comboCount === 4) label = `💥 كومبو مدمر x4! ⚡`;
            else label = `🌟 كومبو أسطوري x${comboCount}! 🌟`;
        } else {
            if (comboCount === 2) label = `x2 COMBO! 🔥`;
            else if (comboCount === 3) label = `x3 ON FIRE! 🔥`;
            else if (comboCount === 4) label = `x4 INCREDIBLE! ⚡`;
            else label = `x${comboCount} GODLIKE! 🌟`;
        }

        badge.textContent = label;
        overlay.appendChild(badge);

        // Ambient reactive glow on game screen during high combo streaks
        const container = document.querySelector('.game-board-container') || document.getElementById('game-screen');
        if (container) {
            container.classList.remove('ambient-combo-glow-fire');
            void container.offsetWidth;
            container.classList.add('ambient-combo-glow-fire');
            setTimeout(() => {
                if (container) container.classList.remove('ambient-combo-glow-fire');
            }, 2200);
        }

        setTimeout(() => {
            if (badge.parentNode) badge.remove();
        }, 950);
    }

    // Snake Slither Escape Animation: Arrow body glides through every corner and bend along its own track!
    animateArrowSlitherEscape(arrow, arrowEl) {
        const rows = this.levelData.rows || this.levelData.size;
        const cols = this.levelData.cols || this.levelData.size;
        const cellSize = 100;
        const headDir = arrow.headDir;
        const delta = window.levelGenerator.DIR_DELTA[headDir];

        // Sound & haptics: arrow flight whoosh
        window.soundEngine.playArrowTravel(arrow.color === 'cyan');
        window.soundEngine.vibrate([20, 25]);

        const segs = arrow.segments;
        const head = segs[segs.length - 1];
        const headCx = (head.c + 0.5) * cellSize;
        const headCy = (head.r + 0.5) * cellSize;
        const headRot = headDir * 90;

        // Distance required for the head and entire tail to slide off the board
        const exitSteps = Math.max(rows, cols) + 4;
        const exitDist = exitSteps * cellSize;

        // Final exit coordinate for head in headDir
        const exitHeadX = headCx + delta.c * exitDist;
        const exitHeadY = headCy + delta.r * exitDist;

        // Construct full track polyline: tail -> body segments -> head -> offscreen exit
        let fullTrackD = '';
        for (let i = 0; i < segs.length; i++) {
            const cx = (segs[i].c + 0.5) * cellSize;
            const cy = (segs[i].r + 0.5) * cellSize;
            fullTrackD += (i === 0 ? `M ${cx} ${cy}` : ` L ${cx} ${cy}`);
        }
        fullTrackD += ` L ${exitHeadX} ${exitHeadY}`;

        // Body length of the arrow along segments
        const bodyLength = (segs.length - 1) * cellSize;
        // Total track length: body + exit line
        const totalTrackLength = bodyLength + exitDist;

        // Total distance to slither so the tail completely disappears off the end
        const totalSlitherDist = totalTrackLength + 50;

        // Prevent further clicks during flight
        arrowEl.style.pointerEvents = 'none';

        const trackLines = arrowEl.querySelectorAll('.arrow-track-line');
        const headMeshes = arrowEl.querySelectorAll('.arrowhead-mesh:not(.arrowhead-tail-mesh)');
        const tailMeshes = arrowEl.querySelectorAll('.arrowhead-tail-mesh');
        const badges = arrowEl.querySelectorAll('.key-badge-marker, .lock-badge-marker');

        const escapedBackwards = !!arrow._escapedBackwards;
        const activeHeadMeshes = escapedBackwards ? tailMeshes : headMeshes;
        const fadingMeshes = escapedBackwards ? headMeshes : tailMeshes;

        fadingMeshes.forEach(fm => {
            fm.style.transition = 'opacity 0.25s ease';
            fm.style.opacity = '0';
        });

        badges.forEach(b => {
            b.style.transition = 'opacity 0.2s ease';
            b.style.opacity = '0';
        });

        arrowEl.querySelectorAll('.arrow-deco').forEach(d => {
            d.style.transition = 'opacity 0.15s ease';
            d.style.opacity = '0';
        });

        // Setup the stroke dash to match the arrow body on the track
        trackLines.forEach(line => {
            line.setAttribute('d', fullTrackD);
            line.style.strokeDasharray = `${bodyLength} ${totalSlitherDist + 3000}`;
            line.style.strokeDashoffset = '0';
        });

        // Slither smoothly in next frame (Snake Movement)
        requestAnimationFrame(() => {
            trackLines.forEach(line => {
                line.style.transition = 'stroke-dashoffset 0.52s cubic-bezier(0.2, 0.8, 0.25, 1)';
                line.style.strokeDashoffset = `-${totalSlitherDist}px`;
            });

            activeHeadMeshes.forEach(headMesh => {
                const exitHeadTargetX = headCx + delta.c * totalSlitherDist;
                const exitHeadTargetY = headCy + delta.r * totalSlitherDist;
                headMesh.style.transition = 'transform 0.52s cubic-bezier(0.2, 0.8, 0.25, 1)';
                headMesh.style.transform = `translate(${exitHeadTargetX}px, ${exitHeadTargetY}px) rotate(${headRot}deg)`;
            });

            const activeTrail = (window.storageManager && window.storageManager.data.activeArrowTrail) || 'neon';
            this.spawnSlitherParticles(headCx, headCy, arrow.color, activeTrail);
        });

        // Clean up element after animation finishes
        setTimeout(() => {
            if (arrowEl.parentNode) {
                arrowEl.parentNode.removeChild(arrowEl);
            }
        }, 560);
    }

    spawnSlitherParticles(cx, cy, color, trailSkin = 'neon') {
        const boardWrapper = document.getElementById('puzzle-grid');
        if (!boardWrapper) return;
        const rect = boardWrapper.getBoundingClientRect();
        const count = (trailSkin === 'cosmic' || trailSkin === 'rainbow' || trailSkin === 'matrix') ? 8 : (trailSkin === 'gold' || trailSkin === 'fire' ? 6 : 4);

        for (let i = 0; i < count; i++) {
            const spark = document.createElement('div');
            spark.className = `slither-sparkle spark-${color} trail-${trailSkin}`;
            if (trailSkin === 'gold') {
                spark.textContent = '✦';
            } else if (trailSkin === 'cosmic') {
                spark.textContent = '★';
            } else if (trailSkin === 'fire') {
                spark.textContent = '🔥';
            } else if (trailSkin === 'rainbow') {
                spark.textContent = '✨';
            } else if (trailSkin === 'matrix') {
                spark.textContent = Math.random() > 0.5 ? '1' : '0';
            } else {
                const emojiTrails = { hearts: '💖', snow: '❄️', bubbles: '🫧', leaves: '🍃', music: Math.random() > 0.5 ? '🎵' : '🎶', petals: '🌸', coins: '🪙', butterflies: '🦋', bolts: '⚡', gems: '💎', clovers: '🍀', fireworks: '🎆', candies: '🍬', planets: '🪐', glowstars: '🌟' };
                if (emojiTrails[trailSkin]) spark.textContent = emojiTrails[trailSkin];
            }
            const ox = (Math.random() - 0.5) * 26;
            const oy = (Math.random() - 0.5) * 26;
            const cols = (this.levelData && this.levelData.cols) || 8;
            const rows = (this.levelData && this.levelData.rows) || 14;
            spark.style.left = `${(cx / (cols * 100)) * rect.width + ox}px`;
            spark.style.top = `${(cy / (rows * 100)) * rect.height + oy}px`;
            spark.style.setProperty('--tx', `${(Math.random() - 0.5) * 55}px`);
            spark.style.setProperty('--ty', `${(Math.random() - 0.5) * 55}px`);
            boardWrapper.appendChild(spark);
            setTimeout(() => spark.remove(), 600);
        }
    }

    spawnVictorySlowConfetti() {
        const container = document.getElementById('android-device-wrapper') || document.body;
        if (!container) return;

        const colors = ['#00f0ff', '#ff007f', '#ffd700', '#00ff66', '#b026ff', '#ffffff'];
        const shapes = ['square', 'circle', 'ribbon', 'star'];

        for (let i = 0; i < 48; i++) {
            const confetti = document.createElement('div');
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            confetti.className = `victory-confetti-particle confetti-${shape}`;

            const startX = Math.random() * 95;
            const duration = 2.2 + Math.random() * 1.8; // Slow motion 2.2s - 4.0s
            const delay = Math.random() * 0.7;
            const size = (shape === 'ribbon') ? (5 + Math.random() * 4) : (7 + Math.random() * 6);
            const driftX = (Math.random() - 0.5) * 120;

            confetti.style.left = `${startX}%`;
            confetti.style.top = `-20px`;
            confetti.style.width = `${size}px`;
            confetti.style.height = shape === 'ribbon' ? `${size * 2.8}px` : `${size}px`;
            confetti.style.backgroundColor = color;
            confetti.style.boxShadow = `0 0 10px ${color}`;
            confetti.style.animationDuration = `${duration}s`;
            confetti.style.animationDelay = `${delay}s`;
            confetti.style.setProperty('--drift-x', `${driftX}px`);

            if (shape === 'star') {
                confetti.textContent = '★';
                confetti.style.backgroundColor = 'transparent';
                confetti.style.color = color;
                confetti.style.fontSize = `${size * 1.4}px`;
            }

            container.appendChild(confetti);
            setTimeout(() => {
                if (confetti.parentNode) confetti.parentNode.removeChild(confetti);
            }, (duration + delay) * 1000 + 100);
        }
    }

    undo() {
        if (this.undoStack.length === 0 || this.isGameOver || this.isLevelComplete) return;

        const lastArrow = this.undoStack.pop();
        lastArrow.isEscaped = false;

        this.activeArrows.set(lastArrow.id, lastArrow);
        lastArrow.segments.forEach(seg => {
            this.activeCells.set(`${seg.r},${seg.c}`, lastArrow.id);
        });

        // If undone arrow was a key, re-lock the locked arrow
        if (lastArrow.isKey) {
            this.levelData.arrows.forEach(a => {
                if (a.lockedById === lastArrow.id) {
                    a.isLocked = true;
                }
            });
        }

        if (this.escapedArrowsCount > 0) this.escapedArrowsCount--;

        const movesEl = document.getElementById('hud-moves');
        if (movesEl) movesEl.textContent = this.escapedArrowsCount;

        window.soundEngine.playClick();
        this.renderBoard();
        this.updateProgressUI();
        this.updateScoreUI();
    }

    reset() {
        if (this.isGameOver || this.isLevelComplete) return;

        this.undoStack = [];
        this.escapedArrowsCount = 0;
        this.activeCells.clear();
        this.activeArrows.clear();

        this.levelData.arrows.forEach(a => {
            a.isEscaped = false;
            if (a.lockedById) a.isLocked = true;
            this.activeArrows.set(a.id, a);
            a.segments.forEach(seg => {
                this.activeCells.set(`${seg.r},${seg.c}`, a.id);
            });
        });

        const movesEl = document.getElementById('hud-moves');
        if (movesEl) movesEl.textContent = this.escapedArrowsCount;

        window.soundEngine.playClick();
        this.renderBoard();
        this.updateProgressUI();
        this.updateScoreUI();
    }

    useHint() {
        if (this.isGameOver || this.isLevelComplete) return;

        const storage = window.storageManager;
        if (storage.data.hints <= 0) {
            // Player ran out of hints: prompt to watch ad per user requirement
            window.uiController.showAdOfferModal('hint');
            return;
        }

        // Find an un-escaped arrow that CAN escape right now (checking both normal & double-headed)
        let escapableArrow = null;
        const rows = this.levelData.rows || this.levelData.size;
        const cols = this.levelData.cols || this.levelData.size;
        for (const arrow of this.activeArrows.values()) {
            if (arrow.isDoubleHeaded) {
                const res = window.levelGenerator.canDoubleHeadedEscape(arrow, rows, this.activeCells, cols, this.activeArrows);
                if (res.canEscape) {
                    escapableArrow = arrow;
                    break;
                }
            } else if (window.levelGenerator.checkArrowCanEscape(arrow, rows, this.activeCells, 'head', cols, this.activeArrows)) {
                escapableArrow = arrow;
                break;
            }
        }

        if (!escapableArrow) {
            window.uiController.showToast(storage.data.settings.lang === 'ar' ? 'لا يوجد سهم سالك حالياً!' : 'No arrows can escape right now!');
            return;
        }

        storage.useHint();
        this.hintsUsed++;
        this.updateBadges();

        window.soundEngine.playHint();

        // Highlight the escapable arrow element with glowing gold beacon
        const arrowEl = document.getElementById(`arrow-group-${escapableArrow.id}`);
        if (arrowEl) {
            arrowEl.classList.add('hint-highlight');
            setTimeout(() => {
                arrowEl.classList.remove('hint-highlight');
            }, 3000);
        }

        const isAr = storage.data.settings.lang === 'ar';
        const msg = isAr 
            ? 'هذا السهم لديه مسار خروج مفتوح! اضغط عليه مباشرة للهروب خارج اللوحة.'
            : 'This arrow has a clear escape path! Tap it to slide off the board.';
        window.uiController.showHintDialog(msg);
    }

    autoSolveNextStep() {
        if (this.isGameOver || this.isLevelComplete) return false;
        let escapableArrow = null;
        let escapeMode = 'head';
        const rows = this.levelData.rows || this.levelData.size;
        const cols = this.levelData.cols || this.levelData.size;
        for (const arrow of this.activeArrows.values()) {
            if (arrow.isLocked) continue;
            if (arrow.isDoubleHeaded) {
                const res = window.levelGenerator.canDoubleHeadedEscape(arrow, rows, this.activeCells, cols, this.activeArrows);
                if (res.canEscape) {
                    escapableArrow = arrow;
                    escapeMode = res.dir || 'head';
                    break;
                }
            } else if (window.levelGenerator.checkArrowCanEscape(arrow, rows, this.activeCells, 'head', cols, this.activeArrows)) {
                escapableArrow = arrow;
                escapeMode = 'head';
                break;
            }
        }

        if (!escapableArrow) {
            window.uiController.showToast(window.storageManager.data.settings.lang === 'ar' ? 'لا يوجد سهم سالك حالياً!' : 'No escapable arrow currently!');
            return false;
        }

        const arrowEl = document.getElementById(`arrow-group-${escapableArrow.id}`);
        if (arrowEl) {
            escapableArrow._escapedBackwards = (escapeMode === 'tail');
            window.soundEngine.playWhoosh();
            this.executeArrowEscape(escapableArrow, arrowEl);
            return true;
        }
        return false;
    }

    triggerMysteryCrateOpen(crate) {
        crate.opened = true;
        if (window.soundEngine && typeof window.soundEngine.playCrateOpen === 'function') {
            window.soundEngine.playCrateOpen();
        }

        const crateEl = document.getElementById('mystery-crate-marker');
        if (crateEl) {
            crateEl.classList.add('mystery-crate-burst');
            setTimeout(() => {
                if (crateEl.parentNode) crateEl.parentNode.removeChild(crateEl);
            }, 600);
        }

        const bonusCoins = crate.rewardCoins || 25;
        window.storageManager.addCoins(bonusCoins);

        const bonusBooster = Math.random() > 0.5 ? 'laser' : 'xray';
        if (bonusBooster === 'laser') {
            window.storageManager.addLasers(1);
        } else {
            window.storageManager.addXRays(1);
        }
        this.updateBadges();

        const isAr = window.storageManager.data.settings.lang === 'ar';
        const boosterName = bonusBooster === 'laser' ? (isAr ? '+1 ليزر ⚡' : '+1 Laser ⚡') : (isAr ? '+1 عين الصقر 👁️' : '+1 X-Ray 👁️');
        window.uiController.showToast(
            isAr ? `📦 صندوق الكنز النيوني! +${bonusCoins} 🪙 و ${boosterName}!` : `📦 Mystery Crate! +${bonusCoins} 🪙 and ${boosterName}!`
        );
    }

    triggerMagneticPull(magArrow) {
        if (window.soundEngine && typeof window.soundEngine.playMagnet === 'function') {
            window.soundEngine.playMagnet();
        }

        const gridEl = document.getElementById('puzzle-grid');
        if (gridEl) {
            gridEl.classList.remove('magnetic-ripple-active');
            void gridEl.offsetWidth;
            gridEl.classList.add('magnetic-ripple-active');
            setTimeout(() => {
                if (gridEl) gridEl.classList.remove('magnetic-ripple-active');
            }, 550);
        }

        this.activeArrows.forEach(otherArrow => {
            if (otherArrow.id === magArrow.id) return;
            const isNear = otherArrow.segments.some(otherSeg => {
                return magArrow.segments.some(magSeg => Math.abs(magSeg.r - otherSeg.r) <= 1 && Math.abs(magSeg.c - otherSeg.c) <= 1);
            });
            if (isNear) {
                const el = document.getElementById(`arrow-group-${otherArrow.id}`);
                if (el) {
                    el.classList.add('magnetic-attracted-glow');
                    setTimeout(() => {
                        if (el) el.classList.remove('magnetic-attracted-glow');
                    }, 650);
                }
            }
        });

        const isAr = window.storageManager.data.settings.lang === 'ar';
        window.uiController.showToast(isAr ? '🧲 نبضة مغناطيسية قوية جذبت مسارات الأسهم المحيطة!' : '🧲 Magnetic pulse attracted nearby arrows!');
    }

    activateXRayVision() {
        if (this.isGameOver || this.isLevelComplete || this.isPaused) return;
        const storage = window.storageManager;
        const xrays = storage.data.xrays !== undefined ? storage.data.xrays : 1;
        if (xrays <= 0) {
            window.uiController.showAdOfferModal('xray');
            return;
        }

        window.storageManager.useXRay();
        this.updateBadges();

        if (window.soundEngine && typeof window.soundEngine.playXRay === 'function') {
            window.soundEngine.playXRay();
        }

        const rows = this.levelData.rows || this.levelData.size;
        const cols = this.levelData.cols || this.levelData.size;
        const escapableArrows = [];

        for (const arrow of this.activeArrows.values()) {
            if (arrow.isLocked) continue;
            let can = false;
            let dir = 'head';
            if (arrow.isDoubleHeaded) {
                const res = window.levelGenerator.canDoubleHeadedEscape(arrow, rows, this.activeCells, cols, this.activeArrows);
                if (res.canEscape) {
                    can = true;
                    dir = res.dir || 'head';
                }
            } else {
                can = window.levelGenerator.checkArrowCanEscape(arrow, rows, this.activeCells, 'head', cols, this.activeArrows);
            }
            if (can) {
                escapableArrows.push({ arrow, dir });
            }
        }

        if (escapableArrows.length === 0) {
            const isAr = storage.data.settings.lang === 'ar';
            window.uiController.showToast(isAr ? '👁️ لا توجد أسهم سالكة حالياً! جرّب التدوير أو الليزر' : '👁️ No directly escapable arrows found! Rotate or Laser');
            return;
        }

        // Draw animated emerald laser rays for all escapable arrows!
        const gridSvg = document.getElementById('board-matrix-svg');
        const raysContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        raysContainer.setAttribute('class', 'xray-laser-container');

        const cellSize = this.cellSize || 100;
        escapableArrows.forEach(({ arrow, dir }) => {
            const arrowEl = document.getElementById(`arrow-group-${arrow.id}`);
            if (arrowEl) {
                arrowEl.classList.add('xray-escapable-glow');
            }

            const isTail = (dir === 'tail');
            const head = isTail ? arrow.segments[0] : arrow.segments[arrow.segments.length - 1];
            const d = isTail ? arrow.tailDir : arrow.headDir;
            const delta = window.levelGenerator.DIR_DELTA[d];
            if (!delta) return;

            const cx1 = (head.c + 0.5) * cellSize;
            const cy1 = (head.r + 0.5) * cellSize;
            const maxDim = Math.max(rows, cols) * cellSize;
            const cx2 = cx1 + delta.c * maxDim;
            const cy2 = cy1 + delta.r * maxDim;

            const ray = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            ray.setAttribute('x1', cx1);
            ray.setAttribute('y1', cy1);
            ray.setAttribute('x2', cx2);
            ray.setAttribute('y2', cy2);
            ray.setAttribute('class', 'xray-laser-beam');
            ray.setAttribute('stroke', '#00ff66');
            ray.setAttribute('stroke-width', Math.max(4, Math.round(cellSize * 0.08)));
            ray.setAttribute('stroke-dasharray', '10 5');
            ray.setAttribute('stroke-linecap', 'round');
            ray.setAttribute('filter', 'url(#maze-cyan-glow)');
            raysContainer.appendChild(ray);
        });

        if (gridSvg) {
            gridSvg.appendChild(raysContainer);
        }

        const isAr = storage.data.settings.lang === 'ar';
        window.uiController.showToast(
            isAr ? `👁️ عين الصقر كشفت ${escapableArrows.length} مسار هروب مفتوح!` : `👁️ X-Ray revealed ${escapableArrows.length} escape routes!`
        );

        setTimeout(() => {
            if (raysContainer.parentNode) raysContainer.parentNode.removeChild(raysContainer);
            escapableArrows.forEach(({ arrow }) => {
                const arrowEl = document.getElementById(`arrow-group-${arrow.id}`);
                if (arrowEl) arrowEl.classList.remove('xray-escapable-glow');
            });
        }, 3600);
    }

    instantWinLevel() {
        if (this.isGameOver || this.isLevelComplete) return;
        for (const arrow of this.activeArrows.values()) {
            arrow.isEscaped = true;
        }
        this.activeArrows.clear();
        this.activeCells.clear();
        this.escapedArrowsCount = this.levelData.totalArrows;
        this.onLevelComplete();
    }

    goToNextLevel() {
        const next = Math.min(5000, this.currentLevel + 1);
        this.startLevel(next, this.gameMode);
    }

    goToPrevLevel() {
        const prev = Math.max(1, this.currentLevel - 1);
        this.startLevel(prev, this.gameMode);
    }

    reloadCurrentLevel() {
        this.startLevel(this.currentLevel, this.gameMode);
    }

    onLevelComplete() {
        if (this.isLevelComplete) return;
        this.isLevelComplete = true;
        this.stopTimer();

        const isBoss = !!(this.levelData && this.levelData.isBoss);
        if (isBoss) {
            window.soundEngine.playBossWin();
        } else {
            window.soundEngine.playWin();
        }

        // Spawn slow-motion neon victory confetti!
        this.spawnVictorySlowConfetti();

        // Challenge Mode specific completion
        if (this.gameMode === 'challenge') {
            const timeUsed = Math.max(1, this.timeLimit - this.elapsedSeconds);
            const stage = this.challengeStage || window.storageManager.getChallengePlayableStage();
            const result = window.storageManager.saveChallengeWin(stage, timeUsed);
            const challengeCoins = result.coins;
            window.uiController.checkAchievements();

            setTimeout(() => {
                const isAr = (window.storageManager.data.settings.lang === 'ar');
                const replayNote = result.firstClear ? '' : (isAr ? ' - إعادة لعب' : ' - replay');
                window.uiController.showToast(isAr 
                    ? `⏱️ أنهيت التحدي ${stage} في ${timeUsed} ثانية${replayNote} +${challengeCoins} 🪙` 
                    : `⏱️ Challenge ${stage} finished in ${timeUsed}s${replayNote} +${challengeCoins} 🪙`);
                window.uiController.showLevelCompleteScreen({
                    level: isAr ? `تحدي ${stage}` : `Challenge ${stage}`,
                    stars: 3,
                    moves: this.escapedArrowsCount,
                    targetMoves: this.levelData.totalArrows,
                    bestResult: `${timeUsed}s`,
                    coinsEarned: challengeCoins,
                    multiplier: 1,
                    isBoss: false
                });
            }, 550);
            return;
        }

        // Calculate stars based on mistakes
        let stars = 3;
        if (this.mistakes >= 2) stars = 1;
        else if (this.mistakes === 1) stars = 2;

        const finalScore = Math.max(1000, 10000 + (this.escapedArrowsCount * 400) - (this.mistakes * 500) + (this.currentLevel * 100));

        // Coin reward with Boss multiplier:
        // 5 coins base, doubled every 100 wins, and doubled again if Boss level!
        const coinCalc = window.storageManager.calculateWinCoins(isBoss);
        const coinsEarned = coinCalc.coins;
        window.storageManager.addCoins(coinsEarned);

        window.storageManager.saveLevelRecord(this.currentLevel, {
            stars,
            moves: this.escapedArrowsCount,
            score: finalScore,
            time: this.elapsedSeconds
        });

        // Milestone celebration for every 100 wins
        const currentTotalSolved = window.storageManager.data.stats.totalPuzzlesSolved || 0;
        if (currentTotalSolved > 0 && currentTotalSolved % 100 === 0) {
            const nextMult = Math.pow(2, Math.floor(currentTotalSolved / 100));
            setTimeout(() => {
                window.uiController.showToast(`🎉 إنجاز أسطوري! أتممت ${currentTotalSolved} مرحلة وتضاعفت الكوينز إلى x${nextMult}!`);
            }, 1200);
        }

        if (window.storageManager && typeof window.storageManager.updateMissionProgress === 'function') {
            window.storageManager.updateMissionProgress('levels', 1);
        }

        window.uiController.checkAchievements();

        // Open Level Complete Screen
        setTimeout(() => {
            window.uiController.showLevelCompleteScreen({
                level: this.currentLevel,
                stars,
                moves: this.escapedArrowsCount,
                targetMoves: this.levelData.totalArrows,
                bestResult: window.storageManager.getLevelRecord(this.currentLevel)?.bestScore || finalScore,
                coinsEarned,
                multiplier: coinCalc.multiplier,
                isBoss
            });
        }, 550);
    }

    onLevelFailed(reason = 'attempts') {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.stopTimer();

        try {
            if (window.soundEngine && window.soundEngine.playGameOver) {
                window.soundEngine.playGameOver();
            }
        } catch (e) {
            console.warn('Sound error on level failed:', e);
        }

        setTimeout(() => {
            if (window.uiController && window.uiController.showLevelFailedScreen) {
                window.uiController.showLevelFailedScreen(reason);
            }
        }, 300);
    }

    grantRewardedAttempt() {
        this.mistakes = 0;
        this.attempts = 3;
        this.isGameOver = false;
        // Clear any shake error or clash warning highlights from the board
        document.querySelectorAll('.shake-error, .clash-warning, .arrow-active-touched').forEach(el => {
            el.classList.remove('shake-error', 'clash-warning', 'arrow-active-touched');
        });
        this.updateStarsUI();
        this.updateScoreUI();
        this.startTimer();
        window.soundEngine.playReward();
    }
}

if (typeof module !== 'undefined') {
    module.exports = GameManager;
}
if (typeof window !== 'undefined') {
    window.gameManager = new GameManager();
}

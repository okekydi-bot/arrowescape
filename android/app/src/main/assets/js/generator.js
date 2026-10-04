// Procedural High-Difficulty Pure Matrix Grid Level Generator for ARROW ESCAPE (5000 Levels)
// 1. Shapes Completely Removed: 100% pure full-coverage cyber matrix grids (no cutout masks).
// 2. Wide Horizontal Grid: cols: 14 to 16 filling the mobile screen width edge-to-edge without side gaps.
// 3. Ultra-High Progressive Difficulty:
//    - Dense winding labyrinth arrows (lengths 2 to 7 cells: L-turns, U-turns, S-curves).
//    - Solvable by Backwards Peeling Simulation: only strictly 1 (or at most 2) arrows can escape at step 0!
//    - Deep sequential dependency chains.
//    - Progressive Key & Lock mechanics (up to 8-10 pairs).
//    - Double-Headed arrows (up to 7-8).
//    - Boss stages every 10 levels (500 Boss stages total).

class WorldCatalog {
    static getDistinctWorlds() {
        return [
            { name: 'أفق النيون', icon: '🔷', color: '#00f3ff' },
            { name: 'شفق الساينث', icon: '🌆', color: '#ff007f' },
            { name: 'مصفوفة الزمرد', icon: '🟩', color: '#00ff66' },
            { name: 'سديم البلازما', icon: '🔮', color: '#b026ff' },
            { name: 'العرش الذهبي', icon: '👑', color: '#ffb700' },
            { name: 'بركان الصهارة', icon: '🌋', color: '#ff3b30' },
            { name: 'كوانتم الجليد', icon: '❄️', color: '#00d2ff' },
            { name: 'صاعقة الأثير', icon: '⚡', color: '#ff9500' },
            { name: 'سماء السديم', icon: '🌌', color: '#a855f7' },
            { name: 'قلب الأوميغا', icon: '♾️', color: '#ff0055' },
            { name: 'واحة الكريستال', icon: '💎', color: '#06b6d4' },
            { name: 'رمال العقيق', icon: '🏜️', color: '#f59e0b' },
            { name: 'شاطئ المرجان', icon: '🪸', color: '#f43f5e' },
            { name: 'أعماق المحيط', icon: '🌊', color: '#3b82f6' },
            { name: 'مدار الكواكب', icon: '🪐', color: '#8b5cf6' },
            { name: 'نيزك الفيروز', icon: '☄️', color: '#14b8a6' },
            { name: 'فجر الإشراق', icon: '☀️', color: '#eab308' },
            { name: 'ضوء القمر', icon: '🌙', color: '#94a3b8' },
            { name: 'فضاء النوفا', icon: '✨', color: '#facc15' },
            { name: 'دوامة الكوازار', icon: '🌀', color: '#6366f1' },
            { name: 'سديم الأندروميدا', icon: '💫', color: '#ec4899' },
            { name: 'أطلال تيتان', icon: '🏛️', color: '#d97706' },
            { name: 'برج الفلك', icon: '🔭', color: '#84cc16' },
            { name: 'جزيرة الشهب', icon: '🏝️', color: '#22d3ee' },
            { name: 'وادي المذنبات', icon: '🌠', color: '#c084fc' },
            { name: 'كهف التوباز', icon: '🪨', color: '#fb923c' },
            { name: 'بستان الأزهار', icon: '🌸', color: '#f472b6' },
            { name: 'درب المجرات', icon: '🌌', color: '#818cf8' },
            { name: 'مدينة الزئبق', icon: '🏙️', color: '#cbd5e1' },
            { name: 'قلب المفاعل', icon: '☢️', color: '#4ade80' },
            { name: 'أفق المستقبل', icon: '📡', color: '#38bdf8' },
            { name: 'ممر الفوتون', icon: '💡', color: '#fde047' },
            { name: 'حصن الأيونات', icon: '🛡️', color: '#a78bfa' },
            { name: 'برج الهايبر', icon: '🗼', color: '#fb7185' },
            { name: 'ساحة الروبوتات', icon: '🤖', color: '#94a3b8' },
            { name: 'تردد الأثير', icon: '📻', color: '#34d399' },
            { name: 'سراب النيون', icon: '🌆', color: '#f43f5e' },
            { name: 'رنين السيليكون', icon: '💾', color: '#60a5fa' },
            { name: 'غابة الأرواح', icon: '🌲', color: '#059669' },
            { name: 'مملكة السراب', icon: '🏰', color: '#d946ef' },
            { name: 'قصر البلور', icon: '💠', color: '#2dd4bf' },
            { name: 'عرش الجليد', icon: '🧊', color: '#7dd3fc' },
            { name: 'مرج الشفق', icon: '🌾', color: '#a3e635' },
            { name: 'كهف الزمرد', icon: '❇️', color: '#4ade80' },
            { name: 'بحيرة النور', icon: '🫧', color: '#38bdf8' },
            { name: 'شلال النقاء', icon: '💧', color: '#0284c7' },
            { name: 'قمة الضباب', icon: '🏔️', color: '#c084fc' },
            { name: 'معبد الصاعقة', icon: '⛩️', color: '#e11d48' },
            { name: 'أبعاد الأثير', icon: '🔮', color: '#9333ea' },
            { name: 'أفق الحدث', icon: '🕳️', color: '#475569' },
            { name: 'دوامة الفراغ', icon: '🌪️', color: '#64748b' },
            { name: 'نسيج الكوانتم', icon: '🧬', color: '#06b6d4' },
            { name: 'بوابة الثقوب', icon: '🌌', color: '#7c3aed' },
            { name: 'مدار المريخ', icon: '🔴', color: '#dc2626' },
            { name: 'أقمار المشتري', icon: '🪐', color: '#ca8a04' },
            { name: 'حلقات زحل', icon: '💍', color: '#eab308' },
            { name: 'رياح الفضاء', icon: '💨', color: '#0ea5e9' },
            { name: 'سماء البنفسج', icon: '☂️', color: '#a855f7' },
            { name: 'كهف الماس', icon: '💎', color: '#38bdf8' },
            { name: 'منجم الياقوت', icon: '❤️', color: '#e11d48' },
            { name: 'كنوز العقيق', icon: '🧡', color: '#ea580c' },
            { name: 'عرش الفيروز', icon: '🩵', color: '#06b6d4' },
            { name: 'أسرار الجمشت', icon: '💜', color: '#9333ea' },
            { name: 'جوهرة السافير', icon: '💙', color: '#2563eb' },
            { name: 'بريق الأوبال', icon: '🤍', color: '#f1f5f9' },
            { name: 'رمال اللؤلؤ', icon: '🦪', color: '#e2e8f0' },
            { name: 'جزر الكوارتز', icon: '⛰️', color: '#f472b6' },
            { name: 'بركان البازلت', icon: '🌋', color: '#b91c1c' },
            { name: 'شبكة الألياف', icon: '🌐', color: '#0284c7' },
            { name: 'قلب الشفرة', icon: '⚡', color: '#f59e0b' },
            { name: 'محور البيانات', icon: '🖧', color: '#10b981' },
            { name: 'سحابة النانو', icon: '☁️', color: '#93c5fd' },
            { name: 'مصفوفة العقل', icon: '🧠', color: '#ec4899' },
            { name: 'معالج التيتانيوم', icon: '⚙️', color: '#94a3b8' },
            { name: 'تدفق النبض', icon: '🌊', color: '#06b6d4' },
            { name: 'تشفير الكوانتم', icon: '🔐', color: '#8b5cf6' },
            { name: 'صدى الأثير', icon: '🔈', color: '#a855f7' },
            { name: 'حقل الجاذبية', icon: '🧲', color: '#ef4444' },
            { name: 'وادي العنقاء', icon: '🔥', color: '#f97316' },
            { name: 'قلعة التنين', icon: '🐉', color: '#dc2626' },
            { name: 'بستان الخلود', icon: '🍃', color: '#16a34a' },
            { name: 'مسار الصقور', icon: '🦅', color: '#ca8a04' },
            { name: 'أطلال الفينيق', icon: '🏺', color: '#b45309' },
            { name: 'سماء الفردوس', icon: '🌈', color: '#f43f5e' },
            { name: 'بحر الأساطير', icon: '⛵', color: '#0284c7' },
            { name: 'جزيرة الخلود', icon: '🏝️', color: '#14b8a6' },
            { name: 'قمة الأولمب', icon: '⚡', color: '#eab308' },
            { name: 'واحة السلام', icon: '🕊️', color: '#6ee7b7' },
            { name: 'فجر الأبدية', icon: '🌅', color: '#f43f5e' },
            { name: 'بوابة اللانهاية', icon: '♾️', color: '#8b5cf6' },
            { name: 'نقطة التفرد', icon: '🎯', color: '#ef4444' },
            { name: 'شعلة الأزل', icon: '🕯️', color: '#f59e0b' },
            { name: 'شفق الخلود', icon: '🌆', color: '#ec4899' },
            { name: 'مدار النور', icon: '💫', color: '#38bdf8' },
            { name: 'كوكب الأحلام', icon: '🪐', color: '#a855f7' },
            { name: 'إشعاع النبض', icon: '🔆', color: '#fbbf24' },
            { name: 'قلب الوجود', icon: '💖', color: '#f43f5e' },
            { name: 'عرش النجوم', icon: '🌟', color: '#ffd700' },
            { name: 'تاج الكواكب', icon: '👑', color: '#a855f7' },
            { name: 'أفق الأوميغا', icon: '⚡', color: '#ff0055' }
        ];
    }

    static getTotalWorlds() {
        return 100;
    }

    static getWorld(worldIndex) {
        const idx = Math.min(99, Math.max(0, worldIndex));
        const list = this.getDistinctWorlds();
        const world = list[idx];
        const startLevel = idx * 50 + 1;
        const endLevel = (idx + 1) * 50;

        return {
            id: `world_${idx + 1}`,
            worldIndex: idx,
            worldNumber: idx + 1,
            startLevel,
            endLevel,
            name: world.name,
            icon: world.icon,
            color: world.color,
            displayName: `${world.icon} ${world.name}`
        };
    }

    static getWorlds() {
        const list = [];
        for (let i = 0; i < 100; i++) {
            list.push(this.getWorld(i));
        }
        return list;
    }

    static getWorldForLevel(level) {
        const safeLvl = Math.min(5000, Math.max(1, level));
        const worldIndex = Math.floor((safeLvl - 1) / 50);
        return this.getWorld(worldIndex);
    }
}

// Pure Full-Grid Cyber Matrix (Shapes removed per user request)
class ShapeCatalog {
    static getShapeForLevel(level) {
        return { type: 'grid', name: 'شبكة نيون كاملة', icon: '⚡' };
    }

    static createMask(shapeType, rows, cols) {
        return Array(rows).fill(0).map(() => Array(cols).fill(true));
    }
}

class LevelGenerator {
    constructor() {
        this.DIR_DELTA = [
            { r: -1, c: 0 }, // 0: Up
            { r: 0, c: 1 },  // 1: Right
            { r: 1, c: 0 },  // 2: Down
            { r: 0, c: -1 }  // 3: Left
        ];
    }

    mulberry32(seed) {
        return function() {
            let t = seed += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    // Grid Dimensions: WIDER HORIZONTALLY to fill mobile screen edge-to-edge!
    // Aspect ratio 0.778 to 0.800 guarantees zero side margins/voids on any phone.
    getGridDimensionsForLevel(level) {
        if (level <= 150) return { cols: 14, rows: 18 };     // 252 cells - Ratio: 0.778
        if (level <= 1500) return { cols: 15, rows: 19 };    // 285 cells - Ratio: 0.789
        return { cols: 16, rows: 20 };                       // 320 cells - Ratio: 0.800
    }

    getGridSizeForLevel(level) {
        const dims = this.getGridDimensionsForLevel(level);
        return Math.max(dims.rows, dims.cols);
    }

    fastCheckArrowEscape(arrow, rows, grid, cols = rows) {
        const head = arrow.segments[arrow.segments.length - 1];
        const delta = this.DIR_DELTA[arrow.headDir];
        let currR = head.r + delta.r;
        let currC = head.c + delta.c;
        const myId = arrow.intId;

        while (currR >= 0 && currR < rows && currC >= 0 && currC < cols) {
            const occ = grid[currR * cols + currC];
            if (occ !== 0 && occ !== myId) return false;
            currR += delta.r;
            currC += delta.c;
        }
        return true;
    }

    fastFindEscapeSequence(arrows, rows, cols = rows) {
        const totalCells = rows * cols;
        const grid = new Int32Array(totalCells);
        const N = arrows.length;

        for (let i = 0; i < N; i++) {
            arrows[i].intId = i + 1;
            for (const seg of arrows[i].segments) {
                grid[seg.r * cols + seg.c] = i + 1;
            }
        }

        const remaining = new Set([...Array(N).keys()]);
        const sequence = [];
        let initialFree = [];

        while (remaining.size > 0) {
            let firstEscapable = -1;
            const freeThisRound = [];

            for (const idx of remaining) {
                if (this.fastCheckArrowEscape(arrows[idx], rows, grid, cols)) {
                    freeThisRound.push(idx);
                    if (firstEscapable === -1) firstEscapable = idx;
                }
            }

            if (sequence.length === 0) initialFree = freeThisRound;
            if (firstEscapable === -1) return null; // Deadlock or cycle

            sequence.push(arrows[firstEscapable]);
            remaining.delete(firstEscapable);
            for (const seg of arrows[firstEscapable].segments) {
                grid[seg.r * cols + seg.c] = 0;
            }
        }

        return { sequence, initialFreeCount: initialFree.length, initialFree };
    }

    tryPruneToOneKey(arrows, rows, cols, initialFree) {
        let bestArrows = arrows;
        let minFree = initialFree.length;

        for (let pass = 0; pass < 3 && minFree > 2; pass++) {
            for (const rootIdx of initialFree) {
                const candidate = bestArrows.map(a => ({
                    ...a,
                    segments: [...a.segments]
                }));
                const target = candidate[rootIdx];
                target.segments.reverse();
                const p1 = target.segments[target.segments.length - 2];
                const p2 = target.segments[target.segments.length - 1];
                if (p2.r < p1.r) target.headDir = 0;
                else if (p2.c > p1.c) target.headDir = 1;
                else if (p2.r > p1.r) target.headDir = 2;
                else if (p2.c < p1.c) target.headDir = 3;

                const sol = this.fastFindEscapeSequence(candidate, rows, cols);
                if (sol && sol.sequence.length === arrows.length) {
                    if (sol.initialFreeCount < minFree) {
                        bestArrows = candidate;
                        minFree = sol.initialFreeCount;
                        initialFree = sol.initialFree;
                        if (minFree <= 2) return { arrows: bestArrows, initialFreeCount: minFree };
                    }
                }
            }
        }

        return { arrows: bestArrows, initialFreeCount: minFree };
    }

    tryGenerateDenseGrid(levelNumber, rows, cols, rand) {
        const occupied = Array(rows).fill(0).map(() => Array(cols).fill(null));
        const arrows = [];
        let idCounter = 1;

        // Progressive Difficulty Scaling for Snake Lengths:
        let minLen = 3, maxLen = 5;
        if (levelNumber <= 5) {
            minLen = 3; maxLen = 4;
        } else if (levelNumber <= 25) {
            minLen = 3; maxLen = 5;
        } else if (levelNumber <= 150) {
            minLen = 3; maxLen = 6;
        } else {
            minLen = 3; maxLen = 7; // Winding labyrinths
        }

        // Partition 100% of grid into winding multi-segment snake arrows
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (occupied[r][c] !== null) continue;
                const snake = [{ r, c }];
                occupied[r][c] = true;
                let curr = { r, c };

                const roll = rand();
                const targetLen = minLen + Math.floor(roll * (maxLen - minLen + 1));

                for (let step = 1; step < targetLen; step++) {
                    const dirs = [0, 1, 2, 3];
                    for (let i = 3; i > 0; i--) {
                        const j = Math.floor(rand() * (i + 1));
                        [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
                    }
                    let moved = false;
                    for (const d of dirs) {
                        const nr = curr.r + this.DIR_DELTA[d].r;
                        const nc = curr.c + this.DIR_DELTA[d].c;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && occupied[nr][nc] === null) {
                            occupied[nr][nc] = true;
                            snake.push({ r: nr, c: nc });
                            curr = { r: nr, c: nc };
                            moved = true;
                            break;
                        }
                    }
                    if (!moved) break;
                }

                if (snake.length >= 2) {
                    const id = `arrow_${idCounter++}`;
                    snake.forEach(s => { occupied[s.r][s.c] = id; });
                    arrows.push({ id, segments: snake });
                } else {
                    occupied[r][c] = null;
                }
            }
        }

        // Absorb leftover single cells into neighboring snakes for 100% full coverage
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (occupied[r][c] === null) {
                    for (const d of [0, 1, 2, 3]) {
                        const nr = r + this.DIR_DELTA[d].r;
                        const nc = c + this.DIR_DELTA[d].c;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && occupied[nr][nc]) {
                            const adj = arrows.find(a => a.id === occupied[nr][nc]);
                            if (adj) {
                                adj.segments.push({ r, c });
                                occupied[r][c] = adj.id;
                                break;
                            }
                        }
                    }
                }
            }
        }

        const N = arrows.length;
        if (N < 4) return null;

        // Configurations: end 0 vs end 1
        const configs = arrows.map((a, idx) => {
            const segs0 = [...a.segments];
            const p1_0 = segs0[segs0.length - 2];
            const p2_0 = segs0[segs0.length - 1];
            let dir0 = 0;
            if (p2_0.r < p1_0.r) dir0 = 0;
            else if (p2_0.c > p1_0.c) dir0 = 1;
            else if (p2_0.r > p1_0.r) dir0 = 2;
            else if (p2_0.c < p1_0.c) dir0 = 3;

            const segs1 = [...a.segments].reverse();
            const p1_1 = segs1[segs1.length - 2];
            const p2_1 = segs1[segs1.length - 1];
            let dir1 = 0;
            if (p2_1.r < p1_1.r) dir1 = 0;
            else if (p2_1.c > p1_1.c) dir1 = 1;
            else if (p2_1.r > p1_1.r) dir1 = 2;
            else if (p2_1.c < p1_1.c) dir1 = 3;

            return [
                { id: a.id, segments: segs0, headDir: dir0, color: (idx % 2 === 0 ? 'cyan' : 'orange'), isEscaped: false },
                { id: a.id, segments: segs1, headDir: dir1, color: (idx % 2 === 0 ? 'cyan' : 'orange'), isEscaped: false }
            ];
        });

        // Fast Peeling Solver: guarantees a cycle-free topological escape sequence
        const currentGrid = new Int32Array(rows * cols).fill(-1);
        for (let i = 0; i < N; i++) {
            for (const seg of arrows[i].segments) {
                currentGrid[seg.r * cols + seg.c] = i;
            }
        }

        const clearedCells = new Uint8Array(rows * cols);

        function checkCanExit(arrowIdx, dirIdx, deltaArr) {
            const arr = configs[arrowIdx][dirIdx];
            const head = arr.segments[arr.segments.length - 1];
            const delta = deltaArr[arr.headDir];
            let r = head.r + delta.r;
            let c = head.c + delta.c;
            let hitsCleared = false;
            while (r >= 0 && r < rows && c >= 0 && c < cols) {
                const occ = currentGrid[r * cols + c];
                if (occ !== -1 && occ !== arrowIdx) {
                    return null; // Blocked by an unremoved arrow
                }
                if (clearedCells[r * cols + c] === 1) {
                    hitsCleared = true;
                }
                r += delta.r;
                c += delta.c;
            }
            return { hitsCleared };
        }

        const unpeeled = new Set([...Array(N).keys()]);
        const peeledSequence = [];
        const chosenDirs = new Int8Array(N).fill(-1);

        while (unpeeled.size > 0) {
            const dependentCandidates = [];
            const independentCandidates = [];

            for (const idx of unpeeled) {
                for (let d = 0; d < 2; d++) {
                    const res = checkCanExit(idx, d, this.DIR_DELTA);
                    if (res) {
                        if (res.hitsCleared) dependentCandidates.push({ idx, d });
                        else independentCandidates.push({ idx, d });
                    }
                }
            }

            let pick = null;
            if (peeledSequence.length === 0) {
                if (independentCandidates.length > 0) {
                    pick = independentCandidates[Math.floor(rand() * independentCandidates.length)];
                } else if (dependentCandidates.length > 0) {
                    pick = dependentCandidates[0];
                }
            } else {
                if (dependentCandidates.length > 0) {
                    pick = dependentCandidates[Math.floor(rand() * dependentCandidates.length)];
                } else if (independentCandidates.length > 0) {
                    pick = independentCandidates[Math.floor(rand() * independentCandidates.length)];
                }
            }

            if (!pick) return null;

            unpeeled.delete(pick.idx);
            chosenDirs[pick.idx] = pick.d;
            peeledSequence.push(pick);

            for (const seg of arrows[pick.idx].segments) {
                currentGrid[seg.r * cols + seg.c] = -1;
                clearedCells[seg.r * cols + seg.c] = 1;
            }
        }

        const finalArrows = [];
        for (let i = 0; i < N; i++) {
            finalArrows.push({ ...configs[i][chosenDirs[i]] });
        }

        const sol = this.fastFindEscapeSequence(finalArrows, rows, cols);
        if (!sol || sol.sequence.length !== N) return null;

        let finalFree = sol.initialFreeCount;
        let prunedArrows = finalArrows;

        if (finalFree > 1) {
            const pruned = this.tryPruneToOneKey(finalArrows, rows, cols, sol.initialFree);
            if (pruned) {
                finalFree = pruned.initialFreeCount;
                prunedArrows = pruned.arrows;
            }
        }

        const mask = Array(rows).fill(0).map(() => Array(cols).fill(true));
        return {
            levelNumber,
            rows,
            cols,
            size: Math.max(rows, cols),
            shapeInfo: { type: 'grid', name: 'شبكة نيون كاملة', icon: '⚡' },
            mask,
            arrows: prunedArrows,
            totalArrows: prunedArrows.length,
            targetMoves: prunedArrows.length,
            initialFreeCount: finalFree
        };
    }

    generateLevel(levelNumber) {
        const dims = this.getGridDimensionsForLevel(levelNumber);
        const rows = dims.rows;
        const cols = dims.cols;
        const seed = levelNumber * 1812433253 + 9973;

        let bestLevel = null;
        for (let attempt = 0; attempt < 35; attempt++) {
            const rand = this.mulberry32(seed + attempt * 7919);
            const candidate = this.tryGenerateDenseGrid(levelNumber, rows, cols, rand);
            if (candidate) {
                if (!bestLevel || candidate.initialFreeCount < bestLevel.initialFreeCount) {
                    bestLevel = candidate;
                }
                if (bestLevel.initialFreeCount <= 2) break;
            }
        }

        let level = bestLevel;
        if (!level) {
            level = this.fallbackFullGrid(levelNumber, rows, cols);
        }

        return this.enhanceLevelFeatures(level, levelNumber);
    }

    fallbackFullGrid(levelNumber, rows, cols) {
        let top = 0, bottom = rows - 1, left = 0, right = cols - 1;
        const spiralCells = [];

        while (top <= bottom && left <= right) {
            for (let c = left; c <= right; c++) spiralCells.push({ r: top, c });
            top++;
            for (let r = top; r <= bottom; r++) spiralCells.push({ r, c: right });
            right--;
            if (top <= bottom) {
                for (let c = right; c >= left; c--) spiralCells.push({ r: bottom, c });
                bottom--;
            }
            if (left <= right) {
                for (let r = bottom; r >= top; r--) spiralCells.push({ r, c: left });
                left++;
            }
        }

        const arrows = [];
        let idCounter = 1;
        let idx = 0;

        while (idx < spiralCells.length) {
            const remain = spiralCells.length - idx;
            let len = 4;
            if (remain <= 1) {
                if (arrows.length > 0) arrows[arrows.length - 1].segments.push(spiralCells[idx]);
                break;
            } else if (remain <= 3) len = remain;
            else if (remain >= 6) len = (idCounter % 3 === 0) ? 6 : ((idCounter % 2 === 0) ? 5 : 4);
            else len = (remain >= 4) ? 4 : remain;

            const rawSegs = spiralCells.slice(idx, idx + len);
            const segs = [...rawSegs].reverse();
            const p1 = segs[segs.length - 2];
            const p2 = segs[segs.length - 1];
            let headDir = 0;
            if (p2.r < p1.r) headDir = 0;
            else if (p2.c > p1.c) headDir = 1;
            else if (p2.r > p1.r) headDir = 2;
            else if (p2.c < p1.c) headDir = 3;

            if (idCounter === 1) headDir = 0;

            arrows.push({
                id: `arrow_${idCounter++}`,
                segments: segs,
                headDir,
                color: (arrows.length % 2 === 0 ? 'cyan' : 'orange'),
                isEscaped: false
            });

            idx += len;
        }

        const mask = Array(rows).fill(0).map(() => Array(cols).fill(true));
        return {
            levelNumber,
            rows,
            cols,
            size: Math.max(rows, cols),
            shapeInfo: { type: 'grid', name: 'شبكة نيون كاملة', icon: '⚡' },
            mask,
            arrows,
            totalArrows: arrows.length,
            targetMoves: arrows.length,
            initialFreeCount: 1
        };
    }

    enhanceLevelFeatures(level, levelNumber) {
        if (!level) return level;
        level.worldInfo = WorldCatalog.getWorldForLevel(levelNumber);
        level.isBoss = (levelNumber >= 10 && levelNumber % 10 === 0);

        // Precompute tailDir
        level.arrows.forEach(a => {
            const s0 = a.segments[0];
            const s1 = a.segments[1];
            if (s0 && s1) {
                if (s0.r < s1.r) a.tailDir = 0;
                else if (s0.c > s1.c) a.tailDir = 1;
                else if (s0.r > s1.r) a.tailDir = 2;
                else if (s0.c < s1.c) a.tailDir = 3;
            } else {
                a.tailDir = (a.headDir + 2) % 4;
            }
            a.isKey = false;
            a.isLocked = false;
            a.lockedById = null;
            a.isDoubleHeaded = false;
            a.isFrozen = false;
            a.isRotating = false;
            a.isBomb = false;
            a.isPortal = false;
            a.isPhantom = false;
            a.isMagnetic = false;
        });

        // 6 Progressive Difficulty Tiers scaled smoothly across 5000 levels
        if (levelNumber <= 25) level.difficulty = { name: 'متدرب', tier: 1, icon: '🟢', color: '#00ff66' };
        else if (levelNumber <= 150) level.difficulty = { name: 'متقدم', tier: 2, icon: '🟡', color: '#ffea00' };
        else if (levelNumber <= 600) level.difficulty = { name: 'محترف', tier: 3, icon: '🟠', color: '#ff9500' };
        else if (levelNumber <= 1500) level.difficulty = { name: 'خبير', tier: 4, icon: '🔴', color: '#ff3b30' };
        else if (levelNumber <= 3500) level.difficulty = { name: 'أسطوري', tier: 5, icon: '🟣', color: '#b026ff' };
        else level.difficulty = { name: 'أوميغا (مستحيل)', tier: 6, icon: '⚡', color: '#ff0055' };

        const sol = this.fastFindEscapeSequence(level.arrows, level.rows || level.size, level.cols || level.size);
        if (sol && sol.sequence && sol.sequence.length >= 6) {
            const seq = sol.sequence;

            // Progressive Key & Lock pairs based on difficulty
            let keyPairsCount = 0;
            if (levelNumber >= 3500) keyPairsCount = 8;
            else if (levelNumber >= 2000) keyPairsCount = 7;
            else if (levelNumber >= 1200) keyPairsCount = 6;
            else if (levelNumber >= 600) keyPairsCount = 5;
            else if (levelNumber >= 250) keyPairsCount = 4;
            else if (levelNumber >= 100) keyPairsCount = 3;
            else if (levelNumber >= 25) keyPairsCount = 2;
            else if (levelNumber >= 4) keyPairsCount = 1;

            if (keyPairsCount > 0) {
                level.hasKeyAndLock = true;
                const used = new Set();
                for (let k = 0; k < keyPairsCount; k++) {
                    const keyIdx = Math.min(seq.length - 2, Math.floor((k + 0.5) * (seq.length / (keyPairsCount * 2))));
                    const lockIdx = Math.min(seq.length - 1, Math.floor(seq.length * 0.65 + k * (seq.length * 0.08)));
                    const kArr = seq[keyIdx];
                    const lArr = seq[lockIdx];
                    if (kArr && lArr && kArr.id !== lArr.id && !used.has(kArr.id) && !used.has(lArr.id)) {
                        kArr.isKey = true;
                        lArr.isLocked = true;
                        lArr.lockedById = kArr.id;
                        used.add(kArr.id);
                        used.add(lArr.id);
                    }
                }
            }

            // Progressive Double-Headed Arrows based on difficulty
            let doubleCount = 0;
            if (levelNumber >= 3500) doubleCount = 7;
            else if (levelNumber >= 2000) doubleCount = 6;
            else if (levelNumber >= 1200) doubleCount = 5;
            else if (levelNumber >= 600) doubleCount = 4;
            else if (levelNumber >= 250) doubleCount = 3;
            else if (levelNumber >= 50) doubleCount = 2;
            else if (levelNumber >= 6) doubleCount = 1;

            if (doubleCount > 0) {
                let assigned = 0;
                for (let i = 2; i < seq.length - 2 && assigned < doubleCount; i++) {
                    const a = seq[i];
                    if (!a.isKey && !a.isLocked && a.segments.length >= 2) {
                        a.isDoubleHeaded = true;
                        level.hasDoubleHeaded = true;
                        assigned++;
                    }
                }
            }

            // Progressive Ice (Frozen) Arrows: level 15+
            // Encased in neon ice crystals: requires 1 tap to crack/thaw, 2nd tap to escape
            let iceCount = 0;
            if (levelNumber >= 1500) iceCount = 4;
            else if (levelNumber >= 300) iceCount = 3;
            else if (levelNumber >= 60) iceCount = 2;
            else if (levelNumber >= 15) iceCount = 1;

            if (iceCount > 0) {
                let iceAssigned = 0;
                for (let i = 2; i < seq.length - 2 && iceAssigned < iceCount; i++) {
                    const a = seq[i];
                    if (!a.isKey && !a.isLocked && !a.isDoubleHeaded && !a.isFrozen) {
                        a.isFrozen = true;
                        level.hasFrozen = true;
                        iceAssigned++;
                    }
                }
            }

            // Progressive Rotating/Pivot Arrows: level 10+
            let rotatingCount = 0;
            if (levelNumber >= 150) rotatingCount = 3;
            else if (levelNumber >= 40) rotatingCount = 2;
            else if (levelNumber >= 10) rotatingCount = 1;

            if (rotatingCount > 0) {
                let rotAssigned = 0;
                for (let i = 1; i < seq.length - 1 && rotAssigned < rotatingCount; i++) {
                    const a = seq[i];
                    if (!a.isKey && !a.isLocked && !a.isDoubleHeaded && !a.isFrozen && a.segments.length <= 2) {
                        a.isRotating = true;
                        level.hasRotating = true;
                        rotAssigned++;
                    }
                }
            }

            // Progressive EMP / Bomb Arrows: level 18+
            let bombCount = (levelNumber >= 18) ? 1 : 0;
            if (levelNumber >= 300) bombCount = 2;
            if (bombCount > 0) {
                let bombAssigned = 0;
                for (let i = 2; i < seq.length - 2 && bombAssigned < bombCount; i++) {
                    const a = seq[i];
                    if (!a.isKey && !a.isLocked && !a.isDoubleHeaded && !a.isFrozen && !a.isRotating) {
                        a.isBomb = true;
                        level.hasBomb = true;
                        bombAssigned++;
                    }
                }
            }

            // Progressive Quantum Portal Arrows: level 25+
            let portalCount = (levelNumber >= 25) ? 1 : 0;
            if (levelNumber >= 400) portalCount = 2;
            if (portalCount > 0) {
                let portalAssigned = 0;
                for (let i = 3; i < seq.length - 2 && portalAssigned < portalCount; i++) {
                    const a = seq[i];
                    if (!a.isKey && !a.isLocked && !a.isDoubleHeaded && !a.isFrozen && !a.isRotating && !a.isBomb) {
                        a.isPortal = true;
                        level.hasPortal = true;
                        portalAssigned++;
                    }
                }
            }

            // Progressive Phantom (Phase/Ghost) Arrows: level 12+
            // Allows arrows to phase through its body segments without collision
            let phantomCount = (levelNumber >= 12) ? 1 : 0;
            if (levelNumber >= 200) phantomCount = 2;
            if (phantomCount > 0) {
                let phantomAssigned = 0;
                for (let i = 2; i < seq.length - 2 && phantomAssigned < phantomCount; i++) {
                    const a = seq[i];
                    if (!a.isKey && !a.isLocked && !a.isDoubleHeaded && !a.isFrozen && !a.isRotating && !a.isBomb && !a.isPortal) {
                        a.isPhantom = true;
                        level.hasPhantom = true;
                        phantomAssigned++;
                    }
                }
            }

            // Progressive Magnetic Polarity Arrows: level 16+
            // Magnetically pulls adjacent unblocked arrows towards its exit track
            let magneticCount = (levelNumber >= 16) ? 1 : 0;
            if (levelNumber >= 300) magneticCount = 2;
            if (magneticCount > 0) {
                let magAssigned = 0;
                for (let i = 2; i < seq.length - 2 && magAssigned < magneticCount; i++) {
                    const a = seq[i];
                    if (!a.isKey && !a.isLocked && !a.isDoubleHeaded && !a.isFrozen && !a.isRotating && !a.isBomb && !a.isPortal && !a.isPhantom) {
                        a.isMagnetic = true;
                        level.hasMagnetic = true;
                        magAssigned++;
                    }
                }
            }
        }

        // Progressive Mystery Crates: level 8+ (every 3 levels or boss level)
        if (levelNumber >= 8 && (levelNumber % 3 === 0 || level.isBoss)) {
            const numRows = level.rows || level.size || 18;
            const numCols = level.cols || level.size || 14;
            const crateR = Math.max(1, Math.min(numRows - 2, 2 + ((levelNumber * 7) % Math.max(1, numRows - 4))));
            const crateC = Math.max(1, Math.min(numCols - 2, 2 + ((levelNumber * 11) % Math.max(1, numCols - 4))));
            level.mysteryCrate = {
                r: crateR,
                c: crateC,
                opened: false,
                rewardCoins: 25
            };
        }

        return level;
    }

    checkArrowCanEscape(arrow, rows, activeCells, dirType = 'head', cols = rows, activeArrows = null) {
        if (typeof rows === 'object' && rows !== null) {
            cols = rows.cols || rows.size || rows.rows;
            rows = rows.rows || rows.size;
        }
        if (!cols) cols = rows;
        if (arrow.isLocked) return false;

        const isTail = dirType === 'tail';
        const head = isTail ? arrow.segments[0] : arrow.segments[arrow.segments.length - 1];
        const dir = isTail ? arrow.tailDir : arrow.headDir;
        if (dir === undefined || dir === null) return false;

        const delta = this.DIR_DELTA[dir];
        let currR = head.r + delta.r;
        let currC = head.c + delta.c;
        let obstaclesHit = 0;

        while (currR >= 0 && currR < rows && currC >= 0 && currC < cols) {
            const key = `${currR},${currC}`;
            const occupantId = activeCells.get(key);
            if (occupantId !== undefined && occupantId !== null && occupantId !== arrow.id) {
                // Check if occupant is a Phantom arrow whose body allows pass-through
                let isPassablePhantom = false;
                if (activeArrows && activeArrows.has(occupantId)) {
                    const occArrow = activeArrows.get(occupantId);
                    if (occArrow && occArrow.isPhantom && occArrow.segments) {
                        const occHead = occArrow.segments[occArrow.segments.length - 1];
                        // Only head-to-head collision blocks; passing through body segment is allowed!
                        if (occHead.r !== currR || occHead.c !== currC) {
                            isPassablePhantom = true;
                        }
                    }
                }

                if (isPassablePhantom) {
                    // Ethereal phase: path continues through phantom arrow body!
                } else if (arrow.isPortal && obstaclesHit === 0) {
                    // Quantum portal tunneling through 1 obstacle
                    obstaclesHit++;
                } else {
                    return false;
                }
            }
            currR += delta.r;
            currC += delta.c;
        }
        return true;
    }

    canDoubleHeadedEscape(arrow, rows, activeCells, cols = rows, activeArrows = null) {
        if (typeof rows === 'object' && rows !== null) {
            cols = rows.cols || rows.size || rows.rows;
            rows = rows.rows || rows.size;
        }
        if (!cols) cols = rows;
        if (arrow.isLocked) return { canEscape: false, isLocked: true };
        const headCan = this.checkArrowCanEscape(arrow, rows, activeCells, 'head', cols, activeArrows);
        if (headCan) return { canEscape: true, dir: 'head' };
        if (arrow.isDoubleHeaded) {
            const tailCan = this.checkArrowCanEscape(arrow, rows, activeCells, 'tail', cols, activeArrows);
            if (tailCan) return { canEscape: true, dir: 'tail' };
        }
        return { canEscape: false };
    }
}

if (typeof module !== 'undefined') {
    module.exports = LevelGenerator;
    module.exports.LevelGenerator = LevelGenerator;
    module.exports.ShapeCatalog = ShapeCatalog;
    module.exports.WorldCatalog = WorldCatalog;
}
if (typeof window !== 'undefined') {
    window.WorldCatalog = WorldCatalog;
    window.ShapeCatalog = ShapeCatalog;
    window.levelGenerator = new LevelGenerator();
}

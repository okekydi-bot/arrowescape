// Persistent Local Storage Management for Arrow Escape
function getSystemLanguage() {
    try {
        let lang = '';
        if (typeof window !== 'undefined') {
            if (window.AndroidNative && typeof window.AndroidNative.getDeviceLanguage === 'function') {
                lang = window.AndroidNative.getDeviceLanguage();
            } else if (navigator.languages && navigator.languages.length) {
                lang = navigator.languages[0];
            } else if (navigator.language) {
                lang = navigator.language;
            }
        }
        if (lang) {
            const clean = lang.toLowerCase();
            return clean.startsWith('ar') ? 'ar' : 'en';
        }
    } catch (e) {
        console.warn('Language detection error:', e);
    }
    return 'ar';
}

class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'arrow_escape_save_v1';
        this.BACKUP_KEY = 'arrow_escape_save_backup';
        this.data = this.load();
        this.save();
        this.setupAutoSave();
    }

    setupAutoSave() {
        if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
            window.addEventListener('beforeunload', () => this.save());
        }
        if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) this.save();
            });
        }
    }

    getDefaults() {
        return {
            currentLevel: 1,
            maxUnlockedLevel: 1,
            levelRecords: {}, // { [level]: { stars: 3, bestMoves: 12, bestScore: 9800, bestTime: 45 } }
            coins: 0,
            hints: 0,
            lasers: 0,
            xrays: 0,
            selectedTheme: 'cyber',
            unlockedThemes: ['cyber'],
            activeArrowHead: 'classic',
            unlockedArrowHeads: ['classic'],
            activeArrowTrail: 'neon',
            unlockedArrowTrails: ['neon'],
            activeArrowBody: 'tube',
            unlockedArrowBodies: ['tube'],
            lastDailySpinDate: null,
            unlockedAchievements: {},
            claimedAchievements: {},
            dailyStreak: 0,
            lastDailyClaimDate: null,
            challengeStage: 1,
            challengeBestTime: null,
            challengeBestStage: 1,
            v13Migrated: true,
            stats: {
                totalPuzzlesSolved: 0,
                totalStars: 0,
                totalRotations: 0,
                totalArrowsReleased: 0,
                mistakesCount: 0,
                bestCombo: 0
            },
            playerName: 'لاعب السهم',
            nameChangeCount: 0,
            settings: {
                sound: true,
                music: false,
                vibration: true,
                lang: getSystemLanguage(),
                hasManualLangChoice: false,
                simulatedDeviceFrame: false // Borderless clean view
            }
        };
    }

    load() {
        try {
            let raw = localStorage.getItem(this.STORAGE_KEY);
            if (!raw) {
                raw = localStorage.getItem(this.BACKUP_KEY);
            }
            if (!raw) return this.getDefaults();
            const parsed = JSON.parse(raw);
            const data = Object.assign(this.getDefaults(), parsed);

            // Migration v13 per user request:
            // 1 Hint and 1 Laser refreshed for each level
            if (!data.v13Migrated) {
                data.v13Migrated = true;
                data.hints = 1;
                data.lasers = 1;
                if (!data.unlockedThemes || data.unlockedThemes.length === 0) {
                    data.unlockedThemes = ['cyber'];
                }
                data.coins = data.coins !== undefined ? data.coins : 50;
            }

            if (!data.unlockedThemes) data.unlockedThemes = ['cyber'];
            data.unlockedThemes = data.unlockedThemes.filter(t => t !== 'white');
            if (data.selectedTheme === 'white' || !data.selectedTheme) {
                data.selectedTheme = 'cyber';
            }

            // Ensure customization collections exist
            data.activeArrowHead = data.activeArrowHead || 'classic';
            data.unlockedArrowHeads = data.unlockedArrowHeads || ['classic'];
            data.activeArrowTrail = data.activeArrowTrail || 'neon';
            data.unlockedArrowTrails = data.unlockedArrowTrails || ['neon'];
            data.activeArrowBody = data.activeArrowBody || 'tube';
            // Migration v14 & v15 per user request:
            // Zero out hints, lasers, xrays for all players
            if (!data.v15ZeroBoostersOnStart) {
                data.v15ZeroBoostersOnStart = true;
                data.hints = 0;
                data.lasers = 0;
                data.xrays = 0;
            }

            if (data.hints === undefined) data.hints = 0;
            if (data.lasers === undefined) data.lasers = 0;
            if (data.xrays === undefined) data.xrays = 0;
            if (!data.stats) {
                data.stats = { totalPuzzlesSolved: 0, totalStars: 0, totalRotations: 0, totalArrowsReleased: 0, mistakesCount: 0, bestCombo: 0 };
            }
            if (data.stats.mistakesCount === undefined) data.stats.mistakesCount = 0;
            if (data.stats.bestCombo === undefined) data.stats.bestCombo = 0;

            if (!data.settings) {
                data.settings = this.getDefaults().settings;
            }
            // Auto-detect device language if user hasn't explicitly locked in a manual choice
            if (!data.settings.hasManualLangChoice) {
                data.settings.lang = getSystemLanguage();
            }

            return data;
        } catch (e) {
            console.warn('Failed to load save from primary localStorage, checking backup...', e);
            try {
                const backupRaw = localStorage.getItem(this.BACKUP_KEY);
                if (backupRaw) {
                    return Object.assign(this.getDefaults(), JSON.parse(backupRaw));
                }
            } catch (err2) {
                console.error('Backup save also unreadable', err2);
            }
            return this.getDefaults();
        }
    }

    save() {
        try {
            const serialized = JSON.stringify(this.data);
            localStorage.setItem(this.STORAGE_KEY, serialized);
            localStorage.setItem(this.BACKUP_KEY, serialized);
        } catch (e) {
            console.error('Failed to save to localStorage', e);
        }
    }

    setCurrentLevel(level) {
        if (!level || isNaN(level)) return;
        this.data.currentLevel = Math.min(5000, Math.max(1, parseInt(level)));
        if (!this.data.testMode && this.data.currentLevel > (this.data.maxUnlockedLevel || 1)) {
            this.data.maxUnlockedLevel = this.data.currentLevel;
        }
        this.save();
    }

    unlockAllLevels() {
        if (!this.data.prevMaxUnlockedLevel) {
            this.data.prevMaxUnlockedLevel = this.data.maxUnlockedLevel || 1;
        }
        this.data.maxUnlockedLevel = 5000;
        this.data.testMode = true;
        this.save();
    }

    restoreNormalProgression() {
        this.data.maxUnlockedLevel = this.data.prevMaxUnlockedLevel || 1;
        this.data.testMode = false;
        this.save();
    }

    isTestModeActive() {
        return !!this.data.testMode || (this.data.maxUnlockedLevel >= 5000);
    }

    renewLevelResources() {
        // Boosters start at 0 per level per user requirement
        this.resetBoostersToZero();
    }

    resetBoostersToZero() {
        this.data.hints = 0;
        this.data.lasers = 0;
        this.data.xrays = 0;
        this.save();
    }

    getLevelRecord(level) {
        return this.data.levelRecords[level] || null;
    }

    saveLevelRecord(level, { stars, moves, score, time }) {
        if (!this.data.levelRecords[level]) {
            this.data.levelRecords[level] = { stars, bestMoves: moves, bestScore: score, bestTime: time };
        } else {
            const rec = this.data.levelRecords[level];
            rec.stars = Math.max(rec.stars || 0, stars);
            rec.bestMoves = Math.min(rec.bestMoves || 9999, moves);
            rec.bestScore = Math.max(rec.bestScore || 0, score);
            rec.bestTime = Math.min(rec.bestTime || 9999, time);
        }

        // Advance current and max unlocked level up to 5000
        this.data.currentLevel = Math.min(5000, level + 1);
        if (level >= this.data.maxUnlockedLevel) {
            this.data.maxUnlockedLevel = Math.min(5000, level + 1);
        }

        // Recalculate total stars
        let totalStars = 0;
        for (const lvl in this.data.levelRecords) {
            totalStars += this.data.levelRecords[lvl].stars || 0;
        }
        this.data.stats.totalStars = totalStars;
        this.data.stats.totalPuzzlesSolved++;
        this.save();
    }

    getTotalStars() {
        let stars = 0;
        if (this.data.levelRecords) {
            for (const lvl in this.data.levelRecords) {
                stars += (this.data.levelRecords[lvl]?.stars || 0);
            }
        }
        const recorded = this.data.stats?.totalStars || 0;
        return Math.max(stars, recorded);
    }

    incrementArrowsReleased() {
        if (!this.data.stats) this.data.stats = {};
        this.data.stats.totalArrowsReleased = (this.data.stats.totalArrowsReleased || 0) + 1;
        if (this.data.stats.totalArrowsReleased % 5 === 0) {
            this.save();
        }
    }

    addCoins(amount) {
        this.data.coins = Math.max(0, (this.data.coins || 0) + amount);
        this.save();
        return this.data.coins;
    }

    calculateWinCoins(isBoss = false) {
        const solved = (this.data.stats && this.data.stats.totalPuzzlesSolved) ? this.data.stats.totalPuzzlesSolved : 0;
        // Formula per user prompt: Every win grants 5 coins, and every 100 wins the coins double!
        // 0-99 wins: multiplier x1 -> 5 coins
        // 100-199 wins: multiplier x2 -> 10 coins
        // 200-299 wins: multiplier x4 -> 20 coins
        // 300-399 wins: multiplier x8 -> 40 coins
        // Plus 2x multiplier for Boss levels (every 10 levels)!
        let multiplier = Math.pow(2, Math.floor(solved / 100));
        let bossMult = isBoss ? 2 : 1;
        const totalMult = multiplier * bossMult;
        const coins = 5 * totalMult;
        return {
            base: 5,
            multiplier: totalMult,
            baseMultiplier: multiplier,
            isBoss,
            coins,
            solved
        };
    }

    useHint() {
        if (this.data.hints > 0) {
            this.data.hints--;
            this.save();
            return true;
        }
        return false;
    }

    useLaser() {
        this.data.lasers = this.data.lasers !== undefined ? this.data.lasers : 0;
        if (this.data.lasers > 0) {
            this.data.lasers--;
            this.save();
            return true;
        }
        return false;
    }

    addLasers(amount) {
        this.data.lasers = (this.data.lasers || 0) + amount;
        this.save();
        return this.data.lasers;
    }

    addHints(amount) {
        this.data.hints = (this.data.hints || 0) + amount;
        this.save();
        return this.data.hints;
    }

    useXRay() {
        this.data.xrays = this.data.xrays !== undefined ? this.data.xrays : 0;
        if (this.data.xrays > 0) {
            this.data.xrays--;
            this.save();
            return true;
        }
        return false;
    }

    addXRays(amount) {
        this.data.xrays = (this.data.xrays || 0) + amount;
        this.save();
        return this.data.xrays;
    }

    addXrays(amount) {
        return this.addXRays(amount);
    }

    unlockTheme(themeId) {
        if (!this.data.unlockedThemes.includes(themeId)) {
            this.data.unlockedThemes.push(themeId);
            this.save();
        }
    }

    setTheme(themeId) {
        this.data.selectedTheme = themeId;
        this.save();
    }

    unlockArrowHead(headId) {
        if (!this.data.unlockedArrowHeads) this.data.unlockedArrowHeads = ['classic'];
        if (!this.data.unlockedArrowHeads.includes(headId)) {
            this.data.unlockedArrowHeads.push(headId);
            this.save();
        }
    }

    setArrowHead(headId) {
        this.data.activeArrowHead = headId;
        this.save();
    }

    unlockArrowTrail(trailId) {
        if (!this.data.unlockedArrowTrails) this.data.unlockedArrowTrails = ['neon'];
        if (!this.data.unlockedArrowTrails.includes(trailId)) {
            this.data.unlockedArrowTrails.push(trailId);
            this.save();
        }
    }

    setArrowTrail(trailId) {
        this.data.activeArrowTrail = trailId;
        this.save();
    }

    unlockArrowBody(bodyId) {
        if (!this.data.unlockedArrowBodies) this.data.unlockedArrowBodies = ['tube'];
        if (!this.data.unlockedArrowBodies.includes(bodyId)) {
            this.data.unlockedArrowBodies.push(bodyId);
            this.save();
        }
    }

    setArrowBody(bodyId) {
        this.data.activeArrowBody = bodyId;
        this.save();
    }

    canSpinDailyWheel() {
        if (!this.data.lastDailySpinDate) return true;
        const todayStr = new Date().toISOString().slice(0, 10);
        return this.data.lastDailySpinDate !== todayStr;
    }

    recordDailySpin() {
        this.data.lastDailySpinDate = new Date().toISOString().slice(0, 10);
        this.save();
    }

    canClaimDailyReward() {
        if (!this.data.lastDailyClaimDate) return true;
        const todayStr = new Date().toISOString().slice(0, 10);
        return this.data.lastDailyClaimDate !== todayStr;
    }

    recordDailyClaim() {
        this.data.lastDailyClaimDate = new Date().toISOString().slice(0, 10);
        this.save();
    }

    unlockAchievement(id) {
        if (!this.data.unlockedAchievements) this.data.unlockedAchievements = {};
        if (!this.data.unlockedAchievements[id]) {
            this.data.unlockedAchievements[id] = Date.now();
            this.save();
            return true;
        }
        return false;
    }

    isAchievementUnlocked(id) {
        return !!(this.data.unlockedAchievements && this.data.unlockedAchievements[id]);
    }

    isAchievementClaimed(id) {
        return !!(this.data.claimedAchievements && this.data.claimedAchievements[id]);
    }

    claimAchievementReward(id, rewardCoins = 25) {
        if (!this.data.claimedAchievements) this.data.claimedAchievements = {};
        if (!this.isAchievementClaimed(id)) {
            this.data.claimedAchievements[id] = Date.now();
            this.addCoins(rewardCoins);
            this.save();
            return true;
        }
        return false;
    }

    // Total number of challenge stages
    getChallengeMaxStage() {
        return 50;
    }

    // Frontier stage (next unbeaten). Can be maxStage + 1 when everything is cleared.
    getChallengeStage() {
        return Math.max(1, Math.min(this.getChallengeMaxStage() + 1, this.data.challengeStage || 1));
    }

    // Stage that should be played when pressing "Start" (capped to last stage)
    getChallengePlayableStage() {
        return Math.min(this.getChallengeMaxStage(), this.getChallengeStage());
    }

    getChallengeLevelForStage(stage) {
        return Math.min(100, Math.max(3, stage * 3));
    }

    getChallengeTimeLimitForStage(stage) {
        return Math.max(30, 90 - Math.floor(this.getChallengeLevelForStage(stage) * 1.5));
    }

    getChallengeRewardForStage(stage) {
        return 15 + stage * 5;
    }

    getChallengeLevel() {
        return this.getChallengeLevelForStage(this.getChallengePlayableStage());
    }

    isChallengeStageCleared(stage) {
        return stage < this.getChallengeStage();
    }

    // Returns { firstClear, coins } so callers can show the correct reward
    saveChallengeWin(stage, timeUsed) {
        if (!this.data.challengeStage) this.data.challengeStage = 1;
        if (!this.data.challengeBestTime || timeUsed < this.data.challengeBestTime) {
            this.data.challengeBestTime = timeUsed;
        }

        const firstClear = stage >= this.data.challengeStage;
        // Replays give a small reward and never advance progress / trophies
        const coins = firstClear ? this.getChallengeRewardForStage(stage) : 5;

        if (firstClear) {
            this.data.challengeStage = Math.min(this.getChallengeMaxStage() + 1, stage + 1);
            this.data.challengeTrophies = (this.data.challengeTrophies || 0) + 1;
        }
        if (!this.data.challengeBestStage || this.data.challengeStage > this.data.challengeBestStage) {
            this.data.challengeBestStage = this.data.challengeStage;
        }
        this.addCoins(coins);
        this.updateMissionProgress('levels', 1);
        this.save();
        return { firstClear, coins };
    }

    getChallengeTrophies() {
        return this.data.challengeTrophies !== undefined ? this.data.challengeTrophies : Math.max(0, this.getChallengeStage() - 1);
    }

    generateRandomDailyMissions(dateStr) {
        let hash = 0;
        for (let i = 0; i < dateStr.length; i++) {
            hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
            hash |= 0;
        }
        let seed = Math.abs(hash) + 12345;
        function rnd() {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        }
        function choose(arr) {
            return arr[Math.floor(rnd() * arr.length)];
        }

        const archetypes = [
            {
                type: 'arrows',
                icon: '🏹',
                options: [
                    { target: 25, reward: 25, titleAr: 'أطلق 25 سهماً اليوم', titleEn: 'Release 25 arrows today' },
                    { target: 40, reward: 35, titleAr: 'أطلق 40 سهماً اليوم', titleEn: 'Release 40 arrows today' },
                    { target: 60, reward: 50, titleAr: 'أطلق 60 سهماً اليوم', titleEn: 'Release 60 arrows today' },
                    { target: 80, reward: 65, titleAr: 'أطلق 80 سهماً اليوم', titleEn: 'Release 80 arrows today' }
                ]
            },
            {
                type: 'levels',
                icon: '🏆',
                options: [
                    { target: 2, reward: 30, titleAr: 'فز بمرحلتين بنجاح', titleEn: 'Win 2 levels' },
                    { target: 3, reward: 40, titleAr: 'فز بـ 3 مراحل بنجاح', titleEn: 'Win 3 levels' },
                    { target: 4, reward: 50, titleAr: 'فز بـ 4 مراحل بنجاح', titleEn: 'Win 4 levels' },
                    { target: 5, reward: 60, titleAr: 'فز بـ 5 مراحل بنجاح', titleEn: 'Win 5 levels' }
                ]
            },
            {
                type: 'combos',
                icon: '⚡',
                options: [
                    { target: 3, reward: 35, titleAr: 'حقق كومبو 3x أو أعلى', titleEn: 'Achieve 3x Combo streak' },
                    { target: 4, reward: 45, titleAr: 'حقق كومبو 4x أو أعلى', titleEn: 'Achieve 4x Combo streak' },
                    { target: 5, reward: 55, titleAr: 'حقق كومبو 5x أو أعلى', titleEn: 'Achieve 5x Combo streak' }
                ]
            },
            {
                type: 'stars',
                icon: '⭐',
                options: [
                    { target: 6, reward: 35, titleAr: 'اجمع 6 نجوم من المراحل', titleEn: 'Collect 6 stars from levels' },
                    { target: 9, reward: 50, titleAr: 'اجمع 9 نجوم من المراحل', titleEn: 'Collect 9 stars from levels' },
                    { target: 12, reward: 65, titleAr: 'اجمع 12 نجمة من المراحل', titleEn: 'Collect 12 stars from levels' }
                ]
            },
            {
                type: 'perfect',
                icon: '🎯',
                options: [
                    { target: 1, reward: 35, titleAr: 'فز بمرحلة واحدة بـ 3 نجوم', titleEn: 'Clear 1 level with 3 stars' },
                    { target: 2, reward: 50, titleAr: 'فز بمرحلتين بـ 3 نجوم', titleEn: 'Clear 2 levels with 3 stars' },
                    { target: 3, reward: 65, titleAr: 'فز بـ 3 مراحل بـ 3 نجوم', titleEn: 'Clear 3 levels with 3 stars' }
                ]
            },
            {
                type: 'spins',
                icon: '🎡',
                options: [
                    { target: 1, reward: 30, titleAr: 'أدر عجلة الحظ المحظوظة اليوم', titleEn: 'Spin the Lucky Wheel today' }
                ]
            }
        ];

        const shuffled = archetypes.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(rnd() * (i + 1));
            const temp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = temp;
        }

        const selected = shuffled.slice(0, 3);
        return selected.map((arch, index) => {
            const opt = choose(arch.options);
            return {
                id: `m_${arch.type}_${dateStr}_${index}`,
                type: arch.type,
                target: opt.target,
                current: 0,
                reward: opt.reward,
                titleAr: opt.titleAr,
                titleEn: opt.titleEn,
                icon: arch.icon,
                claimed: false
            };
        });
    }

    getDailyMissions() {
        const todayStr = new Date().toISOString().slice(0, 10);
        if (!this.data.dailyMissionsDate || this.data.dailyMissionsDate !== todayStr || !this.data.dailyMissions || this.data.dailyMissions.length === 0) {
            this.data.dailyMissionsDate = todayStr;
            this.data.dailyMissions = this.generateRandomDailyMissions(todayStr);
            this.save();
        }
        return this.data.dailyMissions;
    }

    updateMissionProgress(type, amount = 1) {
        const missions = this.getDailyMissions();
        let changed = false;
        missions.forEach(m => {
            if (m.type === type && !m.claimed) {
                const old = m.current;
                if (type === 'combos') {
                    if (amount >= m.target) {
                        m.current = m.target;
                    }
                } else {
                    m.current = Math.min(m.target, m.current + amount);
                }
                if (m.current !== old) changed = true;
            }
        });
        if (changed) this.save();
    }

    claimDailyMission(missionId) {
        const missions = this.getDailyMissions();
        const m = missions.find(x => x.id === missionId);
        if (m && m.current >= m.target && !m.claimed) {
            m.claimed = true;
            this.addCoins(m.reward);
            this.save();
            return m.reward;
        }
        return 0;
    }

    hasUnclaimedMissions() {
        const missions = this.getDailyMissions();
        return missions.some(m => m.current >= m.target && !m.claimed);
    }

    updateMistakes(amount = 1) {
        if (!this.data.stats) this.data.stats = {};
        this.data.stats.mistakesCount = (this.data.stats.mistakesCount || 0) + amount;
        this.save();
    }

    updateBestCombo(combo) {
        if (!this.data.stats) this.data.stats = {};
        if (combo > (this.data.stats.bestCombo || 0)) {
            this.data.stats.bestCombo = combo;
            this.save();
        }
    }

    getBrainIQ() {
        const stats = this.data.stats || {};
        const totalSolved = stats.totalPuzzlesSolved || 0;
        const maxUnlocked = Math.max(0, (this.data.maxUnlockedLevel || 1) - 1);
        const solved = Math.max(totalSolved, this.data.testMode ? totalSolved : maxUnlocked);
        const bestCombo = stats.bestCombo || 0;
        const totalArrows = stats.totalArrowsReleased || 0;
        const mistakes = stats.mistakesCount || 0;
        const totalStars = this.getTotalStars();

        const solvedBonus = Math.floor(solved * 3);
        const starBonus = Math.floor(totalStars * 2);
        const comboBonus = Math.min(50, bestCombo * 4);
        const accuracyPct = totalArrows > 0 
            ? Math.max(0, Math.min(100, Math.round(((totalArrows - mistakes) / totalArrows) * 100))) 
            : 100;
        const accuracyBonus = Math.round((accuracyPct / 100) * 15);

        const iq = Math.round(solvedBonus + starBonus + comboBonus + accuracyBonus);

        // Tiers configured based on completed levels across all 5000 levels.
        // Every title is strictly a single word:
        // 0-24: مبتدئ 🥉
        // 25-89: تكتيكي 🥈
        // 90-149: خبير 🥇
        // 150-199: عبقري 💎
        // 200-349: أسطورة 👑
        // Extended ranks scaling smoothly up to 5000 levels:
        const TIERS = [
            { min: 5000, max: 5000, ar: 'سرمدي', en: 'Eternal', icon: '🌟', descAr: 'القمة المطلقة - أسطورة المتاهات الأبدية', descEn: 'The Ultimate Apex - Eternal Maze Legend' },
            { min: 4500, max: 5000, ar: 'خالد', en: 'Immortal', icon: '💫', descAr: 'اسم محفور في تاريخ أساطير اللعبة', descEn: 'A name etched in the game hall of fame' },
            { min: 4000, max: 4500, ar: 'زعيم', en: 'Overlord', icon: '🪐', descAr: 'قيادة الصدارة بلا منازع وقوة ذهنية طاغية', descEn: 'Undisputed leader of the ranks' },
            { min: 3500, max: 4000, ar: 'إمبراطور', en: 'Emperor', icon: '🏰', descAr: 'سيادة مطلقة على عوالم الألغاز والمتاهات', descEn: 'Sovereign ruler of puzzle realms' },
            { min: 3000, max: 3500, ar: 'مهيب', en: 'Majestic', icon: '🦅', descAr: 'حضور طاغٍ وإنجازات تكتيكية مذهلة', descEn: 'Majestic presence and staggering achievements' },
            { min: 2500, max: 3000, ar: 'خارق', en: 'Ascended', icon: '🌌', descAr: 'تفوق عقلي يتجاوز الحدود التقليدية', descEn: 'Transcendental mental prowess' },
            { min: 2000, max: 2500, ar: 'قاهر', en: 'Conqueror', icon: '⚔️', descAr: 'قهر أصعب التحديات والمتاهات المعقدة', descEn: 'Conquering the hardest complex mazes' },
            { min: 1500, max: 2000, ar: 'فيلسوف', en: 'Sage', icon: '📜', descAr: 'حكمة عميقة وفهم شامل لكافة الأنماط', descEn: 'Deep wisdom and complete pattern understanding' },
            { min: 1000, max: 1500, ar: 'عملاق', en: 'Titan', icon: '🔱', descAr: 'سيطرة ساحقة وتجاوز المستويات باقتدار', descEn: 'Overwhelming dominance across levels' },
            { min: 750, max: 1000, ar: 'داهية', en: 'Mastermind', icon: '🔮', descAr: 'حنكة فائقة وتوقع مسارات الأسهم المعقدة', descEn: 'Supreme cunning and predicting arrow trajectories' },
            { min: 500, max: 750, ar: 'بارع', en: 'Prodigy', icon: '⚡', descAr: 'إتقان متقدم وقدرة مذهلة على المناورة', descEn: 'Advanced mastery and remarkable maneuvering' },
            { min: 350, max: 500, ar: 'محترف', en: 'Master', icon: '🎖️', descAr: 'أداء نخبوي وخبرة واسعة في حل المتاهات', descEn: 'Elite performance and vast maze experience' },
            { min: 200, max: 350, ar: 'أسطورة', en: 'Legend', icon: '👑', descAr: 'ذكاء استثنائي وسيطرة كاملة على اللعبة', descEn: 'Exceptional intellect and game mastery' },
            { min: 150, max: 200, ar: 'عبقري', en: 'Genius', icon: '💎', descAr: 'تخطيط استراتيجي فائق وسرعة بديهة', descEn: 'Strategic brilliance and sharp intuition' },
            { min: 90, max: 150, ar: 'خبير', en: 'Expert', icon: '🥇', descAr: 'مهارة واحترافية عالية في فك العقد', descEn: 'Mastery and high skill in solving puzzles' },
            { min: 25, max: 90, ar: 'تكتيكي', en: 'Tactician', icon: '🥈', descAr: 'تحليل ذكي وقدرة على قراءة المسارات', descEn: 'Smart analysis and path reading' },
            { min: 0, max: 25, ar: 'مبتدئ', en: 'Novice', icon: '🥉', descAr: 'أداء واعد في بداية رحلة المتاهات', descEn: 'Promising start in the maze journey' }
        ];

        let currentTier = TIERS[TIERS.length - 1];
        let nextTier = null;

        for (let i = 0; i < TIERS.length; i++) {
            if (solved >= TIERS[i].min) {
                currentTier = TIERS[i];
                nextTier = i > 0 ? TIERS[i - 1] : null;
                break;
            }
        }

        const rankFloor = currentTier.min;
        const rankCeil = currentTier.max;
        const levelsNeeded = Math.max(0, rankCeil - solved);
        const progressPct = solved >= 5000 
            ? 100 
            : Math.max(0, Math.min(100, Math.round(((solved - rankFloor) / Math.max(1, rankCeil - rankFloor)) * 100)));

        return {
            iq,
            solved,
            rankAr: currentTier.ar,
            rankEn: currentTier.en,
            rankIcon: currentTier.icon,
            nextRankAr: nextTier ? nextTier.ar : 'القمة المطلقة',
            nextRankEn: nextTier ? nextTier.en : 'Apex',
            nextRankIcon: nextTier ? nextTier.icon : '✨',
            descAr: currentTier.descAr,
            descEn: currentTier.descEn,
            pointsNeeded: levelsNeeded,
            levelsNeeded,
            progressPct,
            totalSolved: solved,
            totalStars,
            bestCombo,
            totalArrows,
            accuracy: accuracyPct
        };
    }

    getPlayerName() {
        const isAr = (this.data.settings?.lang === 'ar');
        if (!this.data.nameChangeCount || this.data.nameChangeCount === 0 || this.data.playerName === 'لاعب السهم' || this.data.playerName === 'Arrow Player') {
            return isAr ? 'لاعب السهم' : 'Arrow Player';
        }
        return this.data.playerName;
    }

    getNameChangeCost() {
        const count = this.data.nameChangeCount || 0;
        return count === 0 ? 0 : 10000;
    }

    setPlayerName(newName) {
        if (!newName || typeof newName !== 'string') return false;
        const trimmed = newName.trim().slice(0, 15);
        if (!trimmed) return false;

        const cost = this.getNameChangeCost();
        if (cost > 0) {
            if ((this.data.coins || 0) < cost) {
                return false;
            }
            this.data.coins -= cost;
        }

        this.data.playerName = trimmed;
        this.data.nameChangeCount = (this.data.nameChangeCount || 0) + 1;
        this.save();
        return true;
    }

    resetProgress() {
        this.data = this.getDefaults();
        this.save();
    }
}

if (typeof module !== 'undefined') {
    module.exports = StorageManager;
}
if (typeof window !== 'undefined') {
    window.storageManager = new StorageManager();
}

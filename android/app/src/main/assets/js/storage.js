// Persistent Local Storage Management for Arrow Escape
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
            coins: 50,
            hints: 1,
            lasers: 1,
            xrays: 1,
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
            settings: {
                sound: true,
                music: false,
                vibration: true,
                lang: 'ar', // Default Arabic per prompt
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
            data.unlockedArrowBodies = data.unlockedArrowBodies || ['tube'];
            if (data.xrays === undefined) data.xrays = 1;
            if (!data.stats) {
                data.stats = { totalPuzzlesSolved: 0, totalStars: 0, totalRotations: 0, totalArrowsReleased: 0, mistakesCount: 0, bestCombo: 0 };
            }
            if (data.stats.mistakesCount === undefined) data.stats.mistakesCount = 0;
            if (data.stats.bestCombo === undefined) data.stats.bestCombo = 0;

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
        // Each level renews with exactly 1 Hint, 1 Laser Zap, and 1 X-Ray Vision per user requirement
        this.data.hints = 1;
        this.data.lasers = 1;
        this.data.xrays = 1;
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
        this.data.lasers = this.data.lasers !== undefined ? this.data.lasers : 2;
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
        this.data.xrays = this.data.xrays !== undefined ? this.data.xrays : 1;
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

    getDailyMissions() {
        const todayStr = new Date().toISOString().slice(0, 10);
        if (!this.data.dailyMissionsDate || this.data.dailyMissionsDate !== todayStr || !this.data.dailyMissions || this.data.dailyMissions.length === 0) {
            this.data.dailyMissionsDate = todayStr;
            this.data.dailyMissions = [
                { id: 'm_arrows', type: 'arrows', target: 35, current: 0, reward: 30, titleAr: 'أطلق 35 سهماً اليوم', titleEn: 'Release 35 arrows today', icon: '🏹' },
                { id: 'm_levels', type: 'levels', target: 3, current: 0, reward: 35, titleAr: 'فز بـ 3 مراحل بنجاح', titleEn: 'Win 3 levels', icon: '🏆' },
                { id: 'm_combo', type: 'combos', target: 3, current: 0, reward: 40, titleAr: 'حقق كومبو 3x أو أعلى', titleEn: 'Achieve 3x Combo streak', icon: '⚡' }
            ];
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
        const bestCombo = stats.bestCombo || 0;
        const totalArrows = stats.totalArrowsReleased || 0;
        const mistakes = stats.mistakesCount || 0;
        const totalStars = this.getTotalStars();

        const base = 100;
        const solvedBonus = Math.min(45, Math.floor(totalSolved * 0.7));
        const comboBonus = Math.min(25, bestCombo * 3);
        const accuracyBonus = totalSolved > 0 
            ? Math.max(0, Math.min(20, Math.round(20 - (mistakes / Math.max(1, totalSolved)) * 4)))
            : 10;
        const starBonus = Math.min(25, Math.floor(totalStars * 0.35));

        const iq = Math.round(base + solvedBonus + comboBonus + accuracyBonus + starBonus);

        let rankAr = 'مبتدئ واعد';
        let rankEn = 'Promising Novice';
        let rankIcon = '🥉';

        if (iq >= 185) {
            rankAr = 'أسطورة الذكاء الخارق';
            rankEn = 'Mythic Prodigy';
            rankIcon = '👑';
        } else if (iq >= 160) {
            rankAr = 'عبقري استراتيجي';
            rankEn = 'Strategic Genius';
            rankIcon = '💎';
        } else if (iq >= 135) {
            rankAr = 'خبير متاهات';
            rankEn = 'Maze Master';
            rankIcon = '🥇';
        } else if (iq >= 115) {
            rankAr = 'محلل تكتيكي';
            rankEn = 'Tactical Analyst';
            rankIcon = '🥈';
        }

        return {
            iq,
            rankAr,
            rankEn,
            rankIcon,
            totalSolved,
            totalStars,
            bestCombo,
            totalArrows,
            accuracy: totalSolved > 0 ? Math.max(50, Math.min(100, Math.round(100 - (mistakes / Math.max(1, totalSolved * 3)) * 50))) : 100
        };
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

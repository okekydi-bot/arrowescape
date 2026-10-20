/// UI Controller, Screens, Modals, Internationalization, and Navigation
class UIController {
    constructor() {
        this.currentScreen = 'screen-menu';
        this.selectedLevelTab = 'normal'; // 'normal', 'hard', 'expert'
        this.selectedLeaderboardTab = 'alltime';
        this.activeAchievementCategory = 'all';
        this._achievementsCatalog = null;
        this.adCountdownTimer = null;

        // Localization Dictionary
        this.translations = {
            ar: {
                appName: 'ARROW ESCAPE',
                appTagline: 'فكر .. خطط .. اهرب',
                play: 'بدء اللعب',
                challenges: 'تحديات (قريباً)',
                comingSoon: 'قريباً',
                levels: 'المستويات',
                challenge: 'وضع التحدي',
                dailyPuzzle: 'اللغز اليومي',
                endless: 'الوضع اللانهائي',
                rewards: 'المكافآت',
                leaderboard: 'لوحة الترتيب',
                themes: 'المظاهر',
                achievements: 'الإنجازات',
                settings: 'الإعدادات',
                normal: 'عادي',
                hard: 'صعب',
                expert: 'خبير',
                allTime: 'الكل',
                weekly: 'أسبوعي',
                level: 'المستوى',
                score: 'النقاط',
                moves: 'الحركات',
                target: 'الهدف',
                bestResult: 'أفضل نتيجة',
                reward: 'المكافأة',
                hint: 'تلميح',
                undo: 'تراجع',
                reset: 'إعادة ضبط',
                wellDone: 'أحسنت!',
                levelComplete: 'اكتمل المستوى!',
                nextLevel: 'المستوى التالي',
                retry: 'إعادة المحاولة',
                retryShort: 'إعادة',
                home: 'الرئيسية',
                homeShort: 'الرئيسية',
                shareWin: 'مشاركة الفوز',
                shareShort: 'مشاركة',
                attemptsOver: 'خسرت المرحلة!',
                watchAdReward: '🎬 استئناف من آخر حركة - شاهد إعلان',
                restartFromStart: '🔄 إعادة المحاولة من البداية',
                sound: 'المؤثرات الصوتية',
                music: 'الموسيقى الخلفية',
                vibration: 'الاهتزاز',
                language: 'اللغة',
                privacyPolicy: 'سياسة الخصوصية',
                resetProgress: 'إعادة تعيين التقدم',
                saveAndClose: 'حفظ وإغلاق',
                gamePaused: 'اللعبة متوقفة مؤقتاً',
                resume: 'متابعة اللعب',
                claim: 'استلام المكافأة',
                claimed: 'تم الاستلام',
                day: 'اليوم',
                adCountdown: 'يمكنك الحصول على المحاولة بعد',
                seconds: 'ثوانٍ',
                adCompleted: 'تمت مشاهدة الإعلان بنجاح! ⭐⭐⭐',
                congrats: 'تهانينا!',
                challengeDesc: 'أكمل المستوى في أسرع وقت ممكن!',
                time: 'الوقت',
                best: 'الأفضل',
                outOfHints: 'نفذت التلميحات!',
                outOfHintsDesc: 'شاهد إعلاناً قصيراً للحصول على تلميح مجاني فوري ومتابعة اللعب!',
                watchAdForHint: '🎬 شاهد إعلان للحصول على التلميح',
                cancel: 'إلغاء',
                hintDesc: 'هذا السهم لديه مسار هروب سالك الآن! اضغط عليه مباشرة للهروب من الشبكة.',
                ok: 'موافق',
                doubleRewardAd: '🎬 ضاعف المكافأة x2 - شاهد إعلان 🪙',
                failedDesc: 'خسرت جميع النجوم بسبب 3 أخطاء! شاهد إعلاناً لمتابعة اللعب من آخر حركة واستعادة 3 نجوم ⭐⭐⭐',

                // Levels & Worlds
                levelsTitle: 'المستويات (5000)',
                currentStage: 'المرحلة الحالية',
                currentStageNum: 'المرحلة 1',
                worlds: '🌍 العوالم',
                browseAll: 'تصفح الكل',
                selectWorldTitle: '🌐 اختيار العالم (1 - 100)',
                searchWorldPlaceholder: 'ابحث باسم العالم...',
                go: 'انتقال',

                // Player Card & Profile
                iqTactical: 'IQ تكتيكي',
                statLevels: 'مراحل',
                statStars: 'نجوم',
                statCombo: 'كومبو',
                statAccuracy: 'دقة',
                solvedLevels: 'مراحل محلولة',
                totalStars: 'مجموع النجوم',
                bestCombo: 'أعلى كومبو',
                aimAccuracy: 'دقة التوجيه',
                playerProfileTitle: 'بطاقة اللاعب ومقياس الذكاء',
                shareIqCard: '📤 مشاركة بطاقة الذكاء مع أصدقائك',
                editPlayerName: 'تغيير اسم اللاعب',
                firstTimeFree: 'المرة الأولى مجاناً! 🎁',
                saveName: 'حفظ الاسم',

                // Boosters & Game HUD
                laserBooster: 'ليزر صاعق',
                xrayBooster: 'عين الصقر',
                bossLevelWarning: '👑 مرحلة الزعيم الملكي! (+25 🪙 مكافأة)',

                // Store & Customization
                storeThemes: '🎨 المظاهر',
                storeHeads: '🏹 الرؤوس',
                storeBodies: '🐍 الأجسام',
                storeTrails: '🌈 المسارات',
                watchAdFreeCoins: '🎬 شاهد إعلاناً واحصل على +50 🪙',

                // Achievements
                achCompletedTotal: 'إجمالي الإنجازات المكتملة',
                claimAll: 'استلام الكل',
                achAll: '🌟 الكل',
                achLevels: '🗺️ المراحل',
                achBosses: '👑 الزعماء',
                achStars: '✨ النجوم',
                achPuzzles: '🧩 الألغاز',
                achMastery: '💎 الإتقان',
                achCombos: '⚡ الكومبو',
                achEconomy: '🎨 المتجر',

                // Victory & Dialogs
                exceptionalSpeed: 'سرعة استثنائية!',
                bossDefeatedBanner: '👑 سحقت الزعيم! مكافأة ملكية مضاعفة +25 🪙 🔥',
                tacticalIqGain: 'ذكاء تكتيكي:',
                shareWin: 'مشاركة الفوز مع الأصدقاء',
                pauseDesc: 'المسار بانتظارك! هل ترغب في المتابعة أو إعادة المحاولة؟',
                dailySpinTitle: 'عجلة الحظ اليومية',
                dailySpinDesc: 'دوّر العجلة يومياً واربح عملات وتلميحات وصعقات ليزر مجانية! 🎁',
                freeSpin: 'تدوير مجاني!',
                dailyMissionsTitle: 'مهام اليوم',
                dailyMissionsDesc: 'أكمل المهام اليومية واحصل على مكافآت كوينز وتلميحات إضافية! 📜',
                challengesTitle: 'نمط التحديات ⚔️',
                timeAvailable: 'الوقت المتاح',
                bestTime: 'أفضل توقيت',
                trophies: 'الكؤوس',
                startChallenge: 'بدء التحدي الآن',
                challengeStages: 'مراحل التحدي',
                stage: 'المرحلة',

                // Additional UI Keys
                rankProgressTitle: 'التقدم للرتبة التالية',
                leaderboardComingSoon: 'التصنيف (قريباً)',
                adBadge: 'إعلان',
                adText: 'Google AdMob',
                enterNewNamePlaceholder: 'أدخل اسمك الجديد...',
                levelNumberPrefix: 'المرحلة',
                worldPrefix: 'عالم',
                laserBoosterDesc: 'ليزر صاعق لإزالة السهم المحظور فوراً',
                xrayBoosterDesc: 'عين الصقر الكاشفة (X-Ray)',
                unlockedOutOf15000: '⭐ {stars}/15000',
                challengeStagesTitleFmt: 'مراحل التحدي {cleared} / {total}'
            },
            en: {
                appName: 'ARROW ESCAPE',
                appTagline: 'Think .. Plan .. Escape',
                play: 'PLAY',
                challenges: 'CHALLENGES (SOON)',
                comingSoon: 'Coming Soon',
                levels: 'LEVELS',
                challenge: 'CHALLENGE',
                dailyPuzzle: 'DAILY PUZZLE',
                endless: 'ENDLESS',
                rewards: 'REWARDS',
                leaderboard: 'LEADERBOARD',
                themes: 'THEMES',
                achievements: 'ACHIEVEMENTS',
                settings: 'SETTINGS',
                normal: 'NORMAL',
                hard: 'HARD',
                expert: 'EXPERT',
                allTime: 'ALL TIME',
                weekly: 'WEEKLY',
                level: 'LEVEL',
                score: 'SCORE',
                moves: 'MOVES',
                target: 'TARGET',
                bestResult: 'BEST RESULT',
                reward: 'REWARD',
                hint: 'HINT',
                undo: 'UNDO',
                reset: 'RESET',
                wellDone: 'Well Done!',
                levelComplete: 'Level Complete!',
                nextLevel: 'Next Level',
                retry: 'Retry',
                retryShort: 'Retry',
                home: 'Home',
                homeShort: 'Home',
                shareWin: 'Share Win',
                shareShort: 'Share',
                attemptsOver: 'Level Failed!',
                watchAdReward: '🎬 Continue from Last Move (Watch Ad)',
                restartFromStart: '🔄 Restart from Beginning',
                sound: 'Sound Effects',
                music: 'Background Music',
                vibration: 'Vibration',
                language: 'Language',
                privacyPolicy: 'Privacy Policy',
                resetProgress: 'Reset Progress',
                saveAndClose: 'Save & Close',
                gamePaused: 'Game Paused',
                resume: 'Resume Game',
                claim: 'Claim Reward',
                claimed: 'Claimed',
                day: 'Day',
                adCountdown: 'Reward available in',
                seconds: 'seconds',
                adCompleted: 'Ad completed! Extra attempt awarded ❤️',
                congrats: 'Congratulations!',
                challengeDesc: 'Complete the level in the shortest time!',
                time: 'TIME',
                best: 'BEST',
                outOfHints: 'Out of Hints!',
                outOfHintsDesc: 'Watch a short ad to get a free instant hint and keep playing!',
                watchAdForHint: '🎬 Watch Ad for Free Hint',
                cancel: 'Cancel',
                hintDesc: 'This arrow has a clear escape path right now! Tap it directly to escape.',
                ok: 'OK',
                doubleRewardAd: '🎬 Double Reward x2 (Watch Ad) 🪙',
                failedDesc: 'Lost all stars due to 3 mistakes! Watch a short ad to resume from the last move with 3 stars ⭐⭐⭐',

                // Levels & Worlds
                levelsTitle: 'LEVELS (5000)',
                currentStage: 'Current Level',
                currentStageNum: 'Level 1',
                worlds: '🌍 Worlds',
                browseAll: 'Browse All',
                selectWorldTitle: '🌐 Select World (1 - 100)',
                searchWorldPlaceholder: 'Search world name...',
                go: 'Go',

                // Player Card & Profile
                iqTactical: 'Tactical IQ',
                statLevels: 'Levels',
                statStars: 'Stars',
                statCombo: 'Combo',
                statAccuracy: 'Accuracy',
                solvedLevels: 'Solved Levels',
                totalStars: 'Total Stars',
                bestCombo: 'Highest Combo',
                aimAccuracy: 'Accuracy',
                playerProfileTitle: 'Player Profile & IQ',
                shareIqCard: '📤 Share IQ Card with Friends',
                editPlayerName: 'Edit Player Name',
                firstTimeFree: 'First time free! 🎁',
                saveName: 'Save Name',

                // Boosters & Game HUD
                laserBooster: 'Laser Zap',
                xrayBooster: 'Hawk Eye',
                bossLevelWarning: '👑 Royal Boss Level! (+25 🪙 Bonus)',

                // Store & Customization
                storeThemes: '🎨 Themes',
                storeHeads: '🏹 Arrow Heads',
                storeBodies: '🐍 Arrow Bodies',
                storeTrails: '🌈 Arrow Trails',
                watchAdFreeCoins: '🎬 Watch Ad & Get +50 🪙',

                // Achievements
                achCompletedTotal: 'Total Completed Achievements',
                claimAll: 'Claim All',
                achAll: '🌟 All',
                achLevels: '🗺️ Levels',
                achBosses: '👑 Bosses',
                achStars: '✨ Stars',
                achPuzzles: '🧩 Puzzles',
                achMastery: '💎 Mastery',
                achCombos: '⚡ Combos',
                achEconomy: '🎨 Economy',

                // Victory & Dialogs
                exceptionalSpeed: 'Exceptional Speed!',
                bossDefeatedBanner: '👑 Boss Crushed! Double Royal Reward +25 🪙 🔥',
                tacticalIqGain: 'Tactical IQ:',
                shareWin: 'Share Victory with Friends',
                pauseDesc: 'The maze awaits! Would you like to resume or restart?',
                dailySpinTitle: 'Daily Lucky Wheel',
                dailySpinDesc: 'Spin daily to win free coins, hints, and laser zaps! 🎁',
                freeSpin: 'Free Spin!',
                dailyMissionsTitle: 'Daily Missions',
                dailyMissionsDesc: 'Complete daily missions for bonus coins and extra hints! 📜',
                challengesTitle: 'Challenges ⚔️',
                timeAvailable: 'Time Limit',
                bestTime: 'Best Time',
                trophies: 'Trophies',
                startChallenge: 'Start Challenge',
                challengeStages: 'Challenge Stages',
                stage: 'Stage',

                // Additional UI Keys
                rankProgressTitle: 'Next Rank Progress',
                leaderboardComingSoon: 'Leaderboard (Soon)',
                adBadge: 'Ad',
                adText: 'Google AdMob',
                enterNewNamePlaceholder: 'Enter your new name...',
                levelNumberPrefix: 'Level',
                worldPrefix: 'World',
                laserBoosterDesc: 'Laser zap to vaporize blocking arrow',
                xrayBoosterDesc: 'Hawk Eye Vision (X-Ray)',
                unlockedOutOf15000: '⭐ {stars}/15000',
                challengeStagesTitleFmt: 'Challenge Stages {cleared} / {total}'
            }
        };
    }

    init() {
        if (!window.storageManager.data.settings.hasManualLangChoice) {
            const sysLang = (typeof getSystemLanguage === 'function') ? getSystemLanguage() : (navigator.language?.startsWith('ar') ? 'ar' : 'en');
            window.storageManager.data.settings.lang = sysLang;
        }
        this.applyLanguage(window.storageManager.data.settings.lang);
        this.applyTheme(window.storageManager.data.selectedTheme);
        this.applySettingsUI();
        this.setupEventListeners();
        this.updateHeaderStats();
        this.initMenuAmbientCanvas();
    }

    t(key) {
        const lang = window.storageManager.data.settings.lang || 'ar';
        return (this.translations[lang] && this.translations[lang][key]) || (this.translations.ar[key] || key);
    }

    applyLanguage(lang) {
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
        document.body.classList.remove('lang-ar', 'lang-en');
        document.body.classList.add(`lang-${lang}`);

        // Update all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.translations[lang] && this.translations[lang][key]) {
                el.textContent = this.translations[lang][key];
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (this.translations[lang] && this.translations[lang][key]) {
                el.placeholder = this.translations[lang][key];
            }
        });

        // Update titles
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (this.translations[lang] && this.translations[lang][key]) {
                el.title = this.translations[lang][key];
            }
        });

        // Re-render currently active screens or catalogs with corrected method names
        if (typeof this.renderLevelSelectGrid === 'function' && document.getElementById('screen-levels')?.classList.contains('active')) {
            this.renderLevelSelectGrid();
        }
        if (typeof this.switchStoreTab === 'function' && document.getElementById('screen-themes')?.classList.contains('active')) {
            this.switchStoreTab(this.activeStoreTab || 'themes');
        }
        if (typeof this.renderAchievements === 'function' && document.getElementById('screen-achievements')?.classList.contains('active')) {
            this.renderAchievements();
        }
        if (typeof this.renderChallengeScreen === 'function' && document.getElementById('screen-challenge')?.classList.contains('active')) {
            this.renderChallengeScreen();
        }
        if (typeof this.initLuckyWheel === 'function' && document.getElementById('modal-lucky-spin')?.classList.contains('active')) {
            this.initLuckyWheel();
        }
        if (typeof this.renderDailyMissions === 'function' && document.getElementById('modal-daily-missions')?.classList.contains('active')) {
            this.renderDailyMissions();
        }
        if (window.gameManager && typeof window.gameManager.updateHUD === 'function') {
            window.gameManager.updateHUD();
        }

        this.updateHeaderStats();
    }

    getThemeCatalog() {
        return [
            { id: 'cyber', name: 'سايبر بانك', nameEn: 'Cyberpunk', desc: 'أزرق سماوي + برتقالي نيون', descEn: 'Neon Cyan + Blaze Orange', icon: '🌃', price: 0, a: '#00f0ff', b: '#ff6a00', bg: '#070b14' },
            { id: 'synthwave', name: 'سينث ويف', nameEn: 'Synthwave', desc: 'وردي نيون + بنفسجي', descEn: 'Neon Pink + Violet', icon: '🌆', price: 100, a: '#ff007f', b: '#b026ff', bg: '#0d0221' },
            { id: 'matrix', name: 'ماتريكس', nameEn: 'Matrix', desc: 'أخضر ليزري + سماوي', descEn: 'Laser Green + Cyan', icon: '💚', price: 200, a: '#00ff66', b: '#00f0ff', bg: '#021408' },
            { id: 'gold', name: 'العرش الذهبي', nameEn: 'Golden Throne', desc: 'ذهبي متوهج + كهرماني', descEn: 'Glowing Gold + Amber', icon: '👑', price: 300, a: '#ffd700', b: '#ff8800', bg: '#140f02' },
            { id: 'ice', name: 'الجليد القطبي', nameEn: 'Polar Ice', desc: 'أزرق جليدي + لازوردي', descEn: 'Glacial Blue + Azure', icon: '❄️', price: 350, a: '#70d6ff', b: '#0066ff', bg: '#020d1a' },
            { id: 'lava', name: 'حمم البركان', nameEn: 'Volcanic Lava', desc: 'أحمر ناري + برتقالي لهب', descEn: 'Fiery Red + Flame Orange', icon: '🌋', price: 400, a: '#ff3b30', b: '#ff9500', bg: '#180402' },
            { id: 'toxic', name: 'السم الأخضر', nameEn: 'Toxic Green', desc: 'أخضر نيون + فوشي', descEn: 'Neon Lime + Fuchsia', icon: '☢️', price: 450, a: '#a6ff00', b: '#ff00aa', bg: '#0f1a02' },
            { id: 'royal', name: 'القصر الملكي', nameEn: 'Royal Palace', desc: 'بنفسجي ملكي + ذهب', descEn: 'Royal Purple + Gold', icon: '💜', price: 500, a: '#bf5af2', b: '#ffd700', bg: '#12041a' },
            { id: 'ocean', name: 'أعماق المحيط', nameEn: 'Deep Ocean', desc: 'فيروزي كهربائي + كحلي', descEn: 'Electric Turquoise + Navy', icon: '🌊', price: 550, a: '#00e5ff', b: '#0055ff', bg: '#01121e' },
            { id: 'sakura', name: 'زهر الساكورا', nameEn: 'Cherry Blossom', desc: 'وردي ساكورا + قرمزي', descEn: 'Sakura Pink + Crimson', icon: '🌸', price: 600, a: '#ff70a6', b: '#ff2a70', bg: '#1a0510' },
            { id: 'sunset', name: 'غروب الصحراء', nameEn: 'Desert Sunset', desc: 'برتقالي متقد + وردي', descEn: 'Blazing Orange + Rose', icon: '🌅', price: 700, a: '#ff7b00', b: '#ff0055', bg: '#1a0805' },
            { id: 'aurora', name: 'الشفق القطبي', nameEn: 'Northern Lights', desc: 'زمردي سماوي + بنفسجي', descEn: 'Emerald Mint + Violet', icon: '🌌', price: 800, a: '#00ffb7', b: '#8338ec', bg: '#021612' },
            { id: 'cherry', name: 'كرز الربيع', nameEn: 'Spring Cherry', desc: 'أحمر كرزي + ياقوتي', descEn: 'Cherry Red + Ruby', icon: '🍒', price: 850, a: '#ff1744', b: '#f50057', bg: '#180208' },
            { id: 'electric', name: 'الصاعقة الزرقاء', nameEn: 'Blue Lightning', desc: 'أزرق طاقة + نيون سماوي', descEn: 'Energy Blue + Cyan Neon', icon: '⚡', price: 900, a: '#0066ff', b: '#00f0ff', bg: '#020919' },
            { id: 'mint', name: 'النعناع المنعش', nameEn: 'Fresh Mint', desc: 'نعناع نيون + أزرق بحري', descEn: 'Neon Mint + Aquamarine', icon: '🌿', price: 950, a: '#00f5d4', b: '#00bbf9', bg: '#011714' },
            { id: 'galaxy', name: 'المجرة الساحرة', nameEn: 'Mystic Galaxy', desc: 'أرجواني كوني + أزرق نجمي', descEn: 'Cosmic Purple + Star Blue', icon: '🪐', price: 1000, a: '#a855f7', b: '#3b82f6', bg: '#0d071a' },
            { id: 'coral', name: 'الشعاب المرجانية', nameEn: 'Coral Reef', desc: 'مرجاني ناصع + خوخي', descEn: 'Vivid Coral + Peach', icon: '🪸', price: 1050, a: '#ff6b6b', b: '#ff8e72', bg: '#1a0907' },
            { id: 'lime', name: 'ليمون نيون', nameEn: 'Neon Lime', desc: 'ليموني مشع + سماوي', descEn: 'Radiant Lime + Sky Blue', icon: '🍋', price: 1100, a: '#a3e635', b: '#22d3ee', bg: '#0d1702' },
            { id: 'berry', name: 'التوت البري', nameEn: 'Wild Berry', desc: 'توت فوشي + أرجواني هادئ', descEn: 'Berry Fuchsia + Soft Purple', icon: '🫐', price: 1150, a: '#e879f9', b: '#818cf8', bg: '#17051a' },
            { id: 'sky', name: 'سماء الصيف', nameEn: 'Summer Sky', desc: 'سماء صيفية + شمس نيون', descEn: 'Azure Sky + Neon Sun', icon: '☀️', price: 1200, a: '#38bdf8', b: '#fbbf24', bg: '#03121a' },
            { id: 'ruby', name: 'الياقوت الملكي', nameEn: 'Royal Ruby', desc: 'ياقوت أحمر + ذهب ساطع', descEn: 'Ruby Red + Brilliant Gold', icon: '💍', price: 1300, a: '#f43f5e', b: '#fbbf24', bg: '#190308' }
        ];
    }

    hexToRgb(hex) {
        const h = hex.replace('#', '');
        const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
        return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
    }

    applyTheme(themeId) {
        const root = document.documentElement;
        const catalog = this.getThemeCatalog();
        const theme = catalog.find(t => t.id === themeId) || catalog[0];
        const ra = this.hexToRgb(theme.a);
        const rb = this.hexToRgb(theme.b);

        // Themes change ONLY the colors of arrow bodies per user request:
        root.style.setProperty('--arrow-color-a', theme.a);
        root.style.setProperty('--arrow-color-b', theme.b);
        root.style.setProperty('--arrow-glow-a', `rgba(${ra}, 0.5)`);
        root.style.setProperty('--arrow-glow-b', `rgba(${rb}, 0.5)`);

        if (window.gameManager && window.gameManager.levelData) {
            window.gameManager.renderBoard();
        }
    }

    showScreen(screenId) {
        if (window.gameManager) {
            window.gameManager.isGameOver = false;
            if (screenId === 'screen-game' && window.gameManager.levelData) {
                window.gameManager.applyWorldBackground(window.gameManager.levelData.worldInfo);
            }
        }

        window.soundEngine.playClick();

        const previousId = this.currentScreen || 'screen-menu';
        const previousScreen = document.getElementById(previousId);
        const target = document.getElementById(screenId);

        if (previousScreen && previousScreen !== target) {
            previousScreen.classList.remove('active');
            previousScreen.classList.add('leaving');
            setTimeout(() => {
                previousScreen.classList.remove('leaving');
            }, 300);
        }

        document.querySelectorAll('.app-screen').forEach(s => {
            if (s !== target && s !== previousScreen) {
                s.classList.remove('active', 'leaving');
            }
        });

        if (target) {
            target.classList.remove('leaving');
            target.classList.add('active');
            this.currentScreen = screenId;
        }

        // Close any active modals
        this.closeAllModals();

        // Refresh screen specific data
        if (screenId === 'screen-levels') {
            const playerCurrent = window.storageManager ? (window.storageManager.data.currentLevel || 1) : 1;
            this.selectedWorldIndex = Math.min(99, Math.max(0, Math.floor((playerCurrent - 1) / 50)));
            this.renderLevelSelectGrid();
            setTimeout(() => {
                const currentCard = document.querySelector('.level-card.current');
                if (currentCard) {
                    currentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 120);
        } else if (screenId === 'screen-themes') {
            this.switchStoreTab('themes');
        } else if (screenId === 'screen-achievements') {
            this.renderAchievements();
        } else if (screenId === 'screen-challenge') {
            this.renderChallengeScreen();
        }

        // Show AdMob Banner across screens
        try {
            if (window.AndroidNative && typeof window.AndroidNative.setBannerVisible === 'function') {
                window.AndroidNative.setBannerVisible(true);
            }
        } catch (e) {
            console.log('AdMob bridge:', e);
        }

        this.updateHeaderStats();
    }

    closeAllModals() {
        document.querySelectorAll('.app-modal').forEach(m => m.classList.remove('active'));
    }

    updateHeaderStats() {
        const storage = window.storageManager;
        document.querySelectorAll('.user-coins-display').forEach(el => {
            el.textContent = storage.data.coins.toLocaleString();
        });
        document.querySelectorAll('.user-stars-display').forEach(el => {
            el.textContent = storage.getTotalStars();
        });
        document.querySelectorAll('.user-hints-display').forEach(el => {
            el.textContent = storage.data.hints;
        });

        // Update play button label based on saved progress
        const playBtnText = document.getElementById('menu-play-text');
        if (playBtnText) {
            const lvl = storage.data.currentLevel || 1;
            const isAr = (storage.data.settings.lang === 'ar');
            if (lvl > 1) {
                playBtnText.textContent = isAr ? `متابعة مستوى ${lvl}` : `Continue Level ${lvl}`;
            } else {
                playBtnText.textContent = isAr ? 'بدء اللعب' : 'Play';
            }
        }

        // Update achievements notification badge on main menu button
        this.updateAchievementsBadge();
        this.updateMissionsBadge();
        this.updatePlayerCard();
    }

    updatePlayerCard() {
        const card = document.getElementById('menu-player-card');
        if (!card || !window.storageManager) return;

        const iqData = window.storageManager.getBrainIQ();
        const isAr = window.storageManager.data.settings.lang === 'ar';

        const scoreEl = document.getElementById('mpc-iq-score');
        const badgeTitle = document.getElementById('mpc-rank-title');
        const badgeIcon = document.getElementById('mpc-rank-icon');
        const descEl = document.getElementById('mpc-rank-desc');
        const playerNameEl = document.getElementById('mpc-player-name');
        const lvlEl = document.getElementById('mpc-stat-levels');
        const starsEl = document.getElementById('mpc-stat-stars');
        const comboEl = document.getElementById('mpc-stat-combo');
        const accEl = document.getElementById('mpc-stat-accuracy');
        const progressFill = document.getElementById('mpc-rank-progress-bar');
        const nextHint = document.getElementById('mpc-rank-next-hint');

        if (scoreEl) scoreEl.textContent = iqData.iq;
        if (badgeTitle) badgeTitle.textContent = isAr ? iqData.rankAr : iqData.rankEn;
        if (badgeIcon) badgeIcon.textContent = iqData.rankIcon;
        if (descEl) descEl.textContent = isAr ? (iqData.descAr || 'أداء واعد في بداية رحلة المتاهات') : (iqData.descEn || 'Promising start in the maze journey');
        const savedPlayerName = window.storageManager.getPlayerName();
        if (playerNameEl) playerNameEl.textContent = savedPlayerName;
        if (lvlEl) lvlEl.textContent = iqData.totalSolved;
        if (starsEl) starsEl.textContent = iqData.totalStars;
        if (comboEl) comboEl.textContent = `x${iqData.bestCombo}`;
        if (accEl) accEl.textContent = `${iqData.accuracy}%`;

        // Mini Rank Progression Bar & Next Rank Hint
        if (progressFill) {
            progressFill.style.width = `${iqData.progressPct}%`;
        }
        if (nextHint) {
            if (iqData.solved >= 5000) {
                nextHint.textContent = isAr ? 'القمة المطلقة 👑✨' : 'Max Rank Achieved 👑✨';
            } else {
                nextHint.textContent = isAr
                    ? `متبقي ${iqData.levelsNeeded} مرحلة لرتبة ${iqData.nextRankIcon} ${iqData.nextRankAr}`
                    : `${iqData.levelsNeeded} levels to ${iqData.nextRankIcon} ${iqData.nextRankEn}`;
            }
        }
    }

    initMenuAmbientCanvas() {
        const canvas = document.getElementById('menu-ambient-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width || window.innerWidth;
            height = rect.height || window.innerHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            if (typeof ctx.resetTransform === 'function') {
                ctx.resetTransform();
            } else {
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
            ctx.scale(dpr, dpr);
        };
        resize();
        window.addEventListener('resize', resize);

        const particleColors = [
            'rgba(0, 240, 255, ',    // neon cyan
            'rgba(168, 85, 247, ',   // neon purple
            'rgba(255, 215, 0, ',    // neon gold
            'rgba(0, 255, 136, ',    // neon emerald
            'rgba(255, 0, 128, '     // neon pink
        ];

        const particleCount = 26;
        const particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * (width || 360),
                y: Math.random() * (height || 640),
                radius: 1.2 + Math.random() * 2.2,
                colorPrefix: particleColors[Math.floor(Math.random() * particleColors.length)],
                vx: (Math.random() - 0.5) * 0.3,
                vy: -(0.2 + Math.random() * 0.4),
                alpha: 0.15 + Math.random() * 0.35,
                alphaSpeed: 0.006 + Math.random() * 0.01,
                pulseDirection: Math.random() > 0.5 ? 1 : -1,
                wobbleAngle: Math.random() * Math.PI * 2,
                wobbleSpeed: 0.015 + Math.random() * 0.02
            });
        }

        const render = () => {
            const menuScreen = document.getElementById('screen-menu');
            if (menuScreen && menuScreen.classList.contains('active')) {
                ctx.clearRect(0, 0, width, height);

                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    p.wobbleAngle += p.wobbleSpeed;
                    p.x += p.vx + Math.sin(p.wobbleAngle) * 0.25;
                    p.y += p.vy;

                    p.alpha += p.alphaSpeed * p.pulseDirection;
                    if (p.alpha >= 0.55) {
                        p.alpha = 0.55;
                        p.pulseDirection = -1;
                    } else if (p.alpha <= 0.12) {
                        p.alpha = 0.12;
                        p.pulseDirection = 1;
                    }

                    if (p.y < -10) {
                        p.y = height + 10;
                        p.x = Math.random() * width;
                    }
                    if (p.x < -10) p.x = width + 10;
                    if (p.x > width + 10) p.x = -10;

                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = p.colorPrefix + p.alpha + ')';
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = p.colorPrefix + (p.alpha * 0.8) + ')';
                    ctx.fill();
                    ctx.restore();

                    for (let j = i + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        const dx = p.x - p2.x;
                        const dy = p.y - p2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 60) {
                            const lineAlpha = (1 - dist / 60) * 0.1;
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
                            ctx.lineWidth = 0.6;
                            ctx.stroke();
                        }
                    }
                }
            }

            if (this.currentScreen && this.currentScreen !== 'screen-menu') {
                requestAnimationFrame(render);
                return;
            }

            requestAnimationFrame(render);
        };

        requestAnimationFrame(render);
    }

    animateNumberRollUp(el, start, end, duration = 650, formatFn = (v) => v) {
        if (!el) return;
        const startTime = performance.now();
        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * easeOut);
            el.textContent = formatFn(current);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = formatFn(end);
            }
        };
        requestAnimationFrame(update);
    }

    getUnclaimedAchievementsCount() {
        const storage = window.storageManager;
        if (!storage) return 0;
        const catalog = this.getAchievementsCatalog();
        let unclaimed = 0;
        catalog.forEach(ach => {
            if (storage.isAchievementClaimed(ach.id)) return;
            const prog = ach.getProgress(storage);
            if (storage.isAchievementUnlocked(ach.id) || (prog.current >= prog.target)) {
                unclaimed++;
            }
        });
        return unclaimed;
    }

    updateAchievementsBadge() {
        const badge = document.getElementById('achievements-badge');
        if (!badge) return;
        const count = this.getUnclaimedAchievementsCount();
        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    // 1. Level Select Grid Rendering (5000 Levels Across 100 Worlds)
    renderLevelSelectGrid() {
        const container = document.getElementById('levels-grid-container');
        if (!container) return;
        container.innerHTML = '';

        const storage = window.storageManager;
        const maxUnlocked = storage.data.maxUnlockedLevel || 1;
        const playerCurrent = storage.data.currentLevel || 1;
        const isAr = (storage.data.settings.lang === 'ar');

        // Update current stage section
        const stageNumEl = document.getElementById('current-stage-number');
        if (stageNumEl) {
            stageNumEl.textContent = isAr ? `المرحلة ${playerCurrent}` : `Level ${playerCurrent}`;
        }

        const totalWorlds = window.WorldCatalog ? window.WorldCatalog.getTotalWorlds() : 100;
        if (this.selectedWorldIndex === undefined || this.selectedWorldIndex === null) {
            this.selectedWorldIndex = Math.min(totalWorlds - 1, Math.max(0, Math.floor((playerCurrent - 1) / 50)));
        } else {
            this.selectedWorldIndex = Math.min(totalWorlds - 1, Math.max(0, this.selectedWorldIndex));
        }

        const currentWorld = window.WorldCatalog ? window.WorldCatalog.getWorld(this.selectedWorldIndex, storage.data.settings.lang) : { startLevel: 1, endLevel: 50, name: isAr ? 'عالم النيون' : 'Neon World', icon: '🔷', color: '#00f3ff', worldNumber: 1 };
        const startLvl = currentWorld.startLevel;
        const endLvl = currentWorld.endLevel;
        const count = endLvl - startLvl + 1; // 50 levels per world

        // Distinct per-world tint on the level select screen
        const levelsScreen = document.getElementById('screen-levels');
        if (levelsScreen && currentWorld.color) {
            levelsScreen.style.setProperty('--world-color', currentWorld.color);
            levelsScreen.style.background = `radial-gradient(circle at 50% 15%, ${currentWorld.color}33 0%, #070b14 75%)`;
        }

        // Render World Chips (Smart sliding window around selected world)
        const chipContainer = document.getElementById('worlds-chip-container');
        if (chipContainer && window.WorldCatalog) {
            chipContainer.innerHTML = '';

            // Compute sliding window: e.g. active ± 4
            let winStart = Math.max(0, this.selectedWorldIndex - 4);
            let winEnd = Math.min(totalWorlds - 1, winStart + 8);
            if (winEnd - winStart < 8) {
                winStart = Math.max(0, winEnd - 8);
            }

            const indices = [];
            for (let i = winStart; i <= winEnd; i++) {
                indices.push(i);
            }

            indices.forEach(idx => {
                const w = window.WorldCatalog.getWorld(idx, storage.data.settings.lang);
                const chip = document.createElement('button');
                const isSelected = (idx === this.selectedWorldIndex);
                chip.className = `world-chip-btn ${isSelected ? 'active' : ''}`;
                chip.innerHTML = `<span>${w.icon}</span> <span>${w.name}</span>`;
                if (isSelected && w.color) {
                    chip.style.borderColor = w.color;
                    chip.style.boxShadow = `0 0 10px ${w.color}60`;
                }
                chip.addEventListener('click', () => {
                    this.selectedWorldIndex = idx;
                    this.renderLevelSelectGrid();
                });
                chipContainer.appendChild(chip);
            });

            // Smooth scroll active chip into view
            const activeChip = chipContainer.querySelector('.world-chip-btn.active');
            if (activeChip) {
                activeChip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }

        const isTestMode = storage && typeof storage.isTestModeActive === 'function' ? storage.isTestModeActive() : false;

        // Populate 50 level cards for the selected world
        for (let i = 0; i < count; i++) {
            const lvl = startLvl + i;
            const isUnlocked = isTestMode || (lvl <= maxUnlocked);
            const rec = storage.getLevelRecord(lvl);
            const stars = rec ? rec.stars : 0;
            const isBoss = (lvl % 10 === 0);

            const card = document.createElement('button');
            const isCur = (lvl === playerCurrent);
            card.className = `level-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCur ? 'current' : ''} ${isBoss ? 'boss-card' : ''}`;

            if (isUnlocked) {
                let starsHtml = '';
                for (let s = 1; s <= 3; s++) {
                    starsHtml += `<span class="star-mini ${s <= stars ? 'active' : ''}">★</span>`;
                }
                const bossTag = isBoss ? `<span class="boss-level-crown">👑</span>` : '';
                card.innerHTML = `
                    ${bossTag}
                    <span class="level-number">${lvl}</span>
                    <div class="level-stars-mini">${starsHtml}</div>
                `;
                card.addEventListener('click', () => {
                    this.showScreen('screen-game');
                    window.gameManager.startLevel(lvl, 'normal');
                });
            } else {
                const bossTag = isBoss ? `<span class="boss-level-crown">👑</span>` : '';
                card.innerHTML = `
                    ${bossTag}
                    <span class="level-number">${lvl}</span>
                    <span class="lock-icon">🔒</span>
                `;
            }
            container.appendChild(card);
        }

        // Total stars summary out of 15000 (5000 levels * 3 stars)
        const starCountEl = document.getElementById('level-select-stars-summary');
        if (starCountEl) {
            starCountEl.textContent = `⭐ ${storage.getTotalStars()}/15000`;
        }
    }

    openWorldPickerModal() {
        const modal = document.getElementById('modal-world-picker');
        if (!modal) return;
        this.renderWorldPickerGrid();
        modal.classList.add('active');
        const input = document.getElementById('input-world-search');
        if (input) {
            input.value = '';
            input.focus();
        }
    }

    closeWorldPickerModal() {
        const modal = document.getElementById('modal-world-picker');
        if (modal) modal.classList.remove('active');
    }

    renderWorldPickerGrid(searchQuery = null) {
        const grid = document.getElementById('world-picker-grid');
        if (!grid || !window.WorldCatalog) return;
        grid.innerHTML = '';

        const storage = window.storageManager;
        const maxUnlocked = storage ? (storage.data.maxUnlockedLevel || 1) : 1;
        const totalWorlds = window.WorldCatalog.getTotalWorlds();
        const lang = storage ? storage.data.settings.lang : 'ar';

        for (let i = 0; i < totalWorlds; i++) {
            const w = window.WorldCatalog.getWorld(i, lang);
            if (searchQuery !== null && searchQuery !== undefined && searchQuery !== '') {
                const q = String(searchQuery).trim().toLowerCase();
                const matchAr = w.nameAr && w.nameAr.toLowerCase().includes(q);
                const matchEn = w.nameEn && w.nameEn.toLowerCase().includes(q);
                const matchName = w.name && w.name.toLowerCase().includes(q);
                if (q && !matchAr && !matchEn && !matchName) continue;
            }

            const isUnlocked = (w.startLevel <= maxUnlocked);
            const isCurrent = (i === this.selectedWorldIndex);

            const card = document.createElement('div');
            card.className = `world-picker-card ${isCurrent ? 'active' : ''}`;
            if (isCurrent && w.color) {
                card.style.borderColor = w.color;
            }

            card.innerHTML = `
                <div class="world-picker-card-header">
                    <span class="world-picker-card-icon">${w.icon}</span>
                    ${isUnlocked ? '' : '<span class="world-picker-card-num">🔒</span>'}
                </div>
                <div class="world-picker-card-title" style="color: ${w.color};">${w.name}</div>
            `;

            card.addEventListener('click', () => {
                this.selectedWorldIndex = i;
                this.closeWorldPickerModal();
                this.renderLevelSelectGrid();
            });

            grid.appendChild(card);
        }
    }



    // 3. Level Complete Modal
    showLevelCompleteScreen({ level, stars, moves, targetMoves, bestResult, coinsEarned, multiplier, isBoss }) {
        const modal = document.getElementById('modal-level-complete');
        if (!modal) return;

        const isAr = (window.storageManager.data.settings.lang === 'ar');

        // Set Texts (Boss celebratory fanfare if boss level)
        if (isBoss) {
            document.getElementById('complete-title').textContent = isAr ? '👑 انتصار الزعيم الأسطوري! 👑' : '👑 BOSS CONQUERED! 👑';
            document.getElementById('complete-subtitle').textContent = isAr ? `تم سحق الزعيم واكتمل المستوى ${level}!` : `Boss crushed and Level ${level} solved!`;
        } else {
            document.getElementById('complete-title').textContent = this.t('wellDone');
            document.getElementById('complete-subtitle').textContent = isAr ? `اكتمل المستوى ${level} بنجاح! ⭐` : `Level ${level} Complete! ⭐`;
        }

        // Stars animation
        const starsContainer = document.getElementById('complete-stars');
        starsContainer.innerHTML = '';
        for (let s = 1; s <= 3; s++) {
            const starEl = document.createElement('div');
            starEl.className = `complete-star ${s <= stars ? 'active' : ''}`;
            starEl.style.animationDelay = `${s * 0.2}s`;
            starEl.innerHTML = '★';
            starsContainer.appendChild(starEl);
        }

        // Mastery badge
        const masteryBadge = document.getElementById('victory-mastery-badge');
        const masteryIcon = document.getElementById('victory-mastery-icon');
        const masteryText = document.getElementById('victory-mastery-text');
        if (masteryBadge && masteryText) {
            let mIcon = '⚡';
            let mText = isAr ? 'سرعة استثنائية (حركات مثالية!)' : 'Flawless Execution (Optimal Moves!)';
            if (isBoss) {
                mIcon = '👑';
                mText = isAr ? 'انتصار أسطوري على الزعيم!' : 'Legendary Boss Victory!';
            } else if (moves <= targetMoves) {
                mIcon = '⚡';
                mText = isAr ? 'سرعة استثنائية (حركات مثالية!)' : 'Flawless Execution (Optimal Moves!)';
            } else if (stars === 3) {
                mIcon = '🎯';
                mText = isAr ? 'دقة تكتيكية خارقة (3 نجوم)' : 'Tactical Precision (3 Stars)';
            } else if (stars === 2) {
                mIcon = '🛡️';
                mText = isAr ? 'حل تكتيكي استراتيجي' : 'Strategic Solution';
            } else {
                mIcon = '🏅';
                mText = isAr ? 'إصرار وعبور ناجح' : 'Maze Cleared';
            }
            if (masteryIcon) masteryIcon.textContent = mIcon;
            masteryText.textContent = mText;
            masteryBadge.style.display = 'inline-flex';
        }

        // Stats card values
        document.getElementById('stat-moves-val').textContent = moves;
        document.getElementById('stat-target-val').textContent = targetMoves;
        
        // Tactical IQ Gain
        const iqGainEl = document.getElementById('stat-iq-gain');
        if (iqGainEl) {
            const iqVal = isBoss ? 5 : (stars === 3 ? 3 : (stars === 2 ? 2 : 1));
            iqGainEl.textContent = `+${iqVal} IQ 🧠`;
        }
        
        const rewardLabel = document.querySelector('#modal-level-complete [data-i18n="reward"]');
        if (rewardLabel) {
            rewardLabel.textContent = this.t('reward') + ':';
        }

        const coinsEarnedEl = document.getElementById('stat-coins-earned');
        if (coinsEarnedEl) {
            const earnedAmount = coinsEarned || (isBoss ? 50 : 25);
            this.animateNumberRollUp(coinsEarnedEl, 0, earnedAmount, 650, (val) => {
                if (isBoss) {
                    return isAr ? `+${val} 🪙 مكافأة الزعيم x2 👑` : `+${val} 🪙 Boss Bonus x2 👑`;
                } else if (multiplier && multiplier > 1) {
                    return isAr ? `+${val} 🪙 مضاعف x${multiplier}` : `+${val} 🪙 Multiplier x${multiplier}`;
                } else {
                    return `+${val} 🪙`;
                }
            });
        }

        this.lastEarnedCoins = coinsEarned || 35;
        const doubleBtn = document.getElementById('btn-complete-double-reward');
        if (doubleBtn) {
            doubleBtn.disabled = false;
            doubleBtn.style.opacity = '1';
            doubleBtn.innerHTML = isAr ? `🎬 ضاعف المكافأة x2 - +${this.lastEarnedCoins} 🪙 إضافية` : `🎬 Double Reward - +${this.lastEarnedCoins} 🪙`;
        }

        // Update all action button texts to active language
        const nextBtn = document.getElementById('btn-complete-next');
        if (nextBtn) nextBtn.textContent = this.t('nextLevel');
        const retryBtn = document.getElementById('btn-complete-retry');
        if (retryBtn) retryBtn.textContent = this.t('retry');
        const homeBtn = document.getElementById('btn-complete-home');
        if (homeBtn) homeBtn.textContent = this.t('home');

        // Tactile victory haptic
        window.soundEngine.vibrate([40, 80, 50, 100]);

        // Launch celebratory confetti burst
        this.spawnVictoryConfetti();

        modal.classList.add('active');
        this.updateHeaderStats();
    }

    spawnVictoryConfetti() {
        // 1. High-Performance Canvas Fireworks inside Dialog Box
        const canvas = document.getElementById('victory-confetti-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = rect.width || 320;
            const h = rect.height || 420;
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            if (typeof ctx.resetTransform === 'function') {
                ctx.resetTransform();
            } else {
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
            ctx.scale(dpr, dpr);

            const colors = ['#00f0ff', '#ffd700', '#ff007f', '#00ff88', '#a855f7', '#ffffff', '#ff9500'];
            const particles = [];
            const particleCount = 60;
            const startX = w / 2;
            const startY = h * 0.45;

            for (let i = 0; i < particleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 4 + Math.random() * 7;
                particles.push({
                    x: startX + (Math.random() - 0.5) * 30,
                    y: startY + (Math.random() - 0.5) * 30,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 3.5,
                    size: 4 + Math.random() * 5,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    shape: Math.random() > 0.35 ? 'rect' : 'circle',
                    rotation: Math.random() * 360,
                    rotationSpeed: (Math.random() - 0.5) * 12,
                    gravity: 0.18 + Math.random() * 0.08,
                    drag: 0.965,
                    opacity: 1,
                    decay: 0.01 + Math.random() * 0.008
                });
            }

            const animate = () => {
                ctx.clearRect(0, 0, w, h);
                let alive = 0;
                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    if (p.opacity <= 0.01) continue;
                    alive++;

                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += p.gravity;
                    p.vx *= p.drag;
                    p.vy *= p.drag;
                    p.rotation += p.rotationSpeed;
                    p.opacity = Math.max(0, p.opacity - p.decay);

                    ctx.save();
                    ctx.globalAlpha = p.opacity;
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;

                    if (p.shape === 'rect') {
                        ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 1.5);
                    } else {
                        ctx.beginPath();
                        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();
                }

                if (alive > 0) {
                    requestAnimationFrame(animate);
                } else {
                    ctx.clearRect(0, 0, w, h);
                }
            };
            requestAnimationFrame(animate);
        }

        // 2. Full-Screen HTML Overlay Confetti Fallback
        const container = document.getElementById('confetti-container');
        if (!container) return;
        container.innerHTML = '';

        const colors = ['#00f0ff', '#ff9500', '#ffd700', '#00ff66', '#ff2a85', '#b026ff', '#ffffff'];
        const shapes = ['confetti-rect', 'confetti-circle', 'confetti-star'];

        for (let i = 0; i < 40; i++) {
            const el = document.createElement('div');
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            el.className = `victory-confetti-particle ${shape}`;

            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const size = 6 + Math.random() * 8;
            const driftX = (Math.random() - 0.5) * 120;
            const duration = 2.2 + Math.random() * 1.8;
            const delay = Math.random() * 0.45;

            el.style.left = `${left}%`;
            el.style.top = `-20px`;
            el.style.width = `${size}px`;
            el.style.height = (shape === 'confetti-rect') ? `${size * 1.6}px` : `${size}px`;
            el.style.backgroundColor = (shape !== 'confetti-star') ? color : 'transparent';
            el.style.setProperty('--drift-x', `${driftX}px`);
            el.style.animationDuration = `${duration}s`;
            el.style.animationDelay = `${delay}s`;

            if (shape === 'confetti-star') {
                el.textContent = '★';
                el.style.color = color;
                el.style.fontSize = `${size * 1.4}px`;
            }

            container.appendChild(el);
        }

        setTimeout(() => {
            if (container) container.innerHTML = '';
        }, 4600);
    }

    // ==========================================
    // DAILY LUCKY SPIN WHEEL (عجلة الحظ اليومية)
    // ==========================================
    openLuckySpinModal() {
        if (window.soundEngine) window.soundEngine.playClick();
        const modal = document.getElementById('modal-lucky-spin');
        if (!modal) return;
        modal.classList.add('active');

        this.initLuckyWheel();
    }

    closeLuckySpinModal() {
        if (this._wheelSpinning) return;
        const modal = document.getElementById('modal-lucky-spin');
        if (modal) modal.classList.remove('active');
    }

    initLuckyWheel() {
        this.wheelSlices = [
            { text: '+50 🪙', label: '50 عملة', labelAr: '50 عملة', labelEn: '50 Coins', type: 'coins', amount: 50, color: '#092338', icon: '🪙' },
            { text: '💡 1', label: '1 تلميح', labelAr: '1 تلميح', labelEn: '1 Hint', type: 'hint', amount: 1, color: '#1a103c', icon: '💡' },
            { text: '+25 🪙', label: '25 عملة', labelAr: '25 عملة', labelEn: '25 Coins', type: 'coins', amount: 25, color: '#0a3038', icon: '🪙' },
            { text: '⚡ 1', label: '1 ليزر', labelAr: '1 ليزر', labelEn: '1 Laser', type: 'laser', amount: 1, color: '#300d38', icon: '⚡' },
            { text: '+100 🪙', label: '100 عملة', labelAr: '100 عملة', labelEn: '100 Coins', type: 'coins', amount: 100, color: '#092338', icon: '🪙' },
            { text: '💡 2', label: '2 تلميح', labelAr: '2 تلميح', labelEn: '2 Hints', type: 'hint', amount: 2, color: '#1a103c', icon: '💡' },
            { text: '+75 🪙', label: '75 عملة', labelAr: '75 عملة', labelEn: '75 Coins', type: 'coins', amount: 75, color: '#0a3038', icon: '🪙' },
            { text: '🏆 250', label: 'جاكبوت 250 🪙', labelAr: 'جاكبوت 250 🪙', labelEn: 'Jackpot 250 Coins 🏆', type: 'coins', amount: 250, color: '#453000', icon: '👑' }
        ];

        if (this._wheelAngle === undefined) this._wheelAngle = 0;
        this.drawLuckyWheel(this._wheelAngle);

        const storage = window.storageManager;
        const today = new Date().toISOString().slice(0, 10);
        const alreadySpun = (storage.data.lastDailySpinDate === today);
        const spinBtn = document.getElementById('btn-spin-wheel');
        const resEl = document.getElementById('lucky-wheel-result');
        if (resEl) resEl.style.display = 'none';

        if (spinBtn) {
            const isAr = (storage.data.settings.lang === 'ar');
            if (alreadySpun) {
                spinBtn.innerHTML = isAr ? '🎬 تدوير إضافي (شاهد إعلان)' : '🎬 Extra Spin (Watch Ad)';
                spinBtn.className = 'btn-modal-action reward-ad-btn';
            } else {
                spinBtn.innerHTML = isAr ? '🎡 تدوير مجاني اليوم!' : '🎡 Free Daily Spin!';
                spinBtn.className = 'btn-modal-action primary-cyan';
            }
            spinBtn.disabled = false;
            spinBtn.style.opacity = '1';
        }
    }

    drawLuckyWheel(angle) {
        const canvas = document.getElementById('lucky-wheel-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = cx - 6;
        const numSlices = this.wheelSlices.length;
        const sliceAngle = (2 * Math.PI) / numSlices;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < numSlices; i++) {
            const startA = angle + i * sliceAngle;
            const endA = startA + sliceAngle;
            const slice = this.wheelSlices[i];

            // Slice arc
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, startA, endA);
            ctx.closePath();
            ctx.fillStyle = slice.color;
            ctx.fill();

            // Neon dividing line
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label text
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(startA + sliceAngle / 2);
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 15px sans-serif';
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 8;
            ctx.fillText(slice.text, radius - 20, 0);
            ctx.restore();
        }

        // Outer glow rim
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 5;
        ctx.stroke();
    }

    spinLuckyWheel() {
        if (this._wheelSpinning) return;
        const storage = window.storageManager;
        const today = new Date().toISOString().slice(0, 10);
        const alreadySpun = (storage.data.lastDailySpinDate === today);

        if (alreadySpun) {
            // Watch ad for extra spin
            this.triggerRewardedAd('daily_spin');
            return;
        }

        this.executeSpinAnimation();
    }

    executeSpinAnimation() {
        this._wheelSpinning = true;
        const spinBtn = document.getElementById('btn-spin-wheel');
        if (spinBtn) {
            spinBtn.disabled = true;
            spinBtn.style.opacity = '0.6';
        }

        const resEl = document.getElementById('lucky-wheel-result');
        if (resEl) resEl.style.display = 'none';

        const numSlices = this.wheelSlices.length;
        const sliceAngle = (2 * Math.PI) / numSlices;
        const winningIndex = Math.floor(Math.random() * numSlices);

        const targetRotations = 5 + Math.floor(Math.random() * 3);
        const targetStopAngle = (1.5 * Math.PI) - (winningIndex * sliceAngle + sliceAngle / 2);
        const finalAngle = targetRotations * 2 * Math.PI + targetStopAngle;

        const startAngle = this._wheelAngle % (2 * Math.PI);
        const totalDelta = finalAngle - startAngle;
        const duration = 4200; // ms
        const startTime = performance.now();
        let lastTickSlice = -1;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / duration);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            this._wheelAngle = startAngle + totalDelta * easeOut;

            // Audio tick on slice crossing
            const curSlice = Math.floor((this._wheelAngle / sliceAngle) % numSlices);
            if (curSlice !== lastTickSlice) {
                lastTickSlice = curSlice;
                window.soundEngine.playWheelTick();
            }

            this.drawLuckyWheel(this._wheelAngle);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this._wheelSpinning = false;
                this.finalizeWheelPrize(winningIndex);
            }
        };

        requestAnimationFrame(animate);
    }

    finalizeWheelPrize(winningIndex) {
        const slice = this.wheelSlices[winningIndex];
        const storage = window.storageManager;
        const isAr = (storage.data.settings.lang === 'ar');
        const today = new Date().toISOString().slice(0, 10);

        storage.data.lastDailySpinDate = today;

        if (slice.type === 'coins') {
            storage.addCoins(slice.amount);
        } else if (slice.type === 'hint') {
            storage.addHints(slice.amount);
            if (window.gameManager) window.gameManager.updateBadges();
        } else if (slice.type === 'laser') {
            storage.addLasers(slice.amount);
            if (window.gameManager) window.gameManager.updateBadges();
        }

        storage.save();
        storage.updateMissionProgress('spins', 1);
        this.updateHeaderStats();

        window.soundEngine.playWheelWin();
        window.soundEngine.vibrate([60, 40, 80, 50, 120]);
        this.spawnVictoryConfetti();

        const resEl = document.getElementById('lucky-wheel-result');
        if (resEl) {
            resEl.style.display = 'block';
            resEl.innerHTML = isAr 
                ? `🎉 مبروك! ربحت ${slice.labelAr || slice.label}!` 
                : `🎉 Congratulations! Won ${slice.labelEn || slice.text}!`;
        }

        const spinBtn = document.getElementById('btn-spin-wheel');
        if (spinBtn) {
            spinBtn.innerHTML = isAr ? '🎬 تدوير إضافي (شاهد إعلان)' : '🎬 Extra Spin (Watch Ad)';
            spinBtn.className = 'btn-modal-action reward-ad-btn';
            spinBtn.disabled = false;
            spinBtn.style.opacity = '1';
        }
    }

    // 4. Level Failed Modal
    showLevelFailedScreen(reason = 'mistakes') {
        const modal = document.getElementById('modal-level-failed');
        if (!modal) return;

        const isAr = (window.storageManager.data.settings.lang === 'ar');
        const titleEl = document.getElementById('failed-title');
        const descEl = document.getElementById('failed-desc-text');
        if (titleEl) {
            if (reason === 'timeout') {
                titleEl.textContent = isAr ? '⏱️ انتهى الوقت المتاح!' : "⏱️ Time's Up!";
            } else {
                titleEl.textContent = isAr ? 'خسرت المرحلة!' : 'Level Failed!';
            }
        }
        if (descEl) {
            descEl.textContent = isAr 
                ? 'خسرت جميع النجوم بسبب 3 أخطاء! يمكنك إعادة المحاولة أو مشاهدة إعلان للاستئناف من آخر حركة ⭐⭐⭐'
                : 'Lost all stars after 3 mistakes! You can retry or watch an ad to resume from your last move ⭐⭐⭐';
        }

        modal.classList.add('active');
    }

    // 4.5 Ad Offer Modal (When hints or lasers run out or insufficient coins)
    showAdOfferModal(type, extraParam = null, itemName = '') {
        this.pendingAdOfferType = type;
        const modal = document.getElementById('modal-ad-offer');
        if (!modal) return;

        const iconEl = document.getElementById('ad-offer-icon');
        const titleEl = document.getElementById('ad-offer-title');
        const descEl = document.getElementById('ad-offer-desc');
        const watchBtn = document.getElementById('btn-ad-offer-watch');
        const isAr = (window.storageManager.data.settings.lang === 'ar');

        if (type === 'hint') {
            if (iconEl) iconEl.textContent = '💡';
            if (titleEl) titleEl.textContent = isAr ? 'تلميح ذكي!' : 'Smart Hint!';
            if (descEl) descEl.textContent = isAr 
                ? 'رصيدك الحالي 0. شاهد إعلاناً قصيراً للحصول على 1 تلميح 💡 واستخدامه متى أردت!'
                : 'You have 0 hints. Watch a quick ad to get 1 hint 💡 and use it anytime!';
            if (watchBtn) watchBtn.innerHTML = isAr ? '🎬 شاهد إعلاناً واحصل على تلميح 💡' : '🎬 Watch Ad & Get Hint 💡';
        } else if (type === 'laser') {
            if (iconEl) iconEl.textContent = '⚡';
            if (titleEl) titleEl.textContent = isAr ? 'ليزر صاعق!' : 'Laser Zap!';
            if (descEl) descEl.textContent = isAr 
                ? 'رصيدك الحالي 0. شاهد إعلاناً قصيراً للحصول على 1 ليزر صاعق ⚡ واستخدامه متى أردت!'
                : 'You have 0 lasers. Watch a quick ad to get 1 laser zap ⚡ and use it anytime!';
            if (watchBtn) watchBtn.innerHTML = isAr ? '🎬 شاهد إعلاناً واحصل على ليزر ⚡' : '🎬 Watch Ad & Get Laser ⚡';
        } else if (type === 'xray') {
            if (iconEl) iconEl.textContent = '👁️';
            if (titleEl) titleEl.textContent = isAr ? 'عين الصقر الكاشفة!' : 'Hawk Eye Vision!';
            if (descEl) descEl.textContent = isAr 
                ? 'رصيدك الحالي 0. شاهد إعلاناً قصيراً للحصول على عين الصقر 👁️ واستخدامها متى أردت!'
                : 'You have 0 Hawk Eye. Watch a quick ad to get 1 Hawk Eye 👁️ and use it anytime!';
            if (watchBtn) watchBtn.innerHTML = isAr ? '🎬 شاهد إعلاناً واحصل على عين الصقر 👁️' : '🎬 Watch Ad & Get Hawk Eye 👁️';
        } else if (type === 'coins') {
            const neededText = extraParam ? (isAr ? ` (ينقصك ${extraParam} 🪙)` : ` (Need ${extraParam} more 🪙)`) : '';
            if (iconEl) iconEl.textContent = '🪙';
            if (titleEl) titleEl.textContent = isAr ? 'رصيد العملات غير كافٍ!' : 'Not Enough Coins!';
            if (descEl) descEl.textContent = isAr 
                ? `ليس لديك عملات كافية لشراء ${itemName ? `"${itemName}"` : 'هذا المظهر'}${neededText}! شاهد إعلاناً قصيراً واحصل على +50 🪙 فوراً.`
                : `Not enough coins to buy ${itemName ? `"${itemName}"` : 'this skin'}${neededText}! Watch a quick ad to get +50 coins instantly.`;
            if (watchBtn) watchBtn.innerHTML = isAr ? '🎬 شاهد إعلاناً واحصل على +50 🪙' : '🎬 Watch Ad & Get +50 🪙';
        }

        modal.classList.add('active');
    }

    // 5. Rewarded Ad Trigger
    triggerRewardedAd(rewardType = 'attempt') {
        this.currentAdRewardType = rewardType;

        // Close offer modal if open
        const offerModal = document.getElementById('modal-ad-offer');
        if (offerModal) offerModal.classList.remove('active');

        // Check if running in Native Android APK with Google AdMob
        if (window.AndroidNative && typeof window.AndroidNative.showRewardedAd === 'function') {
            window.AndroidNative.showRewardedAd(rewardType);
            return;
        }

        // STRICT REQUIREMENT: NEVER GRANT REWARD WITHOUT WATCHING AD!
        const isAr = (window.storageManager?.data?.settings?.lang === 'ar');
        this.showToast(isAr 
            ? 'مشاهدة الإعلانات وكسب المكافآت متاحة داخل تطبيق اللعبة عند الاتصال بالإنترنت! (لم يتم منح أي مكافأة)' 
            : 'Rewarded ads are only available inside the Android app with internet! (No reward granted)');
    }

    completeRewardedAd(forcedType = null) {

        const isAr = (window.storageManager.data.settings.lang === 'ar');
        const rewardType = forcedType || this.currentAdRewardType || 'attempt';

        if (rewardType === 'hint') {
            window.storageManager.addHints(1);
            if (window.gameManager) window.gameManager.updateBadges();
            window.soundEngine.playReward();
            this.showToast(isAr ? 'تمت مشاهدة الإعلان! أصبح لديك 1 تلميح 💡 اضغط عليه متى أردت!' : 'Ad completed! 1 hint ready 💡 Tap to use anytime!');
        } else if (rewardType === 'laser') {
            window.storageManager.addLasers(1);
            if (window.gameManager) window.gameManager.updateBadges();
            window.soundEngine.playReward();
            this.showToast(isAr ? 'تمت مشاهدة الإعلان! أصبح لديك 1 ليزر صاعق ⚡ اضغط عليه متى أردت!' : 'Ad completed! 1 laser zap ready ⚡ Tap to use anytime!');
        } else if (rewardType === 'xray') {
            window.storageManager.addXrays(1);
            if (window.gameManager) window.gameManager.updateBadges();
            window.soundEngine.playReward();
            this.showToast(isAr ? 'تمت مشاهدة الإعلان! أصبحت لديك عين الصقر 👁️ اضغط عليها متى أردت!' : 'Ad completed! Hawk Eye ready 👁️ Tap to use anytime!');
        } else if (rewardType === 'coins') {
            window.storageManager.addCoins(50);
            this.updateHeaderStats();
            window.soundEngine.playReward();
            this.showToast(isAr ? 'تمت مشاهدة الإعلان! حصلت على +50 🪙 🎉' : 'Ad completed! +50 coins granted 🎉');
            if (this.currentScreen === 'screen-themes') {
                this.switchStoreTab(this.activeStoreTab || 'themes');
            }

        } else if (rewardType === 'double_coins') {
            const earned = this.lastEarnedCoins || 35;
            window.storageManager.addCoins(earned);
            this.updateHeaderStats();
            window.soundEngine.playReward();
            this.showToast(isAr ? `🎉 تمت مضاعفة المكافأة بنجاح! +${earned} 🪙 إضافية!` : `🎉 Double Coins! +${earned} bonus coins!`);
            const doubleBtn = document.getElementById('btn-complete-double-reward');
            if (doubleBtn) {
                doubleBtn.disabled = true;
                doubleBtn.style.opacity = '0.5';
                doubleBtn.innerHTML = isAr ? '✅ تمت المضاعفة!' : '✅ Doubled!';
            }
        } else if (rewardType === 'daily_spin') {
            this.showToast(isAr ? 'تمت مشاهدة الإعلان! تدوير إضافي فوري 🎡' : 'Ad watched! Extra spin granted 🎡');
            setTimeout(() => {
                this.executeSpinAnimation();
            }, 300);
        } else if (rewardType === 'failed_home') {
            // Close failed modal
            const failedModal = document.getElementById('modal-level-failed');
            if (failedModal) failedModal.classList.remove('active');
            if (window.gameManager) window.gameManager.isGameOver = false;
            this.showScreen('screen-menu');
            this.showToast(isAr ? 'تمت مشاهدة الإعلان! العودة للقائمة الرئيسية' : 'Ad completed! Returned to menu');
        } else if (rewardType === 'failed_retry' || rewardType === 'attempt') {
            // Close failed modal
            const failedModal = document.getElementById('modal-level-failed');
            if (failedModal) failedModal.classList.remove('active');

            // Resume EXACTLY from the last move without restarting the whole level!
            if (window.gameManager) {
                window.gameManager.grantRewardedAttempt();
            }
            this.showToast(isAr ? 'تمت مشاهدة الإعلان! استئناف اللعب من آخر حركة مع 3 نجوم ⭐⭐⭐' : 'Ad watched! Resumed from last move with 3 stars ⭐⭐⭐');
        } else {
            const failedModal = document.getElementById('modal-level-failed');
            if (failedModal) failedModal.classList.remove('active');
            if (window.gameManager) {
                window.gameManager.isGameOver = false;
                window.gameManager.startLevel(window.gameManager.currentLevel, window.gameManager.gameMode);
            }
        }
    }

    // 6. Hint Dialog
    showHintDialog(message) {
        const modal = document.getElementById('modal-hint-dialog');
        if (!modal) return;
        document.getElementById('hint-dialog-text').textContent = message;
        modal.classList.add('active');
    }

    // Themes Store
    renderThemes() {
        const container = document.getElementById('themes-grid-container');
        if (!container) return;
        container.innerHTML = '';

        const storage = window.storageManager;
        const isAr = (storage.data.settings.lang === 'ar');

        const themes = this.getThemeCatalog().map(t => ({
            id: t.id,
            name: isAr ? t.name : (t.nameEn || t.id.charAt(0).toUpperCase() + t.id.slice(1)),
            desc: isAr ? t.desc : (t.descEn || ''),
            icon: t.icon,
            colors: [t.a, t.b],
            price: t.price
        }));

        themes.forEach(th => {
            const isOwned = (th.price === 0) || (storage.data.unlockedThemes && storage.data.unlockedThemes.includes(th.id));
            const isSelected = (storage.data.selectedTheme === th.id) || (th.id === 'cyber' && !storage.data.selectedTheme);

            let actionHtml = '';
            if (isSelected) {
                // Currently active theme: shows "مُستخدَم"
                actionHtml = `<button class="btn-theme-action active-theme" disabled>${isAr ? 'مُستخدَم' : 'In Use'}</button>`;
            } else if (isOwned) {
                // Owned but not equipped: ONLY the word "استخدام" per user prompt!
                actionHtml = `<button class="btn-theme-action btn-theme-equip" data-theme="${th.id}">${isAr ? 'استخدام' : 'Use'}</button>`;
            } else {
                // NOT owned: player MUST buy it with coins per user prompt!
                actionHtml = `<button class="btn-theme-action btn-theme-buy" data-theme="${th.id}" data-price="${th.price}">${isAr ? `شراء ${th.price}🪙` : `Buy ${th.price}🪙`}</button>`;
            }

            const card = document.createElement('div');
            card.className = `theme-card ${isSelected ? 'selected' : ''}`;
            card.innerHTML = `
                <div class="theme-preview" style="background: linear-gradient(135deg, ${th.colors[0]}, ${th.colors[1]}); position: relative;">
                    <span style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:1.1rem; filter: drop-shadow(0 0 4px rgba(0,0,0,0.6));">${th.icon}</span>
                    <span class="preview-dot" style="background: ${th.colors[0]}; box-shadow: 0 0 6px ${th.colors[0]};"></span>
                    <span class="preview-dot" style="background: ${th.colors[1]}; box-shadow: 0 0 6px ${th.colors[1]};"></span>
                </div>
                <div class="theme-info">
                    <div class="theme-name">${th.name}</div>
                    <div class="theme-desc">${th.desc}</div>
                </div>
                <div class="theme-action">
                    ${actionHtml}
                </div>
            `;

            // Equip button listener
            const equipBtn = card.querySelector('.btn-theme-equip');
            if (equipBtn) {
                equipBtn.addEventListener('click', () => {
                    storage.setTheme(th.id);
                    this.applyTheme(th.id);
                    this.renderThemes();
                    window.soundEngine.playClick();
                    this.showToast(isAr ? `تم استخدام مظهر: ${th.name}` : `Theme equipped: ${th.name}`);
                });
            }

            // Buy button listener
            const buyBtn = card.querySelector('.btn-theme-buy');
            if (buyBtn) {
                buyBtn.addEventListener('click', () => {
                    const price = th.price;
                    const currentCoins = storage.data.coins || 0;
                    if (currentCoins >= price) {
                        storage.data.coins -= price;
                        storage.unlockTheme(th.id);
                        storage.setTheme(th.id);
                        this.applyTheme(th.id);
                        storage.save();
                        this.updateHeaderStats();
                        this.renderThemes();
                        this.checkAchievements();
                        window.soundEngine.playReward();
                        this.showToast(isAr ? `تم شراء وتفعيل مظهر ${th.name} بنجاح! 🎉` : `Purchased & equipped ${th.name}! 🎉`);
                    } else {
                        window.soundEngine.playError();
                        const needed = price - currentCoins;
                        this.showAdOfferModal('coins', needed, th.name);
                    }
                });
            }

            container.appendChild(card);
        });
    }

    // Store Tab Switcher: Themes | Arrow Heads | Arrow Trails | Arrow Bodies
    switchStoreTab(tab) {
        this.activeStoreTab = tab;
        document.querySelectorAll('.store-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        const themesPane = document.getElementById('themes-grid-container');
        const headsPane = document.getElementById('heads-grid-container');
        const trailsPane = document.getElementById('trails-grid-container');
        const bodiesPane = document.getElementById('bodies-grid-container');

        if (themesPane) themesPane.style.display = (tab === 'themes') ? 'grid' : 'none';
        if (headsPane) headsPane.style.display = (tab === 'heads') ? 'grid' : 'none';
        if (trailsPane) trailsPane.style.display = (tab === 'trails') ? 'grid' : 'none';
        if (bodiesPane) bodiesPane.style.display = (tab === 'bodies') ? 'grid' : 'none';

        if (tab === 'themes') this.renderThemes();
        else if (tab === 'heads') this.renderArrowHeads();
        else if (tab === 'trails') this.renderArrowTrails();
        else if (tab === 'bodies') this.renderArrowBodies();
    }

    // Vector SVG Preview generator for Arrowheads in Store
    getHeadPreviewSvg(headId) {
        if (window.gameManager && typeof window.gameManager.renderHeadMeshSvg === 'function') {
            const mesh = window.gameManager.renderHeadMeshSvg(32, 20, 0, 'var(--neon-cyan)', 'none', 50, headId, false);
            return `
                <svg viewBox="0 -6 64 44" width="64" height="38" style="overflow: visible;">
                    <line x1="32" y1="40" x2="32" y2="20" stroke="var(--neon-cyan)" stroke-width="7" stroke-linecap="round" />
                    <line x1="32" y1="40" x2="32" y2="20" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
                    ${mesh}
                </svg>
            `;
        }
        return `<span style="font-size: 1.6rem; filter: drop-shadow(0 0 6px var(--neon-cyan));">🔺</span>`;
    }

    // Vector SVG Preview for Arrow Body styles in Store
    getBodyPreviewSvg(bodyId) {
        if (window.gameManager && typeof window.gameManager.generateArrowSVG === 'function') {
            const fake = {
                id: `preview-${bodyId}`,
                color: 'cyan',
                headDir: 1,
                segments: [{ r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 0, c: 2 }, { r: 0, c: 3 }]
            };
            const inner = window.gameManager.generateArrowSVG(fake, 50, { body: bodyId, noFilter: true })
                .replace(/id="arrow-group-[^"]*"/, '')
                .replace('maze-arrow-entity', 'store-arrow-preview')
                .replace(/data-arrow-id="[^"]*"/, '');
            return `<svg viewBox="0 0 200 100" width="80" height="40" style="overflow: visible;">${inner}</svg>`;
        }
        return `<span style="font-size: 1.5rem;">🐍</span>`;
    }

    // 8.1 Arrow Heads Customization Tab (6 complete heads in clean 3x2 grid)
    renderArrowHeads() {
        const container = document.getElementById('heads-grid-container');
        if (!container) return;
        container.innerHTML = '';

        const storage = window.storageManager;
        const isAr = (storage.data.settings.lang === 'ar');

        const heads = [
            { id: 'classic', name: isAr ? 'كلاسيكي' : 'Classic', icon: '🔺', desc: isAr ? 'سهم كلاسيكي متوهج' : 'Classic Arrow', price: 0 },
            { id: 'lightning', name: isAr ? 'صاعقة' : 'Lightning', icon: '⚡', desc: isAr ? 'طاقة كهربائية حادة' : 'Sharp Volt', price: 150 },
            { id: 'diamond', name: isAr ? 'ماسة' : 'Diamond', icon: '💎', desc: isAr ? 'كريستال مصقول' : 'Crystal Prism', price: 250 },
            { id: 'flame', name: isAr ? 'لهب' : 'Flame', icon: '🔥', desc: isAr ? 'لهب نيون حارق' : 'Neon Blaze', price: 350 },
            { id: 'blade', name: isAr ? 'شفرة نيون' : 'Neon Blade', icon: '🗡️', desc: isAr ? 'شفرة هوائية حادة' : 'Aero Blade', price: 450 },
            { id: 'plasma', name: isAr ? 'نجم بلازما' : 'Plasma Star', icon: '🌟', desc: isAr ? 'نجم طاقة كوني' : 'Cosmic Star', price: 600 },
            { id: 'snake', name: isAr ? 'رأس أفعى' : 'Snake', icon: '🐍', desc: isAr ? 'عيون حادة ولسان مشقوق' : 'Forked Tongue', price: 700 },
            { id: 'worm', name: isAr ? 'دودة لطيفة' : 'Cute Worm', icon: '🐛', desc: isAr ? 'وجه مبتسم ظريف' : 'Smiley Face', price: 700 },
            { id: 'heart', name: isAr ? 'قلب' : 'Heart', icon: '💖', desc: isAr ? 'قلب نيون نابض' : 'Neon Heart', price: 800 },
            { id: 'trident', name: isAr ? 'رمح ثلاثي' : 'Trident', icon: '🔱', desc: isAr ? 'رمح بوسيدون' : 'Sea Spear', price: 900 },
            { id: 'crown', name: isAr ? 'تاج' : 'Crown', icon: '👑', desc: isAr ? 'تاج ملكي بجوهرة' : 'Royal Crown', price: 1000 },
            { id: 'rocket', name: isAr ? 'صاروخ' : 'Rocket', icon: '🚀', desc: isAr ? 'صاروخ فضائي سريع' : 'Space Rocket', price: 1200 },
            { id: 'star', name: isAr ? 'نجمة' : 'Star', icon: '⭐', desc: isAr ? 'نجمة خماسية لامعة' : 'Shiny Star', price: 1250 },
            { id: 'chevron', name: isAr ? 'سهم مزدوج' : 'Chevron', icon: '⏫', desc: isAr ? 'شارة سرعة مزدوجة' : 'Double Chevron', price: 1300 },
            { id: 'drop', name: isAr ? 'قطرة' : 'Drop', icon: '💧', desc: isAr ? 'قطرة نيون لامعة' : 'Neon Drop', price: 1350 },
            { id: 'cat', name: isAr ? 'قطة' : 'Cat', icon: '🐱', desc: isAr ? 'رأس قطة بآذان وعيون' : 'Cute Cat', price: 1500 },
            { id: 'moon', name: isAr ? 'هلال' : 'Moon', icon: '🌙', desc: isAr ? 'هلال مع نجوم' : 'Crescent Moon', price: 1550 },
            { id: 'ghost', name: isAr ? 'شبح لطيف' : 'Ghost', icon: '👻', desc: isAr ? 'شبح أبيض مضحك' : 'Cute Ghost', price: 1600 },
            { id: 'flower', name: isAr ? 'زهرة' : 'Flower', icon: '🌼', desc: isAr ? 'زهرة بخمس بتلات' : 'Five Petals', price: 1650 },
            { id: 'shield', name: isAr ? 'درع' : 'Shield', icon: '🛡️', desc: isAr ? 'درع فارس بصليب' : 'Knight Shield', price: 1800 },
            { id: 'leaf', name: isAr ? 'ورقة شجر' : 'Leaf', icon: '🍃', desc: isAr ? 'ورقة بعروق بيضاء' : 'Veined Leaf', price: 1900 }
        ];

        heads.forEach(h => {
            const isOwned = (h.price === 0) || (storage.data.unlockedArrowHeads && storage.data.unlockedArrowHeads.includes(h.id));
            const isSelected = (storage.data.activeArrowHead === h.id);

            let actionHtml = '';
            if (isSelected) {
                actionHtml = `<button class="btn-theme-action active-theme" disabled>${isAr ? 'مُستخدَم' : 'In Use'}</button>`;
            } else if (isOwned) {
                actionHtml = `<button class="btn-theme-action btn-head-equip" data-head="${h.id}">${isAr ? 'استخدام' : 'Use'}</button>`;
            } else {
                actionHtml = `<button class="btn-theme-action btn-head-buy" data-head="${h.id}" data-price="${h.price}">${isAr ? `شراء ${h.price}🪙` : `Buy ${h.price}🪙`}</button>`;
            }

            const card = document.createElement('div');
            card.className = `theme-card ${isSelected ? 'selected' : ''}`;
            card.innerHTML = `
                <div class="theme-preview head-preview" style="background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; height: 38px;">
                    ${this.getHeadPreviewSvg(h.id)}
                </div>
                <div class="theme-info">
                    <div class="theme-name">${h.name}</div>
                    <div class="theme-desc">${h.desc}</div>
                </div>
                <div class="theme-action">
                    ${actionHtml}
                </div>
            `;

            const equipBtn = card.querySelector('.btn-head-equip');
            if (equipBtn) {
                equipBtn.addEventListener('click', () => {
                    storage.setArrowHead(h.id);
                    this.renderArrowHeads();
                    if (window.gameManager && window.gameManager.levelData) {
                        window.gameManager.renderBoard();
                    }
                    window.soundEngine.playClick();
                    this.showToast(isAr ? `تم تفعيل رأس: ${h.name}` : `Head equipped: ${h.name}`);
                });
            }

            const buyBtn = card.querySelector('.btn-head-buy');
            if (buyBtn) {
                buyBtn.addEventListener('click', () => {
                    const price = h.price;
                    const coins = storage.data.coins || 0;
                    if (coins >= price) {
                        storage.data.coins -= price;
                        storage.unlockArrowHead(h.id);
                        storage.setArrowHead(h.id);
                        storage.save();
                        this.updateHeaderStats();
                        this.renderArrowHeads();
                        if (window.gameManager && window.gameManager.levelData) {
                            window.gameManager.renderBoard();
                        }
                        this.checkAchievements();
                        window.soundEngine.playReward();
                        this.showToast(isAr ? `تم شراء وتفعيل رأس ${h.name}! 🎉` : `Purchased & equipped ${h.name}! 🎉`);
                    } else {
                        window.soundEngine.playBlocked();
                        const needed = price - coins;
                        this.showAdOfferModal('coins', needed, h.name);
                    }
                });
            }

            container.appendChild(card);
        });
    }

    // 8.2 Arrow Trails Customization Tab (6 complete trails in clean 3x2 grid)
    renderArrowTrails() {
        const container = document.getElementById('trails-grid-container');
        if (!container) return;
        container.innerHTML = '';

        const storage = window.storageManager;
        const isAr = (storage.data.settings.lang === 'ar');

        const trails = [
            { id: 'neon', name: isAr ? 'نيون كلاسيك' : 'Neon', icon: '✨', desc: isAr ? 'غبار نيون متوهج' : 'Neon Sparkle', price: 0 },
            { id: 'gold', name: isAr ? 'شرارات ذهبية' : 'Gold Sparkle', icon: '🌟', desc: isAr ? 'بريق نجوم إمبراطوري' : 'Royal Stars', price: 150 },
            { id: 'cosmic', name: isAr ? 'دخان كوزمي' : 'Cosmic', icon: '💨', desc: isAr ? 'بلازما فضاء كوني' : 'Cosmic Plasma', price: 300 },
            { id: 'fire', name: isAr ? 'لهب ناري' : 'Fire Embers', icon: '🔥', desc: isAr ? 'جمرات نار متطايرة' : 'Blazing Fire', price: 450 },
            { id: 'rainbow', name: isAr ? 'طيف قوسي' : 'Rainbow Glow', icon: '🌈', desc: isAr ? 'ألوان طيفية ساحرة' : 'Prismatic Aurora', price: 600 },
            { id: 'matrix', name: isAr ? 'شيفرة رقمية' : 'Matrix Code', icon: '⚡', desc: isAr ? 'أرقام باينري خضراء' : 'Binary Stream', price: 750 },
            { id: 'hearts', name: isAr ? 'قلوب' : 'Hearts', icon: '💖', desc: isAr ? 'قلوب متطايرة' : 'Flying Hearts', price: 800 },
            { id: 'snow', name: isAr ? 'ندف الثلج' : 'Snowflakes', icon: '❄️', desc: isAr ? 'ثلج بارد متلألئ' : 'Icy Flakes', price: 850 },
            { id: 'bubbles', name: isAr ? 'فقاعات' : 'Bubbles', icon: '🫧', desc: isAr ? 'فقاعات مائية' : 'Water Bubbles', price: 900 },
            { id: 'leaves', name: isAr ? 'أوراق الربيع' : 'Leaves', icon: '🍃', desc: isAr ? 'أوراق خضراء طائرة' : 'Spring Leaves', price: 950 },
            { id: 'music', name: isAr ? 'نغمات' : 'Music', icon: '🎵', desc: isAr ? 'نوتات موسيقية' : 'Music Notes', price: 1000 },
            { id: 'petals', name: isAr ? 'بتلات الورد' : 'Petals', icon: '🌸', desc: isAr ? 'بتلات ساكورا' : 'Sakura Petals', price: 1100 },
            { id: 'coins', name: isAr ? 'مطر العملات' : 'Coin Rain', icon: '🪙', desc: isAr ? 'عملات ذهبية متناثرة' : 'Golden Coins', price: 1150 },
            { id: 'butterflies', name: isAr ? 'فراشات' : 'Butterflies', icon: '🦋', desc: isAr ? 'فراشات طائرة' : 'Flying Butterflies', price: 1200 },
            { id: 'bolts', name: isAr ? 'صواعق' : 'Bolts', icon: '⚡', desc: isAr ? 'شرارات برق' : 'Lightning Bolts', price: 1250 },
            { id: 'gems', name: isAr ? 'جواهر' : 'Gems', icon: '💎', desc: isAr ? 'أحجار كريمة لامعة' : 'Sparkling Gems', price: 1400 },
            { id: 'clovers', name: isAr ? 'برسيم الحظ' : 'Clovers', icon: '🍀', desc: isAr ? 'أوراق برسيم خضراء' : 'Lucky Clovers', price: 1450 },
            { id: 'fireworks', name: isAr ? 'ألعاب نارية' : 'Fireworks', icon: '🎆', desc: isAr ? 'احتفال ملون' : 'Celebration', price: 1500 },
            { id: 'candies', name: isAr ? 'حلويات' : 'Candies', icon: '🍬', desc: isAr ? 'حلوى متناثرة' : 'Sweet Candies', price: 1550 },
            { id: 'planets', name: isAr ? 'كواكب' : 'Planets', icon: '🪐', desc: isAr ? 'كواكب فضائية' : 'Space Planets', price: 1700 },
            { id: 'glowstars', name: isAr ? 'نجوم متوهجة' : 'Glow Stars', icon: '🌟', desc: isAr ? 'نجوم ذهبية براقة' : 'Bright Stars', price: 1800 }
        ];

        trails.forEach(t => {
            const isOwned = (t.price === 0) || (storage.data.unlockedArrowTrails && storage.data.unlockedArrowTrails.includes(t.id));
            const isSelected = (storage.data.activeArrowTrail === t.id);

            let actionHtml = '';
            if (isSelected) {
                actionHtml = `<button class="btn-theme-action active-theme" disabled>${isAr ? 'مُستخدَم' : 'In Use'}</button>`;
            } else if (isOwned) {
                actionHtml = `<button class="btn-theme-action btn-trail-equip" data-trail="${t.id}">${isAr ? 'استخدام' : 'Use'}</button>`;
            } else {
                actionHtml = `<button class="btn-theme-action btn-trail-buy" data-trail="${t.id}" data-price="${t.price}">${isAr ? `شراء ${t.price}🪙` : `Buy ${t.price}🪙`}</button>`;
            }

            const card = document.createElement('div');
            card.className = `theme-card ${isSelected ? 'selected' : ''}`;
            card.innerHTML = `
                <div class="theme-preview trail-preview" style="background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 8px; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; height: 38px;">
                    <span style="filter: drop-shadow(0 2px 4px rgba(2, 132, 199, 0.4)); transform: scale(1.15);">${t.icon}</span>
                </div>
                <div class="theme-info">
                    <div class="theme-name">${t.name}</div>
                    <div class="theme-desc">${t.desc}</div>
                </div>
                <div class="theme-action">
                    ${actionHtml}
                </div>
            `;

            const equipBtn = card.querySelector('.btn-trail-equip');
            if (equipBtn) {
                equipBtn.addEventListener('click', () => {
                    storage.setArrowTrail(t.id);
                    this.renderArrowTrails();
                    window.soundEngine.playClick();
                    this.showToast(isAr ? `تم تفعيل مسار: ${t.name}` : `Trail equipped: ${t.name}`);
                });
            }

            const buyBtn = card.querySelector('.btn-trail-buy');
            if (buyBtn) {
                buyBtn.addEventListener('click', () => {
                    const price = t.price;
                    const coins = storage.data.coins || 0;
                    if (coins >= price) {
                        storage.data.coins -= price;
                        storage.unlockArrowTrail(t.id);
                        storage.setArrowTrail(t.id);
                        storage.save();
                        this.updateHeaderStats();
                        this.renderArrowTrails();
                        this.checkAchievements();
                        window.soundEngine.playReward();
                        this.showToast(isAr ? `تم شراء وتفعيل مسار ${t.name}! 🎉` : `Purchased & equipped ${t.name}! 🎉`);
                    } else {
                        window.soundEngine.playBlocked();
                        const needed = price - coins;
                        this.showAdOfferModal('coins', needed, t.name);
                    }
                });
            }

            container.appendChild(card);
        });
    }

    // 8.3 Arrow Body Styles Tab (snake, worm, beads...)
    getArrowBodyCatalog(isAr = true) {
        return [
            { id: 'tube', name: isAr ? 'أنبوب نيون' : 'Neon Tube', desc: isAr ? 'الجسم الكلاسيكي' : 'Classic', price: 0 },
            { id: 'snake', name: isAr ? 'أفعى' : 'Snake', desc: isAr ? 'جسم بحراشف' : 'Scaled Body', price: 400 },
            { id: 'worm', name: isAr ? 'دودة' : 'Worm', desc: isAr ? 'حلقات ممتلئة' : 'Ringed Body', price: 450 },
            { id: 'candy', name: isAr ? 'حلوى مخططة' : 'Candy', desc: isAr ? 'خطوط بيضاء' : 'Striped', price: 500 },
            { id: 'beads', name: isAr ? 'خرز لؤلؤي' : 'Beads', desc: isAr ? 'حبات متصلة' : 'Pearl Chain', price: 600 },
            { id: 'hollow', name: isAr ? 'أنبوب مجوّف' : 'Hollow', desc: isAr ? 'إطار نيون' : 'Outline', price: 650 },
            { id: 'rope', name: isAr ? 'حبل مجدول' : 'Rope', desc: isAr ? 'جدائل ملتفة' : 'Braided', price: 750 },
            { id: 'electric', name: isAr ? 'تيار كهربائي' : 'Electric', desc: isAr ? 'طاقة متدفقة' : 'Flowing Volt', price: 900 },
            { id: 'dotted', name: isAr ? 'منقّط' : 'Dotted', desc: isAr ? 'نقاط مضيئة' : 'Glowing Dots', price: 950 },
            { id: 'double', name: isAr ? 'سكة مزدوجة' : 'Double Rail', desc: isAr ? 'خطان متوازيان' : 'Twin Lines', price: 1000 },
            { id: 'caterpillar', name: isAr ? 'يرقة' : 'Caterpillar', desc: isAr ? 'حبات ملونة متبادلة' : 'Two-Tone Beads', price: 1050 },
            { id: 'chain', name: isAr ? 'سلسلة' : 'Chain', desc: isAr ? 'حلقات معدنية' : 'Metal Links', price: 1100 },
            { id: 'laser', name: isAr ? 'ليزر' : 'Laser', desc: isAr ? 'شعاع نحيف متوهج' : 'Thin Beam', price: 1150 },
            { id: 'zebra', name: isAr ? 'حمار وحشي' : 'Zebra', desc: isAr ? 'خطوط كثيفة' : 'Dense Stripes', price: 1200 },
            { id: 'dna', name: isAr ? 'حمض نووي' : 'DNA', desc: isAr ? 'لونان متشابكان' : 'Two-Color Helix', price: 1300 },
            { id: 'rainbow', name: isAr ? 'قوس قزح' : 'Rainbow', desc: isAr ? 'خمسة ألوان زاهية' : 'Five Colors', price: 1500 },
            { id: 'glass', name: isAr ? 'زجاج لامع' : 'Glass', desc: isAr ? 'أنبوب شفاف براق' : 'Shiny Glass', price: 1550 },
            { id: 'ladder', name: isAr ? 'سُلّم' : 'Ladder', desc: isAr ? 'قضبان ودرجات' : 'Rails & Rungs', price: 1600 },
            { id: 'pulse', name: isAr ? 'نبض' : 'Pulse', desc: isAr ? 'نبضات ملونة متحركة' : 'Moving Pulses', price: 1700 },
            { id: 'fire', name: isAr ? 'ناري' : 'Fire', desc: isAr ? 'لهب أحمر وأصفر متحرك' : 'Moving Flames', price: 1800 },
            { id: 'stitch', name: isAr ? 'خياطة' : 'Stitch', desc: isAr ? 'غرزات بيضاء أنيقة' : 'White Stitches', price: 1900 }
        ];
    }

    renderArrowBodies() {
        const container = document.getElementById('bodies-grid-container');
        if (!container) return;
        container.innerHTML = '';

        const storage = window.storageManager;
        const isAr = (storage.data.settings.lang === 'ar');
        const active = storage.data.activeArrowBody || 'tube';

        this.getArrowBodyCatalog(isAr).forEach(b => {
            const isOwned = (b.price === 0) || (storage.data.unlockedArrowBodies && storage.data.unlockedArrowBodies.includes(b.id));
            const isSelected = (active === b.id);

            let actionHtml = '';
            if (isSelected) {
                actionHtml = `<button class="btn-theme-action active-theme" disabled>${isAr ? 'مُستخدَم' : 'In Use'}</button>`;
            } else if (isOwned) {
                actionHtml = `<button class="btn-theme-action btn-body-equip">${isAr ? 'استخدام' : 'Use'}</button>`;
            } else {
                actionHtml = `<button class="btn-theme-action btn-body-buy">${isAr ? `شراء ${b.price}🪙` : `Buy ${b.price}🪙`}</button>`;
            }

            const card = document.createElement('div');
            card.className = `theme-card ${isSelected ? 'selected' : ''}`;
            card.innerHTML = `
                <div class="theme-preview body-preview" style="background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; height: 42px;">
                    ${this.getBodyPreviewSvg(b.id)}
                </div>
                <div class="theme-info">
                    <div class="theme-name">${b.name}</div>
                    <div class="theme-desc">${b.desc}</div>
                </div>
                <div class="theme-action">
                    ${actionHtml}
                </div>
            `;

            const refreshBoard = () => {
                if (window.gameManager && window.gameManager.levelData) window.gameManager.renderBoard();
            };

            const equipBtn = card.querySelector('.btn-body-equip');
            if (equipBtn) {
                equipBtn.addEventListener('click', () => {
                    storage.setArrowBody(b.id);
                    this.renderArrowBodies();
                    refreshBoard();
                    window.soundEngine.playClick();
                    this.showToast(isAr ? `تم تفعيل جسم: ${b.name}` : `Body equipped: ${b.name}`);
                });
            }

            const buyBtn = card.querySelector('.btn-body-buy');
            if (buyBtn) {
                buyBtn.addEventListener('click', () => {
                    const coins = storage.data.coins || 0;
                    if (coins >= b.price) {
                        storage.data.coins -= b.price;
                        storage.unlockArrowBody(b.id);
                        storage.setArrowBody(b.id);
                        storage.save();
                        this.updateHeaderStats();
                        this.renderArrowBodies();
                        refreshBoard();
                        this.checkAchievements();
                        window.soundEngine.playReward();
                        this.showToast(isAr ? `تم شراء وتفعيل جسم ${b.name}! 🎉` : `Purchased & equipped ${b.name}! 🎉`);
                    } else {
                        window.soundEngine.playBlocked();
                        const needed = b.price - coins;
                        this.showAdOfferModal('coins', needed, b.name);
                    }
                });
            }

            container.appendChild(card);
        });
    }

    // 9. Comprehensive 200 Achievements System with Categories, Progress & Rewards
    getAchievementsCatalog() {
        if (this._achievementsCatalog) {
            return this._achievementsCatalog;
        }

        const list = [];
        const add = (item) => list.push(item);

        // 1. Levels (40 Achievements) - Unique, engaging titles and descriptions
        const levelData = [
            { lvl: 1, titleAr: 'الخطوة الأولى', titleEn: 'First Step', descAr: 'حل أول مرحلة واكتشاف مسار الهروب', descEn: 'Solve the first stage and find the escape path' },
            { lvl: 2, titleAr: 'شرارة البداية', titleEn: 'Spark of Hope', descAr: 'اجتياز المستوى 2 بثقة وسلاسة', descEn: 'Clear level 2 smoothly and with confidence' },
            { lvl: 3, titleAr: 'تفكير استراتيجي', titleEn: 'Strategic Mind', descAr: 'فك تشابك الأسهم في المستوى 3', descEn: 'Untangle the arrows in level 3' },
            { lvl: 4, titleAr: 'درب النجوم', titleEn: 'Starry Path', descAr: 'إنهاء المرحلة 4 بنجاح وتميز', descEn: 'Complete stage 4 with distinction' },
            { lvl: 5, titleAr: 'نجم صاعد', titleEn: 'Rising Star', descAr: 'تجاوز المستوى 5 وإثبات المهارة', descEn: 'Surpass level 5 and prove your skill' },
            { lvl: 6, titleAr: 'مناور بارع', titleEn: 'Skilled Dodger', descAr: 'حل ألغاز المستوى 6 بذكاء', descEn: 'Solve level 6 puzzles intelligently' },
            { lvl: 7, titleAr: 'عين الصقر', titleEn: 'Eagle Eye', descAr: 'اكتشاف زوايا الهروب في المستوى 7', descEn: 'Spot the escape angles in level 7' },
            { lvl: 8, titleAr: 'سيد التكتيك', titleEn: 'Tactics Master', descAr: 'اجتياز تحدي المستوى 8 بنجاح', descEn: 'Master the tactical puzzle of level 8' },
            { lvl: 9, titleAr: 'على أبواب الزعيم', titleEn: 'Boss Gate', descAr: 'بلوغ المستوى 9 قبل أول مواجهة', descEn: 'Reach level 9 before the first showdown' },
            { lvl: 10, titleAr: 'فاتح القلاع', titleEn: 'Castle Opener', descAr: 'اجتياز المستوى 10 والقمة الأولى', descEn: 'Conquer level 10 and clear the first peak' },
            { lvl: 12, titleAr: 'طريق التحدي', titleEn: 'Path of Trial', descAr: 'تخطي المستوى 12 بثبات وقوة', descEn: 'Pass level 12 with strength and precision' },
            { lvl: 14, titleAr: 'مفتاح المتاهة', titleEn: 'Maze Key', descAr: 'حل شبكة المستوى 14 المعقدة', descEn: 'Solve the complex grid of level 14' },
            { lvl: 16, titleAr: 'سرعة البديهة', titleEn: 'Quick Reflex', descAr: 'اجتياز المستوى 16 بحرفية', descEn: 'Clear level 16 with quick reflexes' },
            { lvl: 18, titleAr: 'نصل النيون', titleEn: 'Neon Blade', descAr: 'الوصول للمستوى 18 بلا تردد', descEn: 'Reach level 18 without hesitation' },
            { lvl: 20, titleAr: 'فارس السايبر', titleEn: 'Cyber Knight', descAr: 'تخطي المستوى 20 المتطور', descEn: 'Defeat the advanced cyber level 20' },
            { lvl: 22, titleAr: 'صانع الطرق', titleEn: 'Path Maker', descAr: 'فك مسارات المستوى 22 بنجاح', descEn: 'Unlock the paths of level 22' },
            { lvl: 24, titleAr: 'محطم الحواجز', titleEn: 'Barrier Breaker', descAr: 'تخطي المستوى 24 بعزم', descEn: 'Break through obstacles in level 24' },
            { lvl: 26, titleAr: 'فولاذي الإرادة', titleEn: 'Iron Will', descAr: 'اجتياز المستوى 26 بدقة', descEn: 'Complete level 26 with unwavering precision' },
            { lvl: 28, titleAr: 'رؤية ثاقبة', titleEn: 'Sharp Vision', descAr: 'إنهاء المستوى 28 باحتراف', descEn: 'Finish level 28 like a pro' },
            { lvl: 30, titleAr: 'سيد الماتريكس', titleEn: 'Matrix Adept', descAr: 'بلوغ المستوى 30 الرقمي', descEn: 'Reach the digital matrix level 30' },
            { lvl: 32, titleAr: 'مهندس الحركة', titleEn: 'Motion Engineer', descAr: 'حل ألغاز المستوى 32', descEn: 'Solve the intricate puzzle of level 32' },
            { lvl: 35, titleAr: 'عاصفة الأفكار', titleEn: 'Brainstormer', descAr: 'اجتياز المستوى 35 المتقدم', descEn: 'Overcome the advanced puzzle of level 35' },
            { lvl: 38, titleAr: 'روح المغامرة', titleEn: 'Adventurer Spirit', descAr: 'بلوغ المستوى 38 بثقة', descEn: 'Reach level 38 with fearless spirit' },
            { lvl: 40, titleAr: 'شعلة البلازما', titleEn: 'Plasma Blaze', descAr: 'تخطي المستوى 40 الحارق', descEn: 'Master the blazing plasma level 40' },
            { lvl: 42, titleAr: 'حكمة الصمت', titleEn: 'Silent Wisdom', descAr: 'اجتياز المستوى 42', descEn: 'Clear level 42 with quiet mastery' },
            { lvl: 45, titleAr: 'صياد الفرص', titleEn: 'Opportunity Hunter', descAr: 'بلوغ المستوى 45 بنجاح', descEn: 'Seize victory in level 45' },
            { lvl: 48, titleAr: 'درع النيون', titleEn: 'Neon Aegis', descAr: 'تخطي المستوى 48 باقتدار', descEn: 'Overcome level 48 with neon prowess' },
            { lvl: 50, titleAr: 'عملاق المتاهات', titleEn: 'Maze Titan', descAr: 'اجتياز نصف المئوية (مستوى 50)', descEn: 'Cross the milestone of level 50' },
            { lvl: 55, titleAr: 'نبض الكوانتم', titleEn: 'Quantum Pulse', descAr: 'الوصول للمستوى 55 الغامض', descEn: 'Reach mysterious quantum level 55' },
            { lvl: 60, titleAr: 'خارق الذكاء', titleEn: 'Hyper Mind', descAr: 'تخطي المستوى 60 ببراعة', descEn: 'Clear level 60 with brilliant mind' },
            { lvl: 65, titleAr: 'سيد المجرات', titleEn: 'Galactic Lord', descAr: 'بلوغ المستوى 65 الكوني', descEn: 'Reach cosmic level 65' },
            { lvl: 70, titleAr: 'عين العاصفة', titleEn: 'Storm Eye', descAr: 'اجتياز المستوى 70 الهائج', descEn: 'Brave through stormy level 70' },
            { lvl: 75, titleAr: 'أسطورة لا تُقهر', titleEn: 'Invincible Legend', descAr: 'تخطي المستوى 75 الصعب', descEn: 'Conquer challenging level 75' },
            { lvl: 80, titleAr: 'سيد الرعود', titleEn: 'Thunder Lord', descAr: 'بلوغ المستوى 80 الاستثنائي', descEn: 'Achieve the thunderous level 80' },
            { lvl: 85, titleAr: 'طاقة لا تنضب', titleEn: 'Boundless Energy', descAr: 'اجتياز المستوى 85', descEn: 'Power through level 85' },
            { lvl: 90, titleAr: 'تيتان الصمود', titleEn: 'Endurance Titan', descAr: 'تخطي المستوى 90 الفولاذي', descEn: 'Survive the iron trial of level 90' },
            { lvl: 95, titleAr: 'عرش الملوك', titleEn: 'Throne of Kings', descAr: 'بلوغ المستوى 95 الملكي', descEn: 'Ascend to the royal level 95' },
            { lvl: 100, titleAr: 'إمبراطور الألغاز', titleEn: 'Puzzle Emperor', descAr: 'سحق المستوى 100 الأسطوري', descEn: 'Crush the legendary level 100' },
            { lvl: 120, titleAr: 'ما وراء الأفق', titleEn: 'Beyond Horizon', descAr: 'تجاوز المستوى 120 الخارق', descEn: 'Transcend beyond level 120' },
            { lvl: 150, titleAr: 'الخلود الأبدي', titleEn: 'Eternal Grandmaster', descAr: 'ختم المستوى 150 الأقصى', descEn: 'Attain grandmastery at level 150' },
            { lvl: 200, titleAr: 'حارس البوابات', titleEn: 'Gate Keeper', descAr: 'بلوغ المستوى 200 بجدارة', descEn: 'Reach level 200 with supreme merit' },
            { lvl: 250, titleAr: 'ربان المتاهات', titleEn: 'Maze Captain', descAr: 'اجتياز المستوى 250', descEn: 'Navigate successfully through level 250' },
            { lvl: 300, titleAr: 'محارب النيون', titleEn: 'Neon Warrior', descAr: 'تخطي المستوى 300', descEn: 'Conquer neon frontier level 300' },
            { lvl: 400, titleAr: 'سيد الشبكات الكبيرة', titleEn: 'Big Grid Master', descAr: 'حل شبكات المستوى 400 الواسعة', descEn: 'Master colossal grids at level 400' },
            { lvl: 500, titleAr: 'نصف الألف', titleEn: 'Half Thousand', descAr: 'بلوغ المستوى 500 التاريخي', descEn: 'Reach historic milestone level 500' },
            { lvl: 750, titleAr: 'مستكشف العوالم', titleEn: 'World Explorer', descAr: 'اجتياز المستوى 750', descEn: 'Explore through level 750' },
            { lvl: 1000, titleAr: 'أسطورة الألف', titleEn: 'Thousand Legend', descAr: 'بلوغ المستوى 1000 الأسطوري', descEn: 'Attain the legendary level 1000' },
            { lvl: 1500, titleAr: 'ملك المسارات', titleEn: 'Path King', descAr: 'تخطي المستوى 1500', descEn: 'Claim kinghood at level 1500' },
            { lvl: 2000, titleAr: 'عقل خارق', titleEn: 'Super Mind', descAr: 'بلوغ المستوى 2000', descEn: 'Achieve superhuman mind at level 2000' },
            { lvl: 2500, titleAr: 'نصف الرحلة العظمى', titleEn: 'Halfway Hero', descAr: 'اجتياز المستوى 2500', descEn: 'Reach the epic midpoint level 2500' },
            { lvl: 3000, titleAr: 'فاتح المجرات', titleEn: 'Galaxy Conqueror', descAr: 'تخطي المستوى 3000', descEn: 'Conquer galaxy level 3000' },
            { lvl: 3500, titleAr: 'سيد الزمن', titleEn: 'Time Lord', descAr: 'بلوغ المستوى 3500', descEn: 'Master time and space at level 3500' },
            { lvl: 4000, titleAr: 'أسطورة النيون', titleEn: 'Neon Myth', descAr: 'اجتياز المستوى 4000', descEn: 'Become a myth at level 4000' },
            { lvl: 4500, titleAr: 'على عتبة القمة', titleEn: 'Summit Edge', descAr: 'بلوغ المستوى 4500', descEn: 'Stand at the summit edge of level 4500' },
            { lvl: 5000, titleAr: 'البطل المطلق', titleEn: 'Ultimate Champion', descAr: 'إنهاء جميع المراحل حتى 5000', descEn: 'Conquer all 5000 stages as the ultimate champion' }
        ];

        levelData.forEach((ld) => {
            const reward = ld.lvl <= 150 ? Math.round(15 + ld.lvl * 1.5) : Math.round(250 + Math.sqrt(ld.lvl) * 10);
            add({
                id: `lvl_${ld.lvl}`,
                category: 'levels',
                titleAr: `${ld.titleAr} (${ld.lvl})`,
                titleEn: `${ld.titleEn} (${ld.lvl})`,
                descAr: ld.descAr,
                descEn: ld.descEn || `Solve and conquer level ${ld.lvl}`,
                icon: ld.lvl >= 1000 ? '💎' : (ld.lvl >= 100 ? '🌌' : (ld.lvl >= 50 ? '🏆' : (ld.lvl >= 25 ? '🧭' : '⭐'))),
                reward: reward,
                getProgress: (s) => ({ current: Math.min(ld.lvl, Math.max(0, (s.data.maxUnlockedLevel || 1) - 1)), target: ld.lvl })
            });
        });

        // 2. Bosses (10 Achievements)
        const bossConfigs = [
            { lvl: 10, nameAr: 'زعيم النيون الملكي', nameEn: 'Neon Royal Boss', icon: '👑', r: 50 },
            { lvl: 20, nameAr: 'زعيم السايبر المتطور', nameEn: 'Cyber Core Boss', icon: '⚔️', r: 75 },
            { lvl: 30, nameAr: 'زعيم الماتريكس الرقمي', nameEn: 'Matrix Digital Boss', icon: '⚡', r: 100 },
            { lvl: 40, nameAr: 'زعيم البلازما الحارقة', nameEn: 'Plasma Flare Boss', icon: '🔥', r: 125 },
            { lvl: 50, nameAr: 'زعيم النواة المحصنة', nameEn: 'Fortified Core Boss', icon: '🛡️', r: 150 },
            { lvl: 60, nameAr: 'زعيم الكوانتم الغامض', nameEn: 'Quantum Void Boss', icon: '🔮', r: 175 },
            { lvl: 70, nameAr: 'زعيم المجرة السحيقة', nameEn: 'Deep Galaxy Boss', icon: '🌌', r: 200 },
            { lvl: 80, nameAr: 'زعيم العاصفة الرعدية', nameEn: 'Thunder Storm Boss', icon: '🌪️', r: 225 },
            { lvl: 90, nameAr: 'زعيم التيتان الفولاذي', nameEn: 'Titan Steel Boss', icon: '🗿', r: 250 },
            { lvl: 100, nameAr: 'إمبراطور المتاهات الأسطوري', nameEn: 'Legendary Maze Emperor', icon: '🔱', r: 300 }
        ];
        bossConfigs.forEach(b => {
            add({
                id: `boss_${b.lvl}`,
                category: 'bosses',
                titleAr: `سحق ${b.nameAr}`,
                titleEn: `Defeat ${b.nameEn}`,
                descAr: `سحق وهزيمة الزعيم الملكي في المستوى ${b.lvl}`,
                descEn: `Overcome the royal boss at level ${b.lvl}`,
                icon: b.icon,
                reward: b.r,
                getProgress: (s) => {
                    const reached = (s.data.maxUnlockedLevel || 1) > b.lvl || (s.data.levelRecords && s.data.levelRecords[b.lvl]);
                    return { current: reached ? 1 : 0, target: 1 };
                }
            });
        });

        // 3. Stars (30 Achievements)
        const starTargets = [
            3, 6, 9, 12, 15, 18, 21, 24, 27, 30,
            35, 40, 45, 50, 55, 60, 65, 70, 75, 80,
            90, 100, 110, 120, 135, 150, 175, 200, 250, 300,
            400, 500, 750, 1000, 1500, 2000, 3000, 4000, 5000, 7500, 10000, 12500, 15000
        ];
        starTargets.forEach((st, idx) => {
            add({
                id: `stars_${st}`,
                category: 'stars',
                titleAr: `صائد النجوم: ${st}★`,
                titleEn: `Star Collector: ${st}★`,
                descAr: `اجمع ${st} نجمة من خلال حل الألغاز بإتقان تام`,
                descEn: `Collect ${st} golden stars across puzzle stages`,
                icon: '✨',
                reward: Math.round(20 + idx * 6),
                getProgress: (s) => ({ current: Math.min(st, s.getTotalStars ? s.getTotalStars() : 0), target: st })
            });
        });

        // 4. Puzzles Solved (30 Achievements)
        const puzzleTargets = [
            1, 2, 3, 5, 7, 10, 12, 15, 18, 20,
            25, 30, 35, 40, 45, 50, 55, 60, 65, 70,
            75, 80, 90, 100, 120, 140, 160, 180, 200, 250,
            300, 400, 500, 750, 1000, 1500, 2000, 3000, 4000, 5000
        ];
        puzzleTargets.forEach((p, idx) => {
            add({
                id: `puzzles_${p}`,
                category: 'puzzles',
                titleAr: `مفكك الألغاز: ${p}`,
                titleEn: `Puzzle Solver: ${p}`,
                descAr: `حل ${p} لغز أسهم واجتياز التحديات بنجاح`,
                descEn: `Solve ${p} arrow puzzles successfully`,
                icon: '🧩',
                reward: Math.round(15 + idx * 5),
                getProgress: (s) => ({ current: Math.min(p, (s.data.stats && s.data.stats.totalPuzzlesSolved) || 0), target: p })
            });
        });

        // 5. Perfect 3-Star Levels (20 Achievements)
        const perfectTargets = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            12, 15, 18, 20, 25, 30, 35, 40, 45, 50
        ];
        perfectTargets.forEach((pf, idx) => {
            add({
                id: `perfect_${pf}`,
                category: 'perfect',
                titleAr: `دقة وإتقان: ${pf} مراحل`,
                titleEn: `Flawless Mind: ${pf}`,
                descAr: `أكمل ${pf} مراحل بنتيجة 3 نجوم كاملة دون أي أخطاء`,
                descEn: `Complete ${pf} levels with perfect 3 stars`,
                icon: '💎',
                reward: Math.round(25 + idx * 8),
                getProgress: (s) => {
                    let count = 0;
                    Object.values(s.data.levelRecords || {}).forEach(r => { if (r && r.stars === 3) count++; });
                    return { current: Math.min(pf, count), target: pf };
                }
            });
        });

        // 6. Combos & Streaks (15 Achievements)
        for (let c = 2; c <= 10; c++) {
            add({
                id: `combo_x${c}`,
                category: 'combos',
                titleAr: `كومبو متتالي x${c}`,
                titleEn: `Streak Combo x${c}`,
                descAr: `تحقيق سلسلة كومبو متتالية x${c} أو أعلى في مرحلة واحدة`,
                descEn: `Achieve a combo multiplier streak of x${c}`,
                icon: '⚡',
                reward: 20 + (c - 2) * 15,
                getProgress: (s) => ({ current: Math.min(c, (s.data.stats && s.data.stats.bestCombo) || 0), target: c })
            });
        }
        const fastClearTargets = [5, 10, 15, 20, 25, 30];
        fastClearTargets.forEach((fc, idx) => {
            add({
                id: `fast_clear_${fc}`,
                category: 'combos',
                titleAr: `سرعة البرق: ${fc} سهم`,
                titleEn: `Lightning Speed: ${fc}`,
                descAr: `تحرير ${fc} سهماً دون تردد وبسرعة فائقة`,
                descEn: `Release ${fc} arrows in rapid succession`,
                icon: '🔥',
                reward: 30 + idx * 10,
                getProgress: (s) => ({ current: Math.min(fc, (s.data.stats && s.data.stats.totalArrowsReleased) || 0), target: fc })
            });
        });



        // 8. Economy, Themes & Store (30 Achievements)
        // 13 Coins milestones
        const coinMilestones = [50, 100, 150, 200, 300, 400, 500, 750, 1000, 1500, 2000, 3000, 5000];
        coinMilestones.forEach((cm, idx) => {
            add({
                id: `coins_total_${cm}`,
                category: 'economy',
                titleAr: `ثروة العملات: ${cm} 🪙`,
                titleEn: `Coin Hoarder: ${cm}`,
                descAr: `جمع رصيد عملات إجمالي يصل إلى ${cm} قطار نقدية`,
                descEn: `Accumulate ${cm} gold coins in your wallet`,
                icon: '💰',
                reward: Math.round(20 + idx * 12),
                getProgress: (s) => ({ current: Math.min(cm, s.data.coins || 0), target: cm })
            });
        });

        // Themes milestones (12 themes in store)
        const themeCounts = [2, 4, 6, 9, 12, 16, 20];
        themeCounts.forEach((tc, idx) => {
            add({
                id: `theme_own_${tc}`,
                category: 'economy',
                titleAr: `خبير المظاهر: ${tc}`,
                titleEn: `Theme Stylist: ${tc}`,
                descAr: `امتلاك ${tc} مظاهر من المتجر`,
                descEn: `Own ${tc} themes from the store`,
                icon: '🎨',
                reward: 40 + idx * 30,
                getProgress: (s) => ({ current: Math.min(tc, (s.data.unlockedThemes || ['cyber']).length), target: tc })
            });
        });

        // Arrowheads milestones (12 heads in store)
        [2, 4, 6, 9, 12, 16, 20].forEach((h, idx) => {
            add({
                id: `head_own_${h}`,
                category: 'economy',
                titleAr: `جامع الرؤوس: ${h}`,
                titleEn: `Arrowheads Collector: ${h}`,
                descAr: `امتلاك ${h} رؤوس أسهم من المتجر`,
                descEn: `Unlock ${h} arrowheads from the store`,
                icon: '🏹',
                reward: 40 + idx * 30,
                getProgress: (s) => ({ current: Math.min(h, (s.data.unlockedArrowHeads || ['classic']).length), target: h })
            });
        });

        // Trails milestones (12 trails in store)
        [2, 4, 6, 9, 12, 16, 20].forEach((t, idx) => {
            add({
                id: `trail_own_${t}`,
                category: 'economy',
                titleAr: `جامع المسارات: ${t}`,
                titleEn: `Trail Collector: ${t}`,
                descAr: `امتلاك ${t} مسارات ضوئية من المتجر`,
                descEn: `Unlock ${t} light trails from the store`,
                icon: '🌈',
                reward: 40 + idx * 30,
                getProgress: (s) => ({ current: Math.min(t, (s.data.unlockedArrowTrails || ['neon']).length), target: t })
            });
        });

        // Arrow bodies milestones (8 bodies in store)
        [2, 4, 6, 8, 12, 16, 20].forEach((b, idx) => {
            add({
                id: `body_own_${b}`,
                category: 'economy',
                titleAr: `جامع الأجسام: ${b}`,
                titleEn: `Body Collector: ${b}`,
                descAr: `امتلاك ${b} أشكال أجسام من المتجر (أفعى، دودة...)`,
                descEn: `Unlock ${b} arrow body styles`,
                icon: '🐍',
                reward: 50 + idx * 35,
                getProgress: (s) => ({ current: Math.min(b, (s.data.unlockedArrowBodies || ['tube']).length), target: b })
            });
        });



        this._achievementsCatalog = list;
        return this._achievementsCatalog;
    }

    renderAchievements() {
        const container = document.getElementById('achievements-list');
        if (!container) return;
        container.innerHTML = '';

        const storage = window.storageManager;
        const isAr = (storage.data.settings.lang === 'ar');
        const catalog = this.getAchievementsCatalog();

        let unlockedTotal = 0;
        catalog.forEach(ach => {
            const prog = ach.getProgress(storage);
            if (prog.current >= prog.target || storage.isAchievementUnlocked(ach.id)) {
                unlockedTotal++;
                storage.unlockAchievement(ach.id);
            }
        });

        // Update overall summary card
        const countEl = document.getElementById('ach-unlocked-count');
        const totalEl = document.getElementById('ach-total-count');
        const barFill = document.getElementById('ach-summary-bar-fill');
        if (countEl) countEl.textContent = unlockedTotal;
        if (totalEl) totalEl.textContent = catalog.length;
        if (barFill) barFill.style.width = `${Math.round((unlockedTotal / catalog.length) * 100)}%`;

        // Update Claim All Button in Summary Card
        const claimAllBtn = document.getElementById('btn-ach-claim-all');
        if (claimAllBtn) {
            const unclaimedList = catalog.filter(a => {
                const prog = a.getProgress(storage);
                const isUnlocked = (prog.current >= prog.target) || storage.isAchievementUnlocked(a.id);
                const isClaimed = storage.isAchievementClaimed(a.id);
                return isUnlocked && !isClaimed;
            });

            if (unclaimedList.length > 0) {
                const totalCoins = unclaimedList.reduce((sum, a) => sum + a.reward, 0);
                claimAllBtn.style.display = 'inline-flex';
                claimAllBtn.innerHTML = `<span>🎁</span> <span>${isAr ? 'استلام الكل' : 'Claim All'} (+${totalCoins} 🪙)</span>`;
                claimAllBtn.onclick = () => {
                    let totalCoinsClaimed = 0;
                    let count = 0;
                    unclaimedList.forEach(a => {
                        if (storage.claimAchievementReward(a.id, a.reward)) {
                            totalCoinsClaimed += a.reward;
                            count++;
                        }
                    });
                    if (count > 0) {
                        window.soundEngine.playReward();
                        this.updateHeaderStats();
                        this.renderAchievements();
                        this.showToast(isAr ? `🎉 رائع! تم استلام ${count} إنجازات والحصول على +${totalCoinsClaimed} 🪙 بنجاح!` : `🎉 Awesome! Claimed ${count} achievements (+${totalCoinsClaimed} coins)!`);
                    }
                };
            } else {
                claimAllBtn.style.display = 'none';
            }
        }

        // Update Category Tabs (with live counts and active language)
        const catBar = document.getElementById('ach-categories-bar');
        if (catBar) {
            const catKeyMap = {
                all: 'achAll',
                levels: 'achLevels',
                bosses: 'achBosses',
                stars: 'achStars',
                puzzles: 'achPuzzles',
                perfect: 'achMastery',
                mastery: 'achMastery',
                combos: 'achCombos',
                economy: 'achEconomy'
            };

            catBar.querySelectorAll('.ach-cat-btn').forEach(btn => {
                const cat = btn.dataset.cat;
                const count = (cat === 'all') ? catalog.length : catalog.filter(a => a.category === cat).length;
                const baseLabel = this.t(catKeyMap[cat] || 'achAll');
                btn.textContent = `${baseLabel} (${count})`;
                btn.style.display = (count === 0) ? 'none' : '';
                btn.classList.toggle('active', cat === this.activeAchievementCategory);
                if (!btn._achBound) {
                    btn._achBound = true;
                    btn.addEventListener('click', () => {
                        this.activeAchievementCategory = cat;
                        this.renderAchievements();
                    });
                }
            });
        }

        // Filter achievements by active category
        const itemsToRender = (this.activeAchievementCategory === 'all')
            ? catalog
            : catalog.filter(a => a.category === this.activeAchievementCategory);

        itemsToRender.forEach(ach => {
            const prog = ach.getProgress(storage);
            const isUnlocked = (prog.current >= prog.target) || storage.isAchievementUnlocked(ach.id);
            const isClaimed = storage.isAchievementClaimed(ach.id);
            const title = isAr ? ach.titleAr : ach.titleEn;
            const desc = isAr ? ach.descAr : ach.descEn;
            const pct = Math.min(100, Math.round((prog.current / prog.target) * 100));

            let actionHtml = '';
            if (isClaimed) {
                actionHtml = `<span class="ach-badge-claimed">✓ ${isAr ? 'تم الاستلام' : 'Claimed'}</span>`;
            } else if (isUnlocked) {
                actionHtml = `<button class="btn-ach-claim" data-ach-id="${ach.id}" data-reward="${ach.reward}"><span>🎁</span> <span>${isAr ? 'استلام' : 'Claim'} +${ach.reward}</span></button>`;
            } else {
                actionHtml = `<span class="ach-badge-locked"><span>🔒</span> <span>+${ach.reward}</span></span>`;
            }

            const item = document.createElement('div');
            item.className = `achievement-item ${isClaimed ? 'claimed' : (isUnlocked ? 'unlocked' : 'locked')}`;
            item.innerHTML = `
                <div class="ach-icon-container">${ach.icon}</div>
                <div class="ach-details">
                    <div class="ach-title">${title}</div>
                    <div class="ach-desc">${desc}</div>
                    <div class="ach-progress-row">
                        <div class="ach-progress-bar">
                            <div class="ach-progress-fill" style="width: ${pct}%;"></div>
                        </div>
                        <span class="ach-progress-text">${prog.current}/${prog.target}</span>
                    </div>
                </div>
                <div class="ach-action-col">
                    ${actionHtml}
                </div>
            `;

            // Attach claim button listener
            const claimBtn = item.querySelector('.btn-ach-claim');
            if (claimBtn) {
                claimBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const achId = claimBtn.dataset.achId;
                    const rew = parseInt(claimBtn.dataset.reward, 10);
                    if (storage.claimAchievementReward(achId, rew)) {
                        window.soundEngine.playReward();
                        this.updateHeaderStats();
                        this.renderAchievements();
                        this.showToast(isAr ? `🎉 مبروك! استلمت مكافأة الإنجاز +${rew} 🪙 بنجاح!` : `🎉 Congratulations! Claimed +${rew} coins!`);
                    }
                });
            }

            container.appendChild(item);
        });
    }

    checkAchievements() {
        const storage = window.storageManager;
        const isAr = (storage.data.settings.lang === 'ar');
        const catalog = this.getAchievementsCatalog();

        let newlyUnlockedCount = 0;
        let lastTitle = '';
        let lastReward = 0;

        catalog.forEach(ach => {
            const prog = ach.getProgress(storage);
            if (prog.current >= prog.target) {
                const wasNewlyUnlocked = storage.unlockAchievement(ach.id);
                if (wasNewlyUnlocked) {
                    newlyUnlockedCount++;
                    lastTitle = isAr ? ach.titleAr : ach.titleEn;
                    lastReward = ach.reward;
                }
            }
        });

        if (newlyUnlockedCount > 0) {
            setTimeout(() => {
                if (newlyUnlockedCount === 1) {
                    this.showAchievementPopup(lastTitle, isAr ? `استلم +${lastReward} 🪙 من الإنجازات` : `Claim +${lastReward} coins in achievements`);
                } else {
                    this.showAchievementPopup(
                        isAr ? `${newlyUnlockedCount} إنجازات جديدة` : `${newlyUnlockedCount} new achievements`,
                        isAr ? 'تفقد الإنجازات لاستلام الجوائز 🎁' : 'Open achievements to claim rewards 🎁'
                    );
                }
            }, 1200);
        }

        this.updateAchievementsBadge();
    }

    // Compact achievement banner sized for phone screens
    showAchievementPopup(title, subtitle) {
        const host = document.getElementById('android-device-wrapper') || document.body;
        let pop = document.getElementById('achievement-popup');
        if (!pop) {
            pop = document.createElement('div');
            pop.id = 'achievement-popup';
            pop.setAttribute('role', 'status');
            pop.innerHTML = `
                <div class="ach-pop-icon">🏆</div>
                <div class="ach-pop-text">
                    <span class="ach-pop-label"></span>
                    <span class="ach-pop-title"></span>
                    <span class="ach-pop-reward"></span>
                </div>`;
            host.appendChild(pop);
        }
        const isAr = window.storageManager && window.storageManager.data.settings.lang === 'ar';
        pop.setAttribute('dir', isAr ? 'rtl' : 'ltr');
        pop.querySelector('.ach-pop-text').style.textAlign = isAr ? 'right' : 'left';
        pop.querySelector('.ach-pop-label').textContent = isAr ? 'إنجاز مكتمل!' : 'Achievement unlocked!';
        pop.querySelector('.ach-pop-title').textContent = title;
        pop.querySelector('.ach-pop-reward').textContent = subtitle;

        clearTimeout(this._achPopTimer);
        pop.classList.remove('show');
        void pop.offsetWidth;
        pop.classList.add('show');
        if (window.soundEngine && window.soundEngine.playReward) {
            try { window.soundEngine.playReward(); } catch (e) { /* ignore */ }
        }
        this._achPopTimer = setTimeout(() => pop.classList.remove('show'), 3200);
    }

    // 10. Settings & Event Listeners
    applySettingsUI() {
        const s = window.storageManager.data.settings;
        const soundToggle = document.getElementById('toggle-sound');
        const musicToggle = document.getElementById('toggle-music');
        const vibToggle = document.getElementById('toggle-vibration');
        const langSelect = document.getElementById('select-language');
        const currentTheme = window.storageManager.data.selectedTheme || 'cyber';

        if (soundToggle) soundToggle.checked = s.sound;
        if (musicToggle) musicToggle.checked = s.music;
        if (vibToggle) vibToggle.checked = s.vibration;
        if (langSelect) langSelect.value = s.lang;

        window.soundEngine.setSoundEnabled(s.sound);
        window.soundEngine.setMusicEnabled(s.music);
        window.soundEngine.setVibrationEnabled(s.vibration);
        this.applyTheme(currentTheme);
    }

    showToast(message) {
        let toast = document.getElementById('app-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'app-toast';
            toast.setAttribute('role', 'status');
            (document.getElementById('android-device-wrapper') || document.body).appendChild(toast);
        }
        toast.textContent = message;
        void toast.offsetWidth;
        toast.classList.add('show');
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
    }

    setupEventListeners() {
        // Bottom Banner Ad initialization
        if (window.AndroidNative && typeof window.AndroidNative.setBannerVisible === 'function') {
            try {
                window.AndroidNative.setBannerVisible(true);
            } catch (e) {
                console.warn('Native banner error:', e);
            }
            const webBanner = document.getElementById('web-banner-ad');
            if (webBanner) webBanner.style.display = 'none';
        } else {
            const webBanner = document.getElementById('web-banner-ad');
            if (webBanner) webBanner.style.display = 'flex';
        }

        // Main Menu Buttons
        document.getElementById('btn-menu-play')?.addEventListener('click', () => {
            this.showScreen('screen-game');
            window.gameManager.startLevel(window.storageManager.data.currentLevel || 1, 'normal');
        });

        document.getElementById('btn-menu-levels')?.addEventListener('click', () => {
            this.showScreen('screen-levels');
        });

        document.getElementById('btn-menu-challenge')?.addEventListener('click', () => {
            const isAr = (window.storageManager?.data?.settings?.lang === 'ar');
            this.showToast(isAr ? '🔒 نمط التحديات قريباً!' : '🔒 Challenges Mode Coming Soon!');
        });

        document.getElementById('btn-menu-leaderboard')?.addEventListener('click', () => {
            const isAr = (window.storageManager?.data?.settings?.lang === 'ar');
            this.showToast(isAr ? '🔒 نمط التصنيف قريباً!' : '🔒 Leaderboard Coming Soon!');
        });

        document.getElementById('btn-menu-missions')?.addEventListener('click', () => {
            this.openDailyMissionsModal();
        });

        document.getElementById('btn-close-daily-missions')?.addEventListener('click', () => {
            this.closeDailyMissionsModal();
        });

        document.getElementById('btn-menu-themes')?.addEventListener('click', () => {
            this.showScreen('screen-themes');
        });

        document.getElementById('btn-menu-wheel')?.addEventListener('click', () => {
            this.openLuckySpinModal();
        });

        document.getElementById('btn-close-lucky-spin')?.addEventListener('click', () => {
            this.closeLuckySpinModal();
        });

        document.getElementById('btn-spin-wheel')?.addEventListener('click', () => {
            this.spinLuckyWheel();
        });

        document.getElementById('btn-menu-achievements')?.addEventListener('click', () => {
            this.showScreen('screen-achievements');
        });

        document.getElementById('btn-menu-settings')?.addEventListener('click', () => {
            document.getElementById('modal-settings')?.classList.add('active');
        });

        // Navigation Back Buttons
        document.querySelectorAll('.btn-back-to-menu').forEach(btn => {
            btn.addEventListener('click', () => this.showScreen('screen-menu'));
        });

        // Level Select World Jump to Current Level
        document.getElementById('btn-jump-current-level')?.addEventListener('click', () => {
            const playerCurrent = window.storageManager ? (window.storageManager.data.currentLevel || 1) : 1;
            this.selectedWorldIndex = Math.min(99, Math.max(0, Math.floor((playerCurrent - 1) / 50)));
            this.renderLevelSelectGrid();
            setTimeout(() => {
                const currentCard = document.querySelector('.level-card.current');
                if (currentCard) {
                    currentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        });

        // Open World Picker Modal
        document.getElementById('btn-open-world-picker')?.addEventListener('click', () => {
            this.openWorldPickerModal();
        });

        document.getElementById('btn-close-world-picker')?.addEventListener('click', () => {
            this.closeWorldPickerModal();
        });

        // Search/Jump to specific world in modal
        const doGoWorld = () => {
            const input = document.getElementById('input-world-search');
            if (!input || !window.WorldCatalog) return;
            const q = input.value.trim();
            if (q === '') {
                this.renderWorldPickerGrid();
                return;
            }
            const worlds = window.WorldCatalog.getWorlds();
            const match = worlds.find(w => w.name.includes(q));
            if (match) {
                this.selectedWorldIndex = match.worldIndex;
                this.closeWorldPickerModal();
                this.renderLevelSelectGrid();
            } else {
                this.renderWorldPickerGrid(q);
            }
        };

        document.getElementById('btn-go-world')?.addEventListener('click', doGoWorld);
        document.getElementById('input-world-search')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') doGoWorld();
        });
        document.getElementById('input-world-search')?.addEventListener('input', (e) => {
            this.renderWorldPickerGrid(e.target.value.trim());
        });

        // Level Select Tabs (Backwards compatibility)
        document.querySelectorAll('.level-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.level-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedLevelTab = btn.dataset.tab;
                this.renderLevelSelectGrid();
            });
        });

        // Gameplay HUD Controls
        document.getElementById('btn-gameplay-pause')?.addEventListener('click', () => {
            window.soundEngine.playClick();
            document.getElementById('modal-pause')?.classList.add('active');
        });

        document.getElementById('btn-pause-resume')?.addEventListener('click', () => {
            window.soundEngine.playClick();
            document.getElementById('modal-pause')?.classList.remove('active');
        });

        document.getElementById('btn-pause-restart')?.addEventListener('click', () => {
            this.closeAllModals();
            if (window.gameManager) {
                window.gameManager.startLevel(window.gameManager.currentLevel, window.gameManager.gameMode);
            }
        });

        document.getElementById('btn-pause-settings')?.addEventListener('click', () => {
            document.getElementById('modal-pause')?.classList.remove('active');
            document.getElementById('modal-settings')?.classList.add('active');
        });

        document.getElementById('btn-pause-home')?.addEventListener('click', () => {
            this.closeAllModals();
            this.showScreen('screen-menu');
        });

        document.getElementById('btn-gameplay-settings')?.addEventListener('click', () => {
            document.getElementById('modal-settings')?.classList.add('active');
        });

        // Bottom Controls: HINT, LASER, X-RAY, UNDO, RESET
        document.getElementById('btn-action-hint')?.addEventListener('click', () => {
            window.gameManager.useHint();
        });

        document.getElementById('btn-action-laser')?.addEventListener('click', () => {
            window.gameManager.activateLaserBooster();
        });

        document.getElementById('btn-action-xray')?.addEventListener('click', () => {
            window.gameManager.activateXRayVision();
        });

        document.getElementById('btn-action-reset')?.addEventListener('click', () => {
            window.gameManager.reset();
        });

        // Player Profile & Brain IQ Score (بطاقة اللاعب ومقياس الذكاء)
        // Note: Player card background click is disabled per user request
        document.getElementById('btn-mpc-share')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.shareBrainIQ();
        });
        document.getElementById('btn-close-player-profile')?.addEventListener('click', () => {
            this.closePlayerProfileModal();
        });
        document.getElementById('btn-profile-share')?.addEventListener('click', () => {
            this.shareBrainIQ();
        });

        // Edit Player Name (تغيير اسم اللاعب)
        document.getElementById('btn-edit-player-name')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openEditPlayerNameModal();
        });
        document.getElementById('btn-close-edit-name')?.addEventListener('click', () => {
            document.getElementById('modal-edit-player-name')?.classList.remove('active');
        });
        document.getElementById('btn-cancel-edit-name')?.addEventListener('click', () => {
            document.getElementById('modal-edit-player-name')?.classList.remove('active');
        });
        document.getElementById('btn-confirm-edit-name')?.addEventListener('click', () => {
            this.savePlayerName();
        });
        document.getElementById('input-player-name')?.addEventListener('input', (e) => {
            const val = e.target.value || '';
            const charCurrent = document.getElementById('name-edit-char-current');
            if (charCurrent) charCurrent.textContent = val.length;
            const errorMsg = document.getElementById('name-edit-error-msg');
            if (errorMsg) errorMsg.style.display = 'none';
        });
        document.getElementById('input-player-name')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.savePlayerName();
            }
        });

        // Level Complete Buttons
        // IMPORTANT RULE: "المستوى التالي" (NEXT) ONLY EXISTS ON LEVEL COMPLETE SCREEN!
        document.getElementById('btn-complete-next')?.addEventListener('click', () => {
            this.closeAllModals();
            if (window.gameManager.gameMode === 'challenge') {
                // Continue with the next unbeaten stage
                this.startChallengeStage(window.storageManager.getChallengePlayableStage());
            } else {
                const nextLvl = window.gameManager.currentLevel + 1;
                window.gameManager.startLevel(nextLvl, window.gameManager.gameMode);
            }
        });

        document.getElementById('btn-complete-retry')?.addEventListener('click', () => {
            this.closeAllModals();
            if (window.gameManager.gameMode === 'challenge') {
                // Replay the exact stage that was just played
                this.startChallengeStage(window.gameManager.challengeStage);
            } else {
                window.gameManager.startLevel(window.gameManager.currentLevel, window.gameManager.gameMode);
            }
        });

        document.getElementById('btn-complete-home')?.addEventListener('click', () => {
            this.closeAllModals();
            this.showScreen('screen-menu');
        });

        document.getElementById('btn-complete-share')?.addEventListener('click', () => {
            this.shareVictory();
        });

        // Level Failed Buttons: Resume with Ad, Restart Level, or Return Home
        document.getElementById('btn-failed-watch-ad')?.addEventListener('click', () => {
            this.triggerRewardedAd('failed_retry');
        });

        document.getElementById('btn-failed-restart')?.addEventListener('click', () => {
            this.closeAllModals();
            if (window.gameManager) {
                window.gameManager.isGameOver = false;
                window.gameManager.startLevel(window.gameManager.currentLevel, window.gameManager.gameMode);
            }
        });

        document.getElementById('btn-failed-home')?.addEventListener('click', () => {
            this.closeAllModals();
            if (window.gameManager) window.gameManager.isGameOver = false;
            this.showScreen('screen-menu');
        });

        // Ad Offer Modal Buttons (Out of hints / lasers)
        document.getElementById('btn-ad-offer-watch')?.addEventListener('click', () => {
            this.triggerRewardedAd(this.pendingAdOfferType || 'hint');
        });

        document.getElementById('btn-ad-offer-cancel')?.addEventListener('click', () => {
            document.getElementById('modal-ad-offer')?.classList.remove('active');
        });

        // Level Complete: Double reward with ad
        document.getElementById('btn-complete-double-reward')?.addEventListener('click', () => {
            this.triggerRewardedAd('double_coins');
        });

        // Themes Store: Watch Ad for Bonus Coins
        document.getElementById('btn-themes-ad-coins')?.addEventListener('click', () => {
            this.triggerRewardedAd('coins');
        });

        // Hint Dialog OK button
        document.getElementById('btn-hint-dialog-ok')?.addEventListener('click', () => {
            document.getElementById('modal-hint-dialog')?.classList.remove('active');
        });

        // Challenge Start Button (main hero button on challenge screen)
        document.getElementById('btn-challenge-play-now')?.addEventListener('click', () => {
            this.startChallengeStage(window.storageManager.getChallengePlayableStage());
        });

        // Settings toggles
        document.getElementById('toggle-sound')?.addEventListener('change', (e) => {
            window.storageManager.data.settings.sound = e.target.checked;
            window.soundEngine.setSoundEnabled(e.target.checked);
            window.storageManager.save();
        });

        document.getElementById('toggle-music')?.addEventListener('change', (e) => {
            window.storageManager.data.settings.music = e.target.checked;
            window.soundEngine.setMusicEnabled(e.target.checked);
            window.storageManager.save();
        });

        document.getElementById('toggle-vibration')?.addEventListener('change', (e) => {
            window.storageManager.data.settings.vibration = e.target.checked;
            window.soundEngine.setVibrationEnabled(e.target.checked);
            window.storageManager.save();
        });

        document.getElementById('select-language')?.addEventListener('change', (e) => {
            const lang = e.target.value;
            window.storageManager.data.settings.hasManualLangChoice = true;
            window.storageManager.data.settings.lang = lang;
            window.storageManager.save();
            this.applyLanguage(lang);
            window.soundEngine.playClick();
        });

        document.getElementById('btn-reset-data')?.addEventListener('click', () => {
            const isAr = (window.storageManager.data.settings.lang === 'ar');
            const msg = isAr 
                ? 'هل أنت متأكد من رغبتك في إعادة تعيين كافة تقدم اللعبة؟ لا يمكن التراجع عن هذا الإجراء!'
                : 'Are you sure you want to reset all game progress? This action cannot be undone!';
            if (confirm(msg)) {
                window.storageManager.resetProgress();
                location.reload();
            }
        });

        document.getElementById('btn-privacy-policy')?.addEventListener('click', () => {
            window.soundEngine?.playClick();
            this.openPrivacyPolicyModal();
        });

        document.getElementById('btn-close-privacy')?.addEventListener('click', () => {
            window.soundEngine?.playClick();
            document.getElementById('modal-privacy-policy')?.classList.remove('active');
        });

        document.getElementById('btn-close-settings')?.addEventListener('click', () => {
            window.soundEngine.playClick();
            document.getElementById('modal-settings')?.classList.remove('active');
        });

        document.getElementById('btn-resume-pause')?.addEventListener('click', () => {
            document.getElementById('modal-pause')?.classList.remove('active');
        });

        document.getElementById('btn-home-pause')?.addEventListener('click', () => {
            this.closeAllModals();
            this.showScreen('screen-menu');
        });

        // Store Category Tabs (Themes | Arrowheads | Trails)
        document.querySelectorAll('.store-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchStoreTab(btn.dataset.tab);
            });
        });
    }

    // ========================================================
    // CHALLENGE MODE & DAILY MISSIONS & NATIVE SHARE
    // ========================================================

    // Single entry point for launching any challenge stage
    startChallengeStage(stage) {
        const storage = window.storageManager;
        if (!storage || !window.gameManager) return;
        const isAr = (storage.data.settings.lang === 'ar');
        if (window.soundEngine) window.soundEngine.playClick();
        this.showToast(isAr ? '🔒 نمط التحديات قريباً!' : '🔒 Challenges Mode Coming Soon!');
    }

    renderChallengeScreen() {
        const storage = window.storageManager;
        if (!storage) return;

        const isAr = (storage.data.settings.lang === 'ar');
        const maxStage = storage.getChallengeMaxStage();
        const frontier = storage.getChallengeStage();          // may be maxStage + 1
        const playStage = storage.getChallengePlayableStage(); // capped to maxStage
        const allCleared = frontier > maxStage;
        const trophies = storage.getChallengeTrophies();
        const timeLimit = storage.getChallengeTimeLimitForStage(playStage);
        const reward = storage.getChallengeRewardForStage(playStage);
        const bestTime = storage.data.challengeBestTime ? `${storage.data.challengeBestTime}s` : '--';

        const setText = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };

        setText('challenge-screen-title', isAr ? 'نمط التحديات ⚔️' : 'Challenges ⚔️');
        setText('challenge-trophies-display', trophies);
        setText('challenge-trophies-count', `${trophies} 🏆`);
        setText('challenge-current-stage-title', allCleared
            ? (isAr ? '👑 أكملت جميع التحديات' : '👑 All Cleared')
            : (isAr ? `المرحلة ${playStage}` : `Stage ${playStage}`));
        setText('challenge-reward-val', allCleared ? '🪙 +5' : `🪙 +${reward}`);
        setText('challenge-time-limit', `${timeLimit}s ⏱️`);
        setText('challenge-best-time', bestTime);
        setText('challenge-label-time', isAr ? 'الوقت المتاح' : 'Time Limit');
        setText('challenge-label-best', isAr ? 'أفضل توقيت' : 'Best Time');
        setText('challenge-label-trophies', isAr ? 'الكؤوس' : 'Trophies');
        setText('challenge-play-label', allCleared
            ? (isAr ? 'إعادة المرحلة الأخيرة' : 'Replay Final Stage')
            : (isAr ? 'بدء التحدي الآن' : 'Start Challenge'));
        setText('challenge-stages-title', isAr
            ? `مراحل التحدي ${Math.min(frontier - 1, maxStage)} / ${maxStage}`
            : `Challenge Stages ${Math.min(frontier - 1, maxStage)} / ${maxStage}`);

        // Progress bar
        const fill = document.getElementById('challenge-progress-fill');
        if (fill) fill.style.width = `${Math.round((Math.min(frontier - 1, maxStage) / maxStage) * 100)}%`;

        const stagesContainer = document.getElementById('challenge-stages-container');
        if (!stagesContainer) return;
        stagesContainer.innerHTML = '';
        const frag = document.createDocumentFragment();
        let currentCard = null;

        for (let s = 1; s <= maxStage; s++) {
            const isCleared = s < frontier;
            const isCurrent = s === frontier;
            const isLocked = s > frontier;
            const isBoss = s % 5 === 0;

            const card = document.createElement('button');
            card.type = 'button';
            card.id = `challenge-stage-${s}`;
            card.className = `challenge-stage-card ${isCurrent ? 'current' : (isCleared ? 'cleared' : 'locked')}${isBoss ? ' boss' : ''}`;
            if (isLocked) card.disabled = true;

            const icon = isCleared ? '🏆' : (isCurrent ? '⚔️' : (isBoss ? '👑' : '🔒'));
            const status = isCleared
                ? (isAr ? 'مكتمل ✓' : 'Cleared ✓')
                : (isCurrent ? (isAr ? 'نشط الآن' : 'Active') : (isAr ? 'مغلق' : 'Locked'));

            card.innerHTML = `
                <span class="cs-icon">${icon}</span>
                <span class="cs-num">${s}</span>
                <span class="cs-status">${status}</span>
            `;

            if (!isLocked) {
                card.addEventListener('click', () => this.startChallengeStage(s));
            }
            if (isCurrent) currentCard = card;
            frag.appendChild(card);
        }
        stagesContainer.appendChild(frag);

        // Auto-scroll so the active stage is visible
        if (currentCard) {
            requestAnimationFrame(() => {
                const top = currentCard.offsetTop - stagesContainer.offsetTop - stagesContainer.clientHeight / 2 + currentCard.clientHeight / 2;
                stagesContainer.scrollTop = Math.max(0, top);
            });
        }
    }

    openDailyMissionsModal() {
        if (window.soundEngine) window.soundEngine.playClick();
        const modal = document.getElementById('modal-daily-missions');
        if (!modal) return;
        this.renderDailyMissions();
        modal.classList.add('active');
    }

    closeDailyMissionsModal() {
        document.getElementById('modal-daily-missions')?.classList.remove('active');
        this.updateHeaderStats();
    }

    renderDailyMissions() {
        const container = document.getElementById('daily-missions-list');
        if (!container || !window.storageManager) return;
        container.innerHTML = '';

        const missions = window.storageManager.getDailyMissions();
        const isAr = (window.storageManager.data.settings.lang === 'ar');

        missions.forEach(m => {
            const isCompleted = m.current >= m.target;
            const isClaimed = !!m.claimed;
            const pct = Math.min(100, Math.round((m.current / m.target) * 100));

            let actionHtml = '';
            if (isClaimed) {
                actionHtml = `<span class="mission-badge-claimed">✓ ${isAr ? 'تم الاستلام' : 'Claimed'}</span>`;
            } else if (isCompleted) {
                actionHtml = `<button class="btn-mission-claim" data-id="${m.id}"><span>🎁</span> <span>+${m.reward} 🪙</span></button>`;
            } else {
                actionHtml = `<span class="mission-badge-locked"><span>🔒</span> <span>+${m.reward}</span></span>`;
            }

            const card = document.createElement('div');
            card.className = `mission-card ${isClaimed ? 'claimed' : (isCompleted ? 'completed' : '')}`;
            card.innerHTML = `
                <div class="mission-icon">${m.icon}</div>
                <div class="mission-info">
                    <div class="mission-title">${isAr ? m.titleAr : m.titleEn}</div>
                    <div class="mission-bar-wrap">
                        <div class="mission-bar-fill" style="width: ${pct}%;"></div>
                    </div>
                    <div class="mission-count-text">${m.current} / ${m.target}</div>
                </div>
                <div class="mission-action">
                    ${actionHtml}
                </div>
            `;

            const claimBtn = card.querySelector('.btn-mission-claim');
            if (claimBtn) {
                claimBtn.onclick = () => {
                    const rewarded = window.storageManager.claimDailyMission(m.id);
                    if (rewarded > 0) {
                        window.soundEngine?.playReward();
                        this.updateHeaderStats();
                        this.renderDailyMissions();
                        this.showToast(isAr ? `🎉 مبروك! استلمت مكافأة المهمة +${rewarded} 🪙 بنجاح!` : `🎉 Claimed +${rewarded} coins!`);
                    }
                };
            }

            container.appendChild(card);
        });
    }

    updateMissionsBadge() {
        const badge = document.getElementById('missions-badge');
        if (!badge || !window.storageManager) return;
        const hasUnclaimed = window.storageManager.hasUnclaimedMissions();
        if (hasUnclaimed) {
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    openPrivacyPolicyModal() {
        const modal = document.getElementById('modal-privacy-policy');
        const bodyEl = document.getElementById('privacy-policy-body');
        if (!modal || !bodyEl) return;
        const isAr = (window.storageManager?.data?.settings?.lang === 'ar');

        if (isAr) {
            bodyEl.innerHTML = `
                <p style="margin-bottom: 10px;"><strong>لعبة هروب الأسهم (Arrow Escape)</strong> تحترم خصوصيتك بالكامل وتلتزم بأعلى معايير أمان البيانات.</p>
                <p style="margin-bottom: 8px;"><strong>1. حفظ البيانات محلياً:</strong> يتم تخزين كافة بيانات تقدمك، المستويات المكتملة، الكوينز، والإنجازات محلياً داخل جهازك فقط. لا نقوم بجمع أو حفظ أي بيانات شخصية على خوادم خارجية.</p>
                <p style="margin-bottom: 8px;"><strong>2. شبكة الإعلانات (Google AdMob):</strong> تستخدم اللعبة مكتبة إعلانات Google الرسمية لعرض الإعلانات بمكافأة وإعلانات البانر. قد تستخدم Google معرّف الإعلانات المجهول (AD_ID) لتقديم إعلانات آمنة ومناسبة وفقاً لسياسة خصوصية Google المعتمدة.</p>
                <p style="margin-bottom: 8px;"><strong>3. أمان العائلة والأطفال:</strong> اللعبة مصممة لجميع الأعمار وخالية من أي محتوى مسيء أو مشتريات إجبارية.</p>
                <p style="margin-bottom: 8px;"><strong>4. حرية التحكم ومسح البيانات:</strong> يمكنك في أي وقت مسح بياناتك وإعادة تعيين تقدمك بالكامل عبر زر "إعادة تعيين التقدم" من قائمة الإعدادات.</p>
            `;
        } else {
            bodyEl.innerHTML = `
                <p style="margin-bottom: 10px;"><strong>Arrow Escape</strong> values and respects your personal privacy.</p>
                <p style="margin-bottom: 8px;"><strong>1. Local Data Storage:</strong> All gameplay progress, records, and coins are stored solely on your device. We do not collect or upload your personal information to external servers.</p>
                <p style="margin-bottom: 8px;"><strong>2. Advertising (Google AdMob):</strong> We utilize the official Google Mobile Ads SDK for rewarded videos and banner ads. Google may process anonymized advertising identifiers (AD_ID) in strict compliance with Google Play Policies.</p>
                <p style="margin-bottom: 8px;"><strong>3. Families & Safety:</strong> Arrow Escape is completely family-friendly and suitable for all age groups.</p>
                <p style="margin-bottom: 8px;"><strong>4. Data Control:</strong> You have full control to reset or delete your local progress anytime via the "Reset Progress" option in Settings.</p>
            `;
        }
        modal.classList.add('active');
    }

    openPlayerProfileModal() {
        if (window.soundEngine) window.soundEngine.playClick();
        const modal = document.getElementById('modal-player-profile');
        if (!modal) return;

        const iqData = window.storageManager.getBrainIQ();
        const isAr = window.storageManager.data.settings.lang === 'ar';

        const scoreEl = document.getElementById('profile-iq-score');
        const badgeTitle = document.getElementById('profile-rank-title');
        const badgeIcon = document.getElementById('profile-rank-icon');
        const descEl = document.getElementById('profile-rank-desc');
        const lvlEl = document.getElementById('profile-stat-levels');
        const starsEl = document.getElementById('profile-stat-stars');
        const comboEl = document.getElementById('profile-stat-combo');
        const accEl = document.getElementById('profile-stat-accuracy');

        if (scoreEl) scoreEl.textContent = iqData.iq;
        if (badgeTitle) badgeTitle.textContent = isAr ? iqData.rankAr : iqData.rankEn;
        if (badgeIcon) badgeIcon.textContent = iqData.rankIcon;
        if (descEl) descEl.textContent = isAr ? (iqData.descAr || 'أداء واعد في بداية رحلة المتاهات') : (iqData.descEn || 'Promising start in the maze journey');
        if (lvlEl) lvlEl.textContent = iqData.totalSolved;
        if (starsEl) starsEl.textContent = iqData.totalStars;
        if (comboEl) comboEl.textContent = `x${iqData.bestCombo}`;
        if (accEl) accEl.textContent = `${iqData.accuracy}%`;

        modal.classList.add('active');
    }

    closePlayerProfileModal() {
        document.getElementById('modal-player-profile')?.classList.remove('active');
    }

    openEditPlayerNameModal() {
        if (window.soundEngine) window.soundEngine.playClick();
        const modal = document.getElementById('modal-edit-player-name');
        if (!modal) return;

        const storage = window.storageManager;
        const currentName = storage.getPlayerName();
        const cost = storage.getNameChangeCost();
        const coins = storage.data.coins || 0;
        const isAr = storage.data.settings?.lang === 'ar';

        const input = document.getElementById('input-player-name');
        const banner = document.getElementById('name-edit-cost-banner');
        const costText = document.getElementById('name-edit-cost-text');
        const btnText = document.getElementById('name-edit-btn-text');
        const errorMsg = document.getElementById('name-edit-error-msg');
        const charCurrent = document.getElementById('name-edit-char-current');

        if (input) {
            input.value = currentName;
            if (charCurrent) charCurrent.textContent = currentName.length;
        }
        if (errorMsg) errorMsg.style.display = 'none';

        if (cost === 0) {
            if (banner) banner.className = 'name-edit-cost-banner free';
            if (costText) costText.textContent = isAr ? '🎁 المرة الأولى مجانية بالكامل!' : '🎁 First time is completely FREE!';
            if (btnText) btnText.textContent = isAr ? 'حفظ الاسم (مجاناً)' : 'Save Name (Free)';
        } else {
            if (banner) banner.className = 'name-edit-cost-banner paid';
            if (costText) costText.innerHTML = isAr ? `🪙 التكلفة: <b>10,000</b> عملة (رصيدك: ${coins.toLocaleString()})` : `🪙 Cost: <b>10,000</b> coins (Your balance: ${coins.toLocaleString()})`;
            if (btnText) btnText.textContent = isAr ? 'تغيير الاسم (10,000 🪙)' : 'Change Name (10,000 🪙)';
        }

        modal.classList.add('active');
        setTimeout(() => input?.focus(), 150);
    }

    savePlayerName() {
        const storage = window.storageManager;
        const input = document.getElementById('input-player-name');
        const errorMsg = document.getElementById('name-edit-error-msg');
        const isAr = storage.data.settings?.lang === 'ar';

        const newName = (input?.value || '').trim();
        if (!newName) {
            if (errorMsg) {
                errorMsg.textContent = isAr ? 'يرجى إدخال اسم صحيح!' : 'Please enter a valid name!';
                errorMsg.style.display = 'block';
            }
            return;
        }

        const cost = storage.getNameChangeCost();
        const currentCoins = storage.data.coins || 0;
        if (cost > 0 && currentCoins < cost) {
            if (errorMsg) {
                errorMsg.textContent = isAr ? `رصيدك غير كافٍ! تحتاج إلى ${cost.toLocaleString()} عملة.` : `Insufficient balance! You need ${cost.toLocaleString()} coins.`;
                errorMsg.style.display = 'block';
            }
            if (window.soundEngine) window.soundEngine.playFail();
            return;
        }

        const success = storage.setPlayerName(newName);
        if (success) {
            if (window.soundEngine) window.soundEngine.playWin();
            this.updatePlayerCard();
            this.updateHeaderStats();
            this.showToast(isAr ? 'تم تغيير اسم اللاعب بنجاح! ✨' : 'Player name updated successfully! ✨');
            document.getElementById('modal-edit-player-name')?.classList.remove('active');
        }
    }

    shareBrainIQ() {
        const iqData = window.storageManager.getBrainIQ();
        const isAr = window.storageManager.data.settings.lang === 'ar';
        const title = isAr ? 'بطاقة مقياس الذكاء التكتيكي - ARROW ESCAPE 🧠' : 'Tactical Brain IQ Card - ARROW ESCAPE 🧠';
        const text = isAr 
            ? `🧠 مقياس ذكائي التكتيكي في لعبة ARROW ESCAPE هو IQ: ${iqData.iq}!\nالرتبة: ${iqData.rankIcon} ${iqData.rankAr}\nالمراحل المحلولة: ${iqData.totalSolved} 🏆 | الدقة: ${iqData.accuracy}%\nهل تستطيع التفوق علي واجتياز مستواي؟ 🏹⚡`
            : `🧠 My Tactical Brain IQ in ARROW ESCAPE is IQ: ${iqData.iq}!\nRank: ${iqData.rankIcon} ${iqData.rankEn}\nLevels Solved: ${iqData.totalSolved} 🏆 | Accuracy: ${iqData.accuracy}%\nCan you beat my IQ score? 🏹⚡`;

        if (window.AndroidNative && typeof window.AndroidNative.shareText === 'function') {
            window.AndroidNative.shareText(title, text);
        } else if (navigator.share) {
            navigator.share({ title, text }).catch(() => {});
        } else {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text);
            }
            this.showToast(isAr ? '📋 تم نسخ بطاقة الذكاء إلى الحافظة للمشاركة!' : '📋 Copied IQ card to clipboard!');
        }
    }

    shareVictory() {
        const lvl = (window.gameManager && window.gameManager.currentLevel) || 1;
        const isAr = (window.storageManager?.data?.settings?.lang === 'ar');
        const title = 'ARROW ESCAPE 🏹';
        const text = isAr 
            ? `🎉 لقد اجتزت بنجاح المرحلة ${lvl} في لعبة الألغاز ARROW ESCAPE! 🏹🔥 هل يمكنك تحدي عقلك وحل هذا اللغز الشيق؟`
            : `🎉 I just completed Level ${lvl} in ARROW ESCAPE! 🏹🔥 Can your brain solve this exciting maze puzzle?`;

        if (window.AndroidNative && typeof window.AndroidNative.shareText === 'function') {
            window.AndroidNative.shareText(title, text);
        } else if (navigator.share) {
            navigator.share({ title, text }).catch(() => {});
        } else {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text);
            }
            this.showToast(isAr ? '📋 تم نسخ رسالة الفوز للمشاركة!' : '📋 Copied victory message to clipboard!');
        }
    }
}

if (typeof module !== 'undefined') {
    module.exports = UIController;
}
if (typeof window !== 'undefined') {
    window.uiController = new UIController();

    // Global Android Native AdMob Rewarded Callback
    window.onRewardedAdEarned = function(rewardType) {
        if (window.uiController) {
            window.uiController.completeRewardedAd(rewardType);
        }
    };
}

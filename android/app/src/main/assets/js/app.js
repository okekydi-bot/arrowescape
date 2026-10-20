/// Main Application Bootstrapper - Android Only
document.addEventListener('DOMContentLoaded', () => {
    // التحقق الصارم: حظر التشغيل تماماً خارج تطبيق الأندرويد الأصلي
    if (!window.AndroidNative) {
        document.documentElement.innerHTML = `
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>ARROW ESCAPE - نظام أندرويد فقط</title>
                <style>
                    body {
                        margin: 0;
                        padding: 24px;
                        background: #070b14;
                        color: #f8fafc;
                        font-family: 'Cairo', system-ui, -apple-system, sans-serif;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        box-sizing: border-box;
                        text-align: center;
                        direction: rtl;
                    }
                    .phone-icon {
                        font-size: 80px;
                        margin-bottom: 24px;
                        filter: drop-shadow(0 0 20px rgba(0, 240, 255, 0.6));
                        animation: pulse 2s infinite ease-in-out;
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.08); }
                    }
                    h1 {
                        font-size: 26px;
                        color: #00f0ff;
                        margin-bottom: 12px;
                        font-weight: 800;
                    }
                    p {
                        font-size: 16px;
                        color: #94a3b8;
                        max-width: 400px;
                        line-height: 1.7;
                        margin-bottom: 24px;
                    }
                    .badge {
                        background: rgba(0, 240, 255, 0.1);
                        border: 1px solid rgba(0, 240, 255, 0.3);
                        padding: 10px 20px;
                        border-radius: 30px;
                        color: #00f0ff;
                        font-size: 14px;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="phone-icon">📱</div>
                <h1>مخصص لأجهزة الأندرويد فقط</h1>
                <p>تم تصميم وبرمجة لعبة <strong>ARROW ESCAPE</strong> لتعمل حصرياً كتطبيق أصلي مثبت على هواتف وأجهزة الأندرويد (APK)، ولا تدعم التشغيل عبر متصفحات الويب.</p>
                <div class="badge">🤖 متوافق مع نظام أندرويد فقط</div>
            </body>
        `;
        return;
    }

    document.body.classList.add('is-native-android');

    // 1. Initialize UI Controller
    window.uiController.init();

    // 2. Initialize Game Manager
    window.gameManager.init();

    // 3. Background music user-gesture unlock
    const unlockAudio = () => {
        window.soundEngine.initAudioContext();
        window.soundEngine.resume();
        if (window.storageManager.data.settings.music) {
            window.soundEngine.startMusic();
        }
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
    };
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });

    // 4. Prevent window-level rubber-band dragging/overscroll bounce that exposes background void
    document.addEventListener('touchmove', (e) => {
        let el = e.target;
        let canScroll = false;
        while (el && el !== document.body && el !== document.documentElement) {
            if (el.scrollHeight > el.clientHeight + 2) {
                const style = window.getComputedStyle(el);
                const overflowY = style.overflowY;
                if (overflowY === 'auto' || overflowY === 'scroll') {
                    canScroll = true;
                    break;
                }
            }
            el = el.parentElement;
        }
        if (!canScroll) {
            e.preventDefault();
        }
    }, { passive: false });

    console.log('Arrow Escape game initialized successfully on Native Android.');
});

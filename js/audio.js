// Audio Engine for Arrow Escape using Web Audio API
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.soundEnabled = true;
        this.musicEnabled = true;
        this.vibrationEnabled = true;
        this.musicInterval = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.initAudioContext();
    }

    initAudioContext() {
        if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContextClass();
            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.value = 0.6;
            this.sfxGain.connect(this.ctx.destination);

            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.value = 0.25;
            this.musicGain.connect(this.ctx.destination);
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    vibrate(pattern = [25]) {
        if (!this.vibrationEnabled) return;
        try {
            if (window.AndroidNative && typeof window.AndroidNative.vibrate === 'function') {
                const duration = Array.isArray(pattern) ? (pattern[0] || 25) : pattern;
                window.AndroidNative.vibrate(duration);
            } else if (navigator.vibrate) {
                navigator.vibrate(pattern);
            }
        } catch (e) {}
    }

    // UI Click
    playClick() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.05);
        this.vibrate([15]);
    }

    // Arrow Tile Rotate
    playRotate() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.09);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.1);
        this.vibrate([20]);
    }

    // Blocked Arrow Error Sound
    playBlocked() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'square';

        osc1.frequency.setValueAtTime(140, now);
        osc1.frequency.linearRampToValueAtTime(90, now + 0.25);

        osc2.frequency.setValueAtTime(148, now); // Dissonant beating
        osc2.frequency.linearRampToValueAtTime(95, now + 0.25);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.sfxGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.25);
        osc2.stop(now + 0.25);

        this.vibrate([80, 40, 80]);
    }

    // Path connection ding
    playConnect(pitchMultiplier = 1) {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const baseFreq = 523.25 * pitchMultiplier; // C5
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.15);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.25);
        this.vibrate([30]);
    }

    // Hint used
    playHint() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.06;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.25, t);
            gain.gain.exponentialRampToValueAtTime(0.005, t + 0.15);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(t);
            osc.stop(t + 0.15);
        });
        this.vibrate([40, 20, 40]);
    }

    // Glowing Arrow Traveling along the completed path
    playArrowTravel(isCyan = true) {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const startFreq = isCyan ? 440 : 330;
        const endFreq = isCyan ? 880 : 660;

        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.6);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.7);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.7);
    }

    // Glowing Arrow arrives at destination endpoint with power surge
    playDestinationArrival() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Harmonic power resonance
        const freqs = [587.33, 880, 1174.66]; // D Major high energy chime
        freqs.forEach(freq => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + 0.3);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.4);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(now);
            osc.stop(now + 0.4);
        });
        this.vibrate([35, 20, 50]);
    }

    // High Speed Combo Sound
    playCombo(combo = 2) {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const basePitch = Math.min(2.2, 1 + (combo - 2) * 0.15);
        const notes = [523.25 * basePitch, 659.25 * basePitch, 783.99 * basePitch, 1046.50 * basePitch];

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.045;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.08, t + 0.12);

            gain.gain.setValueAtTime(0.28, t);
            gain.gain.exponentialRampToValueAtTime(0.005, t + 0.16);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(t);
            osc.stop(t + 0.16);
        });

        this.vibrate([20, 20, 35]);
    }

    // Sci-Fi Laser Zap Booster
    playLaserZap() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.28);

        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.3);
        this.vibrate([60, 20, 80]);
    }

    // Level Win Fanfare
    playWin() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Ascending triumphant chords
        const chords = [
            [523.25, 659.25, 783.99],       // C Major
            [587.33, 739.99, 880.00],       // D Major
            [659.25, 830.61, 987.77],       // E Major
            [1046.50, 1318.51, 1567.98]     // High C Major
        ];

        chords.forEach((chord, step) => {
            const stepTime = now + step * 0.15;
            const duration = step === chords.length - 1 ? 0.7 : 0.2;
            chord.forEach(freq => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, stepTime);

                gain.gain.setValueAtTime(0.2, stepTime);
                gain.gain.exponentialRampToValueAtTime(0.005, stepTime + duration);

                osc.connect(gain);
                gain.connect(this.sfxGain);

                osc.start(stepTime);
                osc.stop(stepTime + duration);
            });
        });
        this.vibrate([100, 50, 100, 50, 150]);
    }

    // Rewarded Ad completion / Coins award
    playReward() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const freqs = [784, 880, 988, 1046, 1318];
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.08;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.005, t + 0.2);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(t);
            osc.stop(t + 0.2);
        });
        this.vibrate([50, 30, 50, 30, 80]);
    }

    // Level Failed sound
    playGameOver() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [330, 311, 293, 277];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.16;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(t);
            osc.stop(t + 0.25);
        });
        this.vibrate([150, 80, 200]);
    }

    // Key unlocks locked arrow sound
    playUnlock() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const freqs = [587.33, 880, 1174.66, 1760]; // D Major ascending crystal arpeggio
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.04;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.15, t + 0.15);

            gain.gain.setValueAtTime(0.25, t);
            gain.gain.exponentialRampToValueAtTime(0.005, t + 0.22);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(t);
            osc.stop(t + 0.22);
        });
        this.vibrate([25, 30, 45]);
    }

    // Boss level victory fanfare
    playBossWin() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Deep sub punch
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(110, now);
        subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.6);
        subGain.gain.setValueAtTime(0.4, now);
        subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        subOsc.connect(subGain);
        subGain.connect(this.sfxGain);
        subOsc.start(now);
        subOsc.stop(now + 0.6);

        // Regal brass chords
        const chords = [
            { t: 0.0, freqs: [440, 554.37, 659.25] },     // A Maj
            { t: 0.18, freqs: [493.88, 622.25, 739.99] }, // B Maj
            { t: 0.38, freqs: [554.37, 659.25, 830.61] }, // C# Min
            { t: 0.65, freqs: [880, 1108.73, 1318.51] }   // A High Regal
        ];

        chords.forEach(c => {
            c.freqs.forEach(freq => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const t = now + c.t;
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, t);
                gain.gain.setValueAtTime(0.18, t);
                gain.gain.exponentialRampToValueAtTime(0.005, t + 0.45);
                osc.connect(gain);
                gain.connect(this.sfxGain);
                osc.start(t);
                osc.stop(t + 0.45);
            });
        });
        this.vibrate([60, 40, 80, 50, 150]);
    }

    // Lucky Wheel Tick sound
    playWheelTick() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.025);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.025);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.025);
        this.vibrate([10]);
    }

    // Lucky Wheel Win Prize Chime
    playWheelWin() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.07;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.05, t + 0.25);

            gain.gain.setValueAtTime(0.28, t);
            gain.gain.exponentialRampToValueAtTime(0.005, t + 0.35);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(t);
            osc.stop(t + 0.35);
        });
        this.vibrate([70, 40, 90, 50, 120]);
    }

    // Procedural Ambient Synthwave Background Music
    startMusic() {
        if (!this.musicEnabled || this.musicInterval) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const scale = [196, 220, 261.63, 293.66, 329.63, 392, 440]; // A Minor Pentatonic / Cyberpunk
        let step = 0;

        const playMusicBeat = () => {
            if (!this.musicEnabled || !this.ctx) return;
            const now = this.ctx.currentTime;

            // Bass note every 4 steps
            if (step % 4 === 0) {
                const bassOsc = this.ctx.createOscillator();
                const bassGain = this.ctx.createGain();
                const bassRoot = step % 8 === 0 ? 55 : 65.41; // A1 or C2

                bassOsc.type = 'sawtooth';
                bassOsc.frequency.setValueAtTime(bassRoot, now);

                bassGain.gain.setValueAtTime(0.2, now);
                bassGain.gain.exponentialRampToValueAtTime(0.005, now + 0.6);

                bassOsc.connect(bassGain);
                bassGain.connect(this.musicGain);

                bassOsc.start(now);
                bassOsc.stop(now + 0.6);
            }

            // Synth arpeggio
            const arpIndex = (step * 2 + (step % 3)) % scale.length;
            const noteFreq = scale[arpIndex];

            const arpOsc = this.ctx.createOscillator();
            const arpGain = this.ctx.createGain();

            arpOsc.type = 'sine';
            arpOsc.frequency.setValueAtTime(noteFreq, now);

            arpGain.gain.setValueAtTime(0.09, now);
            arpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

            arpOsc.connect(arpGain);
            arpGain.connect(this.musicGain);

            arpOsc.start(now);
            arpOsc.stop(now + 0.22);

            step = (step + 1) % 32;
        };

        this.musicInterval = setInterval(playMusicBeat, 240); // ~125 BPM
    }

    stopMusic() {
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
    }

    setSoundEnabled(val) {
        this.soundEnabled = val;
    }

    setMusicEnabled(val) {
        this.musicEnabled = val;
        if (val) {
            this.startMusic();
        } else {
            this.stopMusic();
        }
    }

    playCombo(count = 2) {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const baseFreq = 440 * Math.pow(1.15, Math.min(8, count));
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, now + 0.18);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.22);
        this.vibrate([20, 25, 20]);
    }

    playIceCrack() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.09);
        this.vibrate([35]);
    }

    playWheelTick() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.03);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.03);
        this.vibrate([10]);
    }

    playWheelWin() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.08;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.35, t);
            gain.gain.exponentialRampToValueAtTime(0.005, t + 0.25);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(t);
            osc.stop(t + 0.25);
        });
        this.vibrate([50, 40, 50, 40, 100]);
    }

    // Harmonic Musical Escapes - Ascending pentatonic melody
    playHarmonicEscape(step = 0) {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
        const noteIndex = Math.max(0, step) % scale.length;
        const freq = scale[noteIndex];

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Warm melodic chime tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.01, now + 0.18);

        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.22);
    }

    // Portal Wormhole Teleport Sound
    playPortal() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(550, now + 0.25);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.25);
        this.vibrate([25, 30, 40]);
    }

    // Bomb / EMP Blast Sound
    playBomb() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

        gain.gain.setValueAtTime(0.55, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.35);
        this.vibrate([60, 40, 80]);
    }

    // X-Ray Vision Scan Sound
    playXRay() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(1400, now + 0.2);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.45);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.45);
        this.vibrate([20, 20, 30]);
    }

    // Mystery Crate Open Chime
    playCrateOpen() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        [587.33, 739.99, 880.00, 1174.66].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.06;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.38, t);
            gain.gain.exponentialRampToValueAtTime(0.005, t + 0.3);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(t);
            osc.stop(t + 0.3);
        });
        this.vibrate([40, 30, 60]);
    }

    // Magnetic Pulse Hum
    playMagnet() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(350, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.3);
        this.vibrate([30, 20, 40]);
    }

    setVibrationEnabled(val) {
        this.vibrationEnabled = val;
    }
}

if (typeof module !== 'undefined') {
    module.exports = SoundEngine;
}
if (typeof window !== 'undefined') {
    window.soundEngine = new SoundEngine();
}

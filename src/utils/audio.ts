// Web Audio API Sound Synthesizer for "Ai Là Triệu Phú"
class AudioEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  constructor() {
    // Lazy init
  }

  private initContext() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public playTone(frequency: number, type: OscillatorType, duration: number, volume = 0.1) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignore audio failure
    }
  }

  public playHover() {
    this.playTone(520, 'sine', 0.08, 0.04);
  }

  public playSelect() {
    // Suspense select chord
    this.playTone(220, 'triangle', 1.8, 0.06);
    setTimeout(() => this.playTone(330, 'sine', 1.5, 0.04), 80);
  }

  public playLifeline() {
    // Magic chime
    [659.25, 783.99, 987.77, 1318.51].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.3, 0.06), idx * 70);
    });
  }

  public playCorrect() {
    // Authentic victory chime (C major arpeggio upward with reverb feel)
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.5, 0.08), idx * 90);
    });
  }

  public playWrong() {
    // Dramatic descending bass tone
    this.playTone(220, 'sawtooth', 0.4, 0.08);
    setTimeout(() => this.playTone(164.81, 'sawtooth', 0.5, 0.09), 150);
    setTimeout(() => this.playTone(110, 'sawtooth', 0.8, 0.1), 350);
  }

  public playWin() {
    // Grand celebration fanfare
    const fanfare = [
      { f: 523.25, d: 0.2 },
      { f: 523.25, d: 0.2 },
      { f: 523.25, d: 0.2 },
      { f: 659.25, d: 0.4 },
      { f: 783.99, d: 0.4 },
      { f: 1046.50, d: 0.8 }
    ];
    let delay = 0;
    fanfare.forEach((n) => {
      setTimeout(() => this.playTone(n.f, 'triangle', n.d, 0.09), delay);
      delay += n.d * 800;
    });
  }
}

export const audio = new AudioEngine();

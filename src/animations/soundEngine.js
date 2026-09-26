/**
 * Optional Subtle Tactile Sound Synthesizer (Web Audio API)
 * Never autoplays. Only activates if the user toggles SOUND ON or interacts after enabling.
 */
class SoundEngine {
  constructor() {
    this.enabled = false;
    this.ctx = null;
  }

  initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.initContext();
      this.playClick(660, 0.06);
    }
    return this.enabled;
  }

  playHover() {
    if (!this.enabled) return;
    this.playClick(420, 0.025, "sine", 0.025);
  }

  playClick(freq = 520, duration = 0.055, type = "triangle", gainVal = 0.045) {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        freq * 0.45,
        this.ctx.currentTime + duration
      );

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        this.ctx.currentTime + duration
      );

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio errors
    }
  }
}

export const soundFX = new SoundEngine();

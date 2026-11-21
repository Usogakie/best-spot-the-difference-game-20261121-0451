// Twin Spots — all sound is synthesized with WebAudio: no audio files,
// no network. A tiny tone helper plus one little melody per game event.
export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return this.ctx;
    }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
    } catch {
      this.ctx = null;
    }
    return this.ctx;
  }

  tone(freq, dur, type, vol, delay, slideTo) {
    const ctx = this.ensure();
    if (!ctx || this.muted) return;
    try {
      const t0 = ctx.currentTime + (delay || 0);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, t0);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(vol || 0.12, t0 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    } catch {
      // Sound is garnish: never let it break the game.
    }
  }

  click() {
    this.tone(660, 0.06, 'triangle', 0.08);
  }

  correct() {
    this.tone(880, 0.12, 'sine', 0.14);
    this.tone(1318, 0.22, 'sine', 0.14, 0.09);
  }

  wrong() {
    this.tone(160, 0.28, 'sawtooth', 0.1, 0, 110);
  }

  hint() {
    this.tone(990, 0.1, 'sine', 0.09);
    this.tone(1480, 0.14, 'sine', 0.07, 0.08);
  }

  win() {
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.22, 'triangle', 0.12, i * 0.11));
  }

  levelDone() {
    [659, 784, 988].forEach((f, i) => this.tone(f, 0.18, 'triangle', 0.11, i * 0.1));
  }
}

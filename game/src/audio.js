// Every sound is synthesized with WebAudio: no audio files, no network. A small
// helper plays a short tone; each named sound is a few tones in a row.

let context = null;

function ac() {
  if (context === null) {
    const AudioContext = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContext) return null;
    context = new AudioContext();
  }
  if (context.state === 'suspended') void context.resume();
  return context;
}

function tone(freq, at, dur, type, gain) {
  const ctx = ac();
  if (ctx === null) return;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.setValueAtTime(0, ctx.currentTime + at);
  amp.gain.linearRampToValueAtTime(gain, ctx.currentTime + at + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + at + dur);
  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start(ctx.currentTime + at);
  osc.stop(ctx.currentTime + at + dur + 0.05);
}

/** A bright pop when a difference is found. */
export function playFound() {
  tone(660, 0, 0.12, 'sine', 0.22);
  tone(990, 0.07, 0.16, 'sine', 0.18);
}

/** A low buzz for a wrong click. */
export function playMiss() {
  tone(140, 0, 0.18, 'sawtooth', 0.12);
}

/** A soft shimmer for a hint. */
export function playHint() {
  tone(880, 0, 0.1, 'triangle', 0.14);
  tone(1174, 0.09, 0.14, 'triangle', 0.12);
}

/** A little fanfare when a level is cleared. */
export function playClear() {
  tone(523, 0, 0.14, 'triangle', 0.2);
  tone(659, 0.12, 0.14, 'triangle', 0.2);
  tone(784, 0.24, 0.22, 'triangle', 0.2);
  tone(1046, 0.38, 0.3, 'triangle', 0.18);
}

/** A sad slide when time runs out. */
export function playTimeout() {
  tone(392, 0, 0.2, 'sine', 0.16);
  tone(311, 0.18, 0.24, 'sine', 0.16);
  tone(233, 0.36, 0.36, 'sine', 0.14);
}

/** A click for buttons and menus. */
export function playClick() {
  tone(520, 0, 0.06, 'square', 0.08);
}

// Twin Spots — bootstrap: build the state, the sound bank and the input,
// apply any ?shot= state for screenshots, then run the frame loop.
import { SoundBank } from './audio.js';
import { attachInput } from './input.js';
import { draw } from './render.js';
import { applyShot } from './shots.js';
import { TwinSpotsState } from './state.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const state = new TwinSpotsState();
const sfx = new SoundBank();

applyShot(state, window.location.search);
attachInput(canvas, state, sfx);

// A handle for play-testing and screenshots.
window.__twinSpots = { state, sfx };

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  state.now = now / 1000;
  state.tick(dt);
  draw(ctx, state, now / 1000);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Pointer and keyboard input, translated into game coordinates. The canvas is
// scaled to the window, so a click's client position is mapped back into the
// 1280x800 logical field before the game sees it.

import { FIELD } from './config.js';

/**
 * Wire a canvas to the game. `handlers` gets onTap(x, y) in logical coordinates,
 * onKey(key) for keys, and onHover(x, y) for the mouse position. Returns a function
 * that reports the current scale, so the renderer can draw the hover ring.
 */
export function wireInput(canvas, handlers) {
  function toLogical(event) {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(rect.width / FIELD.width, rect.height / FIELD.height);
    const offsetX = (rect.width - FIELD.width * scale) / 2;
    const offsetY = (rect.height - FIELD.height * scale) / 2;
    return {
      x: (event.clientX - rect.left - offsetX) / scale,
      y: (event.clientY - rect.top - offsetY) / scale,
    };
  }

  canvas.addEventListener('pointerdown', (event) => {
    const point = toLogical(event);
    handlers.onTap(point.x, point.y);
  });
  canvas.addEventListener('pointermove', (event) => {
    const point = toLogical(event);
    handlers.onHover(point.x, point.y);
  });
  canvas.addEventListener('pointerleave', () => handlers.onHover(-1, -1));
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    handlers.onKey(event.key.toLowerCase());
  });
}

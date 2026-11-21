// Twin Spots — pointer and keyboard input. Pointer clicks are mapped from
// the canvas's on-screen box back into the 1280x800 logical field, then
// tested against the current screen's buttons and, while playing, the two
// picture panels and their difference spots.
import { FIELD_HEIGHT, FIELD_WIDTH, PANEL_HEIGHT, PANEL_LEFT_X, PANEL_RIGHT_X, PANEL_WIDTH, PANEL_Y } from './config.js';

function toLogical(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * FIELD_WIDTH,
    y: ((event.clientY - rect.top) / rect.height) * FIELD_HEIGHT,
  };
}

function nearestUnfound(state, lx, ly) {
  let best = -1;
  let bestDist = Infinity;
  state.scene.differences.forEach((diff, i) => {
    if (state.found.has(i)) return;
    const d = Math.hypot(diff.x - lx, diff.y - ly);
    if (d <= diff.r + 10 && d < bestDist) {
      best = i;
      bestDist = d;
    }
  });
  return best;
}

export function attachInput(canvas, state, sfx) {
  function handleButton(id) {
    switch (id) {
      case 'start':
        sfx.ensure();
        sfx.click();
        state.startLevel(0);
        return true;
      case 'again':
        sfx.click();
        state.resetAll();
        state.startLevel(0);
        return true;
      case 'next':
        sfx.click();
        state.nextLevel();
        if (state.screen === 'victory') sfx.win();
        else sfx.levelDone();
        return true;
      case 'replay':
      case 'retry':
        sfx.click();
        state.restartLevel();
        return true;
      case 'restart':
        sfx.click();
        state.restartLevel();
        return true;
      case 'menu':
        sfx.click();
        state.toMenu();
        return true;
      case 'hint':
        if (state.useHint()) sfx.hint();
        return true;
      default:
        if (id.startsWith('level-')) {
          sfx.ensure();
          sfx.click();
          state.startLevel(Number(id.slice(6)));
          return true;
        }
        return false;
    }
  }

  canvas.addEventListener('pointerdown', (event) => {
    const { x, y } = toLogical(canvas, event);
    for (let i = state.uiButtons.length - 1; i >= 0; i--) {
      const b = state.uiButtons[i];
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
        handleButton(b.id);
        return;
      }
    }
    if (state.screen !== 'playing') return;
    const panels = [
      { panel: 0, x0: PANEL_LEFT_X },
      { panel: 1, x0: PANEL_RIGHT_X },
    ];
    for (const { panel, x0 } of panels) {
      if (x >= x0 && x <= x0 + PANEL_WIDTH && y >= PANEL_Y && y <= PANEL_Y + PANEL_HEIGHT) {
        const lx = x - x0;
        const ly = y - PANEL_Y;
        const hit = nearestUnfound(state, lx, ly);
        if (hit !== -1) {
          state.registerFound(hit);
          if (state.screen === 'levelDone') sfx.levelDone();
          else sfx.correct();
        } else {
          state.registerMiss(lx, ly, panel);
          sfx.wrong();
        }
        return;
      }
    }
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (state.screen === 'menu') {
      if (key === 'enter' || key === ' ') {
        event.preventDefault();
        handleButton('start');
      } else if (key === '1' || key === '2' || key === '3') {
        handleButton(`level-${Number(key) - 1}`);
      }
      return;
    }
    if (state.screen === 'playing') {
      if (key === 'h') handleButton('hint');
      else if (key === 'r') handleButton('restart');
      else if (key === 'm' || key === 'escape') handleButton('menu');
      return;
    }
    if (state.screen === 'levelDone') {
      if (key === 'enter' || key === ' ') handleButton('next');
      else if (key === 'r') handleButton('replay');
      else if (key === 'm' || key === 'escape') handleButton('menu');
      return;
    }
    if (state.screen === 'timeUp') {
      if (key === 'r' || key === 'enter' || key === ' ') handleButton('retry');
      else if (key === 'm' || key === 'escape') handleButton('menu');
      return;
    }
    if (state.screen === 'victory') {
      if (key === 'enter' || key === ' ') handleButton('again');
      else if (key === 'm' || key === 'escape') handleButton('menu');
    }
  });
}

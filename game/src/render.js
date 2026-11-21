// Everything on screen: the two picture panels, the markers on the differences
// found, the timer, the score, the hints, and the title, clear, time-out and win
// screens. It draws; it decides nothing. The scene pictures are painted once per
// level onto offscreen canvases and blitted every frame.

import { FIELD, LEVELS, PALETTE, PANEL, FONT } from './config.js';
import { paintScene } from './scenes.js';
import { SCREEN_CLEAR, SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './state.js';

export const BUTTONS = {
  start: { x: 490, y: 600, w: 300, h: 64, label: 'Start the hunt' },
  hint: { x: 40, y: 636, w: 180, h: 52, label: 'Hint (H)' },
  restart: { x: 240, y: 636, w: 180, h: 52, label: 'Restart (R)' },
  menu: { x: 440, y: 636, w: 180, h: 52, label: 'Menu (M)' },
  next: { x: 490, y: 462, w: 300, h: 64, label: 'Next level' },
  retry: { x: 490, y: 462, w: 300, h: 64, label: 'Try again' },
  again: { x: 490, y: 462, w: 300, h: 64, label: 'Play again' },
};

function inRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

/** Which button, if any, a logical point hits on the game's current screen. */
export function buttonAt(game, x, y) {
  const names = game.screen === SCREEN_TITLE ? ['start']
    : game.screen === SCREEN_PLAY ? ['hint', 'restart', 'menu']
    : game.screen === SCREEN_CLEAR ? ['next']
    : game.screen === SCREEN_OVER ? ['retry']
    : ['again'];
  for (const name of names) {
    if (inRect(x, y, BUTTONS[name])) return name;
  }
  return null;
}

/** Which panel, if any, a logical point hits: 'left', 'right', or null. */
export function panelAt(x, y) {
  if (y < PANEL.y || y > PANEL.y + PANEL.height) return null;
  if (x >= PANEL.leftX && x <= PANEL.leftX + PANEL.width) return 'left';
  if (x >= PANEL.rightX && x <= PANEL.rightX + PANEL.width) return 'right';
  return null;
}

/** Panel coordinates for a logical point inside the named panel. */
export function panelPoint(panel, x, y) {
  const originX = panel === 'left' ? PANEL.leftX : PANEL.rightX;
  return { x: x - originX, y: y - PANEL.y };
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function ring(ctx, x, y, r, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

function drawButton(ctx, rect, label, enabled) {
  ctx.fillStyle = enabled ? PALETTE.button : '#3a4358';
  roundRect(ctx, rect.x, rect.y, rect.w, rect.h, 10);
  ctx.fill();
  ctx.fillStyle = enabled ? '#ffffff' : PALETTE.muted;
  ctx.font = `600 20px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
}

function stars(ctx, x, y, count) {
  ctx.font = '44px ' + FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let line = '';
  for (let i = 0; i < 3; i += 1) line += i < count ? '★' : '☆';
  ctx.fillStyle = PALETTE.gold;
  ctx.fillText(line, x, y);
}

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.levelId = null;
    this.left = document.createElement('canvas');
    this.left.width = PANEL.width;
    this.left.height = PANEL.height;
    this.right = document.createElement('canvas');
    this.right.width = PANEL.width;
    this.right.height = PANEL.height;
  }

  /** Paint both panels for a level (or repaint the same one). */
  setLevel(levelId) {
    if (this.levelId === levelId) return;
    this.levelId = levelId;
    paintScene(this.left.getContext('2d'), levelId, 'left');
    paintScene(this.right.getContext('2d'), levelId, 'right');
  }

  draw(game, hover) {
    const ctx = this.ctx;
    this.setLevel(game.level.id);
    ctx.clearRect(0, 0, FIELD.width, FIELD.height);
    ctx.fillStyle = PALETTE.backdrop;
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);

    this.drawHeader(game);
    if (game.screen === SCREEN_TITLE) {
      this.drawPanels(game, true);
      this.drawTitle(game);
      return;
    }
    this.drawPanels(game, false);
    this.drawHud(game);
    if (game.screen === SCREEN_PLAY) {
      this.drawMarkers(game);
      this.drawHover(game, hover);
      this.drawFooter(game);
    } else if (game.screen === SCREEN_CLEAR) {
      this.drawMarkers(game);
      this.drawClear(game);
    } else if (game.screen === SCREEN_OVER) {
      this.drawMarkers(game);
      this.drawOver(game);
    } else if (game.screen === SCREEN_WIN) {
      this.drawMarkers(game);
      this.drawWin(game);
    }
  }

  drawHeader(game) {
    const ctx = this.ctx;
    ctx.fillStyle = PALETTE.text;
    ctx.font = `700 34px ${FONT}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔍 TWIN SPOTS', 40, 48);
    ctx.font = `400 20px ${FONT}`;
    ctx.fillStyle = PALETTE.muted;
    ctx.fillText('Spot the difference — two pictures, one sharp eye', 40, 84);
    ctx.textAlign = 'right';
    ctx.fillStyle = PALETTE.text;
    ctx.font = `700 26px ${FONT}`;
    ctx.fillText(`Score  ${game.score}`, 1240, 44);
    ctx.font = `400 18px ${FONT}`;
    ctx.fillStyle = PALETTE.muted;
    ctx.fillText(`Best  ${game.best}`, 1240, 78);
  }

  drawPanels(game, dimmed) {
    const ctx = this.ctx;
    ctx.drawImage(this.left, PANEL.leftX, PANEL.y);
    ctx.drawImage(this.right, PANEL.rightX, PANEL.y);
    ctx.strokeStyle = PALETTE.panelEdge;
    ctx.lineWidth = 4;
    ctx.strokeRect(PANEL.leftX, PANEL.y, PANEL.width, PANEL.height);
    ctx.strokeRect(PANEL.rightX, PANEL.y, PANEL.width, PANEL.height);
    // Labels sit inside the panels' bottom corners, over plain ground, so they
    // never collide with the HUD or with a difference ring.
    for (const [originX, label] of [[PANEL.leftX, 'ORIGINAL'], [PANEL.rightX, 'CHANGED']]) {
      ctx.fillStyle = 'rgba(16,21,33,0.75)';
      roundRect(ctx, originX + 8, PANEL.y + PANEL.height - 36, 108, 28, 6);
      ctx.fill();
      ctx.fillStyle = PALETTE.text;
      ctx.font = `600 16px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, originX + 62, PANEL.y + PANEL.height - 21);
    }
    if (dimmed) {
      ctx.fillStyle = 'rgba(20,26,38,0.55)';
      ctx.fillRect(0, PANEL.y, FIELD.width, PANEL.height);
    }
  }

  drawHud(game) {
    const ctx = this.ctx;
    const level = game.level;
    // One clean row: level name left, timer bar centre, found counter right.
    ctx.fillStyle = PALETTE.text;
    ctx.font = `700 24px ${FONT}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Level ${game.levelIndex + 1} · ${level.name}`, 40, 112);
    ctx.textAlign = 'right';
    ctx.fillStyle = game.foundCount === game.totalDiffs ? PALETTE.green : PALETTE.gold;
    ctx.font = `700 26px ${FONT}`;
    ctx.fillText(`Found  ${game.foundCount} / ${game.totalDiffs}`, 1240, 112);

    // Timer bar.
    const barX = 500;
    const barW = 280;
    const frac = Math.max(0, game.timeLeft / level.seconds);
    ctx.fillStyle = '#2a3348';
    roundRect(ctx, barX, 100, barW, 22, 11);
    ctx.fill();
    ctx.fillStyle = frac > 0.5 ? PALETTE.green : frac > 0.25 ? PALETTE.gold : PALETTE.red;
    if (frac > 0) {
      roundRect(ctx, barX, 100, Math.max(22, barW * frac), 22, 11);
      ctx.fill();
    }
    ctx.fillStyle = PALETTE.text;
    ctx.font = `700 18px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.ceil(game.timeLeft)}s`, barX + barW / 2, 112);
  }

  drawMarkers(game) {
    const ctx = this.ctx;
    for (const diff of game.diffs) {
      if (!game.found.has(diff.id)) continue;
      for (const originX of [PANEL.leftX, PANEL.rightX]) {
        ring(ctx, originX + diff.x, PANEL.y + diff.y, diff.r + 4, PALETTE.green, 4);
        ring(ctx, originX + diff.x, PANEL.y + diff.y, diff.r - 2, 'rgba(88,214,141,0.5)', 2);
      }
    }
    const hinted = game.hintedDiff();
    if (hinted !== null) {
      const pulse = 1 + 0.18 * Math.sin(game.now * 9);
      for (const originX of [PANEL.leftX, PANEL.rightX]) {
        ring(ctx, originX + hinted.x, PANEL.y + hinted.y, (hinted.r + 6) * pulse, PALETTE.gold, 4);
      }
    }
    if (game.miss !== null && game.now < game.miss.until) {
      const originX = game.missPanel === 'right' ? PANEL.rightX : PANEL.leftX;
      const mx = originX + game.miss.x;
      const my = PANEL.y + game.miss.y;
      ctx.strokeStyle = PALETTE.red;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(mx - 12, my - 12);
      ctx.lineTo(mx + 12, my + 12);
      ctx.moveTo(mx + 12, my - 12);
      ctx.lineTo(mx - 12, my + 12);
      ctx.stroke();
    }
    if (game.sparkle !== null && game.now < game.sparkle.until) {
      const diff = game.sparkle.diff;
      for (const originX of [PANEL.leftX, PANEL.rightX]) {
        ring(ctx, originX + diff.x, PANEL.y + diff.y, diff.r + 10, 'rgba(242,201,76,0.8)', 3);
      }
    }
  }

  drawHover(game, hover) {
    if (!hover || hover.x < 0) return;
    const panel = panelAt(hover.x, hover.y);
    if (panel === null) return;
    const point = panelPoint(panel, hover.x, hover.y);
    const ctx = this.ctx;
    ring(ctx, hover.x, hover.y, 26, 'rgba(255,255,255,0.55)', 2);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.arc(hover.x, hover.y, 3, 0, Math.PI * 2);
    ctx.fill();
    void point;
  }

  drawFooter(game) {
    const ctx = this.ctx;
    drawButton(ctx, BUTTONS.hint, `Hint (H) · ${game.hintsLeft} left`, game.hintsLeft > 0);
    drawButton(ctx, BUTTONS.restart, 'Restart (R)', true);
    drawButton(ctx, BUTTONS.menu, 'Menu (M)', true);
    ctx.fillStyle = game.lastFoundName ? PALETTE.green : PALETTE.muted;
    ctx.font = `400 20px ${FONT}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const message = game.lastFoundName
      ? `✓ ${game.lastFoundName}  ·  +100`
      : 'Click a difference in either picture. A wrong click costs 5 seconds.';
    ctx.fillText(message, 660, 662);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `400 16px ${FONT}`;
    ctx.fillText('H hint (−50) · R restart · M menu', 660, 694);
  }

  drawOverlayBox(ctx, y, h) {
    ctx.fillStyle = 'rgba(16,21,33,0.88)';
    roundRect(ctx, 340, y, 600, h, 16);
    ctx.fill();
    ctx.strokeStyle = PALETTE.panelEdge;
    ctx.lineWidth = 2;
    roundRect(ctx, 340, y, 600, h, 16);
    ctx.stroke();
  }

  drawTitle(game) {
    const ctx = this.ctx;
    this.drawOverlayBox(ctx, 240, 300);
    ctx.textAlign = 'center';
    ctx.fillStyle = PALETTE.text;
    ctx.font = `700 54px ${FONT}`;
    ctx.textBaseline = 'middle';
    ctx.fillText('TWIN SPOTS', 640, 300);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `400 22px ${FONT}`;
    ctx.fillText('Two pictures. A handful of secrets. Find them all before time runs out.', 640, 346);
    ctx.fillStyle = PALETTE.text;
    ctx.font = `400 20px ${FONT}`;
    const lines = LEVELS.map((level, i) => `${i + 1}. ${level.name} — ${level.diffs} differences, ${level.seconds}s`).join('   ');
    ctx.fillText(lines, 640, 396);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `400 18px ${FONT}`;
    ctx.fillText('Click a difference in either picture · H for a hint · wrong clicks cost 5 seconds', 640, 440);
    if (game.best > 0) {
      ctx.fillStyle = PALETTE.gold;
      ctx.font = `700 20px ${FONT}`;
      ctx.fillText(`Best score: ${game.best}`, 640, 478);
    }
    drawButton(ctx, BUTTONS.start, 'Start the hunt', true);
  }

  drawClear(game) {
    const ctx = this.ctx;
    this.drawOverlayBox(ctx, 250, 300);
    ctx.textAlign = 'center';
    ctx.fillStyle = PALETTE.green;
    ctx.font = `700 34px ${FONT}`;
    ctx.textBaseline = 'middle';
    ctx.fillText('Level clear!', 640, 308);
    stars(ctx, 640, 360, game.stars);
    ctx.fillStyle = PALETTE.text;
    ctx.font = `400 20px ${FONT}`;
    ctx.fillText(`Level score ${game.levelScore}  ·  total ${game.score}`, 640, 414);
    drawButton(ctx, BUTTONS.next, game.levelIndex + 1 < LEVELS.length ? 'Next level' : 'See your score', true);
  }

  drawOver(game) {
    const ctx = this.ctx;
    this.drawOverlayBox(ctx, 250, 300);
    ctx.textAlign = 'center';
    ctx.fillStyle = PALETTE.red;
    ctx.font = `700 34px ${FONT}`;
    ctx.textBaseline = 'middle';
    ctx.fillText("Time's up!", 640, 308);
    ctx.fillStyle = PALETTE.text;
    ctx.font = `400 20px ${FONT}`;
    ctx.fillText(`You found ${game.foundCount} of ${game.totalDiffs} differences · score ${game.score}`, 640, 368);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `400 18px ${FONT}`;
    ctx.fillText('Press M for the menu', 640, 412);
    drawButton(ctx, BUTTONS.retry, 'Try again', true);
  }

  drawWin(game) {
    const ctx = this.ctx;
    this.drawOverlayBox(ctx, 250, 300);
    ctx.textAlign = 'center';
    ctx.fillStyle = PALETTE.gold;
    ctx.font = `700 34px ${FONT}`;
    ctx.textBaseline = 'middle';
    ctx.fillText('You found them all!', 640, 308);
    ctx.fillStyle = PALETTE.text;
    ctx.font = `400 22px ${FONT}`;
    ctx.fillText(`Total score ${game.score}   ·   Best ${game.best}`, 640, 366);
    if (game.newBest) {
      ctx.fillStyle = PALETTE.gold;
      ctx.font = `700 20px ${FONT}`;
      ctx.fillText('★ New best score! ★', 640, 410);
    }
    drawButton(ctx, BUTTONS.again, 'Play again', true);
  }
}

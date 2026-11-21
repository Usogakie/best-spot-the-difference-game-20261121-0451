// Twin Spots — everything the player sees: header, the two picture
// panels, found markers, hint pulse, footer buttons, menu, level-complete,
// time-up and victory screens. All drawing is immediate-mode canvas.
import {
  FIELD_HEIGHT,
  FIELD_WIDTH,
  FOOTER_Y,
  LEVEL_NAMES,
  LEVEL_TAGLINES,
  LEVEL_DIFFICULTY,
  MARKER_RING_COLOR,
  PANEL_HEIGHT,
  PANEL_LEFT_X,
  PANEL_RIGHT_X,
  PANEL_WIDTH,
  PANEL_Y,
} from './config.js';
import { SCENES } from './differences.js';
import { drawScene } from './scenes.js';

const BG = '#141824';
const PANEL_BORDER = '#2c3550';
const GOLD = '#ffd23d';
const INK = '#f4f1de';
const MUTED = '#9aa5c0';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawButton(state, ctx, id, x, y, w, h, label, accent) {
  state.uiButtons.push({ id, x, y, w, h });
  ctx.fillStyle = accent ? GOLD : '#232a42';
  roundRect(ctx, x, y, w, h, 10);
  ctx.fill();
  ctx.strokeStyle = accent ? '#b8860b' : '#3a4568';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = accent ? '#1a1405' : INK;
  ctx.font = 'bold 19px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, y + h / 2 + 1);
}

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function starsText(n) {
  return '★'.repeat(n) + '☆'.repeat(3 - n);
}

function drawHeader(ctx, state) {
  ctx.fillStyle = INK;
  ctx.font = 'bold 30px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('TWIN SPOTS', 20, 46);
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${state.levelIndex + 1} · ${state.scene.name}`, 640, 34);
  ctx.fillStyle = MUTED;
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText(state.scene.tagline, 640, 58);

  ctx.textAlign = 'right';
  ctx.fillStyle = INK;
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText(`SCORE ${state.totalScore + state.levelScore}`, 1260, 34);
  const low = state.timeLeft <= 30;
  ctx.fillStyle = low ? '#ff5a5a' : INK;
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText(`TIME ${formatTime(state.timeLeft)}`, 1260, 64);

  // Timer bar.
  const barW = 220;
  const frac = Math.max(0, state.timeLeft / 180);
  ctx.fillStyle = '#232a42';
  roundRect(ctx, 1040, 76, barW, 10, 5);
  ctx.fill();
  ctx.fillStyle = low ? '#ff5a5a' : '#7ec850';
  if (frac > 0) {
    roundRect(ctx, 1040, 76, barW * frac, 10, 5);
    ctx.fill();
  }

  // Found counter.
  ctx.textAlign = 'left';
  ctx.fillStyle = INK;
  ctx.font = 'bold 20px system-ui, sans-serif';
  const total = state.scene.differences.length;
  ctx.fillText(`FOUND ${state.foundCount} / ${total}`, 20, 84);
  for (let i = 0; i < total; i++) {
    ctx.fillStyle = i < state.foundCount ? GOLD : '#2c3550';
    ctx.beginPath();
    ctx.arc(180 + i * 22, 78, 7, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMarkers(ctx, state, panelX, t) {
  state.scene.differences.forEach((diff, i) => {
    if (!state.found.has(i)) return;
    const pulse = 1 + Math.sin(t * 3 + i) * 0.06;
    ctx.strokeStyle = MARKER_RING_COLOR;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(panelX + diff.x, PANEL_Y + diff.y, (diff.r + 10) * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = MARKER_RING_COLOR;
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✓', panelX + diff.x, PANEL_Y + diff.y - diff.r - 16);
  });
}

function drawHint(ctx, state, panelX, t) {
  const hint = state.hintSpot;
  if (!hint) return;
  const pulse = 1 + Math.sin(t * 8) * 0.12;
  ctx.strokeStyle = '#7ee2ff';
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.arc(panelX + hint.x, PANEL_Y + hint.y, (hint.r + 14) * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawWrongFlash(ctx, state, panelX, panel) {
  const flash = state.wrongFlash;
  if (!flash || flash.panel !== panel) return;
  const x = panelX + flash.x;
  const y = PANEL_Y + flash.y;
  ctx.strokeStyle = '#ff5a5a';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12, y - 12);
  ctx.lineTo(x + 12, y + 12);
  ctx.moveTo(x + 12, y - 12);
  ctx.lineTo(x - 12, y + 12);
  ctx.stroke();
}

function drawPanel(ctx, state, panelIndex, t) {
  const panelX = panelIndex === 0 ? PANEL_LEFT_X : PANEL_RIGHT_X;
  ctx.save();
  ctx.beginPath();
  ctx.rect(panelX, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
  ctx.clip();
  ctx.translate(panelX, PANEL_Y);
  drawScene(ctx, state.levelIndex, panelIndex, t);
  ctx.restore();
  ctx.strokeStyle = PANEL_BORDER;
  ctx.lineWidth = 3;
  ctx.strokeRect(panelX, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
  drawMarkers(ctx, state, panelX, t);
  drawHint(ctx, state, panelX, t);
  drawWrongFlash(ctx, state, panelX, panelIndex);
}

function drawPanelLabels(ctx) {
  ctx.fillStyle = MUTED;
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('— ORIGINAL —', PANEL_LEFT_X + PANEL_WIDTH / 2, 98);
  ctx.fillText('— CHANGED —', PANEL_RIGHT_X + PANEL_WIDTH / 2, 98);
}

function drawFooter(ctx, state) {
  drawButton(state, ctx, 'hint', 20, FOOTER_Y + 8, 150, 48, 'Hint  (H)');
  drawButton(state, ctx, 'restart', 190, FOOTER_Y + 8, 170, 48, 'Restart  (R)');
  drawButton(state, ctx, 'menu', 380, FOOTER_Y + 8, 150, 48, 'Menu  (M)');
  if (state.message) {
    ctx.fillStyle =
      state.messageKind === 'good' ? '#7ec850' : state.messageKind === 'bad' ? '#ff5a5a' : INK;
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.message, 560, FOOTER_Y + 32);
  } else {
    ctx.fillStyle = MUTED;
    ctx.font = '18px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Click a difference in either picture — H for a hint, R to restart.', 560, FOOTER_Y + 32);
  }
}

function dimBackdrop(ctx) {
  ctx.fillStyle = 'rgba(10, 12, 20, 0.78)';
  ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);
}

function drawMenu(ctx, state, t) {
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.rect(PANEL_LEFT_X, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
  ctx.clip();
  ctx.translate(PANEL_LEFT_X, PANEL_Y);
  drawScene(ctx, 0, 0, t);
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.rect(PANEL_RIGHT_X, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
  ctx.clip();
  ctx.translate(PANEL_RIGHT_X, PANEL_Y);
  drawScene(ctx, 0, 1, t);
  ctx.restore();
  dimBackdrop(ctx);

  ctx.textAlign = 'center';
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 72px system-ui, sans-serif';
  ctx.fillText('TWIN SPOTS', 640, 150);
  ctx.fillStyle = INK;
  ctx.font = '24px system-ui, sans-serif';
  ctx.fillText('Two pictures. A handful of sneaky differences. Find them all.', 640, 196);
  ctx.fillStyle = MUTED;
  ctx.font = '18px system-ui, sans-serif';
  ctx.fillText('Click a difference in either picture  ·  +100 per find  ·  wrong click −5s  ·  H hint  ·  R restart', 640, 232);

  SCENES.forEach((scene, i) => {
    const x = 140 + i * 350;
    const y = 300;
    ctx.fillStyle = '#1d2438';
    roundRect(ctx, x, y, 300, 190, 14);
    ctx.fill();
    ctx.strokeStyle = '#3a4568';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = GOLD;
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText(`LEVEL ${i + 1} · ${scene.difficulty.toUpperCase()}`, x + 150, y + 32);
    ctx.fillStyle = INK;
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.fillText(scene.name, x + 150, y + 72);
    ctx.fillStyle = MUTED;
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText(scene.tagline, x + 150, y + 104);
    ctx.fillStyle = INK;
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText(`${scene.differences.length} differences · 180s`, x + 150, y + 134);
    if (state.levelStars[i] > 0) {
      ctx.fillStyle = GOLD;
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText(starsText(state.levelStars[i]), x + 150, y + 166);
    }
    state.uiButtons.push({ id: `level-${i}`, x, y, w: 300, h: 190 });
  });

  drawButton(state, ctx, 'start', 490, 540, 300, 60, 'START — LEVEL 1', true);
  ctx.fillStyle = MUTED;
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText('or press 1, 2 or 3 to jump to a level', 640, 640);
  ctx.fillText('Best played with mouse + keyboard · works fully offline', 640, 668);
}

function drawCard(ctx, x, y, w, h) {
  ctx.fillStyle = 'rgba(10, 12, 20, 0.72)';
  ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);
  ctx.fillStyle = '#1d2438';
  roundRect(ctx, x, y, w, h, 18);
  ctx.fill();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawLevelDone(ctx, state) {
  const r = state.levelResult;
  drawCard(ctx, 360, 170, 560, 440);
  ctx.textAlign = 'center';
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 40px system-ui, sans-serif';
  ctx.fillText('Level Complete!', 640, 240);
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 52px system-ui, sans-serif';
  ctx.fillText(starsText(r.stars), 640, 310);
  ctx.fillStyle = INK;
  ctx.font = '22px system-ui, sans-serif';
  ctx.fillText(`Found ${r.found} / ${state.scene.differences.length} differences`, 640, 356);
  ctx.fillText(`Time bonus +${r.timeBonus}  ·  Mistakes ${state.mistakes}  ·  Hints ${state.hintsUsed}`, 640, 392);
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.fillText(`Level score ${state.levelScore}  ·  Total ${state.totalScore}`, 640, 436);
  const last = state.levelIndex === SCENES.length - 1;
  drawButton(state, ctx, 'next', 470, 480, 340, 56, last ? 'SEE RESULTS  (Enter)' : 'NEXT LEVEL  (Enter)', true);
  drawButton(state, ctx, 'replay', 470, 548, 165, 44, 'Replay');
  drawButton(state, ctx, 'menu', 645, 548, 165, 44, 'Menu');
}

function drawTimeUp(ctx, state) {
  drawCard(ctx, 360, 210, 560, 360);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ff5a5a';
  ctx.font = 'bold 44px system-ui, sans-serif';
  ctx.fillText("Time's up!", 640, 290);
  ctx.fillStyle = INK;
  ctx.font = '22px system-ui, sans-serif';
  ctx.fillText(`You found ${state.foundCount} of ${state.scene.differences.length} differences.`, 640, 340);
  ctx.fillText('The last ones were so close — try again!', 640, 376);
  drawButton(state, ctx, 'retry', 470, 430, 340, 56, 'TRY AGAIN  (R)', true);
  drawButton(state, ctx, 'menu', 470, 498, 340, 44, 'Back to Menu');
}

function drawVictory(ctx, state) {
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.rect(PANEL_LEFT_X, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
  ctx.clip();
  ctx.translate(PANEL_LEFT_X, PANEL_Y);
  drawScene(ctx, 2, 0, 0);
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.rect(PANEL_RIGHT_X, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
  ctx.clip();
  ctx.translate(PANEL_RIGHT_X, PANEL_Y);
  drawScene(ctx, 2, 1, 0);
  ctx.restore();
  dimBackdrop(ctx);

  ctx.textAlign = 'center';
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 56px system-ui, sans-serif';
  ctx.fillText('You found them all!', 640, 150);
  ctx.fillStyle = INK;
  ctx.font = '26px system-ui, sans-serif';
  ctx.fillText('Every difference, in every scene. Sharp eyes!', 640, 196);

  ctx.fillStyle = '#1d2438';
  roundRect(ctx, 380, 240, 520, 300, 18);
  ctx.fill();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText('TOTAL SCORE', 640, 286);
  ctx.fillStyle = INK;
  ctx.font = 'bold 54px system-ui, sans-serif';
  ctx.fillText(String(state.totalScore), 640, 348);
  SCENES.forEach((scene, i) => {
    ctx.fillStyle = INK;
    ctx.font = '20px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${i + 1}. ${scene.name}`, 430, 400 + i * 38);
    ctx.fillStyle = GOLD;
    ctx.textAlign = 'right';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText(`${starsText(state.levelStars[i])}   ${state.levelScores[i]} pts`, 850, 400 + i * 38);
  });

  drawButton(state, ctx, 'again', 470, 580, 340, 56, 'PLAY AGAIN  (Enter)', true);
  drawButton(state, ctx, 'menu', 470, 648, 340, 44, 'Back to Menu');
}

export function draw(ctx, state, t) {
  state.uiButtons = [];
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);
  if (state.screen === 'menu') {
    drawMenu(ctx, state, t);
    return;
  }
  if (state.screen === 'victory') {
    // The victory screen paints its own dimmed harbour backdrop; drawing
    // the gameplay header under it would show a stale "FOUND 0 / 8".
    drawVictory(ctx, state);
    return;
  }
  drawHeader(ctx, state);
  drawPanelLabels(ctx);
  drawPanel(ctx, state, 0, t);
  drawPanel(ctx, state, 1, t);
  if (state.screen === 'playing') {
    drawFooter(ctx, state);
  } else if (state.screen === 'levelDone') {
    drawLevelDone(ctx, state);
  } else if (state.screen === 'timeUp') {
    drawTimeUp(ctx, state);
  }
}

export { LEVEL_NAMES, LEVEL_TAGLINES, LEVEL_DIFFICULTY };

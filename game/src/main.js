// Boot and the frame loop. Wires the canvas, the state machine and the renderer,
// routes clicks to buttons or panels, and routes keys. Also reads ?shot= for the
// screenshot staging in shots.js, and keeps the canvas at its 1280x800 logical
// size whatever the window is.

import { FIELD, SHOT_PARAM } from './config.js';
import { wireInput } from './input.js';
import { Game, SCREEN_CLEAR, SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './state.js';
import { Renderer, buttonAt, panelAt, panelPoint } from './render.js';
import { stageShot } from './shots.js';
import { playClick } from './audio.js';

const canvas = document.getElementById('game');
const status = document.getElementById('status');
canvas.width = FIELD.width;
canvas.height = FIELD.height;

const game = new Game();
const renderer = new Renderer(canvas);
let hover = { x: -1, y: -1 };
let lastStatus = '';

const params = new URLSearchParams(window.location.search);
const shot = params.get(SHOT_PARAM);
if (shot !== null) stageShot(shot, game);

function announce() {
  const text = game.screen === SCREEN_PLAY
    ? `Level ${game.levelIndex + 1}, ${game.level.name}. Found ${game.foundCount} of ${game.totalDiffs}. ${Math.ceil(game.timeLeft)} seconds left. Score ${game.score}.`
    : game.screen === SCREEN_TITLE ? 'Twin Spots. Spot the difference. Press Enter to start.'
    : game.screen === SCREEN_CLEAR ? `Level clear. ${game.stars} stars. Score ${game.score}.`
    : game.screen === SCREEN_OVER ? `Time is up. You found ${game.foundCount} of ${game.totalDiffs}.`
    : `You found them all. Total score ${game.score}.`;
  if (text !== lastStatus) {
    status.textContent = text;
    lastStatus = text;
  }
}

function onTap(x, y) {
  const button = buttonAt(game, x, y);
  if (button !== null) {
    playClick();
    if (button === 'start') game.startGame();
    else if (button === 'hint') game.useHint();
    else if (button === 'restart') game.startLevel(game.levelIndex);
    else if (button === 'menu') game.screen = SCREEN_TITLE;
    else if (button === 'next') game.nextLevel();
    else if (button === 'retry') game.startLevel(game.levelIndex);
    else if (button === 'again') game.startGame();
    announce();
    return;
  }
  if (game.screen !== SCREEN_PLAY) return;
  const panel = panelAt(x, y);
  if (panel === null) return;
  const point = panelPoint(panel, x, y);
  game.missPanel = panel;
  game.tapPanel(point.x, point.y);
  announce();
}

function onKey(key) {
  if (key === 'enter' || key === ' ') {
    if (game.screen === SCREEN_TITLE) {
      playClick();
      game.startGame();
    } else if (game.screen === SCREEN_CLEAR) {
      playClick();
      game.nextLevel();
    } else if (game.screen === SCREEN_OVER) {
      playClick();
      game.startLevel(game.levelIndex);
    } else if (game.screen === SCREEN_WIN) {
      playClick();
      game.startGame();
    }
  } else if (key === 'h') {
    game.useHint();
  } else if (key === 'r') {
    if (game.screen === SCREEN_PLAY || game.screen === SCREEN_OVER) {
      playClick();
      game.startLevel(game.levelIndex);
    }
  } else if (key === 'm') {
    game.screen = SCREEN_TITLE;
  } else if (key >= '1' && key <= '3') {
    if (game.screen === SCREEN_TITLE) {
      playClick();
      game.score = 0;
      game.startLevel(Number(key) - 1);
    }
  }
  announce();
}

wireInput(canvas, {
  onTap,
  onKey,
  onHover: (x, y) => { hover = { x, y }; },
});

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  game.tick(dt);
  renderer.draw(game, hover);
  announce();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

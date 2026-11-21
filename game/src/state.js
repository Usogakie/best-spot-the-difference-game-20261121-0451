// Twin Spots — the game's state machine: menu, playing, level done,
// time up, and victory, plus score, timer, finds, hints and mistakes.
import {
  HINT_FLASH_MS,
  LEVEL_TIME_SECONDS,
  POINTS_PER_FIND,
  WRONG_CLICK_TIME_PENALTY,
} from './config.js';
import { SCENES } from './differences.js';

export class TwinSpotsState {
  constructor() {
    this.resetAll();
  }

  resetAll() {
    this.screen = 'menu';
    this.levelIndex = 0;
    this.totalScore = 0;
    this.levelStars = [0, 0, 0];
    this.levelScores = [0, 0, 0];
    this.levelScore = 0;
    this.found = new Set();
    this.mistakes = 0;
    this.hintsUsed = 0;
    this.timeLeft = LEVEL_TIME_SECONDS;
    this.message = '';
    this.messageKind = 'info';
    this.messageUntil = 0;
    this.hintSpot = null;
    this.wrongFlash = null;
    this.frozen = false;
    this.now = 0;
    this.uiButtons = [];
    this.levelResult = null;
    this.menuPreview = 0;
  }

  get scene() {
    return SCENES[this.levelIndex];
  }

  get foundCount() {
    return this.found.size;
  }

  get remaining() {
    return this.scene.differences.length - this.found.size;
  }

  startLevel(index) {
    this.levelIndex = index;
    this.levelScore = 0;
    this.found = new Set();
    this.mistakes = 0;
    this.hintsUsed = 0;
    this.timeLeft = LEVEL_TIME_SECONDS;
    this.message = `Find ${this.scene.differences.length} differences!`;
    this.messageKind = 'info';
    this.messageUntil = this.now + 4;
    this.hintSpot = null;
    this.wrongFlash = null;
    this.levelResult = null;
    this.screen = 'playing';
  }

  restartLevel() {
    this.startLevel(this.levelIndex);
  }

  toMenu() {
    this.resetAll();
  }

  registerFound(index) {
    if (this.found.has(index)) return false;
    this.found.add(index);
    this.levelScore += POINTS_PER_FIND;
    const diff = this.scene.differences[index];
    this.message = `Found: ${diff.label}! +${POINTS_PER_FIND}`;
    this.messageKind = 'good';
    this.messageUntil = this.now + 2.5;
    if (this.found.size === this.scene.differences.length) {
      this.completeLevel();
    }
    return true;
  }

  registerMiss(x, y, panel) {
    this.mistakes += 1;
    this.timeLeft = Math.max(0, this.timeLeft - WRONG_CLICK_TIME_PENALTY);
    this.wrongFlash = { x, y, panel, until: this.now + 0.7 };
    this.message = `Not there! -${WRONG_CLICK_TIME_PENALTY}s`;
    this.messageKind = 'bad';
    this.messageUntil = this.now + 2;
    if (this.timeLeft <= 0) {
      this.screen = 'timeUp';
    }
  }

  useHint() {
    const next = this.scene.differences.findIndex((d, i) => !this.found.has(i));
    if (next === -1) return false;
    const diff = this.scene.differences[next];
    this.hintSpot = { x: diff.x, y: diff.y, r: diff.r, until: this.now + HINT_FLASH_MS / 1000 };
    this.hintsUsed += 1;
    this.message = `Hint: look near the ${diff.label.toLowerCase()}`;
    this.messageKind = 'info';
    this.messageUntil = this.now + 2.5;
    return true;
  }

  starsForLevel() {
    if (this.mistakes === 0 && this.hintsUsed === 0 && this.timeLeft >= 60) return 3;
    if (this.mistakes <= 2 && this.timeLeft >= 20) return 2;
    return 1;
  }

  completeLevel() {
    const timeBonus = Math.round(this.timeLeft);
    const stars = this.starsForLevel();
    this.levelScore += timeBonus;
    this.levelStars[this.levelIndex] = stars;
    this.levelScores[this.levelIndex] = this.levelScore;
    this.totalScore += this.levelScore;
    this.levelResult = { stars, timeBonus, found: this.found.size };
    this.screen = 'levelDone';
  }

  nextLevel() {
    if (this.levelIndex < SCENES.length - 1) {
      this.startLevel(this.levelIndex + 1);
    } else {
      this.screen = 'victory';
    }
  }

  tick(dt) {
    if (this.screen === 'playing' && !this.frozen) {
      this.timeLeft -= dt;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.screen = 'timeUp';
      }
    }
    if (this.hintSpot && this.now > this.hintSpot.until) this.hintSpot = null;
    if (this.wrongFlash && this.now > this.wrongFlash.until) this.wrongFlash = null;
    if (this.message && this.now > this.messageUntil) this.message = '';
  }
}

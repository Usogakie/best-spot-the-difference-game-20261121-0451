// The game's state machine: title, playing, level clear, time out, and the final
// score. It owns the timer, the found set, the score and the hints, and answers
// every question the renderer and the input handler ask. It never draws anything.

import { HINTS_PER_LEVEL, LEVELS, SCORE, HINT_SECONDS, MISS_SECONDS, SPARKLE_SECONDS, BEST_KEY } from './config.js';
import { diffsOf } from './differences.js';
import { playClear, playFound, playHint, playMiss, playTimeout } from './audio.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_CLEAR = 'clear';
export const SCREEN_OVER = 'over';
export const SCREEN_WIN = 'win';

export function loadBest() {
  try {
    return Number(window.localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function saveBest(score) {
  try {
    window.localStorage.setItem(BEST_KEY, String(score));
  } catch {
    // A browser that refuses storage just forgets the best score.
  }
}

export class Game {
  constructor() {
    this.screen = SCREEN_TITLE;
    this.levelIndex = 0;
    this.score = 0;
    this.best = loadBest();
    this.found = new Set();
    this.timeLeft = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.hint = null; // { diff, until } while a hint pulse is showing
    this.miss = null; // { x, y, until } while a wrong-click mark shows
    this.sparkle = null; // { diff, until } while a found ring sparkles
    this.lastFoundName = '';
    this.levelScore = 0;
    this.stars = 0;
    this.now = 0;
    this.newBest = false;
  }

  get level() {
    return LEVELS[this.levelIndex];
  }

  get diffs() {
    return diffsOf(this.level.id);
  }

  get foundCount() {
    return this.found.size;
  }

  get totalDiffs() {
    return this.diffs.length;
  }

  startLevel(index) {
    this.levelIndex = index;
    this.found = new Set();
    this.timeLeft = this.level.seconds;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.hint = null;
    this.miss = null;
    this.sparkle = null;
    this.lastFoundName = '';
    this.levelScore = 0;
    this.screen = SCREEN_PLAY;
  }

  startGame() {
    this.score = 0;
    this.newBest = false;
    this.startLevel(0);
  }

  /** Advance the clock by dt seconds; the timer only runs while playing. */
  tick(dt) {
    this.now += dt;
    if (this.screen !== SCREEN_PLAY) return;
    this.timeLeft -= dt;
    if (this.hint !== null && this.now >= this.hint.until) this.hint = null;
    if (this.miss !== null && this.now >= this.miss.until) this.miss = null;
    if (this.sparkle !== null && this.now >= this.sparkle.until) this.sparkle = null;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.screen = SCREEN_OVER;
      playTimeout();
    }
  }

  /** A click inside a panel, in panel coordinates. Returns true when it found one. */
  tapPanel(x, y) {
    if (this.screen !== SCREEN_PLAY) return false;
    for (const diff of this.diffs) {
      if (this.found.has(diff.id)) continue;
      const dx = x - diff.x;
      const dy = y - diff.y;
      if (dx * dx + dy * dy <= diff.r * diff.r) {
        this.found.add(diff.id);
        this.score += SCORE.find;
        this.levelScore += SCORE.find;
        this.lastFoundName = diff.name;
        this.sparkle = { diff, until: this.now + SPARKLE_SECONDS };
        playFound();
        if (this.found.size === this.diffs.length) this.clearLevel();
        return true;
      }
    }
    this.timeLeft = Math.max(0, this.timeLeft - SCORE.wrongClickSeconds);
    this.miss = { x, y, until: this.now + MISS_SECONDS };
    playMiss();
    if (this.timeLeft <= 0) {
      this.screen = SCREEN_OVER;
      playTimeout();
    }
    return false;
  }

  clearLevel() {
    const timeBonus = Math.round(this.timeLeft) * SCORE.timeBonusPerSecond;
    this.score += timeBonus + SCORE.levelClearBonus;
    this.levelScore += timeBonus + SCORE.levelClearBonus;
    const hintBonus = this.hintsLeft * 2;
    this.stars = this.timeLeft > this.level.seconds * 0.5 && this.hintsLeft >= 2 ? 3
      : this.timeLeft > this.level.seconds * 0.25 || hintBonus > 0 ? 2 : 1;
    this.screen = SCREEN_CLEAR;
    playClear();
  }

  nextLevel() {
    if (this.levelIndex + 1 < LEVELS.length) {
      this.startLevel(this.levelIndex + 1);
    } else {
      this.finishGame();
    }
  }

  finishGame() {
    this.screen = SCREEN_WIN;
    if (this.score > this.best) {
      this.best = this.score;
      this.newBest = true;
      saveBest(this.score);
    }
    playClear();
  }

  useHint() {
    if (this.screen !== SCREEN_PLAY || this.hintsLeft <= 0) return false;
    const remaining = this.diffs.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return false;
    const diff = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - this.level.hintCost);
    this.hint = { diff, until: this.now + HINT_SECONDS };
    playHint();
    return true;
  }

  /** The difference a hint is currently pulsing, or null. */
  hintedDiff() {
    return this.hint !== null && this.now < this.hint.until ? this.hint.diff : null;
  }
}

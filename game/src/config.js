// Every tuning number, colour and level in one place. The playfield is a fixed 1280x800
// logical area; the renderer scales it to the window, so no rule below depends on the
// screen size. Each scene is drawn on a 560x420 panel, twice: once as the original on
// the left, once with the level's differences applied on the right.

export const FIELD = { width: 1280, height: 800 };
export const PANEL = { width: 560, height: 420, leftX: 40, rightX: 680, y: 150 };

export const LEVELS = [
  {
    id: 'garden',
    name: 'Sunny Garden',
    tagline: 'A quiet morning in the garden',
    seconds: 90,
    diffs: 7,
    hintCost: 50,
  },
  {
    id: 'kitchen',
    name: 'Cozy Kitchen',
    tagline: 'Tea is on, the cat is watching',
    seconds: 90,
    diffs: 7,
    hintCost: 50,
  },
  {
    id: 'harbor',
    name: 'Night Harbor',
    tagline: 'The lighthouse keeps its watch',
    seconds: 120,
    diffs: 8,
    hintCost: 50,
  },
];

export const SCORE = {
  find: 100,
  timeBonusPerSecond: 5,
  wrongClickSeconds: 5,
  levelClearBonus: 250,
};

export const HINTS_PER_LEVEL = 3;
/** How long a hint pulse lasts, in seconds. */
export const HINT_SECONDS = 2.5;
/** How long a wrong-click mark stays on screen, in seconds. */
export const MISS_SECONDS = 0.9;
/** How long a found ring sparkles before it settles, in seconds. */
export const SPARKLE_SECONDS = 0.8;

export const PALETTE = {
  backdrop: '#141a26',
  panel: '#1d2536',
  panelEdge: '#39445e',
  text: '#f2f4f8',
  muted: '#9aa5bb',
  gold: '#f2c94c',
  green: '#58d68d',
  red: '#e5534b',
  blue: '#4fc3f7',
  button: '#2c6e4f',
  buttonHover: '#35855f',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best total score is kept between visits (this browser only). */
export const BEST_KEY = 'twin-spots.best';

/** Query param the screenshot stager reads, e.g. ?shot=play */
export const SHOT_PARAM = 'shot';

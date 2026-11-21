// Twin Spots — shared constants for the whole game.
// The play field is a fixed 1280x800 logical canvas; two 600x600 picture
// panels sit side by side under a header bar and above a footer bar.
export const FIELD_WIDTH = 1280;
export const FIELD_HEIGHT = 800;

export const PANEL_WIDTH = 600;
export const PANEL_HEIGHT = 600;
export const PANEL_Y = 104;
export const PANEL_LEFT_X = 20;
export const PANEL_RIGHT_X = 660;
export const HEADER_HEIGHT = 96;
export const FOOTER_Y = 716;

export const LEVEL_TIME_SECONDS = 180;
export const POINTS_PER_FIND = 100;
export const WRONG_CLICK_TIME_PENALTY = 5;
export const HINT_FLASH_MS = 2600;
export const HINT_RING_MS = 2600;

export const MARKER_RING_COLOR = '#ffd23d';
export const MARKER_RING_WIDTH = 5;
export const WRONG_MARK_COLOR = '#ff5a5a';
export const HINT_RING_COLOR = '#7ee2ff';

export const LEVEL_NAMES = ['Sunny Garden', 'Cozy Kitchen', 'Night Harbor'];
export const LEVEL_TAGLINES = [
  'A bright garden morning — 8 sneaky changes hide in the flowers.',
  'Tea is brewing and something moved — 8 quiet changes in the kitchen.',
  'The harbour sleeps under the moon — 8 changes in the dark.',
];
export const LEVEL_DIFFICULTY = ['Easy', 'Medium', 'Tricky'];

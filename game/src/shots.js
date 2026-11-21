// The screenshot scenes behind ?shot=start|play|end. Each one sets the real game
// to a fixed state, so the frame is what a short game really looks like and the
// same URL always gives the same frame. The screenshots are taken by the maker
// from these URLs, never edited afterwards.
//   ?shot=start — the title screen over the garden scene
//   ?shot=play  — mid-game: 3 of 7 differences found, rings on both panels, timer mid-way
//   ?shot=end   — the final score screen after all three levels are cleared
import { SCREEN_CLEAR, SCREEN_TITLE, SCREEN_WIN } from './state.js';

const PLAY_FOUND = ['sun-rays', 'cloud', 'apples'];

/** Set `game` to the named scene and return the screen to draw over it. */
export function stageShot(name, game) {
  if (name === 'play') {
    game.startLevel(0);
    game.timeLeft = 47;
    for (const id of PLAY_FOUND) game.found.add(id);
    game.score = 300;
    game.levelScore = 300;
    game.lastFoundName = 'Two apples are gone';
    return game.screen;
  }
  if (name === 'end') {
    game.startGame();
    for (let level = 0; level < 3; level += 1) {
      game.startLevel(level);
      for (const diff of game.diffs) game.found.add(diff.id);
      game.timeLeft = 40 + level * 5;
      game.clearLevel();
      if (level < 2) game.nextLevel();
    }
    game.finishGame();
    game.score = 2410;
    game.best = 2410;
    return SCREEN_WIN;
  }
  game.screen = SCREEN_TITLE;
  game.levelIndex = 0;
  return SCREEN_TITLE;
}

export { SCREEN_CLEAR, SCREEN_TITLE };

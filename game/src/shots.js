// Twin Spots — deterministic screenshot states. ?shot=start shows the menu,
// ?shot=play drops into level 1 with three differences already ringed, and
// ?shot=end shows the victory screen. Shot mode freezes the timer so the
// renders are stable from run to run.
export function applyShot(state, search) {
  const params = new URLSearchParams(search || '');
  const shot = params.get('shot');
  if (!shot) return false;
  state.frozen = true;
  if (shot === 'start') {
    state.screen = 'menu';
    state.menuPreview = 0;
  } else if (shot === 'play') {
    state.startLevel(0);
    state.found = new Set([0, 1, 2]);
    state.levelScore = 300;
    state.timeLeft = 142;
    state.message = 'Nice eye! 3 found — 5 still hiding.';
    state.messageKind = 'good';
    state.messageUntil = Infinity;
  } else if (shot === 'end') {
    state.screen = 'victory';
    state.levelIndex = 2;
    state.totalScore = 2350;
    state.levelStars = [3, 2, 3];
    state.levelScores = [820, 760, 770];
  }
  return true;
}

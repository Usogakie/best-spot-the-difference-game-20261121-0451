# best-spot-the-difference-game-20261121-0451

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Usogakie/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Usogakie/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Twin Spots — a complete spot the difference game that plays offline in a desktop browser. Two near-identical pictures side by side, three original hand-drawn scenes (Sunny Garden, Cozy Kitchen, Night Harbor), 7–8 differences per scene, a timer, score, hints, and star ratings. All art is drawn in code on canvas; all sounds are synthesized with WebAudio. No network, no libraries, no build step.

## Run it

```sh
node main.ts
```

`main.ts` copies `game/` and `screenshots/` to `/output` (or `$MAKEFUN_OUTPUT_DIR`) and writes `/output/dossier.json`. To play it directly, serve `game/` with any static server and open `game/index.html` — for example:

```sh
python3 -m http.server 8080 --directory game
```

Click a difference in either picture (or press H for a hint, R to restart, M for the menu). A wrong click costs 5 seconds.

---

<sub>Entered on [make.fun](https://make.fun/?ref=skbtbry2&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>

# Twin Spots — a spot-the-difference game

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Usogakie/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Usogakie/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Twin Spots** is a complete spot-the-difference game that plays offline in a
desktop browser from its own static files — no libraries, no network, no
build step. Two near-identical pictures sit side by side; find every sneaky
change before the clock runs out.

## How to play

- **Click** a difference in either picture: a gold ring marks it, +100 points,
  and a happy chime plays.
- **Wrong click:** −5 seconds and a buzz. Look twice, click once.
- **H** — hint: a pulsing ring around one difference you haven't found yet.
- **R** — restart the level. **M** — back to the menu.
- Each level gives you **180 seconds**. Finish a level to earn a time bonus
  and up to **3 stars** (few mistakes, no hints, plenty of time left).

## The three scenes

1. **Sunny Garden** (Easy) — 8 differences: a sunny morning with a tree,
   flowers, a fence and a butterfly that can't sit still.
2. **Cozy Kitchen** (Medium) — 8 differences: tea is brewing, the clock is
   ticking, and something on the shelf moved.
3. **Night Harbor** (Tricky) — 8 differences: moon, stars, a lighthouse beam
   and boats asleep on dark water.

Every picture is drawn procedurally on canvas (gradients, arcs, polygons)
and every sound is synthesized with WebAudio — there are no image or audio
files at all.

## Run it

```sh
node serve.ts        # serves game/ on http://localhost:8080
```

or serve `game/` with any static server and open `game/index.html`.

Hand the entry in (writes `game/`, `screenshots/` and `dossier.json` to
`/output`, or to `$MAKEFUN_OUTPUT_DIR` outside the grader):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `game/index.html` — the page: one 1280×800 canvas, loads `src/main.js`.
- `game/src/config.js` — field size, scoring and timing constants.
- `game/src/random.js` — seeded RNG so decorations land identically every run.
- `game/src/state.js` — screens, score, timer, finds, hints, mistakes.
- `game/src/differences.js` — the difference sets for the three scenes.
- `game/src/scenes.js` — procedural painting of each scene, original + changed.
- `game/src/render.js` — header, panels, markers, menus and overlays.
- `game/src/audio.js` — synthesized WebAudio sounds.
- `game/src/input.js` — pointer + keyboard input, click-to-logical mapping.
- `game/src/shots.js` — deterministic `?shot=start|play|end` states.
- `game/src/main.js` — bootstrap + frame loop.
- `main.ts` — the entry program (Node 22, stdlib only).
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged.

## Screenshots

- `1-start.jpg` — the menu, with the garden behind it.
- `2-play.jpg` — mid-hunt in Sunny Garden: 3 differences ringed, 5 to go.
- `3-end.jpg` — the victory screen with total score and stars.

<sub>Entered on [make.fun](https://make.fun/?ref=skbtbry2&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>

// The pictures themselves. Every scene is drawn twice from the same code: the left
// panel with no modifications, the right panel with the level's differences applied
// (`mods` holds the ids of the differences that change). Nothing is loaded from a
// file: all art is vector shapes on canvas, so the game runs with no network at all.
// Panel space is 560x420. A difference id is only real when the painter changes
// something for it — see differences.js, which lists the same ids.

import { DIFFERENCES } from './differences.js';

// The ids each painter alters, so paintScene can hand the right panel its full set.
const DIFF_IDS = Object.fromEntries(
  Object.entries(DIFFERENCES).map(([level, list]) => [level, list.map((d) => d.id)]),
);

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function cloud(ctx, x, y, scale) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, 18 * scale, 0, Math.PI * 2);
  ctx.arc(x + 20 * scale, y - 8 * scale, 15 * scale, 0, Math.PI * 2);
  ctx.arc(x + 40 * scale, y, 17 * scale, 0, Math.PI * 2);
  ctx.fill();
}

function flower(ctx, x, y, petal, center) {
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2;
    circle(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 6, petal);
  }
  circle(ctx, x, y, 5, center);
}

function paintGarden(ctx, mods) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#7ec3ee');
  sky.addColorStop(1, '#d9f1ff');
  rect(ctx, 0, 0, 560, 300, sky);
  rect(ctx, 0, 300, 560, 120, '#69b455');
  rect(ctx, 0, 300, 560, 10, '#4f9c3f');

  // Sun, top left. The changed picture has fewer rays.
  const rays = mods.has('sun-rays') ? 6 : 8;
  ctx.strokeStyle = '#f2b705';
  ctx.lineWidth = 4;
  for (let i = 0; i < rays; i += 1) {
    const a = (i / rays) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(72 + Math.cos(a) * 36, 62 + Math.sin(a) * 36);
    ctx.lineTo(72 + Math.cos(a) * 48, 62 + Math.sin(a) * 48);
    ctx.stroke();
  }
  circle(ctx, 72, 62, 30, '#ffd93b');
  ctx.fillStyle = '#e8a800';
  circle(ctx, 64, 56, 3, '#e8a800');
  circle(ctx, 80, 56, 3, '#e8a800');
  ctx.strokeStyle = '#e8a800';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(72, 66, 10, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  cloud(ctx, 150, 58, 1);
  if (!mods.has('cloud')) cloud(ctx, 305, 72, 0.9);
  cloud(ctx, 468, 48, 0.8);

  // House with chimney. The changed picture has no smoke.
  rect(ctx, 92, 212, 138, 118, '#f7e8c8');
  ctx.fillStyle = '#c65b4e';
  ctx.beginPath();
  ctx.moveTo(82, 212);
  ctx.lineTo(161, 152);
  ctx.lineTo(240, 212);
  ctx.closePath();
  ctx.fill();
  rect(ctx, 196, 162, 20, 52, '#a8543f');
  if (!mods.has('smoke')) {
    circle(ctx, 206, 148, 10, 'rgba(255,255,255,0.85)');
    circle(ctx, 214, 132, 13, 'rgba(255,255,255,0.7)');
    circle(ctx, 206, 114, 15, 'rgba(255,255,255,0.55)');
  }
  rect(ctx, 146, 262, 30, 68, '#7a5230');
  circle(ctx, 170, 296, 3, '#f2c94c');
  rect(ctx, 108, 232, 34, 34, '#bfe3f2');
  ctx.strokeStyle = '#7a5230';
  ctx.lineWidth = 3;
  ctx.strokeRect(108, 232, 34, 34);
  ctx.beginPath();
  ctx.moveTo(125, 232);
  ctx.lineTo(125, 266);
  ctx.moveTo(108, 249);
  ctx.lineTo(142, 249);
  ctx.stroke();

  // Apple tree. The changed picture has fewer apples.
  rect(ctx, 432, 240, 18, 90, '#7a5230');
  circle(ctx, 442, 198, 52, '#3f8f3a');
  circle(ctx, 408, 222, 34, '#4da244');
  circle(ctx, 476, 222, 34, '#4da244');
  const apples = mods.has('apples')
    ? [[424, 196], [452, 210], [438, 228]]
    : [[424, 196], [452, 210], [438, 228], [414, 226], [466, 196]];
  for (const [ax, ay] of apples) circle(ctx, ax, ay, 6, '#e23b3b');

  // Butterfly. Gone in the changed picture.
  if (!mods.has('butterfly')) {
    ctx.fillStyle = '#ff8fd1';
    ellipse(ctx, 374, 122, 9, 6, '#ff8fd1');
    ellipse(ctx, 390, 122, 9, 6, '#ff8fd1');
    ctx.fillStyle = '#5b3a8c';
    ctx.fillRect(380, 116, 3, 12);
  }

  // Fence. One picket missing in the changed picture.
  ctx.fillStyle = '#e8dcc0';
  ctx.fillRect(30, 322, 500, 8);
  for (let x = 40; x <= 520; x += 24) {
    if (mods.has('picket') && x === 256) continue;
    ctx.beginPath();
    ctx.moveTo(x, 322);
    ctx.lineTo(x + 7, 314);
    ctx.lineTo(x + 14, 322);
    ctx.lineTo(x + 14, 348);
    ctx.lineTo(x, 348);
    ctx.closePath();
    ctx.fill();
  }

  // Flower bed. One flower changes colour in the changed picture.
  const beds = [
    [70, 372, '#ff6b6b'], [130, 366, '#ffd93b'], [190, 372, '#ff8fd1'],
    [258, 366, '#ffffff'], [318, 356, '#ff6b6b'], [380, 372, '#ffd93b'],
    [440, 366, '#ff8fd1'], [500, 372, '#ffffff'],
  ];
  for (const [fx, fy, col] of beds) {
    ctx.strokeStyle = '#3f8f3a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fx, fy + 8);
    ctx.lineTo(fx, fy + 26);
    ctx.stroke();
    const petal = mods.has('flower') && fx === 318 ? '#8b5cf6' : col;
    flower(ctx, fx, fy, petal, '#f2c94c');
  }

  // A bird on the fence, and grass tufts for texture.
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(96, 316, 7, Math.PI, 0);
  ctx.arc(108, 316, 7, Math.PI, 0);
  ctx.stroke();
  ctx.strokeStyle = '#4f9c3f';
  ctx.lineWidth = 2;
  for (const gx of [60, 210, 350, 480, 530]) {
    ctx.beginPath();
    ctx.moveTo(gx, 402);
    ctx.lineTo(gx + 4, 390);
    ctx.moveTo(gx + 8, 402);
    ctx.lineTo(gx + 12, 391);
    ctx.stroke();
  }
}

function paintKitchen(ctx, mods) {
  rect(ctx, 0, 0, 560, 340, '#f3e2c7');
  rect(ctx, 0, 340, 560, 80, '#b98a5a');
  ctx.strokeStyle = '#9c6f43';
  ctx.lineWidth = 2;
  for (let y = 360; y < 420; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(560, y);
    ctx.stroke();
  }

  // Window with sky. A bird sits on the sill in the original only.
  rect(ctx, 56, 56, 128, 128, '#bfe3f2');
  ctx.strokeStyle = '#7a5230';
  ctx.lineWidth = 6;
  ctx.strokeRect(56, 56, 128, 128);
  ctx.beginPath();
  ctx.moveTo(120, 56);
  ctx.lineTo(120, 184);
  ctx.moveTo(56, 120);
  ctx.lineTo(184, 120);
  ctx.stroke();
  circle(ctx, 150, 82, 14, '#ffd93b');
  if (!mods.has('bird')) {
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(88, 112, 6, Math.PI, 0);
    ctx.arc(98, 112, 6, Math.PI, 0);
    ctx.stroke();
  }

  // Wall clock. The changed picture shows another time.
  circle(ctx, 468, 82, 30, '#ffffff');
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(468, 82, 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(468, 82);
  if (mods.has('clock')) {
    ctx.lineTo(468, 100);
    ctx.moveTo(468, 82);
    ctx.lineTo(452, 82);
  } else {
    ctx.lineTo(468, 62);
    ctx.moveTo(468, 82);
    ctx.lineTo(488, 82);
  }
  ctx.stroke();
  circle(ctx, 468, 82, 3, '#2c3e50');

  // Counter, stove and kettle. Steam rises in the original only.
  rect(ctx, 40, 280, 480, 60, '#8a6d4b');
  rect(ctx, 40, 280, 480, 10, '#a8875f');
  rect(ctx, 180, 226, 90, 54, '#5b6770');
  circle(ctx, 225, 200, 26, '#3f4a54');
  ctx.fillStyle = '#3f4a54';
  ctx.beginPath();
  ctx.moveTo(225, 178);
  ctx.lineTo(225, 158);
  ctx.lineTo(238, 172);
  ctx.closePath();
  ctx.fill();
  if (!mods.has('steam')) {
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(222, 152);
    ctx.quadraticCurveTo(214, 138, 222, 126);
    ctx.moveTo(232, 152);
    ctx.quadraticCurveTo(240, 138, 232, 126);
    ctx.stroke();
  }

  // Fruit bowl. One apple fewer in the changed picture.
  ellipse(ctx, 302, 308, 52, 16, '#c65b4e');
  const fruit = mods.has('fruit')
    ? [[282, 296], [302, 290], [322, 296]]
    : [[282, 296], [302, 290], [322, 296], [292, 282]];
  for (const [fx, fy] of fruit) circle(ctx, fx, fy, 10, '#e23b3b');
  ctx.strokeStyle = '#7a5230';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(302, 280);
  ctx.quadraticCurveTo(306, 274, 312, 272);
  ctx.stroke();

  // Mug. Blue in the original, green in the changed picture.
  rect(ctx, 126, 286, 32, 30, mods.has('mug') ? '#58b368' : '#4f8fd1');
  ctx.strokeStyle = mods.has('mug') ? '#58b368' : '#4f8fd1';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(160, 300, 8, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();

  // The cat on its chair. Its tail is up in the original, down in the changed picture.
  rect(ctx, 396, 300, 76, 12, '#7a5230');
  rect(ctx, 402, 312, 8, 28, '#7a5230');
  rect(ctx, 458, 312, 8, 28, '#7a5230');
  ellipse(ctx, 430, 282, 30, 22, '#e8a34c');
  circle(ctx, 452, 256, 16, '#e8a34c');
  ctx.fillStyle = '#e8a34c';
  ctx.beginPath();
  ctx.moveTo(440, 244);
  ctx.lineTo(444, 232);
  ctx.lineTo(450, 244);
  ctx.closePath();
  ctx.moveTo(458, 244);
  ctx.lineTo(462, 232);
  ctx.lineTo(466, 244);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#e8a34c';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (mods.has('tail')) {
    ctx.moveTo(402, 288);
    ctx.quadraticCurveTo(392, 306, 398, 322);
  } else {
    ctx.moveTo(402, 288);
    ctx.quadraticCurveTo(388, 272, 396, 254);
  }
  ctx.stroke();
  ctx.fillStyle = '#2c3e50';
  circle(ctx, 458, 254, 2, '#2c3e50');

  // Potted plant. Its flower is gone in the changed picture.
  rect(ctx, 488, 306, 28, 26, '#c65b4e');
  ctx.strokeStyle = '#3f8f3a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(502, 306);
  ctx.lineTo(502, 282);
  ctx.moveTo(502, 292);
  ctx.lineTo(490, 282);
  ctx.moveTo(502, 292);
  ctx.lineTo(514, 282);
  ctx.stroke();
  if (!mods.has('bloom')) flower(ctx, 502, 276, '#ff8fd1', '#f2c94c');

  // Shelves with plates and jars for texture.
  rect(ctx, 260, 60, 150, 8, '#8a6d4b');
  circle(ctx, 285, 48, 12, '#ffffff');
  circle(ctx, 320, 48, 12, '#bfe3f2');
  rect(ctx, 348, 34, 22, 26, '#58b368');
}

function paintHarbor(ctx, mods) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#0b1030');
  sky.addColorStop(1, '#24356b');
  rect(ctx, 0, 0, 560, 300, sky);

  // Stars. One goes out in the changed picture.
  const stars = [[60, 40], [180, 30], [260, 52], [352, 62], [420, 36], [500, 70], [300, 28], [140, 90], [460, 120]];
  ctx.fillStyle = '#ffffff';
  for (const [sx, sy] of stars) {
    if (mods.has('star') && sx === 352) continue;
    ctx.beginPath();
    ctx.arc(sx, sy, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Moon. Full in the original, crescent in the changed picture.
  circle(ctx, 92, 72, 26, '#f7f3d8');
  if (mods.has('moon')) circle(ctx, 102, 66, 24, '#0b1030');

  // Gulls. One flies off in the changed picture.
  ctx.strokeStyle = '#dfe6f2';
  ctx.lineWidth = 2;
  const gulls = [[180, 90], [252, 102], [320, 84]];
  for (const [gx, gy] of gulls) {
    if (mods.has('gull') && gx === 252) continue;
    ctx.beginPath();
    ctx.arc(gx - 6, gy, 6, Math.PI, 0);
    ctx.arc(gx + 6, gy, 6, Math.PI, 0);
    ctx.stroke();
  }

  // Lighthouse. Its beam is out in the changed picture.
  rect(ctx, 104, 150, 36, 150, '#f2f4f8');
  rect(ctx, 104, 180, 36, 18, '#e5534b');
  rect(ctx, 104, 230, 36, 18, '#e5534b');
  rect(ctx, 110, 128, 24, 22, '#2c3e50');
  circle(ctx, 122, 139, 8, '#ffe98a');
  if (!mods.has('beam')) {
    const beam = ctx.createLinearGradient(140, 139, 330, 139);
    beam.addColorStop(0, 'rgba(255,233,138,0.55)');
    beam.addColorStop(1, 'rgba(255,233,138,0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(140, 130);
    ctx.lineTo(330, 108);
    ctx.lineTo(330, 170);
    ctx.lineTo(140, 148);
    ctx.closePath();
    ctx.fill();
  }

  // Cottage with two lit windows. One goes dark in the changed picture.
  rect(ctx, 448, 210, 76, 90, '#5b4a68');
  ctx.fillStyle = '#c65b4e';
  ctx.beginPath();
  ctx.moveTo(442, 210);
  ctx.lineTo(486, 176);
  ctx.lineTo(530, 210);
  ctx.closePath();
  ctx.fill();
  rect(ctx, 460, 228, 18, 20, '#ffe98a');
  rect(ctx, 494, 228, 18, 20, mods.has('window') ? '#2c3e50' : '#ffe98a');

  // Sea.
  rect(ctx, 0, 300, 560, 120, '#12294d');
  ctx.strokeStyle = 'rgba(120,170,230,0.5)';
  ctx.lineWidth = 2;
  for (const [wx, wy, wl] of [[40, 322, 60], [200, 336, 80], [380, 322, 70], [90, 372, 90], [300, 386, 80], [460, 372, 60]]) {
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.quadraticCurveTo(wx + wl / 2, wy - 6, wx + wl, wy);
    ctx.stroke();
  }

  // Sailboat. Its sail changes colour in the changed picture.
  ctx.fillStyle = '#7a5230';
  ctx.beginPath();
  ctx.moveTo(272, 292);
  ctx.lineTo(336, 292);
  ctx.lineTo(322, 308);
  ctx.lineTo(286, 308);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#d8c9a8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(304, 292);
  ctx.lineTo(304, 238);
  ctx.stroke();
  ctx.fillStyle = mods.has('sail') ? '#4f8fd1' : '#e5534b';
  ctx.beginPath();
  ctx.moveTo(304, 240);
  ctx.lineTo(304, 288);
  ctx.lineTo(268, 288);
  ctx.closePath();
  ctx.fill();

  // A second, smaller boat far away.
  ctx.fillStyle = '#4a3a5e';
  ctx.beginPath();
  ctx.moveTo(160, 330);
  ctx.lineTo(200, 330);
  ctx.lineTo(192, 340);
  ctx.lineTo(168, 340);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#d8c9a8';
  ctx.beginPath();
  ctx.moveTo(180, 330);
  ctx.lineTo(180, 306);
  ctx.lineTo(196, 330);
  ctx.closePath();
  ctx.fill();

  // Buoy. Gone in the changed picture.
  if (!mods.has('buoy')) {
    circle(ctx, 452, 352, 10, '#ff8c42');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(448, 344, 8, 6);
  }

  // A fish jumps out of the water in the original only.
  if (!mods.has('fish')) {
    ctx.strokeStyle = '#bfe3f2';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(202, 356, 12, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = '#bfe3f2';
    ctx.beginPath();
    ctx.moveTo(190, 356);
    ctx.lineTo(184, 348);
    ctx.lineTo(194, 350);
    ctx.closePath();
    ctx.fill();
  }

  // Moonlight on the water.
  ctx.fillStyle = 'rgba(247,243,216,0.25)';
  for (let i = 0; i < 5; i += 1) {
    ctx.fillRect(84 + i * 4, 312 + i * 18, 44 - i * 6, 4);
  }
}

/** Paint a level's scene onto a 560x420 canvas context. `variant` is 'left' (the
 *  original) or 'right' (the picture with the differences applied). */
export function paintScene(ctx, levelId, variant) {
  const mods = variant === 'right' ? new Set((DIFF_IDS[levelId] ?? [])) : new Set();
  ctx.clearRect(0, 0, 560, 420);
  if (levelId === 'garden') paintGarden(ctx, mods);
  else if (levelId === 'kitchen') paintKitchen(ctx, mods);
  else paintHarbor(ctx, mods);
}

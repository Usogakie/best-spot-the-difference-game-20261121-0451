// Twin Spots — procedural scene painting. Every picture is drawn from code:
// gradients, arcs and polygons, no image files. Each scene has one painter
// that takes a variant (0 = original, 1 = changed); the changed variant
// applies exactly the differences listed in differences.js.
import { SCENES } from './differences.js';
import { makeRng, range } from './random.js';

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function poly(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
}

function cloud(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ellipse(ctx, x, y, 34 * s, 20 * s);
  ellipse(ctx, x - 24 * s, y + 6 * s, 22 * s, 15 * s);
  ellipse(ctx, x + 26 * s, y + 6 * s, 24 * s, 16 * s);
}

function star4(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

// ------------------------------------------------------------ Sunny Garden
function drawGarden(ctx, variant) {
  const sky = ctx.createLinearGradient(0, 0, 0, 600);
  sky.addColorStop(0, '#7ec3f7');
  sky.addColorStop(0.55, '#cfeeff');
  sky.addColorStop(1, '#eaf9d8');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 600);

  // Sun: variant 1 loses two rays.
  const rays = variant === 1 ? 6 : 8;
  ctx.strokeStyle = '#ffb703';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  for (let i = 0; i < rays; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(96 + Math.cos(a) * 46, 88 + Math.sin(a) * 46);
    ctx.lineTo(96 + Math.cos(a) * 66, 88 + Math.sin(a) * 66);
    ctx.stroke();
  }
  ctx.fillStyle = '#ffd23d';
  circle(ctx, 96, 88, 38);
  ctx.fillStyle = '#fff3b0';
  circle(ctx, 96, 88, 26);

  // Clouds: variant 1 loses the middle one.
  cloud(ctx, 210, 64, 1, 'rgba(255,255,255,0.95)');
  if (variant === 0) cloud(ctx, 428, 72, 0.9, 'rgba(255,255,255,0.95)');
  cloud(ctx, 540, 40, 0.7, 'rgba(255,255,255,0.85)');

  // A new bird appears in the changed picture.
  if (variant === 1) {
    ctx.strokeStyle = '#3a3a3a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(512, 152, 9, Math.PI * 1.1, Math.PI * 1.9);
    ctx.arc(530, 152, 9, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  }
  ctx.strokeStyle = '#3a3a3a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(300, 120, 8, Math.PI * 1.1, Math.PI * 1.9);
  ctx.arc(316, 120, 8, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();

  // Rolling hills.
  ctx.fillStyle = '#7ec850';
  ctx.beginPath();
  ctx.moveTo(0, 380);
  ctx.quadraticCurveTo(180, 300, 380, 372);
  ctx.quadraticCurveTo(500, 410, 600, 360);
  ctx.lineTo(600, 600);
  ctx.lineTo(0, 600);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#67b13e';
  ctx.beginPath();
  ctx.moveTo(0, 460);
  ctx.quadraticCurveTo(220, 400, 420, 452);
  ctx.quadraticCurveTo(520, 478, 600, 440);
  ctx.lineTo(600, 600);
  ctx.lineTo(0, 600);
  ctx.closePath();
  ctx.fill();

  // Fence: variant 1 loses one post.
  ctx.fillStyle = '#b07a45';
  ctx.fillRect(0, 318, 600, 10);
  ctx.fillRect(0, 352, 600, 10);
  const posts = [30, 120, 210, 300, 390, 480, 570];
  posts.forEach((x, i) => {
    if (variant === 1 && i === 3) return;
    ctx.fillRect(x - 7, 300, 14, 78);
    ctx.beginPath();
    ctx.moveTo(x - 7, 300);
    ctx.lineTo(x, 288);
    ctx.lineTo(x + 7, 300);
    ctx.closePath();
    ctx.fill();
  });

  // Tree with apples: variant 1 loses one apple.
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(452, 240, 26, 120);
  ctx.fillStyle = '#4e9b3a';
  circle(ctx, 465, 200, 62);
  circle(ctx, 420, 235, 44);
  circle(ctx, 510, 235, 44);
  ctx.fillStyle = '#e63946';
  circle(ctx, 438, 215, 9);
  if (variant === 0) circle(ctx, 468, 238, 9);
  circle(ctx, 498, 210, 9);
  circle(ctx, 452, 258, 9);

  // Butterfly: variant 1 moves it away (drawn elsewhere, lower).
  const bx = variant === 1 ? 252 : 252;
  const by = variant === 1 ? 182 : 182;
  if (variant === 0) {
    ctx.fillStyle = '#ff8fab';
    ellipse(ctx, bx - 10, by, 12, 16);
    ellipse(ctx, bx + 10, by, 12, 16);
    ctx.fillStyle = '#3a2e39';
    ellipse(ctx, bx, by, 3, 12);
  }

  // Flower bed: variant 1 turns one tulip purple.
  const rng = makeRng(SCENES[0].seed);
  const petalColors = ['#ff5d8f', '#ff9f1c', '#ffffff', '#ff5d8f', '#ff9f1c'];
  for (let i = 0; i < 9; i++) {
    const fx = 60 + i * 58 + range(rng, -6, 6);
    const fy = 500 + range(rng, -8, 8);
    ctx.strokeStyle = '#2f7d32';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(fx, fy + 14);
    ctx.lineTo(fx, fy + 44);
    ctx.stroke();
    ctx.fillStyle = variant === 1 && i === 2 ? '#9b5de5' : petalColors[i % petalColors.length];
    ellipse(ctx, fx, fy, 11, 15);
    circle(ctx, fx, fy - 8, 8);
  }

  // Watering can: only in the changed picture.
  if (variant === 1) {
    ctx.fillStyle = '#5a8f7b';
    rr(ctx, 66, 522, 52, 34, 8);
    ctx.fill();
    ctx.fillStyle = '#4a7a68';
    ctx.fillRect(112, 528, 26, 8);
    ctx.beginPath();
    ctx.moveTo(66, 530);
    ctx.lineTo(44, 516);
    ctx.lineTo(44, 540);
    ctx.lineTo(66, 546);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#7fb069';
    circle(ctx, 40, 514, 4);
  }

  // Grass tufts.
  ctx.strokeStyle = '#3e8e2f';
  ctx.lineWidth = 3;
  for (let i = 0; i < 14; i++) {
    const gx = 20 + i * 43;
    ctx.beginPath();
    ctx.moveTo(gx, 596);
    ctx.lineTo(gx + 4, 580);
    ctx.moveTo(gx + 8, 596);
    ctx.lineTo(gx + 12, 582);
    ctx.stroke();
  }
}

// ------------------------------------------------------------ Cozy Kitchen
function drawKitchen(ctx, variant) {
  ctx.fillStyle = '#f7e3c3';
  ctx.fillRect(0, 0, 600, 600);
  ctx.fillStyle = '#e8c99a';
  ctx.fillRect(0, 470, 600, 130);

  // Window with sky: variant 1 hides the sun behind a cloud.
  ctx.fillStyle = '#8a5a2b';
  rr(ctx, 380, 60, 180, 170, 10);
  ctx.fill();
  const winSky = ctx.createLinearGradient(0, 70, 0, 220);
  winSky.addColorStop(0, '#8ec9f7');
  winSky.addColorStop(1, '#dff3ff');
  ctx.fillStyle = winSky;
  ctx.fillRect(392, 72, 156, 146);
  if (variant === 0) {
    ctx.fillStyle = '#ffd23d';
    circle(ctx, 500, 110, 22);
  } else {
    cloud(ctx, 500, 110, 0.8, 'rgba(255,255,255,0.95)');
  }
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(464, 72, 12, 146);
  ctx.fillRect(392, 138, 156, 12);

  // Curtains: variant 1 changes the left tie colour.
  ctx.fillStyle = '#e63946';
  poly(ctx, [[372, 56], [404, 56], [396, 230], [372, 230]]);
  ctx.fill();
  ctx.fillStyle = '#e63946';
  poly(ctx, [[568, 56], [536, 56], [544, 230], [568, 230]]);
  ctx.fill();
  ctx.fillStyle = variant === 1 ? '#2a9d8f' : '#ffd23d';
  ctx.fillRect(372, 146, 32, 12);
  ctx.fillStyle = '#ffd23d';
  ctx.fillRect(536, 146, 32, 12);

  // Wall clock: variant 1 moves the hands.
  ctx.fillStyle = '#ffffff';
  circle(ctx, 300, 92, 40);
  ctx.strokeStyle = '#3a2e39';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(300, 92, 40, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#3a2e39';
  ctx.lineWidth = 3;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(300 + Math.cos(a) * 33, 92 + Math.sin(a) * 33);
    ctx.lineTo(300 + Math.cos(a) * 37, 92 + Math.sin(a) * 37);
    ctx.stroke();
  }
  const hourAngle = variant === 1 ? Math.PI * 0.75 : 0;
  const minAngle = variant === 1 ? Math.PI * 0.5 : -Math.PI / 2;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(300, 92);
  ctx.lineTo(300 + Math.cos(hourAngle) * 18, 92 + Math.sin(hourAngle) * 18);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 92);
  ctx.lineTo(300 + Math.cos(minAngle) * 28, 92 + Math.sin(minAngle) * 28);
  ctx.stroke();
  ctx.fillStyle = '#e63946';
  circle(ctx, 300, 92, 4);

  // Shelf with three jars: variant 1 changes the middle label.
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(180, 240, 220, 12);
  const jarColors = ['#f4a261', '#e9c46a', '#90be6d'];
  [210, 290, 370].forEach((jx, i) => {
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    rr(ctx, jx, 186, 52, 54, 8);
    ctx.fill();
    ctx.fillStyle = jarColors[i];
    rr(ctx, jx + 6, 196, 40, 34, 6);
    ctx.fill();
    ctx.fillStyle = variant === 1 && i === 1 ? '#9b5de5' : '#ffffff';
    ctx.fillRect(jx + 10, 206, 32, 14);
    ctx.fillStyle = '#8a5a2b';
    ctx.fillRect(jx + 14, 178, 24, 10);
  });

  // Table.
  ctx.fillStyle = '#a9713f';
  rr(ctx, 120, 400, 360, 22, 8);
  ctx.fill();
  ctx.fillRect(150, 422, 18, 90);
  ctx.fillRect(432, 422, 18, 90);

  // Teapot: variant 1 loses the lid knob and the steam.
  ctx.fillStyle = '#457b9d';
  ellipse(ctx, 252, 382, 52, 34);
  ctx.fillStyle = '#3a6a8a';
  poly(ctx, [[200, 372], [168, 352], [172, 366], [200, 388]]);
  ctx.fill();
  ctx.fillStyle = '#457b9d';
  ctx.beginPath();
  ctx.arc(306, 372, 16, -Math.PI / 2, Math.PI / 2);
  ctx.fill();
  ctx.fillStyle = '#2f5d7d';
  ellipse(ctx, 252, 350, 30, 8);
  if (variant === 0) {
    ctx.fillStyle = '#ffd23d';
    circle(ctx, 252, 342, 7);
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(244, 330);
    ctx.quadraticCurveTo(236, 314, 246, 300);
    ctx.moveTo(260, 330);
    ctx.quadraticCurveTo(268, 312, 258, 298);
    ctx.stroke();
  }

  // Cups.
  ctx.fillStyle = '#ffffff';
  rr(ctx, 330, 372, 34, 26, 6);
  ctx.fill();
  ctx.fillStyle = '#e9c46a';
  rr(ctx, 372, 372, 34, 26, 6);
  ctx.fill();

  // Fruit bowl: variant 1 loses one apple.
  ctx.fillStyle = '#6d597a';
  ctx.beginPath();
  ctx.ellipse(432, 428, 52, 18, 0, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = '#e63946';
  circle(ctx, 408, 416, 13);
  circle(ctx, 436, 410, 13);
  if (variant === 0) circle(ctx, 458, 418, 13);
  ctx.fillStyle = '#90be6d';
  circle(ctx, 424, 404, 11);

  // Rug: variant 1 changes a stripe.
  ctx.fillStyle = '#b5838d';
  rr(ctx, 180, 520, 240, 44, 10);
  ctx.fill();
  ctx.fillStyle = '#e5989b';
  ctx.fillRect(180, 520, 240, 12);
  ctx.fillStyle = variant === 1 ? '#2a9d8f' : '#ffcdb2';
  ctx.fillRect(180, 540, 240, 10);
}

// ------------------------------------------------------------ Night Harbor
function drawHarbor(ctx, variant) {
  const night = ctx.createLinearGradient(0, 0, 0, 600);
  night.addColorStop(0, '#0b1035');
  night.addColorStop(0.6, '#1c2a5e');
  night.addColorStop(1, '#0e1a3d');
  ctx.fillStyle = night;
  ctx.fillRect(0, 0, 600, 600);

  // Stars: variant 1 puts one out.
  const rng = makeRng(SCENES[2].seed);
  const starSpots = [];
  for (let i = 0; i < 26; i++) {
    starSpots.push([range(rng, 20, 580), range(rng, 16, 220), range(rng, 1.5, 3.5)]);
  }
  starSpots.forEach(([sx, sy, sr], i) => {
    if (variant === 1 && i === 7) return;
    star4(ctx, sx, sy, sr + 2, 'rgba(255,255,255,0.9)');
  });

  // Moon: variant 1 loses a crater.
  ctx.fillStyle = '#f4f1de';
  circle(ctx, 112, 92, 40);
  ctx.fillStyle = '#d8d3b8';
  circle(ctx, 100, 82, 8);
  if (variant === 0) circle(ctx, 126, 102, 6);
  circle(ctx, 122, 76, 5);

  // Moon reflection: only in the original.
  if (variant === 0) {
    ctx.fillStyle = 'rgba(244,241,222,0.35)';
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(96 + (i % 2) * 10, 500 + i * 14, 34 - i * 4, 5);
    }
  }

  // Sea.
  const sea = ctx.createLinearGradient(0, 380, 0, 600);
  sea.addColorStop(0, '#16324f');
  sea.addColorStop(1, '#0a1f33');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 380, 600, 220);
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(20 + i * 70, 420 + (i % 3) * 40);
    ctx.quadraticCurveTo(50 + i * 70, 412 + (i % 3) * 40, 80 + i * 70, 420 + (i % 3) * 40);
    ctx.stroke();
  }

  // Distant buildings with lit windows: variant 1 darkens one window.
  ctx.fillStyle = '#141b34';
  ctx.fillRect(360, 250, 70, 130);
  ctx.fillRect(440, 220, 80, 160);
  ctx.fillRect(530, 270, 60, 110);
  const windows = [
    [378, 272], [402, 272], [378, 306], [402, 306],
    [458, 244], [486, 244], [458, 278], [486, 278], [458, 312],
    [546, 292], [570, 292],
  ];
  windows.forEach(([wx, wy], i) => {
    if (variant === 1 && i === 4) {
      ctx.fillStyle = '#232c4a';
    } else {
      ctx.fillStyle = '#ffd23d';
    }
    ctx.fillRect(wx, wy, 14, 18);
  });

  // Lighthouse: variant 1 swings the beam and loses the flag.
  ctx.fillStyle = '#e8e3d3';
  poly(ctx, [[470, 380], [494, 380], [488, 180], [476, 180]]);
  ctx.fill();
  ctx.fillStyle = '#e63946';
  poly(ctx, [[473, 320], [491, 320], [489, 282], [475, 282]]);
  ctx.fill();
  poly(ctx, [[476, 230], [488, 230], [486, 196], [478, 196]]);
  ctx.fill();
  ctx.fillStyle = '#3a2e39';
  ctx.fillRect(470, 168, 24, 14);
  ctx.fillStyle = '#ffd23d';
  circle(ctx, 482, 160, 10);
  if (variant === 0) {
    ctx.strokeStyle = '#3a2e39';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(482, 168);
    ctx.lineTo(482, 138);
    ctx.stroke();
    ctx.fillStyle = '#e63946';
    poly(ctx, [[482, 138], [506, 144], [482, 150]]);
    ctx.fill();
  }
  // Beam: kept faint so it reads as light, not a solid triangle.
  ctx.fillStyle = 'rgba(255,210,61,0.18)';
  if (variant === 0) {
    poly(ctx, [[482, 160], [600, 110], [600, 200]]);
  } else {
    poly(ctx, [[482, 160], [360, 110], [360, 200]]);
  }
  ctx.fill();

  // Boats: variant 1 changes the small sail's colour.
  ctx.fillStyle = '#6d3b1f';
  poly(ctx, [[150, 440], [260, 440], [240, 470], [170, 470]]);
  ctx.fill();
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(200, 380, 6, 62);
  ctx.fillStyle = variant === 1 ? '#2a9d8f' : '#f4f1de';
  poly(ctx, [[206, 384], [206, 436], [246, 436]]);
  ctx.fill();
  ctx.fillStyle = '#e9c46a';
  poly(ctx, [[196, 390], [196, 436], [164, 436]]);
  ctx.fill();

  ctx.fillStyle = '#4a2c17';
  poly(ctx, [[330, 470], [420, 470], [400, 496], [350, 496]]);
  ctx.fill();
  ctx.fillStyle = '#f4f1de';
  poly(ctx, [[372, 420], [372, 466], [404, 466]]);
  ctx.fill();

  // Buoy: variant 1 changes its colour.
  ctx.fillStyle = variant === 1 ? '#2a9d8f' : '#e63946';
  circle(ctx, 522, 502, 14);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(514, 494, 16, 6);
  ctx.strokeStyle = '#3a2e39';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(522, 488);
  ctx.lineTo(522, 478);
  ctx.stroke();
}

const PAINTERS = [drawGarden, drawKitchen, drawHarbor];

export function drawScene(ctx, sceneIndex, variant, t) {
  PAINTERS[sceneIndex](ctx, variant);
}

export function sceneCount() {
  return SCENES.length;
}

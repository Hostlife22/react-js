import { ellipse, line, path, random, rect, type Ctx } from '../primitives';
import { COLORS as C, paperTexture as texture } from './materials';
import { drawModernEnvironment } from './environment';

let room: HTMLCanvasElement | undefined;

function makeRoom() {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const c = canvas.getContext('2d', { willReadFrequently: true })!;
  c.scale(2, 2);
  rect(c, 0, 0, 960, 540, C.paper);
  ellipse(c, 280, 247, 203, 151, '#f4d8c9');
  ellipse(c, 669, 261, 151, 163, '#e4d8f2');
  rect(c, 0, 396, 960, 144, '#eee2cd');
  // The window has separate sill, glazing, skyline, clouds and fine printed accents.
  c.save();
  c.translate(179, 60);
  c.scale(222 / 267, 218 / 244);
  c.translate(-172, -102);
  rect(c, 179, 108, 267, 244, '#ded9c6', 23);
  rect(c, 172, 102, 267, 244, C.cream, 22);
  const window = path(
    c,
    'M193 116 H417 Q425 116 425 127 V318 Q425 329 413 329 H195 Q185 329 185 317 V128 Q185 116 193 116Z',
    '#bfe4e4',
  );
  c.save();
  c.clip(window);
  const buildings = [
    [192, 276, 38, 54, '#c3afe6'],
    [219, 292, 42, 38, '#a59adb'],
    [252, 263, 43, 67, '#eea19b'],
    [293, 283, 35, 47, '#8bae94'],
    [322, 280, 41, 50, '#bcaee5'],
    [359, 300, 52, 30, C.navy],
  ] as const;
  for (const [x, y, w, h, color] of buildings) {
    rect(c, x, y, w, h, color, x === 322 ? 18 : 5);
    for (let bx = x + 6; bx < x + w - 4; bx += 12)
      for (let by = y + 8; by < y + h - 4; by += 13) rect(c, bx, by, 4, 6, '#fbe280', 1);
  }
  ellipse(c, 373, 160, 26, 26, '#edc342');
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    line(
      c,
      373 + Math.cos(a) * 32,
      160 + Math.sin(a) * 32,
      373 + Math.cos(a) * 37,
      160 + Math.sin(a) * 37,
      '#edc342',
      2,
    );
  }
  ellipse(c, 197, 327, 18, 13, '#559570');
  ellipse(c, 419, 327, 19, 13, '#559570');
  c.restore();
  line(c, 304, 116, 304, 329, C.cream, 8);
  line(c, 185, 221, 425, 221, C.cream, 8);
  rect(c, 160, 341, 291, 12, C.cream, 6);
  c.restore();
  // Chair and table dimensions match the articulated character and the landing.
  ellipse(c, 684, 450, 109, 13, '#84bda04a');
  rect(c, 723, 277, 23, 119, C.mint, 10);
  rect(c, 651, 376, 95, 13, '#87b797', 6);
  line(c, 657, 385, 648, 448, '#75a481', 5);
  line(c, 737, 385, 747, 448, '#75a481', 5);
  rect(c, 409, 320, 191, 12, C.navy, 6);
  rect(c, 498, 330, 13, 113, C.navy, 3);
  rect(c, 463, 441, 84, 9, C.navy, 5);
  const rng = random(10);
  for (const [x, y, color] of [
    [95, 77, C.coral],
    [626, 115, '#ad92d0'],
    [898, 132, C.navy],
  ] as const) {
    line(c, x - 4, y - 4, x + 4, y + 4, color, 3.5);
    line(c, x + 4, y - 4, x - 4, y + 4, color, 3.5);
  }
  for (const [x, y, color] of [
    [43, 160, C.yellow],
    [139, 298, C.coral],
    [732, 139, C.yellow],
    [697, 36, C.navy],
  ] as const)
    ellipse(c, x, y, 3.6, 3.6, color);
  ellipse(c, 587, 49, 6, 6, 'transparent', C.yellow, 3);
  for (const [x, y, color] of [
    [124, 129, C.green],
    [149, 237, C.navy],
  ] as const)
    for (let i = 0; i < 9; i++)
      ellipse(c, x + (i % 3) * 8, y + Math.floor(i / 3) * 8, 1.2, 1.2, color);
  for (const [x, y, color] of [
    [119, 211, C.navy],
    [633, 54, C.coral],
    [42, 362, C.yellow],
  ] as const)
    path(c, `M${x - 13} ${y}q4-8 9 0q4 8 9 0q4-8 9 0`, undefined, color, 2);
  path(c, 'M437 153l-7-13-7 13Z', C.yellow);
  path(c, 'M59 278l-16 7 13 15Z', '#ad92d0');
  path(c, 'M443 67a10 10 0 0 1 20 0Z', C.green);
  path(c, 'M909 167a10 10 0 0 1 20 0Z', C.coral);
  // Pigment becomes denser along the lower edge of each printed color field.
  for (const [x, y, rx, ry, color] of [
    [280, 247, 203, 151, '#db827b'],
    [669, 261, 151, 163, '#9b83bd'],
  ] as const) {
    c.save();
    c.beginPath();
    c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    c.clip();
    c.fillStyle = color;
    for (let i = 0; i < 15000; i++) {
      const px = x - rx + rng() * rx * 2,
        py = y - ry + Math.pow(rng(), 0.4) * ry * 2;
      c.globalAlpha = 0.1 + rng() * 0.3;
      c.fillRect(px, py, 0.4 + rng() * 0.6, 0.5 + rng() * 0.6);
    }
    c.restore();
  }
  c.globalAlpha = 0.28;
  c.drawImage(texture(), 0, 0, 960, 540);
  c.globalAlpha = 1;
  return canvas;
}

export function drawModernRoom(c: Ctx, time = 0) {
  room ??= makeRoom();
  c.drawImage(room, 0, 0, 960, 540);
  drawModernEnvironment(c, time);
}

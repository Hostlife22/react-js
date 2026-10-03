import { ellipse, gradient, line, path, type Ctx } from './primitives';

type Point = { x: number; y: number };
const materials = new Map<string, HTMLCanvasElement>();

function phong(color: string) {
  const cached = materials.get(color);
  if (cached) return cached;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const c = canvas.getContext('2d', { willReadFrequently: true })!,
    pixels = c.createImageData(256, 256),
    rgb = parseInt(color.slice(1), 16),
    base = [rgb >> 16, (rgb >> 8) & 255, rgb & 255];
  // Surface normals, two lights, Blinn highlights and a cool reflected horizon.
  // Every texel is calculated here; there is no image asset or model download.
  for (let y = 0; y < 256; y++)
    for (let x = 0; x < 256; x++) {
      const nx = (x - 127.5) / 127.5,
        ny = (y - 127.5) / 127.5,
        r2 = nx * nx + ny * ny;
      if (r2 >= 1) continue;
      const nz = Math.sqrt(1 - r2),
        light = Math.max(0, -nx * 0.42 - ny * 0.58 + nz * 0.69),
        fill = Math.max(0, nx * 0.7 + ny * 0.2 + nz * 0.4);
      const spec = Math.pow(Math.max(0, -nx * 0.23 - ny * 0.31 + nz * 0.923), 62) * 1.3;
      const rim = Math.pow(1 - nz, 3),
        horizon = Math.exp(-Math.pow((ny * nz * 2 + 0.35) * 4, 2));
      const at = (y * 256 + x) * 4;
      for (let k = 0; k < 3; k++)
        pixels.data[at + k] = Math.min(
          255,
          base[k] * (0.19 + 0.71 * light + 0.12 * fill) +
            [241, 250, 250][k] * spec +
            [30, 60, 75][k] * rim +
            [17, 24, 37][k] * horizon,
        );
      pixels.data[at + 3] = Math.min(255, (1 - Math.sqrt(r2)) * 127.5 * 255);
    }
  c.putImageData(pixels, 0, 0);
  materials.set(color, canvas);
  return canvas;
}

function ball(c: Ctx, x: number, y: number, rx: number, ry: number, color: string, angle = 0) {
  c.save();
  c.translate(x, y);
  c.rotate(angle);
  c.drawImage(phong(color), -rx, -ry, rx * 2, ry * 2);
  c.restore();
}

function tube(c: Ctx, a: Point, b: Point, width: number, color: string) {
  const dx = b.x - a.x,
    dy = b.y - a.y,
    n = Math.max(0.01, Math.hypot(dx, dy)),
    px = ((-dy / n) * width) / 2,
    py = ((dx / n) * width) / 2;
  c.lineCap = 'round';
  c.lineWidth = width;
  c.strokeStyle = gradient(c, a.x - px, a.y - py, a.x + px, a.y + py, [
    '#233548',
    color,
    '#e5e9e0',
    color,
    '#22394d',
  ]);
  c.beginPath();
  c.moveTo(a.x, a.y);
  c.lineTo(b.x, b.y);
  c.stroke();
}

export function drawRetroFigure(
  c: Ctx,
  time: number,
  cup: Point,
  solve: (sx: number, sy: number, hx: number, hy: number) => Point,
) {
  c.save();
  c.translate(0, Math.sin(time * 2) * 0.5);
  c.save();
  c.filter = 'blur(4px)';
  ellipse(c, 671, 444, 68, 7, '#21354b70');
  c.restore();
  tube(c, { x: 690, y: 354 }, { x: 641, y: 382 }, 26, '#6384cb');
  ball(c, 641, 382, 15, 15, '#8fabe0');
  tube(c, { x: 641, y: 382 }, { x: 625, y: 426 }, 21, '#6384cb');
  ball(c, 625, 426, 11, 11, '#bfcae0');
  ball(c, 620, 438, 24, 9, '#657ab8');
  tube(c, { x: 701, y: 354 }, { x: 659, y: 386 }, 21, '#4365a3');
  tube(c, { x: 659, y: 386 }, { x: 649, y: 430 }, 18, '#4365a3');
  ball(c, 649, 438, 20, 9, '#4365a3');
  const torso = new Path2D(
    'M670 260 Q690 253 705 272 L711 344 Q712 364 690 366 Q666 363 661 345 L657 280 Q657 266 670 260Z',
  );
  c.fillStyle = gradient(c, 658, 0, 713, 0, [
    '#672e65',
    '#c05091',
    '#ec9bb3',
    '#995488',
    '#403553',
  ]);
  c.fill(torso);
  ball(c, 686, 349, 26, 14, '#a45691');
  path(c, 'M662 339 Q685 347 709 339 M662 344 Q685 353 709 344', undefined, '#d994b1', 0.7);
  tube(c, { x: 700, y: 279 }, { x: 715, y: 319 }, 15, '#dfc276');
  ball(c, 715, 319, 10, 10, '#e2d29b');
  tube(c, { x: 715, y: 319 }, { x: 680, y: 350 }, 13, '#dfc276');
  ball(c, 680, 350, 9, 8, '#e2d29b');
  const hand = { x: cup.x + 20, y: cup.y - 12 },
    joint = solve(670, 278, hand.x, hand.y);
  tube(c, { x: 670, y: 278 }, joint, 17, '#dfc276');
  tube(c, joint, hand, 14, '#dfc276');
  ball(c, 670, 278, 13, 13, '#edcf84');
  ball(c, joint.x, joint.y, 10, 10, '#edcf84');
  ball(c, hand.x, hand.y, 8, 8, '#edcf84');
  for (let i = 0; i < 3; i++) ball(c, hand.x + 4, hand.y - 3 + i * 4, 5, 2.1, '#e7d7a3');
  tube(c, { x: 676, y: 244 }, { x: 677, y: 262 }, 16, '#b3bbc8');
  ball(c, 677, 252, 11, 6, '#a1b2d3');
  c.save();
  c.translate(675, 214);
  c.rotate(Math.sin(time) * 0.015);
  c.translate(-675, -214);
  ball(c, 675, 212, 35, 38, '#7e92ca');
  ball(c, 702, 213, 17, 19, '#875aad');
  c.save();
  c.translate(702, 213);
  c.scale(0.5, 1);
  ellipse(c, 0, 0, 12, 12, 'transparent', '#bbc6e0', 3);
  c.restore();
  ball(c, 643, 219, 8, 6, '#7e92ca');
  const t = (time + 0.2) % 2.9,
    blink = t > 2.6 && t < 2.75 ? 0.1 : 1;
  for (const x of [649, 666]) {
    ball(c, x, 207, 6, 7 * blink, '#f4e8b5');
    ball(c, x - 1.8, 207, 2.1, 3.2 * blink, '#26364f');
    path(c, `M${x - 4} 198 q5-3 8 0`, undefined, '#394366', 1.1);
  }
  path(c, 'M645 233 Q653 238 661 232', undefined, '#2e3754', 1.3);
  c.restore();
  c.restore();
}

export function drawRetroCat(c: Ctx, time: number) {
  c.save();
  c.translate(317, 438 + Math.sin(time * 2.5) * 0.4);
  c.save();
  c.filter = 'blur(3px)';
  ellipse(c, 3, 3, 47, 5, '#23374d60');
  c.restore();
  const tail = Math.sin(time * 2.7) * 5;
  const tailGradient = gradient(c, 0, -20, 0, 0, ['#eac675', '#fff1b8', '#855e32']);
  c.strokeStyle = tailGradient;
  c.lineWidth = 10;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(23, -15);
  c.bezierCurveTo(74, 5, 83, -38 + tail, 61, -34 + tail);
  c.bezierCurveTo(46, -33 + tail, 50, -18 + tail, 59, -24 + tail);
  c.stroke();
  ball(c, 0, -41, 34, 43, '#e5b650');
  ball(c, -19, -8, 15, 9, '#e5b650');
  ball(c, 23, -8, 15, 9, '#e5b650');
  c.save();
  c.rotate(Math.sin(time * 1.3) * 0.025);
  const ears = path(c, 'M-27-99 L-31-126-12-111 9-112 28-125 27-97Z', '#e5b650');
  c.save();
  c.clip(ears);
  c.fillStyle = gradient(c, -30, -130, 30, -97, ['#f7dc94', '#c59136', '#766345']);
  c.fill(ears);
  c.restore();
  path(c, 'M-27-119 L-24-106-17-111Z', '#b87583');
  path(c, 'M17-111 L25-119 24-106Z', '#b87583');
  ball(c, 0, -96, 29, 27, '#e5b650');
  for (const x of [-13, 13]) {
    ball(c, x, -98, 6, 7, '#c0d5bc');
    ball(c, x, -98, 1.8, 5, '#384a5b');
  }
  ball(c, -7, -85, 9, 6, '#f4dfac');
  ball(c, 8, -85, 9, 6, '#f4dfac');
  ball(c, 0, -90, 3.2, 2, '#a97581');
  path(c, 'M0-87 Q-4-81-8-85 M0-87 Q4-81 8-85', undefined, '#796146', 0.7);
  for (let i = 0; i < 3; i++) {
    line(c, -14, -84 + i * 3, -36, -88 + i * 6, '#f8e6b3', 0.45);
    line(c, 14, -84 + i * 3, 36, -88 + i * 6, '#f8e6b3', 0.45);
  }
  c.restore();
  c.restore();
}

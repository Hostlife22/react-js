import { sandstone, textureShape } from './materials';
import { ellipse, gradient, line, path, random, type Ctx } from './primitives';

let room: HTMLCanvasElement | undefined;
function landscape(c: Ctx) {
  const window = new Path2D('M210 269V139Q210 69 305 69Q400 69 400 139V269Z');
  c.save();
  c.clip(window);
  c.fillStyle = gradient(c, 0, 68, 0, 275, ['#9db5b5', '#d1d1b4', '#bac6ad', '#8c9b78']);
  c.fillRect(207, 68, 197, 209);
  const layers = [
    ['#9cafac', 143],
    ['#93a99f', 160],
    ['#8fa291', 174],
  ] as const;
  for (let i = 0; i < layers.length; i++) {
    const [color, y] = layers[i];
    c.filter = `blur(${2 - i * 0.6}px)`;
    path(
      c,
      `M204 ${y + 21} Q212 ${y + 11} 221 ${y - 11} Q229 ${y + 12} 240 ${y + 6} Q257 ${y - 6} 267 ${y + 4} Q279 ${y - 17} 289 ${y - 1} Q303 ${y + 9} 314 ${y} Q332 ${y - 18} 345 ${y + 3} Q359 ${y + 5} 365 ${y - 7} Q382 ${y - 17} 404 ${y + 11} V278H204Z`,
      color,
    );
  }
  c.filter = 'none';
  c.fillStyle = gradient(c, 0, 175, 0, 276, ['#9cac88', '#899674', '#73815d']);
  c.fillRect(207, 177, 197, 99);
  path(
    c,
    'M337 177Q373 181 336 191Q306 203 287 214Q239 223 268 232Q278 248 354 254Q376 263 394 274H372Q286 255 265 248Q219 232 242 222Q252 217 288 212Q309 203 331 194Q362 181 337 177Z',
    '#c5ccb0',
  );
  const rng = random(991);
  for (let i = 0; i < 69; i++) {
    const x = 210 + rng() * 194,
      y = 179 + rng() * 90,
      s = 0.45 + (y - 179) * 0.023 + rng() * 0.5;
    c.save();
    c.globalAlpha = 0.45 + rng() * 0.3;
    c.filter = y < 194 ? 'blur(.6px)' : 'none';
    if (i % 3)
      path(
        c,
        `M${x - s} ${y} Q${x - s * 1.7} ${y - s * 4} ${x} ${y - s * 8} Q${x + s * 1.6} ${y - s * 3} ${x + s} ${y}Z`,
        '#566d52',
      );
    else {
      ellipse(c, x, y - s * 2, s * 2, s * 2.6, '#6e825d');
      line(c, x, y - s * 3, x, y + 1, '#78825b', 0.6);
    }
    c.restore();
  }
  for (let i = 0; i < 11; i++) {
    const x = 259 + i * 4.1,
      y = 185 + Math.sin(i * 1.7) * 2;
    path(c, `M${x} ${y} h3v4h-3Z`, '#9da48c');
    path(c, `M${x - 1} ${y} l2.5-2 2.5 2Z`, '#6f806d');
  }
  const haze = c.createLinearGradient(0, 140, 0, 264);
  haze.addColorStop(0, '#dfdbbd40');
  haze.addColorStop(0.4, '#d9d9bd27');
  haze.addColorStop(1, '#d4d1af00');
  c.fillStyle = haze;
  c.fillRect(208, 131, 197, 139);
  c.restore();
}

function timber(c: Ctx, x1: number, y1: number, x2: number, y2: number, w: number) {
  const g = gradient(c, x1 - w / 2, 0, x1 + w / 2, 0, ['#35281c', '#a78045', '#72502c', '#33261b']);
  c.strokeStyle = g;
  c.lineWidth = w;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
  line(c, x1 - 1, y1, x2 - 1, y2, '#c4995730', 0.6);
}

export function paintedRoom(c: Ctx) {
  if (!room) {
    room = document.createElement('canvas');
    room.width = 1920;
    room.height = 1080;
    const r = room.getContext('2d', { willReadFrequently: true })!;
    r.scale(2, 2);
    r.fillStyle = gradient(r, 0, 0, 960, 480, ['#30251b', '#372b1f', '#27211a']);
    r.fillRect(0, 0, 960, 540);
    r.save();
    r.globalCompositeOperation = 'soft-light';
    r.globalAlpha = 0.23;
    r.drawImage(sandstone(), 0, 0, 960, 540);
    r.restore();
    textureShape(r, new Path2D('M0 0H960V540H0Z'), 'paper', 0.6);
    const glow = r.createRadialGradient(320, 261, 10, 320, 261, 420);
    glow.addColorStop(0, '#ceb57817');
    glow.addColorStop(1, '#efce8b00');
    r.fillStyle = glow;
    r.fillRect(0, 0, 960, 540);
    // Floor squares converge on the same vanishing point as the reference.
    for (let row = 0; row < 6; row++) {
      const y0 = 385 + Math.pow(row / 6, 1.18) * 155,
        y1 = 385 + Math.pow((row + 1) / 6, 1.18) * 155;
      const a = 47 + row * 8,
        b = 47 + (row + 1) * 8;
      for (let col = -30; col < 30; col++) {
        const shape = path(
          r,
          `M${480 + col * a} ${y0} H${480 + (col + 1) * a} L${480 + (col + 1) * b} ${y1} H${480 + col * b}Z`,
          (row + col) % 2 ? '#4a3021' : '#a59162',
        );
        textureShape(r, shape, 'paper', 0.4);
      }
    }
    const floorLight = r.createRadialGradient(480, 421, 35, 480, 421, 440);
    floorLight.addColorStop(0, '#f2d99a25');
    floorLight.addColorStop(1, '#00000040');
    r.fillStyle = floorLight;
    r.fillRect(0, 385, 960, 155);
    line(r, 0, 384, 960, 384, '#817154', 1);
    line(r, 0, 389, 960, 389, '#241e17', 3);
    const frame = new Path2D(
      'M203 279V141Q203 58 305 58Q407 58 407 141V279H396V142Q396 72 305 72Q215 72 215 142V279Z',
    );
    r.fillStyle = gradient(r, 203, 0, 409, 0, ['#746345', '#aa9671', '#736342']);
    r.fill(frame);
    landscape(r);
    path(r, 'M207 274V139Q207 65 305 65Q403 65 403 139V274', undefined, '#c9b99288', 1.2);
    path(r, 'M201 272V137Q201 57 305 57Q409 57 409 137V274', undefined, '#241f1840', 8);
    r.fillStyle = gradient(r, 0, 274, 0, 288, ['#cfc09b', '#86764f']);
    r.fillRect(198, 273, 213, 13);
    line(r, 198, 274, 411, 274, '#e6d2a8', 1.3);
    r.save();
    r.filter = 'blur(4px)';
    ellipse(r, 294, 453, 79, 9, '#1617146b');
    ellipse(r, 509, 451, 100, 9, '#16171470');
    ellipse(r, 663, 451, 78, 9, '#16171480');
    r.restore();
    timber(r, 423, 334, 418, 449, 9);
    timber(r, 590, 334, 596, 449, 9);
    timber(r, 420, 411, 594, 411, 7);
    timber(r, 644, 368, 636, 449, 7);
    timber(r, 730, 228, 730, 449, 9);
    timber(r, 646, 365, 730, 365, 8);
    const finial = r.createRadialGradient(728, 226, 0.5, 730, 230, 6);
    finial.addColorStop(0, '#cfab6c');
    finial.addColorStop(0.45, '#8b6036');
    finial.addColorStop(1, '#46331e');
    r.fillStyle = finial;
    r.beginPath();
    r.arc(730, 229, 6, 0, Math.PI * 2);
    r.fill();
    // The cloth has a lit top plane and a hanging, softly folded front plane.
    r.fillStyle = gradient(r, 0, 309, 0, 327, ['#e4d8ac', '#c8bb92']);
    r.fill(new Path2D('M412 311H595L601 328H407Z'));
    const cloth = new Path2D(
      'M407 326H601L602 378Q584 373 567 375Q530 369 496 375Q451 370 407 380Z',
    );
    r.fillStyle = gradient(r, 407, 0, 602, 0, ['#c6b78c', '#dfd1a9', '#bca97d', '#d2c49b']);
    r.fill(cloth);
    r.save();
    r.clip(cloth);
    for (let i = 0; i < 15; i++) {
      const x = 410 + i * 13;
      r.filter = 'blur(1.5px)';
      path(
        r,
        `M${x} 326Q${x - 2} 351 ${x - 1} 379`,
        undefined,
        i % 2 ? '#f3e5bb45' : '#78694940',
        3,
      );
      r.filter = 'none';
    }
    for (const y of [359, 362]) line(r, 405, y, 605, y, '#777569', 0.7);
    r.restore();
    textureShape(r, cloth, 'cloth', 0.6);
    textureShape(r, new Path2D('M0 0H960V540H0Z'), 'craquelure', 0.35);
  }
  c.drawImage(room, 0, 0, 960, 540);
}

export function renaissanceFlight(c: Ctx, time: number) {
  const t = Math.max(0, Math.min(1, (time - 5.3) / 0.9)),
    x = 430 - t * 101,
    y = 129 + Math.sin(t * 3) * 7;
  c.save();
  c.beginPath();
  c.rect(211, 75, 188, 194);
  c.clip();
  c.translate(x, y);
  const wing = 6 + Math.sin(time * 7) * 3;
  path(
    c,
    `M-3 0Q-21-18-9 ${-57 - wing}Q3 ${-41 - wing} 17 ${-29 - wing}L7-26 18-12Z`,
    '#b8a779',
    '#716044',
    1.1,
  );
  path(c, `M-9 ${-57 - wing}L-3 0 M-13-39L14-29 M-14-25L10-17`, undefined, '#786d4d', 0.7);
  path(c, 'M3 1L25 5 32-9 32 10Z', '#b8a779', '#726345', 0.8);
  ellipse(c, 0, 0, 12, 2.5, '#9c4c34');
  ellipse(c, -9, -2, 2.5, 2, '#403626');
  c.restore();
}

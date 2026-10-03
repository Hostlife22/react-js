import { EVENTS, clamp, lerp, progress } from '../timeline';
import { ellipse, line, path, random, rect, text, type Ctx } from './primitives';

const C = {
  paper: '#f6efd9',
  navy: '#27265c',
  purple: '#b5a0e3',
  purpleDark: '#9b81c9',
  coral: '#ed7771',
  coralDark: '#d95557',
  yellow: '#efbb42',
  yellowDark: '#ce942e',
  green: '#377a60',
  mint: '#9abfa0',
  cream: '#fff9e8',
};
let paper: HTMLCanvasElement | undefined;
let room: HTMLCanvasElement | undefined;

function texture() {
  if (paper) return paper;
  paper = document.createElement('canvas');
  paper.width = 960;
  paper.height = 540;
  const c = paper.getContext('2d', { willReadFrequently: true })!,
    rng = random(4301);
  for (let i = 0; i < 46000; i++) {
    c.fillStyle = i % 4 ? '#4c3544' : '#fff8df';
    c.globalAlpha = 0.06 + rng() * 0.23;
    const size = 0.25 + rng() * 0.75;
    c.fillRect(rng() * 960, rng() * 540, size, size);
  }
  return paper;
}

function shape(c: Ctx, d: string, color: string, density = 0.46) {
  const p = path(c, d, color);
  c.save();
  c.globalAlpha = density;
  c.fillStyle = c.createPattern(texture(), 'repeat')!;
  c.fill(p);
  c.restore();
  return p;
}

function leaf(c: Ctx, x: number, y: number, size: number, angle: number) {
  c.save();
  c.translate(x, y);
  c.rotate(angle);
  c.scale(size, size);
  shape(c, 'M0 43 C-55 24-54-20-22-42 Q-8-51 0-49 Q8-51 22-42 C54-20 55 24 0 43Z', C.green, 0.7);
  line(c, 0, 39, 0, -44, '#d2dfbd', 1.05);
  for (let i = 0; i < 5; i++)
    for (const side of [-1, 1]) {
      const yy = -33 + i * 13,
        edge = i === 0 ? 31 : i === 4 ? 34 : 46;
      path(
        c,
        `M${side * edge} ${yy} Q${side * 21} ${yy + 2} ${side * 7} ${yy + 9} Q${side * 24} ${yy + 7} ${side * (edge + 3)} ${yy + 7}Z`,
        C.paper,
      );
    }
  c.restore();
}

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

function blink(time: number, offset = 0) {
  const t = (time + offset) % 3.1;
  return t > 2.81 && t < 2.96 ? Math.max(0.05, Math.abs((t - 2.885) / 0.075)) : 1;
}

function hand(c: Ctx, x: number, y: number, open: number) {
  c.save();
  c.translate(x, y);
  c.rotate(-0.1 - open * 0.4);
  if (open > 0.2) {
    shape(
      c,
      'M-4 10 Q-13 4-13-2 L-23-10 Q-27-18-20-17 L-10-11 L-15-23 Q-17-30-11-29 L-4-16 L-5-31 Q-5-37 1-34 L4-19 L7-31 Q9-37 13-31 L12-16 Q21-24 23-18 L16-6 Q18 6 7 11Z',
      C.purple,
      0.6,
    );
  } else {
    shape(
      c,
      'M-13-2 Q-13-8-6-10 L8-10 Q16-8 16-3 Q14 2 7 1 L-3 0 Q-1 5 8 5 Q13 9 6 12 L-4 12 Q-15 10-13-2Z',
      C.purple,
      0.5,
    );
    path(c, 'M-3-5 H10 M-4-1 H10', undefined, C.purpleDark, 0.7);
  }
  c.restore();
}

export function drawModernHuman(c: Ctx, time: number) {
  const notice = progress(time, EVENTS.land - 0.1, EVENTS.land + 0.26);
  const shock = progress(time, EVENTS.swat - 0.035, EVENTS.swat + 0.18);
  const settle = progress(time, 14.0, 14.65),
    reaction = notice * 0.35 + shock * 0.65;
  c.save();
  c.translate(0, Math.sin(time * 2.4) * 0.65);
  // Both legs have visible calf, sock, shoe and sole; the thigh bends naturally.
  shape(
    c,
    'M674 350Q723 346 723 370Q724 392 646 391L620 427Q613 441 597 435Q583 430 589 413L615 373Q625 353 647 351Z',
    C.navy,
    0.65,
  );
  shape(c, 'M637 376Q614 383 606 412Q606 440 590 440Q574 439 580 418L597 374Z', '#34306d', 0.7);
  rect(c, 590, 423, 14, 18, C.purple, 3);
  rect(c, 610, 423, 15, 18, '#c9b2e7', 3);
  shape(c, 'M608 438Q615 432 625 437L633 449H591Q585 443 594 442Z', C.coral, 0.5);
  shape(c, 'M591 437Q599 434 607 443L609 449H566Q563 441 575 440Z', C.cream, 0.5);
  rect(c, 566, 448, 44, 4, C.coral, 2);
  rect(c, 593, 448, 41, 4, C.coralDark, 2);
  line(c, 574, 440, 584, 440, '#ded1b5', 1);
  // Upper body leans away after the cat lands. Rotation has a hip pivot.
  c.translate(689, 371);
  c.rotate(-reaction * 0.035);
  c.translate(-689, -371);
  shape(
    c,
    'M675 214 Q701 207 716 235 Q734 275 731 375 Q698 384 654 344 L654 243 Q655 221 675 214Z',
    C.coral,
    0.82,
  );
  shape(c, 'M711 235 Q731 278 730 375 L716 379 Q719 312 705 246Z', C.coralDark, 0.8);
  path(c, 'M665 365 Q690 375 716 369 M704 286 Q711 294 713 313', undefined, '#d66363', 1.2);
  // Back sleeve and a second hand move independently of the front arm.
  const backX = lerp(685, 648, shock),
    backY = lerp(350, 264, shock);
  line(c, 712, 244, 716, 301, '#f58c86', 33);
  line(c, 716, 301, backX, backY, '#f58c86', 27);
  hand(c, backX, backY, shock);
  // Neck, head, ears, face and hair remain separate parts.
  shape(c, 'M664 195 L685 198 L686 220 Q674 232 661 219Z', C.purple, 0.65);
  shape(c, 'M661 205 Q672 215 685 210 L685 220 Q673 224 666 219Z', C.purpleDark, 0.5);
  path(c, 'M658 218 Q670 230 688 218', undefined, C.coralDark, 6);
  c.save();
  c.translate(0, -40);
  c.translate(674, 235);
  c.rotate(-reaction * 0.07);
  c.translate(-674, -235);
  shape(
    c,
    'M645 181 Q663 160 690 177 Q708 193 696 223 Q686 249 659 246 Q645 244 640 228 L636 218 L627 213 Q624 209 632 203 L641 191Z',
    C.purple,
    0.62,
  );
  shape(
    c,
    'M675 170 Q711 174 710 209 Q707 233 686 245 L683 214 690 201 Q675 197 664 185Z',
    C.navy,
    0.75,
  );
  shape(c, 'M643 182 Q641 159 664 151 Q690 145 706 169 L705 189 Q677 175 643 182Z', C.navy, 0.7);
  ellipse(c, 707, 171, 20, 20, C.navy);
  ellipse(c, 707, 175, 13, 15, '#302d69');
  ellipse(c, 650, 222, 8.5, 8, '#d897b4');
  const eye = blink(time);
  ellipse(c, 649, 200, 5.1, eye * (4.8 + reaction * 1.8), C.navy);
  ellipse(c, 650.5, 198.4, 1.65, eye * 1.65, C.cream);
  path(
    c,
    `M643 ${190 - reaction * 3} Q650 ${188 - reaction * 4} 654 ${190 - reaction * 3}`,
    undefined,
    C.navy,
    1.7,
  );
  if (reaction > 0.25) {
    ellipse(c, 646, 233, 3.5 + reaction * 1.6, 3 + reaction * 4, C.navy);
    ellipse(c, 647, 235, 2.2, 2, C.coralDark);
  } else path(c, 'M642 233 Q647 237 653 233', undefined, '#674889', 1.5);
  path(c, 'M653 164 Q686 143 698 181', undefined, C.cream, 5.5);
  rect(c, 690, 176, 18, 39, '#d79720', 8);
  rect(c, 686, 179, 15, 34, C.yellow, 7);
  rect(c, 689, 184, 7, 22, '#f3cd66', 4);
  c.restore();
  // The forearm follows a two-bone rig instead of a narrow triangular wedge.
  const catchCat = progress(time, EVENTS.land - 0.15, EVENTS.land + 0.06),
    sitCat = progress(time, EVENTS.land + 0.11, EVENTS.land + 0.36);
  const hx = lerp(lerp(527, 564, catchCat), 618, sitCat) - shock * 4 - settle * 3,
    hy = lerp(lerp(313, 304, catchCat), 274, sitCat) - shock * 4 + settle * 7;
  const ex = lerp(648, 690, notice),
    ey = lerp(307, 299, notice);
  line(c, 689, 240, ex, ey, C.coralDark, 31);
  line(c, ex, ey, hx + 12, hy, C.coral, 26);
  ellipse(c, ex, ey, 14, 14, C.coral);
  line(c, lerp(ex, hx + 12, 0.9), lerp(ey, hy, 0.9), hx + 9, hy, '#f29187', 28);
  hand(c, hx, hy, shock);
  if ((shock > 0.2 && shock < 1) || (notice > 0.1 && notice < 0.98)) {
    c.globalAlpha = Math.sin((reaction - 0.1) * Math.PI) * 0.8;
    for (let i = 0; i < 3; i++) line(c, 638 + i * 13, 151, 633 + i * 16, 142, C.coralDark, 2);
    c.globalAlpha = 1;
  }
  c.restore();
}

export function modernCatPose(time: number) {
  const phase = clamp((time - EVENTS.jump) / (EVENTS.land - EVENTS.jump)),
    flight = time >= EVENTS.jump && time < EVENTS.land;
  const anticipation = progress(time, EVENTS.jump - 0.2, EVENTS.jump);
  const landing =
    time >= EVENTS.land
      ? Math.exp(-(time - EVENTS.land) * 12) * Math.sin((time - EVENTS.land) * 26)
      : 0;
  const paw =
    progress(time, EVENTS.reach, EVENTS.swat) -
    progress(time, EVENTS.swat + 0.15, EVENTS.swat + 0.5);
  const scale = flight
    ? lerp(0.78, 1, progress(time, EVENTS.jump, EVENTS.jump + 0.11))
    : time < EVENTS.jump
      ? 1 - anticipation * 0.22
      : 1 - landing * 0.1;
  const stretch =
    progress(time, EVENTS.jump, EVENTS.jump + 0.065) *
    (1 - progress(time, EVENTS.land, EVENTS.land + 0.36));
  return {
    x: lerp(280, 578, phase),
    y: lerp(450, 320, phase) - (flight ? Math.sin(Math.PI * phase) * 38 : 0),
    rotation: flight ? -0.2 * Math.sin(Math.PI * phase) : 0,
    scale,
    paw,
    flight: flight ? Math.sin(Math.PI * phase) : 0,
    stretch,
    phase,
  };
}

function catFace(c: Ctx, time: number, flight: number, look: number) {
  c.save();
  c.translate(look * 4, 0);
  // Slightly asymmetric cheeks and ear hinges make the expression less toy-like.
  shape(
    c,
    'M-36-113 L-35-145 Q-23-142-15-129 Q1-134 17-128 L31-144 Q35-130 31-111 Q37-92 22-81 Q0-69-22-80 Q-39-91-36-113Z',
    C.yellow,
    0.68,
  );
  shape(c, 'M-31-119 L-30-137-21-128Z', '#eaa29c', 0.4);
  shape(c, 'M20-127 L29-136 28-118Z', '#eaa29c', 0.4);
  shape(
    c,
    'M-32-104 Q-25-90-17-92 Q-8-81 0-88 Q12-81 19-92 Q29-92 32-104 Q35-86 20-79 Q-1-69-22-81 Q-35-87-32-104Z',
    '#f4c557',
    0.6,
  );
  for (let i = 0; i < 3; i++) line(c, -13 + i * 10, -129, -12 + i * 10, -119, C.yellowDark, 2.3);
  const b = blink(time, 0.62),
    wide = 1 + flight * 0.45;
  ellipse(c, -17, -105, 4.8, 3.8 * b * wide, C.navy);
  ellipse(c, 12, -105, 4.8, 3.8 * b * wide, C.navy);
  ellipse(c, -15.7, -106.3, 1.1, b * 1.1, C.cream);
  ellipse(c, 13.2, -106.3, 1.1, b * 1.1, C.cream);
  ellipse(c, -23, -94, 7, 6, '#eaa09a');
  ellipse(c, 22, -94, 7, 6, '#eaa09a');
  path(c, 'M-7-96 Q-3-100 1-96 L-3-92Z', '#a76467');
  path(c, 'M-3-92 Q-8-84-14-91 M-3-92 Q3-84 8-91', undefined, C.navy, 1.3);
  for (let i = 0; i < 3; i++) {
    line(c, -23, -93 + i * 4, -43, -96 + i * 7, C.cream, 0.9);
    line(c, 22, -93 + i * 4, 43, -96 + i * 7, C.cream, 0.9);
  }
  c.restore();
}

export function drawModernCat(c: Ctx, time: number) {
  const p = modernCatPose(time),
    f = p.stretch,
    landed = p.phase;
  const shadowY = time < EVENTS.land ? 450 : 321;
  c.save();
  c.globalAlpha = 0.15 * (1 - p.flight * 0.5);
  ellipse(c, p.x, shadowY + 1, 44 + p.flight * 14, 4.5 * (1 - p.flight * 0.5), '#847252');
  c.restore();
  c.save();
  c.translate(p.x, p.y);
  c.rotate(p.rotation);
  c.scale(1 + (1 - p.scale) * 0.23, p.scale);
  // Three sets of Bézier control points define a continuous change of anatomy.
  // The landed cat has a side-facing chest and a broad haunch, matching the film.
  const seated = [
    -11, -87, -43, -85, -57, -52, -52, -20, -49, -3, -15, -3, 37, -3, 42, -14, 26, -48, 19, -87, 10,
    -99, -3, -97, -11, -87,
  ];
  const landing = [
    -51, -90, -5, -89, 32, -70, 49, -42, 61, -13, 55, -3, 17, -3, -35, -3, -65, -3, -61, -34, -61,
    -69, -61, -88, -51, -90,
  ];
  const flying = [
    -70, -58, -89, -46, -76, -26, -49, -27, 1, -29, 40, -48, 51, -58, 44, -79, 9, -81, -35, -75,
    -58, -70, -64, -64, -70, -58,
  ];
  const v = seated.map((n, i) => lerp(lerp(n, landing[i], landed), flying[i], f));
  const tail = Math.sin(time * 2.6) * 5;
  path(
    c,
    `M${lerp(lerp(-38, 37, landed), -64, f)} ${lerp(-14, -46, f)}C${lerp(lerp(-86, 84, landed), -107, f)} ${lerp(-3, -66, f)} ${lerp(lerp(-85, 89, landed), -143, f)} ${lerp(-38 + tail, -99, f)} ${lerp(lerp(-65, 68, landed), -134, f)} ${lerp(-35 + tail, -96, f)}Q${lerp(lerp(-55, 59, landed), -129, f)} ${lerp(-27 + tail, -88, f)} ${lerp(lerp(-65, 67, landed), -126, f)} ${lerp(-22 + tail, -88, f)}`,
    undefined,
    C.yellow,
    10,
  );
  const d = `M${v[0]} ${v[1]} C${v[2]} ${v[3]} ${v[4]} ${v[5]} ${v[6]} ${v[7]} Q${v[8]} ${v[9]} ${v[10]} ${v[11]} L${v[12]} ${v[13]} C${v[14]} ${v[15]} ${v[16]} ${v[17]} ${v[18]} ${v[19]} C${v[20]} ${v[21]} ${v[22]} ${v[23]} ${v[24]} ${v[25]}Z`;
  shape(c, d, C.yellow, 0.94);
  const chestX = lerp(17, -48, landed) + f * 45;
  shape(
    c,
    `M${chestX - 10} ${-83 + f * 16} Q${chestX + 18} ${-69 + f * 15} ${chestX + 7} ${-42 - f * 4} Q${chestX + 4} ${-24 - f * 8} ${chestX - 11} ${-25 - f * 8} Q${chestX - 19} ${-38 - f * 10} ${chestX - 10} ${-83 + f * 16}Z`,
    C.cream,
    0.5,
  );
  for (let i = 0; i < 3; i++)
    path(
      c,
      `M${lerp(-31, 27, landed)} ${-65 + i * 12 - f * 6} q${12 + 3 * f} 3 ${15 + 3 * f} 9`,
      undefined,
      C.yellowDark,
      1.7,
    );
  const extension = progress(p.phase, 0.55, 1);
  for (const side of [1, 0]) {
    const rest = lerp(-20 + side * 13, 24 + side * 10, landed),
      x = lerp(rest, -57 + side * 9, f),
      y = -27 - f * 17;
    const footX = lerp(rest, -110 + side * 8 + extension * 8, f),
      footY = -4 - f * 48 + extension * f * 6;
    path(
      c,
      `M${x} ${y} Q${x - 13 * f} ${y + 12} ${footX} ${footY}`,
      undefined,
      side ? '#dba333' : C.yellow,
      16,
    );
    ellipse(c, footX + 1, footY, 11, 5.5, C.cream);
  }
  for (const side of [1, 0]) {
    const shoulderX = lerp(15 + side * 7, -48 + side * 12, landed) + f * 47;
    const shoulderY = -63 + f * 13;
    const restX = lerp(22 + side * 7, -51 + side * 13, landed);
    const pawX = lerp(restX, 56 + side * 10, f) - (!side ? p.paw * 44 : 0);
    const pawY = lerp(-5, -27 + extension * 28, f) - (!side ? p.paw * 20 : 0);
    path(
      c,
      `M${shoulderX} ${shoulderY} Q${shoulderX - 8 - p.paw * 10} ${-34 + f * 17} ${pawX} ${pawY}`,
      undefined,
      side ? '#e3a937' : C.yellow,
      side ? 12 : 15,
    );
    ellipse(c, pawX, pawY, side ? 9 : 11, 5.5, C.cream);
    for (let j = 0; j < 2; j++)
      line(c, pawX - 4 + j * 5, pawY + 1, pawX - 4 + j * 5, pawY + 4, '#d4bd86', 0.6);
  }
  const fold = progress(p.phase, 0.6, 1);
  const headX = lerp(23, -58, landed) + f * 76 + fold * f * 36,
    headY = -landed * 15 + f * 30 + fold * f * 33;
  c.save();
  c.translate(headX, headY + Math.sin(time * 2.7) * 0.4);
  c.scale(0.91, 0.94);
  c.rotate(f * 0.13);
  catFace(c, time, f, -landed * 0.08);
  c.restore();
  c.restore();
}

export function drawModernCup(c: Ctx, time: number) {
  const falling = time >= EVENTS.swat;
  if (time >= EVENTS.impact) {
    const p = progress(time, EVENTS.impact, EVENTS.impact + 0.27);
    ellipse(c, 365, 449, lerp(4, 53, p), lerp(1, 9, p), '#b58b47');
    ellipse(c, 365, 449, lerp(3, 36, p), lerp(1, 5.5, p), '#d5aa58');
    const rng = random(934);
    for (let i = 0; i < 9; i++) {
      const a = rng() * Math.PI * 2,
        r = (16 + rng() * 40) * p,
        x = 365 + Math.cos(a) * r,
        y = 445 + Math.sin(a) * 7 * p - Math.sin(p * Math.PI) * (5 + rng() * 11);
      shape(c, `M${x} ${y} l${-5 - (i % 3)} -9 12-3 5 11-4 5Z`, i % 3 ? C.coral : C.cream, 0.6);
    }
    c.save();
    c.translate(395, 446);
    c.rotate(0.6);
    ellipse(c, 0, 0, 5, 7, 'transparent', C.coral, 3);
    c.restore();
    return;
  }
  const q = falling ? clamp((time - EVENTS.swat) / (EVENTS.impact - EVENTS.swat)) : 0;
  const x = 491 - 126 * q,
    y = 320 - 30 * q + 155 * q * q;
  if (falling) {
    for (let i = 0; i < 5; i++) {
      const delay = i * 0.07,
        r = clamp((q - delay) / (1 - delay));
      if (r <= 0) continue;
      ellipse(c, 493 - 100 * r + i * 3, 298 - 35 * r + 155 * r * r - i * 5, 1.5, 2.3, '#c4954c');
    }
  }
  c.save();
  c.translate(x, y);
  c.rotate(-q * 5.4);
  ellipse(c, -16, -15, 7, 8, 'transparent', C.coral, 4.2);
  shape(c, 'M-12-28 H13 L12-5 Q1 2-10-5Z', C.coral, 0.65);
  ellipse(c, 0, -28, 12.6, 3, C.cream);
  ellipse(c, 0, -28, 9.3, 1.7, '#9f7640');
  path(c, 'M-3-28 V-13', undefined, C.cream, 0.8);
  rect(c, -7, -16, 7, 8, C.cream, 2);
  ellipse(c, -3.5, -12, 1.6, 1.6, '#6baa9a');
  c.restore();
  if (!falling)
    for (let i = 0; i < 3; i++) {
      const p = (time * 0.42 + i / 3) % 1;
      c.save();
      c.globalAlpha = Math.sin(p * Math.PI) * 0.7;
      path(c, `M${490 + i * 3} ${283 - p * 17} q-4-5 0-11 q4-5 0-11`, undefined, C.cream, 1.4);
      c.restore();
    }
}

export function drawModern(c: Ctx, time: number) {
  drawModernRoom(c, time);
  drawModernHuman(c, time);
  drawModernCat(c, time);
  drawModernCup(c, time);
  c.save();
  c.globalAlpha = progress(time, 14.1, 14.65);
  text(c, "Times change. Cats don't.", 912, 511, 18, C.navy, '"Outfit"', 'right');
  c.restore();
}

/** Independently drawn leaves, stems, clouds, light and lamp; no moving image plate. */
export function drawModernEnvironment(c: Ctx, time: number) {
  c.save();
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.save();
  c.translate(179, 60);
  c.scale(222 / 267, 218 / 244);
  c.translate(-172, -102);
  c.beginPath();
  c.rect(185, 116, 240, 136);
  c.clip();
  const drift = Math.sin(time * 0.4) * 5;
  path(
    c,
    `M${203 + drift} 155 Q${201 + drift} 143 ${212 + drift} 141 Q${215 + drift} 127 ${226 + drift} 134 Q${240 + drift} 130 ${242 + drift} 145 Q${253 + drift} 145 ${253 + drift} 154Z`,
    C.cream,
  );
  path(
    c,
    `M${230 + drift * 0.6} 204 Q${224 + drift * 0.6} 187 ${241 + drift * 0.6} 185 Q${247 + drift * 0.6} 165 ${263 + drift * 0.6} 174 Q${285 + drift * 0.6} 168 ${289 + drift * 0.6} 188 Q${304 + drift * 0.6} 187 ${307 + drift * 0.6} 203Z`,
    C.cream,
  );
  line(c, 304, 116, 304, 329, C.cream, 8);
  line(c, 185, 221, 425, 221, C.cream, 8);
  c.restore();
  // Monstera leaves have individual rotation, branching veins and negative cuts.
  ellipse(c, 849, 450, 63, 7, '#bdb3a144');
  c.save();
  c.translate(0, -43);
  const leaves = [
    [799, 271, 0.72, -0.65],
    [843, 205, 0.93, -0.12],
    [901, 275, 0.82, 0.5],
    [793, 347, 0.47, -0.72],
    [889, 354, 0.56, 0.55],
    [835, 294, 0.64, -0.25],
  ];
  for (const [i, [anchorX, y, s, a]] of leaves.entries()) {
    const sway = Math.sin(time * 1.5 + i * 0.8) * 2.4,
      swing = Math.sin(time * 1.5 + i * 0.8 + 0.4) * 0.035,
      x = anchorX + sway;
    path(c, `M849 427Q${849 + sway * 2} ${y + 90} ${x} ${y + 25 * s}`, undefined, C.green, 2.2);
    leaf(c, x, y, s, a + swing);
  }
  shape(c, 'M815 417 H881 L877 459 Q849 480 819 459Z', '#a98ce0', 0.72);
  rect(c, 811, 415, 74, 13, '#9470d0', 5);
  line(c, 824, 466, 817, 487, C.navy, 3);
  line(c, 872, 466, 879, 487, C.navy, 3);
  c.restore();
  ellipse(c, 94, 450, 51, 6, '#bdb3a144');
  for (let i = 0; i < 7; i++) {
    const x = 68 + i * 7,
      sway = Math.sin(time * 1.7 + i * 0.6) * 2.5;
    shape(
      c,
      `M${x} 405 Q${x - 11 + sway * 0.6} 343 ${x - 20 + i * 4 + sway} ${251 + (i % 3) * 15} Q${x + 12 + sway * 0.6} 341 ${x + 7} 405Z`,
      i % 2 ? C.green : '#79a56c',
      0.6,
    );
  }
  shape(c, 'M62 400 H125 L122 443 Q93 457 66 443Z', C.coral, 0.8);
  rect(c, 61, 400, 65, 10, C.coralDark, 3);
  rect(c, 63, 413, 61, 6, C.cream);
  // Lamp light remains behind the jumping cat.
  c.save();
  c.translate(498, 0);
  c.rotate(Math.sin(time * 1.2) * 0.009);
  c.translate(-516, -25);
  line(c, 516, 0, 516, 116, C.navy, 2);
  const light = path(c, 'M495 141 H537 L596 331 H437Z', '#ffe8a657');
  c.save();
  c.clip(light);
  c.globalAlpha = 0.25;
  c.drawImage(texture(), 0, 0, 960, 540);
  c.restore();
  ellipse(c, 516, 142, 10, 7, '#eac455');
  shape(c, 'M480 140 Q480 107 516 107 Q551 107 551 140Z', C.coral, 0.6);
  ellipse(c, 516, 106, 5, 5, C.navy);
  c.restore();
  c.restore();
}

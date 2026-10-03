import { pigment, textureShape } from './materials';
import { ellipse, gradient, line, path, random, type Ctx } from './primitives';
import { clamp } from '../timeline';

type Point = { x: number; y: number };
type Cup = Point & { sip: number };
export function paintedArmPose(cup: Cup) {
  const shoulder = { x: 704, y: 276 };
  const wrist = { x: (cup.x - 681) / 1.04 + 681 + 15, y: (cup.y - 333) / 1.1 + 356 + 7 };
  const dx = wrist.x - shoulder.x,
    dy = wrist.y - shoulder.y,
    d = clamp(Math.hypot(dx, dy), 0.01, 201.99);
  const a = (77 * 77 - 125 * 125 + d * d) / (2 * d),
    h = Math.sqrt(Math.max(0, 77 * 77 - a * a));
  const elbow = {
    x: shoulder.x + (dx / d) * a + (dy / d) * h,
    y: shoulder.y + (dy / d) * a - (dx / d) * h,
  };
  return { shoulder, elbow, wrist };
}

function oil(
  c: Ctx,
  d: string,
  colors: string[],
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  cloth = false,
) {
  const shape = new Path2D(d);
  c.fillStyle = gradient(c, x0, y0, x1, y1, colors);
  c.fill(shape);
  textureShape(c, shape, cloth ? 'cloth' : 'paper', 0.34);
  textureShape(c, shape, 'craquelure', 0.65);
  return shape;
}

function glaze(
  c: Ctx,
  shape: Path2D,
  d: string,
  color: string,
  width: number,
  blur = 3,
  opacity = 0.6,
) {
  c.save();
  c.clip(shape);
  c.filter = `blur(${blur}px)`;
  c.globalAlpha = opacity;
  path(c, d, undefined, color, width);
  c.restore();
}

function cylinder(c: Ctx, a: Point, b: Point, r: number, colors: string[]) {
  const dx = b.x - a.x,
    dy = b.y - a.y,
    n = Math.hypot(dx, dy),
    nx = ((-dy / n) * r) / 2,
    ny = ((dx / n) * r) / 2;
  c.lineWidth = r;
  c.lineCap = 'round';
  c.strokeStyle = gradient(c, a.x - nx, a.y - ny, a.x + nx, a.y + ny, colors);
  c.beginPath();
  c.moveTo(a.x, a.y);
  c.lineTo(b.x, b.y);
  c.stroke();
  c.save();
  c.globalAlpha = 0.6;
  c.strokeStyle = c.createPattern(pigment('craquelure'), 'repeat')!;
  c.stroke();
  c.restore();
}

function paintedHand(c: Ctx, x: number, y: number, angle: number) {
  c.save();
  c.translate(x, y);
  c.rotate(angle);
  oil(
    c,
    'M-7-6 Q-2-10 4-7 L11-4 Q15-1 11 2 L3 2 Q5 5 11 4 Q14 8 8 10 L-2 10 Q-11 6-7-6Z',
    ['#e7ce9f', '#c8aa7c', '#8f7353'],
    -5,
    -8,
    10,
    11,
  );
  for (let i = 0; i < 3; i++) path(c, `M1 ${i * 2.5 - 1} q5 1 10 1`, undefined, '#987956', 0.48);
  path(c, 'M-4-3 q4 1 6 4', undefined, '#f0d9aa', 0.9);
  c.restore();
}

export function drawPaintedFigure(c: Ctx, time: number, cup: Cup) {
  const breath = Math.sin(time * 2) * 0.65;
  c.save();
  c.translate(0, breath);
  c.save();
  c.translate(681, 450);
  c.scale(1.25, 1.4);
  c.translate(-681, -441);
  ellipse(c, 667, 443, 65, 6, '#1d181875');
  const skirt = oil(
    c,
    'M650 352 Q680 367 710 352 Q724 369 698 384 Q668 392 660 412 L681 442 Q643 446 595 440 Q618 414 616 387 Q616 361 650 352Z',
    ['#481c1c', '#a0282c', '#c34e40', '#551e21'],
    593,
    388,
    715,
    404,
    true,
  );
  glaze(c, skirt, 'M705 364 Q670 367 649 387 Q625 411 621 443', '#431b23', 18, 5, 0.85);
  glaze(c, skirt, 'M690 375 Q667 382 646 408 L632 443', '#e27358', 12, 5, 0.55);
  for (let i = 0; i < 5; i++) {
    const x = 641 + i * 12;
    glaze(c, skirt, `M${x + 14} 383 Q${x - 7} 411 ${x - 4} 443`, '#4b2024', 4 + i * 0.4, 2.3, 0.7);
    glaze(c, skirt, `M${x + 11} 384 Q${x - 9} 411 ${x - 7} 443`, '#d35546', 2.7, 2, 0.6);
  }
  oil(
    c,
    'M611 433 Q624 432 632 441 L632 445 H597 Q597 438 611 433Z',
    ['#241b17', '#4c3224', '#181611'],
    600,
    435,
    630,
    445,
  );
  c.restore();
  c.translate(681, 333);
  c.scale(1.04, 1.1);
  c.translate(-681, -356);
  // The shoulder, waist and bent arm each receive light from the window.
  const torso = oil(
    c,
    'M669 254 Q691 249 705 265 Q717 287 716 356 Q685 365 650 355 L651 288 Q651 263 669 254Z',
    ['#162e29', '#416c52', '#2c5945', '#162c28'],
    649,
    270,
    718,
    315,
    true,
  );
  glaze(c, torso, 'M657 274 Q662 306 657 353', '#85a078', 12, 4, 0.52);
  glaze(c, torso, 'M704 270 Q701 303 711 354', '#092820', 11, 4, 0.9);
  for (let i = 0; i < 5; i++) {
    const x = 665 + i * 8;
    glaze(c, torso, `M${x} 273 Q${x - 3} 311 ${x + 1} 356`, '#122f29', 4.5, 1.8, 0.65);
    glaze(c, torso, `M${x - 2} 272 Q${x - 5} 311 ${x - 1} 355`, '#92a879', 2.3, 1.4, 0.45);
  }
  oil(
    c,
    'M662 237 L684 236 684 261 Q674 269 659 257Z',
    ['#e7cda0', '#c8a67a', '#856c4f'],
    660,
    242,
    685,
    258,
  );
  // Hair is painted behind the face with narrow, curved strand highlights.
  oil(
    c,
    'M640 185 Q641 170 662 165 Q689 161 702 185 Q713 206 697 239 L683 245 675 218 686 192 Q666 178 640 185Z',
    ['#211b16', '#674128', '#39291e', '#171715'],
    643,
    177,
    704,
    227,
  );
  const bun = c.createRadialGradient(708, 208, 2, 710, 213, 17);
  bun.addColorStop(0, '#8a5b35');
  bun.addColorStop(0.5, '#5d3d25');
  bun.addColorStop(1, '#241d16');
  c.fillStyle = bun;
  c.beginPath();
  c.ellipse(710, 213, 15, 18, -0.15, 0, Math.PI * 2);
  c.fill();
  for (let i = 0; i < 24; i++)
    path(
      c,
      `M${644 + i * 1.6} ${178 - i * 0.19} Q${682 + i * 0.5} ${163 + i * 0.25} ${692 + i * 0.37} ${199 + i * 0.55} Q${704 + i * 0.15} 226 685 242`,
      undefined,
      i % 3 ? '#92684080' : '#38271da0',
      0.55,
    );
  for (let i = 0; i < 15; i++)
    path(
      c,
      `M${703 + i * 0.9} 201 q8 9 ${-3 + i * 0.2} 24`,
      undefined,
      i % 2 ? '#a5754070' : '#39261780',
      0.5,
    );
  c.save();
  c.translate(674, 236);
  c.rotate(-cup.sip * 0.018 + Math.sin(time * 0.83) * 0.007);
  c.translate(-674, -236);
  const face = oil(
    c,
    'M653 178 Q664 171 678 177 Q692 184 692 199 L689 223 Q686 237 675 242 Q664 243 654 235 L649 229 641 228 641 224 645 221 633 217 Q630 215 636 210 L642 202 Q641 188 653 178Z',
    ['#ecddb6', '#dcc298', '#c9a67d', '#9b7b58'],
    637,
    190,
    691,
    222,
  );
  glaze(c, face, 'M679 178 Q687 199 680 223 Q678 237 670 239', '#97734e', 11, 4, 0.65);
  glaze(c, face, 'M654 180 Q644 194 644 207', '#fff1c6', 7, 3, 0.6);
  glaze(c, face, 'M650 218 q5 4 10 1', '#c69172', 6, 3, 0.48);
  glaze(c, face, 'M656 232 Q665 240 676 235', '#e8c59b', 5, 2, 0.55);
  const ear = oil(
    c,
    'M681 202 Q688 201 687 210 Q686 218 681 220 Q678 214 681 202Z',
    ['#e4c796', '#b58f68'],
    679,
    204,
    687,
    213,
  );
  glaze(c, ear, 'M684 205 q-4 4 0 9', '#96714f', 1.2, 0.3, 0.6);
  const phase = (time + 0.2) % 2.9,
    blink = phase > 2.6 && phase < 2.75 ? Math.max(0.035, Math.abs((phase - 2.675) / 0.075)) : 1;
  c.save();
  c.translate(647, 202);
  c.scale(1, blink);
  path(c, 'M-6 1 Q-2-2 3 0 Q0 3-6 1Z', '#ded4b7');
  ellipse(c, -1, 0, 1.7, 2.2, '#746b4b');
  ellipse(c, -1.5, 0, 0.8, 1.5, '#292820');
  ellipse(c, -2, -1, 0.45, 0.5, '#f7ebcc');
  path(c, 'M-6 1 Q-2-2 3 0', undefined, '#6d5a40', 0.7);
  c.restore();
  path(c, 'M642 197 Q647 194 652 197', undefined, '#765b3d', 0.7);
  path(c, 'M638 218 Q641 219 643 217', undefined, '#ad8964', 0.5);
  path(c, 'M641 227 Q646 226 649 228 Q645 230 641 229Z', '#af7562');
  path(c, 'M642 231 Q646 233 650 231', undefined, '#e4bb8f', 0.65);
  c.restore();
  path(c, 'M658 258 Q674 269 691 257', undefined, '#a28a53', 2.0);
  for (let i = 0; i < 12; i++) {
    const x = 659 + i * 2.65,
      y = 258 + Math.sin((i * Math.PI) / 12) * 6;
    const pearl = c.createRadialGradient(x - 0.5, y - 0.6, 0.15, x, y, 1.5);
    pearl.addColorStop(0, '#fff0c3');
    pearl.addColorStop(0.6, '#d3b67e');
    pearl.addColorStop(1, '#716044');
    c.fillStyle = pearl;
    c.beginPath();
    c.arc(x, y, 1.5, 0, Math.PI * 2);
    c.fill();
  }
  const sleeve = ['#143f2b', '#42784b', '#214e34'];
  const { shoulder, elbow, wrist } = paintedArmPose(cup);
  // The long painted forearm folds beneath the shoulder when the goblet rises.
  cylinder(c, shoulder, elbow, 27, sleeve);
  cylinder(c, elbow, wrist, 23, sleeve);
  const dx = wrist.x - elbow.x,
    dy = wrist.y - elbow.y,
    angle = Math.atan2(dy, dx);
  c.save();
  c.translate(wrist.x - 3, wrist.y + 1);
  c.rotate(angle);
  path(c, 'M-2-11 V11', undefined, '#b29b62', 2.5);
  path(c, 'M-5-10 V10', undefined, '#d1c08f', 0.6);
  c.restore();
  paintedHand(c, wrist.x, wrist.y, -0.15 - cup.sip * 0.23);
  c.restore();
}

function fur(c: Ctx, shape: Path2D, seed: number, origin: Point) {
  c.save();
  c.clip(shape);
  const rng = random(seed);
  for (let i = 0; i < 2400; i++) {
    const x = -45 + rng() * 105,
      y = -137 + rng() * 138,
      a = Math.atan2(y - origin.y, x - origin.x),
      len = 0.7 + rng() * 2;
    line(
      c,
      x,
      y,
      x + Math.cos(a) * len * 0.7,
      y + Math.sin(a) * len,
      i % 3 ? '#f4e9c640' : '#7c73532e',
      0.22 + rng() * 0.15,
    );
  }
  c.restore();
}

export function drawPaintedCat(c: Ctx, time: number) {
  c.save();
  c.translate(285, 450 + Math.sin(time * 2.2) * 0.35);
  c.scale(1.05, 1.16);
  c.save();
  c.filter = 'blur(3px)';
  ellipse(c, 3, 3, 45, 6, '#211b1880');
  c.restore();
  const tail = Math.sin(time * 2.7) * 5;
  const tailShape = oil(
    c,
    `M-21-8 C-55 1-77 ${-17 + tail}-73 ${-29 + tail} Q-69 ${-33 + tail}-65 ${-23 + tail} C-69 ${-14 + tail}-55-1-29-2Z`,
    ['#a29d80', '#eee4be', '#8e8a6b'],
    -71,
    -29,
    -35,
    0,
  );
  fur(c, tailShape, 172, { x: -45, y: -15 });
  oil(
    c,
    `M-73 ${-29 + tail} Q-79 ${-21 + tail}-68 ${-15 + tail} L-65 ${-23 + tail}Z`,
    ['#302c24', '#645840'],
    -74,
    -29,
    -65,
    -15,
  );
  const body = oil(
    c,
    'M-9-80 Q-51-77-53-38 Q-53-11-38-3 L29-2 Q43-15 30-41 Q23-66 10-79Z',
    ['#f3e9c9', '#d5ceb0', '#b4ad8b', '#756e55'],
    -38,
    -57,
    36,
    -9,
  );
  fur(c, body, 833, { x: -4, y: -65 });
  glaze(c, body, 'M4-72 Q23-44 16-8', '#746f58', 15, 6, 0.55);
  glaze(c, body, 'M-21-69 Q-36-43-24-10', '#fff0d2', 12, 4, 0.4);
  const leg = oil(
    c,
    'M-5-56 Q2-65 10-55 Q9-34 12-7 Q7-1-3-5 Q-8-28-5-56Z',
    ['#ede5c7', '#cac4a5', '#8e896e'],
    -7,
    -36,
    13,
    -26,
  );
  fur(c, leg, 334, { x: 2, y: -57 });
  for (const [x, seed] of [
    [-17, 73],
    [12, 34],
  ]) {
    const paw = oil(
      c,
      `M${x - 11}-3 Q${x - 11}-13 ${x}-10 Q${x + 11}-8 ${x + 12} 0 H${x - 11}Z`,
      ['#eae2c4', '#beb79a', '#837d62'],
      x,
      -10,
      x,
      2,
    );
    fur(c, paw, seed, { x, y: -8 });
    for (let i = 0; i < 3; i++) line(c, x - 5 + i * 4, -4, x - 5 + i * 4, -1, '#8b826880', 0.4);
  }
  c.save();
  c.translate(0, Math.sin(time * 1.6) * 0.5);
  c.rotate(Math.sin(time * 1.15) * 0.021);
  oil(
    c,
    'M-28-103 L-31-128 Q-21-123-15-113 L0-116 Q12-115 16-111 L31-126 28-99Z',
    ['#f5e8c5', '#d4c7a5', '#a69b7e'],
    -20,
    -125,
    26,
    -97,
  );
  path(c, 'M-27-121 L-24-112-18-114Z', '#bc9382');
  path(c, 'M22-114 L28-121 26-109Z', '#b68e7e');
  const face = oil(
    c,
    'M-26-104 Q-32-92-24-81 Q-9-69 5-73 Q26-76 27-96 Q22-112 3-114 Q-13-116-26-104Z',
    ['#f0e6c6', '#ddd4b3', '#b8b08e'],
    -22,
    -98,
    24,
    -84,
  );
  fur(c, face, 732, { x: 0, y: -110 });
  glaze(c, face, 'M16-104 Q22-89 10-77', '#968d70', 9, 3, 0.48);
  const t = (time + 0.75) % 3.25,
    b = t > 2.85 && t < 3 ? Math.max(0.03, Math.abs((t - 2.925) / 0.075)) : 1;
  for (const x of [-14, 12]) {
    c.save();
    c.translate(x, -96);
    c.scale(1, b);
    path(c, 'M-6 1 Q0-4 6 0 Q0 4-6 1Z', '#969b6e', '#5c5b43', 0.5);
    ellipse(c, 0, 0, 1.0, 2.5, '#323c30');
    ellipse(c, -1, -1, 0.6, 0.7, '#f6edce');
    c.restore();
    path(c, `M${x - 6}-96 Q${x}-100 ${x + 6}-97`, undefined, '#6c694e', 0.6);
  }
  const muzzle = oil(
    c,
    'M-14-86 Q-5-89 0-84 Q6-89 14-85 Q13-77 4-77 L0-79 Q-10-73-14-86Z',
    ['#f4ecd5', '#dfd5b5', '#b2a389'],
    -11,
    -87,
    9,
    -76,
  );
  fur(c, muzzle, 92, { x: 0, y: -86 });
  path(c, 'M-5-89 Q-1-91 4-88 L0-85Z', '#a47e72');
  path(c, 'M0-85 Q-2-79-8-81 M0-85 Q3-80 9-82', undefined, '#837762', 0.65);
  for (let i = 0; i < 3; i++) {
    path(
      c,
      `M-13 ${-84 + i * 2} Q-25 ${-87 + i * 5}-38 ${-87 + i * 6}`,
      undefined,
      '#e9dec5',
      0.45,
    );
    path(c, `M13 ${-84 + i * 2} Q27 ${-87 + i * 5} 40 ${-87 + i * 6}`, undefined, '#d6cbb2', 0.45);
  }
  c.restore();
  c.restore();
}

import { ellipse, line, path, rect, type Ctx } from '../primitives';
import { COLORS as C, paperTexture as texture, printedShape as shape } from './materials';

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

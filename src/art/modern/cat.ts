import { EVENTS } from '../../timeline';
import { lerp, progress } from '../../animation/math';
import { ellipse, line, path, type Ctx } from '../primitives';
import { COLORS as C, printedShape as shape } from './materials';
import { blink } from '../../animation/blink';
import { modernCatPose } from '../../animation/cat';

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

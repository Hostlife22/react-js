import { EVENTS } from '../../timeline';
import { clamp, lerp, progress } from '../../animation/math';
import { ellipse, path, random, rect, type Ctx } from '../primitives';
import { COLORS as C, printedShape as shape } from './materials';

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

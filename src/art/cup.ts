import { EVENTS } from '../timeline';
import { clamp, lerp, progress } from '../animation/math';
import { cupMotion } from '../animation/cup';
import { PALETTES } from './palettes';
import { ellipse, gradient, line, path, text, type Ctx } from './primitives';

export function drawCup(c: Ctx, id: string, time: number) {
  const p = PALETTES[id],
    pos = cupMotion(time, id);
  let x = pos.x,
    y = pos.y,
    angle = pos.sip * (id === 'renaissance' ? -0.45 : -0.12);
  const falling = id === 'modern' && time >= EVENTS.swat;
  if (falling) {
    const q = clamp((time - EVENTS.swat) / (EVENTS.impact - EVENTS.swat));
    x = lerp(508, 391, q);
    y = 332 - 38 * q + 160 * q * q;
    angle = -q * 5.8;
  }
  if (id === 'modern' && time >= EVENTS.impact) {
    const q = progress(time, EVENTS.impact, EVENTS.impact + 0.32);
    ellipse(c, 389, 454, lerp(8, 48, q), lerp(3, 10, q), '#b9854b');
    ellipse(c, 389, 454, lerp(5, 36, q), lerp(2, 6, q), '#d0a465');
    for (let i = 0; i < 7; i++) {
      const a = i * 2.399,
        dx = Math.cos(a) * (18 + i * 5) * q,
        dy = Math.sin(a) * 8 * q;
      path(
        c,
        `M${388 + dx} ${451 + dy} l${-6 - (i % 3)} ${-8 + (i % 3)} 12-2 3 9Z`,
        i % 2 ? '#c36350' : '#f5e7cd',
      );
    }
    c.save();
    c.translate(419, 447);
    c.rotate(0.9);
    ellipse(c, 0, 0, 5, 6, 'transparent', '#c36350', 3);
    c.restore();
    return;
  }
  c.save();
  c.translate(x, y);
  c.rotate(angle);
  const color =
    id === 'cave'
      ? '#b75c37'
      : id === 'modern'
        ? '#c66d58'
        : id === 'egypt'
          ? '#3c7890'
          : id === 'gothic'
            ? '#c7a444'
            : id === 'ukiyo' || id === 'nouveau'
              ? '#eae1c6'
              : id === 'bauhaus'
                ? '#f0ebda'
                : p.accent;
  if (id === 'renaissance') {
    const bowl = new Path2D('M-16-31 Q-13-11 0-10 Q13-11 16-31Z');
    c.fillStyle = gradient(c, -16, 0, 16, 0, ['#706747', '#eee2b7', '#b7aa78', '#5d5b42']);
    c.fill(bowl);
    line(c, 0, -10, 0, -3, '#bfb18b', 3);
    ellipse(c, 0, -2, 13, 2, '#b8aa7e');
    ellipse(c, 0, -31, 16, 4, '#d7c497');
    ellipse(c, 0, -31, 13, 2.6, '#662c29');
    path(c, 'M-10-27 Q-8-15-2-14', undefined, '#eae2c0', 1.4);
    path(c, 'M-13-29 Q0-24 13-29', undefined, '#a69765', 0.6);
  } else if (id === 'gothic') {
    path(c, 'M-15-30 Q-13-10 0-10 Q13-10 15-30Z', color, p.ink, 1.4);
    line(c, 0, -10, 0, -3, p.ink, 2);
    ellipse(c, 0, -2, 12, 2, color, p.ink, 1);
    for (let i = 0; i < 5; i++) path(c, `M${-10 + i * 5}-28 v9`, undefined, '#e6cc7a', 0.7);
  } else {
    ellipse(
      c,
      19,
      -18,
      8,
      9,
      'transparent',
      id === 'modern' ? color : p.ink,
      id === 'modern' ? 4 : 2,
    );
    const vessel = new Path2D('M-15-29 L15-29 12-5 Q0 2-12-5Z');
    c.fillStyle =
      id === 'cgi'
        ? gradient(c, -15, 0, 15, 0, ['#41407a', '#9772bf', '#dac9e3', '#624992'])
        : color;
    c.fill(vessel);
    if (p.outline) path(c, 'M-15-29 L15-29 12-5 Q0 2-12-5Z', undefined, p.ink, p.outline);
    ellipse(
      c,
      0,
      -29,
      15,
      4,
      id === 'modern' ? '#edd7b7' : id === 'cgi' ? '#e0cfe3' : p.paper,
      p.outline ? p.ink : undefined,
      p.outline,
    );
    ellipse(c, 0, -29, 11, 2.3, '#765535');
    if (id === 'ukiyo') {
      path(c, 'M-12-23 Q0-18 12-23 M-11-9 Q0-5 11-9', undefined, '#6b8790', 0.7);
      for (let i = 0; i < 5; i++) {
        const a = (i * Math.PI * 2) / 5;
        ellipse(c, Math.cos(a) * 3, -17 + Math.sin(a) * 3, 1.3, 1.8, '#5e7d89');
      }
    }
    if (id === 'nouveau') {
      path(c, 'M-14-25H14M-12-9H12', undefined, '#b99857', 2);
      for (let i = 0; i < 5; i++) ellipse(c, -9 + i * 4.5, -17, 1.4, 1.4, '#caa99a', p.ink, 0.4);
      ellipse(c, 0, 0, 23, 2.5, '#e9ddba', p.ink, 0.7);
    }
    if (id === 'egypt')
      for (let i = 0; i < 5; i++) path(c, `M${-10 + i * 5}-25 v17`, undefined, '#cbbb69', 0.6);
  }
  if (id === 'modern') {
    text(c, '·', 0, -12, 22, '#f7e9d0', 'Georgia', 'center');
  }
  if (id === 'nouveau') {
    const drift = Math.sin(time * 1.7) * 4;
    const curls = [
      `M0-36C-19-70 49-88 15-125C-10-151-68-136-50-177C-30-218 17-215-3-184C-15-172-25-182-15-191`,
      `M0-36C-4-74-35-86-22-121C-2-156 52-135 53-173C53-207 29-204 36-190`,
      `M3-36C14-75 75-80 64-117C54-145 29-137 35-161`,
    ];
    c.save();
    c.translate(drift, 0);
    for (const curl of curls) {
      path(c, curl, undefined, '#897f58', 4.3);
      path(c, curl, undefined, '#faf4df', 3.4);
      path(c, curl, undefined, '#d9d0ad', 0.45);
    }
    c.restore();
  } else if (!falling)
    for (let i = 0; i < 2; i++) {
      const dy = (time * 17 + i * 17) % 34,
        alpha = (1 - dy / 34) * (id === 'renaissance' ? 0.27 : 0.55);
      c.save();
      c.globalAlpha = alpha;
      path(
        c,
        `M${-5 + i * 11} ${-37 - dy} q-7-6 1-13 q6-5 0-9`,
        undefined,
        id === 'modern' ? '#fdf6e5' : id === 'renaissance' ? '#d6c69f' : p.ink,
        id === 'renaissance' ? 0.8 : 1.4,
      );
      c.restore();
    }
  c.restore();
}

import { PALETTES } from '../palettes';
import { textureShape, tint } from '../materials';
import { ellipse, gradient, line, path, random, type Ctx } from '../primitives';

function catSurface(c: Ctx, d: string, color: string, id: string, fur = false, seed = 218) {
  const p = PALETTES[id],
    shape = new Path2D(d),
    rich = ['renaissance', 'cgi'].includes(id);
  c.fillStyle = rich
    ? gradient(c, -32, -105, 43, -8, [tint(color, 0.26), color, tint(color, -0.48)])
    : color;
  c.fill(shape);
  if (id !== 'cgi') textureShape(c, shape, 'paper', 0.5);
  if (id === 'renaissance') textureShape(c, shape, 'craquelure', 0.48);
  if (fur && ['renaissance', 'impression', 'post'].includes(id)) {
    c.save();
    c.clip(shape);
    const rng = random(seed);
    for (let i = 0; i < 2300; i++) {
      const x = -40 + rng() * 90,
        y = -144 + rng() * 149,
        theta = Math.atan2(y + 80, x) * 0.65,
        dx = Math.sin(theta) * 1.4,
        dy = 0.8 + rng() * 2.8;
      line(
        c,
        x,
        y,
        x + dx,
        y + dy,
        i % 3 === 0 ? tint(color, 0.25) : i % 3 === 1 ? tint(color, -0.12) : tint(color, 0.06),
        id === 'renaissance' ? 0.23 : 0.6 + rng() * 0.7,
      );
    }
    c.restore();
  }
  if (p.outline) path(c, d, undefined, p.ink, p.outline);
}

export function drawHistoricalCat(c: Ctx, id: string, time: number) {
  const p = PALETTES[id],
    w = Math.sin(time * 2.9) * 7,
    breathe = Math.sin(time * 2.5) * 0.4,
    body = 'M-19-79 Q-39-59-32-25 Q-34-6-21-3 L35-3 Q45-13 33-36 Q26-64 12-79Z';
  c.save();
  c.translate(317, 438 + breathe);
  ellipse(c, 7, 2, 46, 5, '#22231b20');
  path(
    c,
    `M23-14 C${72 + w * 0.35} 5 87 ${-43 + w} 62 ${-42 + w} Q47 ${-36 + w} 59 ${-29 + w}`,
    undefined,
    p.cat,
    10,
  );
  if (p.outline)
    path(
      c,
      `M23-14 C${72 + w * 0.35} 5 87 ${-43 + w} 62 ${-42 + w} Q47 ${-36 + w} 59 ${-29 + w}`,
      undefined,
      p.ink,
      0.8,
    );
  catSurface(c, body, p.cat, id, true);
  if (['ukiyo', 'impression', 'post', 'pixel'].includes(id))
    catSurface(c, 'M-17-71 Q-29-57-24-32 Q-18-12-9-5 L2-7 Q8-27 1-57Z', '#f1e7c9', id, true, 38);
  if (id === 'ukiyo') {
    catSurface(c, 'M17-64 Q31-49 33-25 L10-36Z', '#bd754b', id);
    catSurface(c, 'M-30-39 Q-15-48-7-33 L-13-17-31-19Z', '#323b39', id);
  }
  if (id === 'gothic') {
    catSurface(c, 'M-23-73 Q-13-84 5-79 L17-55-8-49Z', '#8da6b5', id);
    path(c, 'M-19-72 Q-6-65 9-71', undefined, '#d4ba64', 1.5);
  }
  for (let i = 0; i < 3; i++)
    if (['post', 'impression', 'egypt', 'greek', 'pixel'].includes(id))
      path(
        c,
        `M20 ${-58 + i * 13} q13 3 14 12`,
        undefined,
        id === 'greek' ? p.accent : tint(p.cat, -0.3),
        1.6,
      );
  catSurface(
    c,
    'M-26-2 Q-23-13-10-9 L-2-4-2 1-26 1Z',
    id === 'renaissance' || id === 'ukiyo' ? '#ece5cd' : p.cat,
    id,
    true,
    107,
  );
  catSurface(
    c,
    'M13-3 Q19-13 33-7 L36 1 13 1Z',
    id === 'renaissance' || id === 'ukiyo' ? '#ece5cd' : p.cat,
    id,
    true,
    17,
  );
  for (let i = 0; i < 3; i++)
    line(c, -21 + i * 6, -3, -21 + i * 6, 0, id === 'greek' ? p.accent : tint(p.cat, -0.3), 0.55);
  c.save();
  c.translate(0, Math.sin(time * 1.6) * 0.75);
  c.rotate(Math.sin(time * 1.13) * 0.027);
  catSurface(
    c,
    'M-28-100 L-30-126-12-113 Q1-118 12-111 L28-125 26-96 Q30-80 14-72 Q-6-65-23-78 Q-31-87-28-100Z',
    p.cat,
    id,
    true,
    143,
  );
  path(c, 'M-26-116 L-26-121-18-113Z', id === 'greek' ? p.accent : '#c88f89');
  path(c, 'M17-113 L25-121 24-109Z', id === 'greek' ? p.accent : '#c88f89');
  if (!['greek', 'cave', 'nouveau', 'renaissance'].includes(id))
    for (let i = 0; i < 3; i++)
      path(c, `M${-12 + i * 8}-115 l1 9`, undefined, tint(p.cat, -0.35), 1.7);
  const bt = (time + 0.75) % 3.25,
    blink = bt > 2.85 && bt < 3.0 ? Math.max(0.03, Math.abs((bt - 2.925) / 0.075)) : 1;
  for (const x of [-15, 9]) {
    ellipse(
      c,
      x,
      -95,
      6,
      4.5 * blink,
      ['egypt', 'greek', 'nouveau'].includes(id) ? '#c4b15a' : '#b8c395',
      p.ink,
      0.8,
    );
    ellipse(c, x + 0.7, -95, 1.5, 3.8 * blink, p.ink);
    ellipse(c, x + 2, -96.5, 1.0, blink, '#fff5d9');
    path(c, `M${x - 6}-98 q6-5 12 0`, undefined, p.ink, 0.75);
  }
  if (!['greek', 'cave'].includes(id)) {
    ellipse(c, -8, -84, 7, 4, id === 'renaissance' ? '#ddd6bc' : tint(p.cat, 0.2));
    ellipse(c, 5, -84, 7, 4, id === 'renaissance' ? '#ddd6bc' : tint(p.cat, 0.2));
  }
  path(c, 'M-7-88 Q-2-91 2-88 L-2-84Z', id === 'greek' ? p.accent : '#ab7871', p.ink, 0.6);
  path(
    c,
    'M-2-84 Q-7-77-11-83 M-2-84 Q4-77 8-83',
    undefined,
    id === 'greek' ? p.accent : p.ink,
    0.75,
  );
  for (let i = 0; i < 3; i++) {
    line(c, -12, -83 + i * 3, -35, -87 + i * 6, id === 'greek' ? p.accent : p.ink, 0.45);
    line(c, 11, -83 + i * 3, 35, -87 + i * 6, id === 'greek' ? p.accent : p.ink, 0.45);
  }
  if (id === 'egypt' || id === 'nouveau' || id === 'greek') {
    path(
      c,
      'M-22-73 Q-4-61 20-74 L19-67 Q-4-54-23-66Z',
      id === 'nouveau' ? '#ac553e' : '#c3983a',
      p.ink,
      0.8,
    );
    for (let i = 0; i < 9; i++)
      ellipse(c, -18 + i * 4, -67 + Math.sin(i * 0.39) * 5, 1.3, 1.3, '#dacc76');
  }
  c.restore();
  c.restore();
}

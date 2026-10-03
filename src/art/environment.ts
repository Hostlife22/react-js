import { ellipse, gradient, line, path, rect, text, type Ctx } from './primitives';
import { textureShape } from './materials';

function caveAnimals(c: Ctx, time: number) {
  // The wall paintings have their own leg joints and tail curves.
  const body = path(
    c,
    'M218 184Q221 165 242 170Q248 144 270 164Q293 152 323 174L352 174 368 165 365 182 353 187Q350 202 319 203L267 207 251 207 230 207 226 201 215 194Z',
    '#9e5935',
    '#342919',
    1.8,
  );
  textureShape(c, body, 'stone', 1);
  for (const [i, x] of [231, 258, 309, 320].entries()) {
    const swing = Math.sin(time * 4.3 + i * Math.PI) * 5,
      knee = x + swing * 0.5,
      foot = x + swing;
    path(
      c,
      `M${x} 201L${knee} 217 ${foot - 3} 237 ${foot + 4} 237 ${knee + 6} 217 ${x + 7} 201Z`,
      '#9e5935',
      '#342919',
      1.1,
    );
  }
  path(
    c,
    `M216 185Q${205 + Math.sin(time * 4) * 4} 171 ${200 + Math.cos(time * 4) * 3} 180`,
    undefined,
    '#3f2c1f',
    1.6,
  );
  path(c, 'M250 171Q260 187 262 205M335 174L340 188 351 189', undefined, '#3f2c1f', 1.2);
  ellipse(c, 355, 180, 1.2, 1.2, '#342919');
  path(
    c,
    'M256 256L258 243 276 239 301 243 310 235 305 252 290 257 267 258Z',
    '#b47946',
    '#493021',
    1.3,
  );
  for (const [i, x] of [260, 269, 284, 293].entries())
    line(c, x, 254, x + Math.sin(time * 5 + i * 2) * 3, 271, '#8f5c34', 3);
  path(c, `M258 247Q${248 + Math.sin(time * 3) * 4} 242 248 253`, undefined, '#493021', 1.1);
}

function atenRays(c: Ctx, time: number) {
  for (let i = 0; i < 13; i++) {
    const spread = Math.sin(time * 2.5 + i * 0.35) * 3,
      x = 210 + i * 15 + spread,
      y = 281 + Math.cos(time * 2 + i * 0.7) * 2;
    line(c, 300, 188, x, y, '#b9573f', 1);
    c.save();
    c.translate(x, y);
    c.rotate((x - 300) * 0.003 + Math.sin(time * 2 + i) * 0.08);
    path(c, 'M-2-2L2-2 3 3 1 5-2 3Z', '#b9573f');
    for (let j = 0; j < 4; j++)
      line(c, -1.5 + j, 2, -2 + j * 1.3, 6 + Math.sin(time * 2 + i + j) * 0.4, '#b9573f', 0.55);
    c.restore();
  }
}

function cgiLight(c: Ctx, time: number) {
  c.save();
  c.beginPath();
  c.rect(192, 123, 230, 206);
  c.clip();
  const x = 310 + Math.sin((time - 10.6) * 6) * 45,
    y = 150 + Math.cos(time * 2) * 4;
  const g = c.createRadialGradient(x, y, 1, x, y, 62);
  g.addColorStop(0, '#ffffed');
  g.addColorStop(0.07, '#fffce7bb');
  g.addColorStop(0.2, '#ffe8b85a');
  g.addColorStop(1, '#e8bfec00');
  c.fillStyle = g;
  c.fillRect(x - 70, y - 70, 140, 140);
  c.save();
  c.translate(x, y);
  c.rotate(time * 0.65);
  for (let i = 0; i < 4; i++) {
    c.rotate(Math.PI / 2);
    path(c, 'M-2 0L0-28 2 0 0 28Z', '#fffce9bb');
  }
  c.restore();
  c.restore();
  // Analytic highlight follows the light around the chrome sphere.
  const bx = 853,
    by = 344,
    hx = bx - 9 + Math.sin(time * 1.4) * 7,
    hy = by - 12 + Math.cos(time * 1.4) * 3;
  const ball = c.createRadialGradient(hx, hy, 1, bx, by, 27);
  ball.addColorStop(0, '#fff9e6');
  ball.addColorStop(0.2, '#c7d3cc');
  ball.addColorStop(0.6, '#857f9e');
  ball.addColorStop(1, '#263d51');
  c.fillStyle = ball;
  c.beginPath();
  c.arc(bx, by, 27, 0, Math.PI * 2);
  c.fill();
  c.save();
  c.translate(837, 397);
  c.rotate(-0.35 + Math.sin(time * 1.7) * 0.15);
  c.scale(1, 0.45);
  c.strokeStyle = gradient(c, -46, -30, 46, 30, ['#c8b6de', '#70568e', '#e3c9ef', '#8963a7']);
  c.lineWidth = 24;
  c.beginPath();
  c.arc(0, 0, 34, 0, Math.PI * 2);
  c.stroke();
  c.restore();
}

function comicPortraits(c: Ctx, time: number) {
  const colors = ['#eed554', '#8c78ad', '#ef997d', '#dac65c'];
  for (let i = 0; i < 4; i++) {
    const x = 243 + (i % 2) * 122,
      y = 180 + Math.floor(i / 2) * 108,
      eye = Math.max(0.12, Math.abs(Math.sin(time * 4 + i * 1.3)));
    path(
      c,
      `M${x - 24} ${y + 11}L${x - 25} ${y - 30} ${x - 8} ${y - 14}Q${x} ${y - 18} ${x + 10} ${y - 14}L${x + 25} ${y - 30} ${x + 25} ${y + 9}Q${x + 2} ${y + 40} ${x - 24} ${y + 11}Z`,
      colors[i],
      '#202b41',
      1.5,
    );
    for (const side of [-1, 1]) {
      ellipse(c, x + side * 10, y, 5, 7 * eye, '#eae1bd', '#202b41', 0.7);
      ellipse(c, x + side * 10, y + eye, 1.5, 4 * eye, '#202b41');
      line(c, x + side * 12, y + 12, x + side * 28, y + 8, '#202b41', 0.7);
      line(c, x + side * 12, y + 15, x + side * 28, y + 15, '#202b41', 0.7);
    }
    path(c, `M${x - 4} ${y + 9}l8 0-4 5Z`, '#202b41');
    path(c, `M${x} ${y + 14}q-5 9-10 2m10-2q5 9 10 2`, undefined, '#202b41', 1.1);
  }
  c.save();
  c.translate(136, 346);
  const pulse = 1 + Math.sin(time * 7) * 0.025;
  c.scale(pulse, pulse);
  c.translate(-136, -346);
  path(
    c,
    'M110 318L89 330 104 344 79 362 110 364 120 385 140 370 163 387 165 364 190 365 178 343 193 326 164 324 153 304 137 320Z',
    '#f1d647',
    '#202b41',
    2,
  );
  text(c, 'WIGGLE', 133, 343, 16, '#202b41', '"Bangers"', 'center');
  text(c, 'WAGGLE', 135, 359, 14, '#202b41', '"Bangers"', 'center');
  c.restore();
}

export function environmentMotion(c: Ctx, id: string, time: number) {
  c.save();
  c.lineCap = 'round';
  c.lineJoin = 'round';
  if (id === 'cave') caveAnimals(c, time);
  else if (id === 'egypt') atenRays(c, time);
  else if (id === 'cgi') cgiLight(c, time);
  else if (id === 'pop') comicPortraits(c, time);
  else if (id === 'greek') {
    const wind = Math.sin(time * 3) * 2;
    path(c, `M281 171Q${319 + wind} 175 337 205L281 208Z`, '#ddaa76', '#28241f', 2);
    for (let i = 0; i < 5; i++) {
      const x = 257 + i * 18,
        a = Math.sin(time * 4 + i * 0.2) * 3;
      line(c, x, 244, x - 11 + a, 258, '#28241f', 2);
      line(c, x - 11 + a, 258, x - 20 + a, 254, '#28241f', 2);
    }
  } else if (id === 'pixel') {
    const phase = Math.floor(time * 12) % 3;
    for (let i = 0; i < 3; i++) {
      rect(c, 344 + i * 17, 146, 6, 6, i === phase ? '#fff3b0' : '#d6b567');
    }
  }
  c.restore();
}

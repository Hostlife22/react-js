import { flower, impasto } from './materials';
import { ellipse, line, path, random, rect, type Ctx } from './primitives';

const rooms = new Map<string, HTMLCanvasElement>();
const strokes = {
  post: [
    '#85aed1',
    '#739ac4',
    '#a9c7de',
    '#667fad',
    '#b1c7d7',
    '#7d94bb',
    '#859bbe',
    '#b7c7d3',
    '#9289b7',
    '#72a7b4',
  ],
  impression: [
    '#ede0c4',
    '#e9c6b9',
    '#ddd0da',
    '#dfbdd1',
    '#c9c0d8',
    '#eee2c4',
    '#f0d79a',
    '#dbbfbe',
    '#f2e6cc',
    '#c1c0d4',
  ],
} as const;

function paintedWood(
  c: Ctx,
  d: string,
  box: readonly [number, number, number, number],
  vertical = false,
) {
  const s = path(c, d, '#cfa24b', '#34527b', 1.8);
  impasto(
    c,
    s,
    box,
    ['#d9b454', '#f0cf6f', '#bb813d', '#9e702b', '#d3b459'],
    Math.max(40, Math.round((box[2] * box[3]) / 18)),
    147,
    () => (vertical ? Math.PI / 2 : 0),
  );
  return s;
}

let starryBase: HTMLCanvasElement | undefined;
function starry(c: Ctx, time: number) {
  const win = path(c, 'M194 69H410V279H194Z', '#1f397b');
  if (!starryBase) {
    starryBase = document.createElement('canvas');
    starryBase.width = 1920;
    starryBase.height = 1080;
    const b = starryBase.getContext('2d', { willReadFrequently: true })!;
    b.scale(2, 2);
    impasto(
      b,
      win,
      [194, 69, 216, 211],
      ['#2e4c92', '#244282', '#5675ab', '#628ebd', '#182e6c', '#88b6d0', '#32518c'],
      3600,
      429,
      (x, y) => {
        const cx = y < 160 ? 270 : 335,
          cy = y < 160 ? 131 : 203;
        return Math.atan2(y - cy, x - cx) + Math.PI / 2;
      },
    );
  }
  c.drawImage(starryBase, 0, 0, 960, 540);
  c.save();
  c.clip(win);
  // Each brush stroke follows a rotating elliptical vortex; pixels are never shifted.
  for (const [cx, cy, rx, ry] of [
    [277, 134, 64, 31],
    [342, 200, 68, 29],
  ] as const) {
    for (let i = 0; i < 260; i++) {
      const phase = i * 2.399 + time * 0.55,
        r = 0.28 + Math.sqrt(i / 260) * 0.72,
        a = phase;
      const x = cx + Math.cos(a) * rx * r,
        y = cy + Math.sin(a) * ry * r;
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(
        x - Math.sin(a) * 5,
        y + Math.cos(a) * 3,
        x - Math.sin(a) * 10,
        y + Math.cos(a) * 5,
      );
      c.strokeStyle = ['#8fb4cb', '#bad2cc', '#5778ae', '#e2d996', '#5e95b4'][i % 5];
      c.lineWidth = 0.7 + (i % 4) * 0.32;
      c.stroke();
    }
  }
  const stars = [
    [217, 81, 5],
    [260, 92, 11],
    [337, 97, 9],
    [388, 101, 15],
    [246, 158, 6],
    [282, 211, 6],
    [375, 236, 6],
  ];
  for (const [x, y, r] of stars) {
    for (let ring = r + 7; ring > 0; ring -= 2) {
      c.beginPath();
      c.ellipse(
        x,
        y,
        ring * (1 + Math.sin(time * 3 + x) * 0.035),
        ring * 0.86,
        ring * 0.013 + time * 0.45,
        0,
        Math.PI * 1.88,
      );
      c.strokeStyle = ring % 3 ? '#ead27c' : '#b6c69c';
      c.lineWidth = 1.5;
      c.stroke();
    }
    ellipse(c, x, y, r * 0.28, r * 0.3, '#f7e2a0');
  }
  const cypress = path(
    c,
    'M201 281Q205 215 214 194Q216 153 226 133Q226 108 233 96Q236 133 243 154Q236 188 250 210Q239 246 252 281Z',
    '#344a3c',
    '#173251',
    1.4,
  );
  impasto(
    c,
    cypress,
    [199, 99, 53, 183],
    ['#375c45', '#607449', '#243c39', '#778455', '#294b3b'],
    400,
    491,
    () => Math.PI / 2 + 0.12,
  );
  for (let i = 0; i < 22; i++) {
    const x = 247 + i * 7.8,
      y = 270 + Math.sin(i * 0.5) * 4;
    rect(c, x, y, 6, 11, ['#56716c', '#4b5f65', '#687978'][i % 3]);
    path(c, `M${x - 1} ${y}l4-4 4 4Z`, '#2b3e64');
  }
  c.restore();
  paintedWood(c, 'M181 56H422V65H181Z', [181, 56, 241, 9]);
  paintedWood(c, 'M181 56H189V291H181Z', [181, 56, 8, 235], true);
  paintedWood(c, 'M416 56H424V291H416Z', [416, 56, 8, 235], true);
  path(c, 'M182 56H423V64H182Z', '#65a65c', '#274d73', 1.5);
  path(c, 'M183 282H426V293H177Z', '#6aa55a', '#284c70', 1.5);
  for (let i = 0; i < 32; i++)
    line(c, 181 + i * 7.5, 286, 187 + i * 7.5, 286, ['#a9c973', '#518c49', '#b3be69'][i % 3], 1.1);
  line(c, 303, 67, 303, 282, '#70a865', 5);
  line(c, 195, 177, 410, 177, '#70a865', 4);
}

function garden(c: Ctx) {
  const win = path(c, 'M179 65H410V281H179Z', '#b8d3de');
  impasto(
    c,
    win,
    [179, 65, 231, 216],
    ['#b4d0dd', '#8fbed9', '#e8e8d3', '#b2ccdd', '#9fc3db'],
    2100,
    528,
    () => 0.12,
  );
  c.save();
  c.clip(win);
  const green = path(
    c,
    'M174 220Q225 204 247 183Q280 166 322 213Q349 180 414 185V287H174Z',
    '#a4b769',
  );
  impasto(
    c,
    green,
    [174, 160, 244, 127],
    ['#96ba67', '#c0cf82', '#709c68', '#82b271', '#b3c27b', '#d8d48a'],
    1800,
    920,
    () => 0.04,
  );
  for (const [x, y, r] of [
    [252, 151, 23],
    [287, 177, 26],
    [352, 153, 30],
    [382, 176, 24],
  ]) {
    const shrub = path(
      c,
      `M${x - r} ${y + 30}Q${x - r * 1.6} ${y - r} ${x} ${y - r}Q${x + r * 1.7} ${y - r} ${x + r} ${y + 30}Z`,
      '#71a877',
    );
    impasto(
      c,
      shrub,
      [x - r * 1.3, y - r, r * 2.6, r + 30],
      ['#4f9367', '#8fbb86', '#67aa73', '#bad09a'],
      450,
      Math.round(x),
      () => -0.6,
    );
  }
  rect(c, 196, 155, 22, 20, '#e9e6c5');
  path(c, 'M191 155L208 140 224 155Z', '#bc8175');
  rect(c, 204, 163, 5, 9, '#8497a1');
  const rng = random(826);
  for (let i = 0; i < 130; i++) {
    const x = 185 + rng() * 211,
      y = 220 + rng() * 64;
    ellipse(c, x, y, 1.7 + rng() * 1.5, 1.3 + rng() * 1.3, i % 3 ? '#b96958' : '#e1957f');
  }
  c.restore();
  for (const [x, y, w, h] of [
    [165, 50, 12, 255],
    [411, 50, 14, 255],
    [174, 54, 243, 10],
    [174, 284, 245, 15],
  ] as const) {
    const frame = path(c, `M${x} ${y}h${w}v${h}h${-w}Z`, '#eadfbe');
    impasto(
      c,
      frame,
      [x, y, w, h],
      ['#f8efcc', '#d5ceb8', '#c0c3cf', '#fff1ce'],
      350,
      Math.round(x + y),
      () => (h > w ? Math.PI / 2 : 0),
    );
  }
  line(c, 289, 66, 289, 280, '#f6e9d0', 4);
  line(c, 180, 207, 408, 207, '#f8eacb', 4);
}

export function impastoRoom(c: Ctx, id: 'post' | 'impression') {
  let canvas = rooms.get(id);
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const r = canvas.getContext('2d', { willReadFrequently: true })!;
    r.scale(2, 2);
    const post = id === 'post';
    rect(r, 0, 0, 960, 540, post ? '#84a5c4' : '#e5cfc8');
    rect(r, 0, 394, 960, 146, post ? '#b28769' : '#d5aa9c');
    impasto(r, new Path2D('M0 0H960V394H0Z'), [0, 0, 960, 394], strokes[id], 18500, 537, (x, y) =>
      post ? Math.PI / 2 + 0.14 : Math.atan2(y - 190, x - 300) * 0.45 + 1.1,
    );
    const floorColors = post
      ? ['#bd916d', '#d2a985', '#a07967', '#8b7265', '#d4bb8a', '#7d9b81', '#b98680']
      : ['#d4ad99', '#d8b8a1', '#bc989e', '#e1c39f', '#b29cac', '#e5c795', '#b9b1a0'];
    impasto(
      r,
      new Path2D('M0 394H960V540H0Z'),
      [0, 394, 960, 146],
      floorColors,
      8200,
      170,
      (x, y) => (post ? Math.atan2(y - 321, x - 470) : 0.06),
    );
    if (post) {
      for (let i = -14; i < 18; i++) line(r, 475 + i * 29, 394, 475 + i * 76, 540, '#325678', 1.4);
    } else garden(r);
    if (post) {
      for (let ring = 3; ring < 39; ring += 1.5) {
        r.beginPath();
        r.ellipse(516, 68, ring, ring * 0.88, ring * 0.02, 0, Math.PI * 1.95);
        r.strokeStyle = ['#dce094', '#d9d36d', '#adbf89', '#e9d584'][Math.floor(ring) % 4];
        r.lineWidth = 1.3;
        r.stroke();
      }
      line(r, 516, 0, 516, 63, '#24436c', 0.7);
      path(r, 'M505 67Q516 54 526 67Z', '#deb74e', '#324875', 0.8);
      ellipse(r, 516, 70, 6, 5, '#f2de85');
      paintedWood(r, 'M816 270H960V441H816Z', [816, 270, 144, 171], true);
      paintedWood(r, 'M815 247H960V283H815Z', [815, 247, 145, 36]);
      const bed = path(r, 'M822 244Q889 227 960 245V262H822Z', '#b24b3b', '#304e72', 1.5);
      impasto(
        r,
        bed,
        [820, 234, 145, 35],
        ['#c95c46', '#a14040', '#d58b53', '#a94c47'],
        330,
        904,
        () => 0.2,
      );
      for (let i = 0; i < 3; i++)
        paintedWood(r, `M${703 + i * 12} 243h4v202h-4Z`, [703 + i * 12, 243, 4, 202], true);
      for (let i = 0; i < 4; i++) line(r, 696, 340 + i * 24, 735, 340 + i * 24, '#d8b84e', 3);
      paintedWood(r, 'M412 315H601V330H412Z', [412, 315, 189, 15]);
      paintedWood(r, 'M418 329H597V345H418Z', [418, 329, 179, 16]);
      ellipse(r, 505, 337, 2.8, 3, '#f0d678', '#32527a', 0.7);
      for (const x of [417, 590]) paintedWood(r, `M${x} 344h7v105h-7Z`, [x, 344, 7, 105], true);
      const vase = path(r, 'M430 289H451L447 316H435Z', '#d1b557', '#2a4d77', 1.1);
      impasto(r, vase, [430, 289, 22, 29], ['#d4b758', '#ebce78', '#b48a45'], 70, 650, () => 0.1);
      for (const [x, y, size] of [
        [433, 263, 10],
        [450, 253, 9],
        [457, 281, 9],
        [425, 284, 8],
        [445, 284, 7],
      ] as const) {
        line(r, 440, 298, x, y, '#6e8c44', 1.5);
        flower(r, x, y, size, '#dec054', '#876834', 13);
        ellipse(r, x, y, size * 0.4, size * 0.4, '#87703a', '#b4a45a', 0.6);
      }
      for (let i = 0; i < 2; i++) {
        const x = 817 + i * 64;
        paintedWood(r, `M${x} 140h50v64h-50Z`, [x, 140, 50, 64], true);
        const painting = path(r, `M${x + 5} 145h40v54h-40Z`, i ? '#dcba53' : '#708faf');
        impasto(
          r,
          painting,
          [x + 5, 145, 40, 54],
          i ? ['#f0d37e', '#deb950', '#f3e1a7'] : ['#a1b7c8', '#7a9eaa', '#72aab8'],
          130,
          650 + i,
          () => 0,
        );
        if (i) {
          path(r, `M${x + 6} 193q10-26 20-11l11 13Z`, '#66915d');
          line(r, x + 16, 175, x + 12, 193, '#526d48', 1);
        } else {
          rect(r, x + 17, 175, 17, 18, '#c98443');
          ellipse(r, x + 25, 174, 11, 3, '#e4af52');
          for (let j = 0; j < 3; j++)
            flower(r, x + 16 + j * 7, 157 + (j % 2) * 6, 3, '#dd6651', '#e1bc53', 7);
        }
      }
    } else {
      const frame = path(r, 'M466 96H607V186H466Z', '#d5bb83');
      impasto(r, frame, [466, 96, 141, 90], ['#e7ce98', '#b79c72', '#d6b880'], 650, 620, () => 0);
      const mon = path(r, 'M473 103H600V178H473Z', '#b7bbc0');
      impasto(
        r,
        mon,
        [473, 103, 127, 75],
        ['#a5aab6', '#c1bdbe', '#d1bdab', '#a4b6bc'],
        500,
        622,
        () => 0.03,
      );
      ellipse(r, 548, 125, 5, 5, '#d08067');
      for (let i = 0; i < 7; i++)
        line(r, 542 - i * 0.6, 138 + i * 4, 551 + i * 0.8, 138 + i * 4, '#c9896f', 1.4);
      path(r, 'M513 160l10-6 12 6Z', '#777d8a');
      const table = path(
        r,
        'M410 316H602L599 398Q577 403 558 397Q545 405 528 400Q504 405 480 399Q445 403 412 398Z',
        '#dedfdf',
      );
      impasto(
        r,
        table,
        [410, 316, 192, 89],
        ['#deded7', '#f5eaca', '#c5c5d5', '#b7bbd2', '#e5dbca', '#dbd8df'],
        1600,
        426,
        () => Math.PI / 2 + 0.2,
      );
      line(r, 505, 397, 505, 446, '#a4a0a6', 3);
      line(r, 489, 447, 521, 447, '#857e91', 3);
      const vase = path(r, 'M436 293H452L449 319H439Z', '#97b8b4');
      impasto(r, vase, [436, 293, 17, 27], ['#97babb', '#b9d1cb', '#7f9eab'], 90, 808);
      for (let i = 0; i < 13; i++) {
        const x = 435 + ((i * 17) % 24),
          y = 269 + ((i * 13) % 35);
        line(r, 443, 299, x, y, '#839885', 0.7);
        flower(r, x, y, 3 + (i % 3), '#cf8fa6', '#d8b7a7', 5);
      }
      const bush = path(
        r,
        'M780 396Q772 314 792 277Q788 201 825 185Q846 142 877 176Q921 166 939 246Q965 299 948 397Z',
        '#8fc18d',
      );
      impasto(
        r,
        bush,
        [771, 172, 186, 224],
        ['#94c78d', '#a8d297', '#b5d798', '#79b183', '#85bb8d', '#bed8a2'],
        2400,
        803,
        () => -0.8,
      );
      const rng = random(901);
      for (let i = 0; i < 43; i++)
        ellipse(r, 796 + rng() * 140, 215 + rng() * 169, 1.5, 2.1, i % 2 ? '#d48caa' : '#f0c5cf');
      const pot = path(r, 'M825 399H900L891 453H834Z', '#b0bacb');
      impasto(r, pot, [825, 399, 75, 55], ['#adb9cb', '#d1d2d5', '#8caac2', '#c7cbd3'], 300, 814);
    }
    rooms.set(id, canvas);
  }
  c.drawImage(canvas, 0, 0, 960, 540);
}

export function impastoMotion(c: Ctx, id: 'post' | 'impression', time: number) {
  c.save();
  c.lineCap = 'round';
  c.lineJoin = 'round';
  if (id === 'post') starry(c, time);
  else {
    // Separate folds share an anchored curtain rod, with different cloth phases.
    for (let i = 0; i < 15; i++) {
      const x = 158 + i * 0.8,
        bend = Math.sin(time * 1.6 + i * 0.15) * 2.6;
      path(
        c,
        `M${x} 51Q${x - 11 + bend} 179 ${x - 5 + bend * 0.6} 307`,
        undefined,
        i % 2 ? '#d1c5d4' : '#f0e3c6',
        2,
      );
    }
    for (let i = 0; i < 12; i++) {
      const x = 426 + i * 0.8,
        bend = Math.sin(time * 1.6 + i * 0.15 + 0.7) * 2.1;
      path(
        c,
        `M${x} 52Q${x + 8 + bend} 183 ${x + 5 + bend * 0.6} 307`,
        undefined,
        i % 2 ? '#b8bfd4' : '#e9ded0',
        2,
      );
    }
    // Poppies and their stems sway independently in the painted garden.
    c.save();
    c.beginPath();
    c.rect(181, 211, 225, 69);
    c.clip();
    for (let i = 0; i < 28; i++) {
      const root = 187 + ((i * 37) % 211),
        y = 230 + ((i * 19) % 48),
        sway = Math.sin(time * 2.5 + i * 0.9) * 1.9;
      path(
        c,
        `M${root} ${y + 15}Q${root + sway * 0.5} ${y + 5} ${root + sway} ${y}`,
        undefined,
        '#769954',
        0.7,
      );
      ellipse(c, root + sway, y, 1.8, 1.5, i % 3 ? '#bd6b58' : '#e1957f');
    }
    c.restore();
  }
  c.restore();
}

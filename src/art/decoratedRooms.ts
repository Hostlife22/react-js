import { ellipse, gradient, line, path, random, rect, text, type Ctx } from './primitives';
import { flower, textureShape } from './materials';

const cache = new Map<string, HTMLCanvasElement>();
function stained(c: Ctx, x: number, y: number, w: number, h: number) {
  const win = path(
    c,
    `M${x} ${y + h}V${y + 28}Q${x + w * 0.12} ${y + 10} ${x + w * 0.5} ${y}Q${x + w * 0.88} ${y + 10} ${x + w} ${y + 28}V${y + h}Z`,
    '#304c86',
    '#352d25',
    2,
  );
  c.save();
  c.clip(win);
  for (let yy = y; yy < y + h; yy += 12)
    for (let xx = x - 12; xx < x + w; xx += 12) {
      const i = Math.floor((xx - x) / 12 + (yy - y) / 12);
      path(c, `M${xx} ${yy + 6}l6-6 6 6-6 6Z`, i % 2 ? '#a4423e' : '#244d89', '#e3ca71', 0.6);
      ellipse(c, xx + 6, yy + 6, 1, 1, '#e3ce91');
    }
  c.restore();
}

function margin(c: Ctx, x: number, y: number, h: number, seed: number, time: number) {
  const rng = random(seed);
  path(
    c,
    `M${x} ${y + h}C${x - 52} ${y + h * 0.67} ${x + 40} ${y + h * 0.37} ${x} ${y}`,
    undefined,
    '#5e5e35',
    0.6,
  );
  for (let i = 0; i < 25; i++) {
    const yy = y + (h * i) / 25,
      xx = x + Math.sin(i * 0.68) * 20 + Math.sin(time * 1.9 + i * 0.8) * 1.6,
      side = i % 2 ? -1 : 1;
    path(
      c,
      `M${xx} ${yy}q${side * 22} -10 ${side * (26 + rng() * 9)} -22`,
      undefined,
      '#655d38',
      0.55,
    );
    if (i % 3) {
      path(
        c,
        `M${xx + side * 26} ${yy - 20}l${side * 7} 1-2 7 8 4-4 6-7-2-7 5-2-9Z`,
        i % 2 ? '#2f4d93' : '#a4483d',
        '#4c4436',
        0.6,
      );
    } else ellipse(c, xx + side * 26, yy - 20, 3.2, 3.2, '#cbb658', '#665035', 0.5);
  }
}

function gothic(c: Ctx) {
  const wall = path(
    c,
    'M164 450V93L289 18 416 96 491 35 568 94 642 35 724 94V450Z',
    '#d4b75d',
    '#3f352a',
    1.7,
  );
  c.save();
  c.clip(wall);
  for (let x = 155; x < 735; x += 20)
    for (let y = 26; y < 455; y += 20) {
      path(c, `M${x} ${y + 10}l10-10 10 10-10 10Z`, undefined, '#edda8a', 0.65);
      path(c, `M${x + 8} ${y + 10}l2-2 2 2-2 2Z`, '#e4cf83');
    }
  c.restore();
  path(c, 'M164 89L289 16 418 92', undefined, '#bb827b', 6);
  path(c, 'M420 92L491 34 567 94 642 34 724 94', undefined, '#315392', 5);
  for (let i = 0; i < 48; i++) {
    const x = 164 + i * 11.6,
      segment =
        x < 418
          ? x < 289
            ? (289 - x) * 0.57
            : (x - 289) * 0.57
          : x < 567
            ? Math.abs(x - 491) * 0.74
            : Math.abs(x - 642) * 0.73;
    ellipse(c, x, 13 + segment, 2.6, 2.6, '#dab44e', '#584634', 0.6);
  }
  for (const x of [154, 417, 568, 726]) {
    rect(c, x - 5, 73, 11, 367, '#eedfb5', 0, '#493927', 1.2);
    path(c, `M${x - 5} 69L${x} 30 ${x + 5} 69Z`, '#b73e35', '#493927', 1.1);
    for (let y = 92; y < 434; y += 23) {
      rect(c, x - 5, y, 11, 12, Math.floor(y / 23) % 2 ? '#ac403b' : '#304b87', 0, '#c9a654', 0.4);
      ellipse(c, x, y + 6, 1.5, 1.5, '#eed69a');
    }
  }
  path(c, 'M177 272V158Q177 108 287 63Q397 108 397 158V272Z', '#f1e7ce', '#3f352c', 2);
  stained(c, 196, 146, 87, 121);
  stained(c, 297, 146, 87, 121);
  for (const [dx, dy] of [
    [-13, 0],
    [0, -13],
    [13, 0],
    [0, 13],
  ])
    ellipse(c, 288 + dx, 112 + dy, 13, 13, '#b33f38', '#372e2a', 1.7);
  for (const [dx, dy] of [
    [-12, 0],
    [0, -12],
    [12, 0],
    [0, 12],
  ])
    ellipse(c, 288 + dx, 112 + dy, 7, 7, '#35558b', '#372e2a', 1);
  ellipse(c, 288, 112, 4.5, 4.5, '#d6b84f', '#5b4431', 0.6);
  rect(c, 175, 269, 225, 11, '#c19184', 0, '#49372c', 1.7);
  line(c, 174, 269, 401, 269, '#ecd2b7', 1.3);
  path(
    c,
    'M164 448Q203 438 246 449Q284 439 330 449Q369 439 409 449Q458 438 507 449Q551 438 599 449Q650 436 724 449V473H164Z',
    '#7e985e',
    '#505a3e',
    1,
  );
  for (let i = 0; i < 38; i++) {
    const x = 166 + i * 15;
    rect(c, x, 475, 14, 8, i % 2 ? '#a6413b' : '#2d4c89', 0, '#ddb85e', 0.8);
    path(c, `M${x + 1} 479q6-6 12 0`, undefined, '#e8d1a2', 0.65);
  }
  // A manuscript table has trestles and a scalloped embroidered cloth.
  for (const x of [420, 588]) {
    line(c, x, 358, x - 8, 448, '#80653e', 3);
    line(c, x, 358, x + 11, 448, '#a38852', 3);
    line(c, x - 5, 414, x + 8, 414, '#715a36', 2);
  }
  path(c, 'M403 290H608L613 321H408Z', '#f4edce', '#4f3e2a', 1.5);
  const cloth = path(
    c,
    'M408 321H612V364Q605 376 598 364Q591 377 583 364Q576 377 568 364Q560 377 551 364Q543 377 535 364Q526 377 517 364Q509 377 501 364Q492 377 483 364Q474 377 466 364Q457 377 449 364Q440 377 432 364Q424 376 415 364Z',
    '#f2ecd6',
    '#5b4d39',
    1.1,
  );
  textureShape(c, cloth, 'cloth', 0.6);
  for (const y of [332, 336, 348]) line(c, 410, y, 611, y, '#607392', 0.65);
  for (let i = 0; i < 23; i++) {
    const x = 414 + i * 8.4;
    line(c, x, 351, x + 2, 370, '#64759c', 0.6);
    ellipse(c, x + 3, 354, 1, 1, '#b85c56');
  }
  ellipse(c, 440, 308, 16, 9, '#ba975a', '#665136', 0.8);
  path(c, 'M431 305q9 4 17-1M440 303v11', undefined, '#76603e', 0.7);
  rect(c, 683, 362, 56, 84, '#bd878b', 0, '#4e392b', 1.5);
  for (let i = 0; i < 4; i++)
    path(c, `M${690 + i * 12} 438V403q0-10 6-17q6 7 6 17v35Z`, '#314d86', '#6b5140', 0.7);
  path(c, 'M711 361V238L721 222 732 239V361Z', '#477748', '#4c4532', 1.5);
  rect(c, 681, 367, 57, 6, '#d4b764', 0, '#5e4b31', 1);

  // The historiated initial and text column use the space outside the scene.
  rect(c, 755, 153, 54, 56, '#354f8e', 0, '#c6a65b', 3);
  text(c, 'h', 764, 201, 53, '#b85044', '"IM Fell English"', 'left', '400');
  const lines = [
    'ic sedet homo',
    'cum poculo suo',
    'et bibit. Cattus',
    'eum spectat.',
    'Cattus semper',
    'spectat. Nemo',
    'scit quare. Omnes',
    'autem sciunt',
    'cattum in aeternum.',
  ];
  lines.forEach((s, i) =>
    text(c, s, i < 2 ? 815 : 756, 173 + i * 28, 17, '#3e3427', '"IM Fell English"', 'left', '400'),
  );
  for (let i = 0; i < 31; i++) {
    const x = 165 + i * 19;
    path(c, `M${x} 498q8 8 16-2`, undefined, '#636c43', 0.5);
    if (i % 2)
      path(c, `M${x + 10} 499l5-5 4 7-4 4Z`, i % 3 ? '#325794' : '#a4493d', '#6d5137', 0.5);
  }
}

function mosaicBorder(c: Ctx) {
  for (let x = 17; x < 944; x += 10) {
    rect(c, x, 453, 9, 10, Math.floor(x / 10) % 3 ? '#c8b679' : '#6c967d', 0, '#665b36', 0.5);
    rect(c, x, 16, 9, 6, Math.floor(x / 10) % 3 ? '#bdb071' : '#7d9577');
  }
}

function nouveau(c: Ctx) {
  c.fillStyle = gradient(c, 0, 0, 0, 540, ['#c7d0a3', '#e3d4ac']);
  c.fillRect(0, 0, 960, 540);
  rect(c, 12, 12, 936, 516, 'transparent', 0, '#574f31', 3);
  rect(c, 18, 18, 924, 504, 'transparent', 0, '#b29958', 1);
  for (let x = 26; x < 945; x += 29)
    for (let y = 29; y < 450; y += 28) {
      ellipse(c, x + (Math.floor(y / 28) % 2) * 14, y, 5, 5, 'transparent', '#aab17e', 0.3);
      ellipse(c, x + (Math.floor(y / 28) % 2) * 14, y, 1.2, 1.2, '#b9bf8b');
    }
  const win = path(c, 'M191 269V139Q191 65 293 65Q400 65 400 139V269Z', '#c6d3bd', '#5c5038', 9);
  c.save();
  c.clip(win);
  c.fillStyle = gradient(c, 0, 76, 0, 264, ['#acc8c3', '#dde0b7', '#e1c788', '#b8bb8b']);
  c.fillRect(185, 66, 220, 205);
  ellipse(c, 291, 207, 35, 35, '#d5b774', '#5b573b', 1.5);
  ellipse(c, 291, 208, 27, 27, 'transparent', '#8b8350', 1);
  for (let i = 0; i < 9; i++) {
    const a = Math.PI + (i * Math.PI) / 8;
    path(
      c,
      `M${291 + Math.cos(a) * 35} ${207 + Math.sin(a) * 35}Q${291 + Math.cos(a) * 82} ${187 + Math.sin(a) * 56} ${291 + Math.cos(a) * 107} ${158 + Math.sin(a) * 81}`,
      undefined,
      '#5f6142',
      1.2,
    );
  }
  for (const y of [117, 148, 178])
    path(
      c,
      `M186 ${y}Q238 ${y - 17} 287 ${y - 7}Q350 ${y - 16} 406 ${y}`,
      undefined,
      '#606342',
      1.2,
    );
  c.restore();
  line(c, 188, 269, 404, 269, '#715c3d', 7);
  for (let i = 0; i < 31; i++) {
    const a = Math.PI + (i * Math.PI) / 30,
      x = 293 + Math.cos(a) * 107,
      y = 141 + Math.sin(a) * 79;
    c.save();
    c.translate(x, y);
    c.rotate(a - Math.PI / 2);
    rect(c, -3.1, -4, 6.2, 8, i % 3 ? '#cbb074' : '#659c96', 0, '#5f583b', 0.4);
    c.restore();
  }
  // A floral medallion frames the black cat independently of its head motion.
  ellipse(c, 302, 342, 42, 43, '#d1b05e', '#5c5032', 1.5);
  ellipse(c, 302, 342, 34, 35, '#a75642', '#5c5032', 1);
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8;
    line(
      c,
      302 + Math.cos(a) * 35,
      342 + Math.sin(a) * 36,
      302 + Math.cos(a) * 42,
      342 + Math.sin(a) * 43,
      '#5d5639',
      0.6,
    );
  }
  path(c, 'M407 319H600L596 331H412Z', '#ece3c1', '#49583a', 1.5);
  path(
    c,
    'M420 333Q420 350 435 346Q444 335 437 334M591 333Q596 350 580 346Q570 337 576 334',
    undefined,
    '#4e7759',
    4,
  );
  path(
    c,
    'M505 331V421Q505 440 482 440Q465 440 464 450M505 421Q505 440 529 440Q546 440 546 450M477 439Q460 421 474 415Q487 408 488 421M533 439Q551 421 537 415Q523 408 522 421',
    undefined,
    '#537857',
    4,
  );
  path(
    c,
    'M414 335Q456 336 474 362Q483 379 465 388Q449 393 448 379Q449 365 461 369M596 335Q554 336 536 362Q527 379 545 388Q561 393 562 379Q561 365 549 369M471 389Q505 401 539 389M414 447Q473 446 505 405Q537 446 596 447',
    undefined,
    '#537857',
    4,
  );
  rect(c, 698, 333, 43, 8, '#9e8055', 2, '#5a5038', 1);
  line(c, 703, 341, 691, 451, '#937647', 3);
  line(c, 735, 341, 746, 451, '#937647', 3);
  mosaicBorder(c);
  rect(c, 17, 466, 927, 56, '#83986d', 0, '#605c35', 1);
  text(c, 'THÉ DU CHAT NOIR', 481, 509, 33, '#f3e9ca', '"Patrick Hand SC"', 'center');
  for (const x of [104, 855])
    path(c, `M${x} 491q-28-30-40-12q-8 10 15 9q40-5 67 13q18 13 26 0`, undefined, '#e0cf92', 1.3);
}

function ukiyo(c: Ctx) {
  c.fillStyle = gradient(c, 0, 0, 0, 540, ['#aebbc0', '#e9d9a3', '#e0c799']);
  c.fillRect(0, 0, 960, 540);
  rect(c, 10, 10, 940, 520, 'transparent', 0, '#333c38', 1.8);
  rect(c, 11, 391, 938, 137, '#b8bc92');
  for (const y of [399, 425, 488]) line(c, 11, y, 949, y, '#456070', 2);
  for (let y = 397; y < 527; y += 3) line(c, 11, y, 949, y, '#879773', 0.3);
  line(c, 196, 426, 109, 488, '#677960', 0.6);
  line(c, 288, 488, 244, 528, '#677960', 0.6);
  rect(c, 56, 56, 45, 164, '#b65749', 0, '#353e37', 1.2);
  rect(c, 60, 60, 37, 156, 'transparent', 0, '#d58b66', 0.7);
  for (let i = 0; i < 3; i++)
    text(c, ['猫', 'と', '茶'][i], 78, 99 + i * 48, 35, '#2b3938', 'Georgia', 'center');
  rect(c, 63, 226, 28, 28, '#b36355');
  ellipse(c, 77, 243, 6, 5, '#efddb4');
  for (let i = 0; i < 3; i++) ellipse(c, 72 + i * 5, 233, 2, 2, '#efddb4');
  rect(c, 449, 61, 53, 172, '#8e9c72', 0, '#3a4437', 1.4);
  rect(c, 457, 83, 37, 126, '#e3dfc3');
  line(c, 446, 235, 506, 235, '#343d37', 3);
  path(c, 'M409 314H607L601 326H404Z', '#ad5844', '#293c43', 1.5);
  rect(c, 405, 326, 197, 8, '#263b3d');
  ellipse(c, 501, 332, 2.3, 2.3, '#d3b765');
  for (const x of [414, 588])
    path(
      c,
      `M${x} 334Q${x + 8} 392 ${x} 433Q${x - 3} 448 ${x - 9} 449H${x - 15}Q${x} 422 ${x - 8} 334Z`,
      '#283e3e',
    );
  ellipse(c, 443, 314, 24, 4, '#b7b99a', '#3b4c46', 0.6);
  for (let i = 0; i < 3; i++)
    ellipse(c, 430 + i * 11, 308, 6, 6, ['#ddd8af', '#d0c6a3', '#b5c2a2'][i], '#43544b', 0.6);
  rect(c, 706, 354, 105, 13, '#b45443', 0, '#2d403d', 1.5);
  line(c, 714, 367, 715, 444, '#4e5e49', 3);
  line(c, 803, 367, 801, 444, '#4e5e49', 3);
  rect(c, 825, 291, 51, 150, '#eadcaa', 0, '#3d4236', 2);
  path(c, 'M825 291Q847 217 876 291', undefined, '#423f35', 1.6);
  for (const x of [825, 837, 874]) line(c, x, 294, x, 450, '#3e4338', 1.4);
  line(c, 825, 375, 877, 375, '#3e4338', 1.4);
}

export function decoratedRoom(c: Ctx, id: 'gothic' | 'nouveau' | 'ukiyo') {
  let canvas = cache.get(id);
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const r = canvas.getContext('2d', { willReadFrequently: true })!;
    r.scale(2, 2);
    rect(r, 0, 0, 960, 540, '#eee2bc');
    if (id === 'gothic') gothic(r);
    else if (id === 'nouveau') nouveau(r);
    else ukiyo(r);
    textureShape(r, new Path2D('M0 0H960V540H0Z'), 'paper', 0.7);
    cache.set(id, canvas);
  }
  c.drawImage(canvas, 0, 0, 960, 540);
}

/** Moving details are independent paths layered over the cached architecture. */
export function decoratedMotion(c: Ctx, id: 'gothic' | 'nouveau' | 'ukiyo', time: number) {
  c.save();
  c.lineCap = 'round';
  c.lineJoin = 'round';
  if (id === 'ukiyo') {
    ellipse(c, 291, 171, 111, 110, '#7f3433', '#273c46', 2);
    ellipse(c, 291, 171, 106, 105, '#bcc7bb');
    c.save();
    c.beginPath();
    c.ellipse(291, 171, 104, 103, 0, 0, Math.PI * 2);
    c.clip();
    path(c, 'M262 224L328 167 391 246H262Z', '#3c5e7f', '#304450', 0.7);
    path(c, 'M300 192L328 167 354 195 340 190 334 198 326 189 317 198 313 190Z', '#eee9ce');
    const swell = Math.sin(time * 3.2) * 4,
      roll = Math.cos(time * 2.4) * 3,
      curl = Math.sin((time - 6.2) * 2.1) * 11;
    path(
      c,
      `M186 264Q176 ${188 + roll} 205 ${134 + roll}Q226 ${83 + swell} 276 ${74 + swell}Q322 ${55 + swell} 347 ${96 + roll + curl * 0.5}Q${363 + curl * 0.3} ${114 + roll + curl * 0.8} 350 ${143 + roll + curl}Q353 ${118 + roll + curl * 0.5} 329 ${111 + swell}Q303 ${102 + swell} 279 ${120 + swell}Q251 152 269 189Q290 220 322 224L392 283H186Z`,
      '#365a7b',
      '#243d57',
      1.2,
    );
    for (let i = 0; i < 12; i++)
      path(
        c,
        `M${190 + i * 6} 262Q${186 + i * 7} 168 ${236 + i * 5} ${102 + swell}Q${274 + i * 4} ${61 + swell} ${318 + i * 2} ${88 + roll}`,
        undefined,
        i % 2 ? '#9db5c0' : '#658ca4',
        1.4,
      );
    path(
      c,
      `M275 ${74 + swell}Q322 ${56 + swell} ${347 + curl * 0.4} ${96 + swell + curl * 0.5}Q${364 + curl * 0.3} ${119 + swell + curl * 0.8} 350 ${142 + swell + curl}Q359 ${121 + swell + curl * 0.5} 329 ${111 + swell}Q303 ${102 + swell} 279 ${120 + swell}L277 ${105 + swell} 270 ${99 + swell} 281 ${86 + swell}Z`,
      '#f5edce',
      '#2a4054',
      0.8,
    );
    for (const [i, [x, y, a]] of [
      [281, 86, -0.3],
      [294, 91, -0.1],
      [309, 99, 0.15],
      [322, 105, 0.35],
      [333, 113, 0.5],
      [341, 123, 0.7],
      [346, 134, 0.9],
    ].entries()) {
      c.save();
      c.translate(x + curl * i * 0.06, y + swell + curl * i * 0.12);
      c.rotate(a + Math.sin(time * 3 + i * 0.5) * 0.12);
      path(c, 'M-5-3Q-3 5 2 9Q5 14 0 18Q9 17 9 10Q8 2 4-4Z', '#f5edce', '#2a4054', 0.6);
      c.restore();
    }
    const rng = random(444);
    for (let i = 0; i < 65; i++)
      ellipse(
        c,
        275 + rng() * 79 + Math.sin(time * 3 + i * 0.7) * 4,
        91 + rng() * 72 + Math.cos(time * 2.5 + i) * 5,
        1 + rng() * 1.4,
        1 + rng() * 1.4,
        '#f5edce',
      );
    path(c, 'M290 273Q309 226 343 234Q376 240 382 260L391 280Z', '#496e8c');
    for (let i = 0; i < 7; i++)
      path(
        c,
        `M${291 + i * 7} 278Q${327 + i * 3} ${220 + roll} ${357 + i * 3} ${242 + swell}`,
        undefined,
        '#c1d0cd',
        1.3,
      );
    c.restore();

    // The fish's tail bends while its head stays anchored to the paper scroll.
    c.save();
    c.beginPath();
    c.rect(457, 83, 37, 126);
    c.clip();
    const tail = Math.sin(time * 5.4) * 3;
    path(
      c,
      `M469 119Q491 105 481 151Q474 169 ${467 + tail} 187L${459 + tail} 201 ${462 + tail} 181Q470 172 466 153Q456 139 469 119Z`,
      '#6691a1',
      '#486a7b',
      0.7,
    );
    for (let i = 0; i < 13; i++) path(c, `M469 ${126 + i * 4}q5 6 11 0`, undefined, '#d1d5be', 0.6);
    ellipse(c, 475, 121, 1, 1, '#243c42');
    c.restore();
    // Foam petals drift beyond the circular print, as in the reference.
    for (let i = 0; i < 9; i++) {
      const q = (time * 0.6 + i / 9) % 1;
      c.save();
      c.globalAlpha = Math.sin(q * Math.PI) * 0.8;
      ellipse(c, 340 + q * 73 + Math.sin(i * 2) * 9, 105 + q * 72 + i * 8, 1.5, 2.3, '#f5edce');
      c.restore();
    }
  } else if (id === 'nouveau') {
    c.save();
    c.clip(new Path2D('M196 266V139Q196 70 293 70Q395 70 395 139V266Z'));
    for (const [anchor, y] of [
      [214, 240],
      [243, 234],
      [278, 244],
      [328, 238],
      [360, 245],
    ]) {
      const x = anchor + Math.sin(time * 2.4 + anchor) * 1.8;
      line(c, anchor, y + 30, x, y - 15, '#638552', 1.1);
      path(
        c,
        `M${x} ${y + 11}q-19-12-18-26q18 0 18 26m0 3q18-14 18-28q-20 3-18 28Z`,
        '#8da776',
        '#566e4a',
        0.6,
      );
      path(c, `M${x} ${y - 10}q-12-12-7-23q10-7 14 0q4 13-7 23Z`, '#eee8c8', '#68754d', 0.6);
      ellipse(c, x - 8, y - 7, 7, 7, '#ad9cb5', '#756381', 0.5);
      ellipse(c, x + 8, y - 7, 7, 7, '#af9eb6', '#756381', 0.5);
    }
    c.restore();
    for (const side of [-1, 1]) {
      const x = side < 0 ? 81 : 881;
      path(
        c,
        `M${x} 449Q${x + side * 60 + Math.sin(time * 1.9) * 2} 350 ${x - side * 4 + Math.sin(time * 1.9) * 2} 284Q${x - side * 39 + Math.sin(time * 1.9) * 3} 191 ${x + side * 13 + Math.sin(time * 1.9) * 3} 103`,
        undefined,
        '#556944',
        2,
      );
      for (let i = 0; i < 4; i++) {
        const sway = Math.sin(time * 2.1 + i * 0.8 + side) * 3.5,
          xx = x + Math.sin(i * 1.8) * 30 + sway,
          yy = 107 + i * 75 + Math.cos(time * 1.4 + i) * 0.7;
        path(c, `M${x} 449Q${x + sway * 2} ${yy + 80} ${xx} ${yy}`, undefined, '#687b4c', 1.2);
        c.save();
        c.translate(xx, yy);
        c.rotate(sway * 0.035);
        c.translate(-xx, -yy);
        if (side < 0) flower(c, xx, yy, 22 - (i % 2) * 5, '#b97970', '#789057', 6);
        else {
          for (let j = 0; j < 5; j++) {
            c.save();
            c.translate(xx, yy);
            c.rotate((j * Math.PI * 2) / 5);
            path(c, 'M0 0Q-9-12 0-32Q9-12 0 0Z', '#f2e6c3', '#5d6644', 0.8);
            c.restore();
          }
          ellipse(c, xx, yy, 3, 3, '#b3ac6d');
        }
        c.restore();
        path(
          c,
          `M${x} ${yy + 23}Q${x + side * 32} ${yy + 6} ${x + side * 40} ${yy - 22}Q${x + side * 15} ${yy - 8} ${x} ${yy + 23}Z`,
          '#a6b589',
          '#62764d',
          0.6,
        );
      }
    }
  } else {
    margin(c, 86, 125, 371, 803, time);
    c.save();
    c.translate(Math.sin(time * 1.1) * 3, 0);
    path(c, 'M423 527Q405 523 404 530H434Q432 520 423 519Z', '#b9bcb0', '#4e4838', 0.7);
    ellipse(c, 422, 522, 12, 12, '#c2a267', '#5c4933', 0.8);
    for (let r = 2; r < 10; r += 2) {
      c.beginPath();
      c.arc(422, 522, r, 0.4, Math.PI * 1.85);
      c.strokeStyle = '#64513a';
      c.lineWidth = 0.5;
      c.stroke();
    }
    path(c, 'M423 523L439 500M429 526L445 505', undefined, '#584c34', 0.7);
    c.restore();
  }
  c.restore();
}

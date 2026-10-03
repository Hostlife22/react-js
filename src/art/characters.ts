import { EVENTS, clamp, lerp, progress } from '../timeline';
import { PALETTES } from './palettes';
import { ART, ellipse, gradient, line, path, random, rect, text, type Ctx } from './primitives';
import { modernCatPose } from './modern';
import { cupMotion } from './figures';

const FIGURE = {
  face: 'M656 175 C679 167 704 183 703 211 Q700 232 686 245 Q671 255 654 244 L644 232 L639 231 L641 222 L628 218 L641 205 Q638 185 656 175Z',
  torso: 'M667 253 Q694 248 707 274 L714 351 Q690 368 650 353 L655 289Z',
  skirt:
    'M654 345 Q687 359 711 346 Q716 366 694 379 L650 389 646 435 608 436 612 382 Q613 356 654 345Z',
  hair: 'M646 184 Q651 162 678 165 Q711 166 716 197 L709 229 690 244 681 222 686 194 Q664 191 646 184Z',
};

function material(c: Ctx, d: string, color: string, id: string, seed = 13) {
  const p = PALETTES[id],
    shape = new Path2D(d);
  if (id === 'renaissance' || id === 'cgi') {
    c.fillStyle = gradient(c, 610, 220, 719, 390, [color, '#e0c898', color]);
    c.fill(shape);
  } else path(c, d, color, p.outline ? p.ink : undefined, p.outline);
  if (
    id === 'ukiyo' ||
    id === 'post' ||
    id === 'impression' ||
    id === 'nouveau' ||
    id === 'greek'
  ) {
    c.save();
    c.clip(shape);
    const rng = random(seed);
    if (id === 'ukiyo') {
      for (let x = 596; x < 750; x += 15)
        for (let y = 180; y < 450; y += 18) {
          c.globalAlpha = 0.7;
          line(c, x, y, x + 6, y - 8, '#ded9ba', 0.9);
          line(c, x, y, x - 6, y - 8, '#ded9ba', 0.9);
          ellipse(c, x, y - 11, 2, 3, '#ebe0bc');
        }
    } else if (id === 'nouveau') {
      for (let i = 0; i < 14; i++)
        path(
          c,
          `M${620 + i * 8} 449 Q${640 + i * 6} 336 ${660 + i * 4} 244`,
          undefined,
          '#b28c62',
          0.6,
        );
    } else if (id === 'greek') {
      for (let i = 0; i < 16; i++)
        path(
          c,
          `M${622 + i * 6} 439 Q${644 + i * 5} 343 ${653 + i * 4} 273`,
          undefined,
          p.accent,
          0.9,
        );
    } else
      for (let i = 0; i < 450; i++) {
        const x = 600 + rng() * 150,
          y = 163 + rng() * 281;
        line(
          c,
          x,
          y,
          x + (rng() - 0.5) * 9,
          y + 5 + rng() * 15,
          i % 3 === 0 ? p.accent : i % 3 === 1 ? '#e9dab1' : p.ink,
          0.8 + rng() * 2,
        );
      }
    c.restore();
    if (p.outline) path(c, d, undefined, p.ink, p.outline);
  }
}

function sphere(c: Ctx, x: number, y: number, r: number, color: string) {
  const g = c.createRadialGradient(x - r * 0.38, y - r * 0.45, r * 0.05, x, y, r);
  g.addColorStop(0, '#f3e5bc');
  g.addColorStop(0.23, color);
  g.addColorStop(1, '#283e51');
  c.fillStyle = g;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
}

export function cupPosition(time: number, id: string) {
  return cupMotion(time, id);
}

export function drawHuman(c: Ctx, id: string, time: number) {
  const p = PALETTES[id],
    cup = cupPosition(time, id);
  const surprise = id === 'modern' ? progress(time, EVENTS.swat - 0.1, EVENTS.swat + 0.18) : 0;
  const breathe = Math.sin(time * 2) * 0.7;
  c.save();
  c.translate(0, breathe);
  if (id === 'cave') {
    path(
      c,
      'M654 182Q678 167 695 187Q711 208 690 236L672 247 652 238 643 220 633 217 644 207Q640 192 654 182Z',
      p.skin,
      p.ink,
      2,
    );
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 1.3 + Math.PI * 0.7;
      line(
        c,
        674 + Math.cos(a) * 31,
        212 + Math.sin(a) * 35,
        674 + Math.cos(a) * 38,
        212 + Math.sin(a) * 42,
        p.ink,
        1.2,
      );
    }
    ellipse(c, 649, 203, 2, 2, p.ink);
    path(c, 'M642 227q6 3 11 0M643 196q6-4 12-1', undefined, p.ink, 1.1);
    path(c, 'M669 248 L693 253 705 354 655 355Z', p.skin, p.ink, 2.6);
    path(
      c,
      'M657 351 L704 351 703 374 648 381 636 435 606 437 616 425 623 363Z',
      p.robe,
      p.ink,
      2.6,
    );
    line(c, 672, 272, 618, 316, p.skin, 14);
    line(c, 618, 316, cup.x + 17, cup.y - 10, p.skin, 12);
    line(c, 672, 272, 618, 316, p.ink, 1);
    line(c, 618, 316, cup.x + 17, cup.y - 10, p.ink, 1);
    c.restore();
    return;
  }
  if (id === 'bauhaus') {
    rect(c, 666, 265, 23, 92, p.ink);
    rect(c, 691, 276, 15, 83, '#355b7a');
    line(c, 687, 362, 643, 374, p.ink, 17);
    line(c, 643, 374, 628, 435, p.ink, 17);
    line(c, 617, 438, 643, 438, p.ink, 7);
    ellipse(c, 676, 214, 34, 34, p.skin, p.ink, 2);
    path(c, 'M676 180 A34 34 0 0 1 676 248Z', p.ink);
    rect(c, 658, 201, 6, 15, p.accent);
    line(c, 650, 222, 670, 222, p.ink, 2);
    line(c, 675, 281, 622, 312, p.ink, 9);
    line(c, 622, 312, cup.x + 19, cup.y - 9, p.ink, 9);
    ellipse(c, 674, 282, 6, 6, p.paper, p.ink);
    ellipse(c, 622, 312, 5, 5, p.paper, p.ink);
    c.restore();
    return;
  }
  if (id === 'cubism') {
    path(c, 'M665 176 L697 183 710 209 684 245 649 241 627 217Z', p.skin, p.ink, 1.5);
    path(c, 'M670 177 L660 217 685 244 709 208Z', '#ada184', p.ink, 1);
    path(c, 'M665 176 L695 181 707 205 681 187Z', p.hair);
    path(c, 'M656 206 L640 210 653 215Z', '#ede0b4', p.ink);
    ellipse(c, 648, 211, 2, 3, p.ink);
    path(c, 'M671 218 L658 214 658 229Z', '#918972');
    line(c, 645, 233, 663, 231, p.ink, 1.5);
    path(c, 'M665 252 L702 261 715 351 673 370 647 354Z', p.robe, p.ink, 2);
    path(c, 'M672 263 L694 352 647 354Z', '#9b9c88');
    path(c, FIGURE.skirt, '#bcb193', p.ink, 2);
    line(c, 629, 383, 619, 438, p.ink, 2);
    path(
      c,
      `M668 272 L636 303 ${cup.x + 22} ${cup.y - 18} ${cup.x + 15} ${cup.y - 6} 629 318 657 290Z`,
      p.skin,
      p.ink,
      1.5,
    );
    c.restore();
    return;
  }
  if (id === 'cgi') {
    line(c, 691, 345, 644, 379, '#647fb9', 25);
    line(c, 644, 379, 628, 428, '#647fb9', 22);
    sphere(c, 644, 379, 14, '#a5a5c8');
    rect(c, 604, 429, 45, 12, '#283f70', 6);
    line(c, 689, 273, 690, 345, '#bd4f80', 32);
    sphere(c, 688, 273, 17, '#bd4f80');
    sphere(c, 688, 346, 15, '#bd4f80');
    line(c, 677, 280, 623, 307, '#cba853', 12);
    line(c, 623, 307, cup.x + 19, cup.y - 8, '#cba853', 12);
    sphere(c, 623, 307, 9, '#e6c778');
    sphere(c, cup.x + 17, cup.y - 8, 8, '#e6c778');
    sphere(c, 675, 212, 35, '#899bc4');
    ellipse(c, 647, 210, 4, 6, '#fff4b7');
    ellipse(c, 664, 210, 4, 6, '#fff4b7');
    ellipse(c, 646, 211, 2, 3, '#30394e');
    ellipse(c, 663, 211, 2, 3, '#30394e');
    ellipse(c, 653, 226, 7, 2, '#353951');
    sphere(c, 712, 213, 15, '#7457a7');
    c.restore();
    return;
  }
  // The same rig carries the gesture through changing media and costumes.
  const pants = ['modern', 'impression', 'post', 'pixel'].includes(id);
  if (pants) {
    material(
      c,
      FIGURE.skirt,
      id === 'modern' ? '#303455' : id === 'post' ? '#487c91' : p.accent,
      id,
      18,
    );
    path(
      c,
      'M611 427 Q626 429 643 428 L647 441 598 441 Q593 431 611 427Z',
      id === 'modern' ? '#faf1da' : p.hair,
      p.outline ? p.ink : undefined,
      p.outline,
    );
    if (id === 'modern') rect(c, 598, 439, 49, 5, '#d98a79', 2);
  } else {
    material(c, FIGURE.skirt, id === 'renaissance' ? p.accent : p.robe, id, 18);
    path(
      c,
      'M608 428 Q623 428 635 435 L635 443 599 443 Q594 435 608 428Z',
      p.hair,
      p.outline ? p.ink : undefined,
      p.outline,
    );
  }
  if (id === 'gothic') {
    ellipse(c, 676, 215, 49, 49, '#d9ba59', '#8d7040', 1.3);
    ellipse(c, 676, 215, 43, 43, 'transparent', '#eee0a8', 1);
  }
  if (id === 'nouveau') {
    ellipse(c, 678, 215, 62, 67, '#c9b686', p.ink, 2);
    ellipse(c, 678, 215, 53, 58, '#eadbb4', p.ink, 1);
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      ellipse(
        c,
        678 + Math.cos(a) * 59,
        215 + Math.sin(a) * 64,
        4,
        4,
        i % 2 ? p.accent : '#839b70',
        p.ink,
        0.5,
      );
    }
    path(
      c,
      'M686 185 Q730 200 713 261 Q700 273 704 290 L673 280 Q718 248 682 232Z',
      p.hair,
      p.ink,
      1,
    );
  } else {
    path(c, FIGURE.hair, p.hair);
    if (!['egypt', 'gothic'].includes(id)) ellipse(c, 712, 211, 18, 18, p.hair);
  }
  material(c, FIGURE.torso, p.robe, id);
  path(
    c,
    'M662 239 L662 259 Q675 270 684 259 L680 237Z',
    p.skin,
    p.outline ? p.ink : undefined,
    p.outline,
  );
  if (id === 'renaissance') {
    c.fillStyle = gradient(c, 632, 196, 706, 238, ['#e8d2ad', '#ceb088', '#9d7756']);
    c.fill(new Path2D(FIGURE.face));
  } else path(c, FIGURE.face, p.skin, p.outline ? p.ink : undefined, p.outline);
  if (id === 'egypt') {
    path(c, 'M649 175 Q678 157 701 177 L713 261 684 265 677 211 682 182Z', p.hair, p.ink, 1.5);
    for (let i = 0; i < 7; i++)
      path(c, `M${684 + i * 3} 184 L${697 + i * 2} 258`, undefined, '#ad9760', 1);
    path(c, 'M648 176 Q672 151 696 167 L703 175Z', '#e8debc', p.ink, 1);
    ellipse(c, 676, 160, 8, 18, '#bc5140', p.ink, 1);
    path(c, 'M656 253 Q674 278 694 254 L698 270 Q675 293 651 270Z', '#cca74c', p.ink, 1);
    path(c, 'M654 267 Q674 285 695 266', undefined, p.accent, 4);
    ellipse(c, 685, 231, 4, 6, '#ddbc55', p.ink, 1);
  } else if (id === 'gothic') {
    path(c, 'M645 179 Q668 159 692 174 L700 219 688 243', undefined, '#eee2c7', 5);
    path(c, 'M685 268 L701 269 706 350 687 359Z', p.accent, p.ink, 1);
  } else if (id === 'ukiyo') {
    path(c, 'M644 185 Q658 158 685 169 L703 193 687 199 680 184Z', p.hair, p.ink, 1);
    ellipse(c, 700, 184, 21, 13, p.hair);
    line(c, 688, 174, 722, 165, '#c88d42', 3);
    line(c, 695, 176, 720, 176, '#d5b354', 2);
    path(c, 'M660 256 L677 278 693 257 706 279 680 298 653 279Z', '#ddcba8', p.ink, 1);
  } else if (id === 'post') {
    ellipse(c, 674, 178, 52, 9, '#e5c66c', p.ink, 2);
    path(c, 'M646 173 Q647 149 680 149 Q701 151 704 173Z', '#d8b45b', p.ink, 2);
    line(c, 648, 168, 705, 168, '#725e44', 5);
  } else if (id === 'modern') {
    path(c, 'M645 183 Q646 161 674 167 Q697 174 692 194 L670 205 653 196Z', p.hair);
    ellipse(c, 707, 197, 18, 18, p.hair);
    path(c, 'M656 174 Q690 155 703 186', undefined, '#f8eed9', 7);
    rect(c, 687, 185, 14, 29, '#e3b448', 6);
    rect(c, 695, 185, 11, 30, '#c6953b', 5);
    ellipse(c, 651, 222, 8, 7, '#d4a0b5');
  }
  const eyeOpen = 0.87 + 0.13 * Math.sin(time * 1.7);
  ellipse(c, 647, 207, 2.8, 3 * eyeOpen, p.ink);
  path(c, 'M641 199 Q647 196 652 198', undefined, p.ink, id === 'pop' ? 2 : 1.2);
  if (surprise > 0.1) ellipse(c, 644, 234, 4 + surprise * 1.5, 1 + surprise * 5, p.ink);
  else
    path(
      c,
      'M643 232 Q648 234 653 230',
      undefined,
      id === 'ukiyo' || id === 'pop' ? '#a35348' : p.ink,
      1.2,
    );
  // Back arm rests on the lap; the front arm follows the cup, then reacts to the cat.
  line(c, 700, 281, 702, 327, p.robe, 18);
  line(c, 702, 327, 671, 348, p.robe, 17);
  ellipse(c, 671, 348, 10, 6, p.skin);
  const handX = id === 'modern' ? lerp(532, 614, surprise) : cup.x + 19;
  const handY = id === 'modern' ? lerp(331, 290, surprise) : cup.y - 10;
  const elbowX = lerp(620, 640, surprise),
    elbowY = lerp(307, 317, surprise);
  path(
    c,
    `M666 278 Q651 293 ${elbowX} ${elbowY} Q${elbowX - 8} ${elbowY + 5} ${elbowX - 3} ${elbowY + 12} L${handX + 4} ${handY + 8} L${handX + 4} ${handY - 3} L${elbowX + 7} ${elbowY - 5} L675 280Z`,
    p.robe,
    p.outline ? p.ink : undefined,
    p.outline,
  );
  ellipse(c, handX, handY, 10, 6, p.skin, p.outline ? p.ink : undefined, p.outline);
  if (id === 'pop') {
    for (let i = 0; i < 40; i++) {
      const x = 663 + (i % 5) * 9,
        y = 280 + Math.floor(i / 5) * 8;
      ellipse(c, x, y, 1, 1, '#6f3248');
    }
    line(c, 639, 261, 654, 275, '#eed6b5', 4);
  }
  if (surprise > 0.5) {
    for (let i = 0; i < 3; i++) {
      const x = 648 + i * 12;
      line(c, x, 160, x + (i - 1) * 5, 149, '#be715f', 2);
    }
  }
  c.restore();
}

export function catPose(time: number, id: string) {
  if (id !== 'modern') return { x: ART.cat.x, y: ART.cat.y, rotation: 0, scale: 1, paw: 0 };
  return modernCatPose(time);
}

export function drawCat(c: Ctx, id: string, time: number) {
  const p = PALETTES[id],
    pose = catPose(time, id),
    tail = Math.sin(time * 3) * 9;
  c.save();
  c.translate(pose.x, pose.y);
  c.rotate(pose.rotation);
  c.scale(1, pose.scale);
  ellipse(c, 9, 2, 46, 5, id === 'modern' ? '#c8c09f' : '#25221c25');
  path(
    c,
    `M24-12 C88 2 84 ${-56 + tail} 62 ${-49 + tail} Q50 ${-39 + tail} 57 ${-33 + tail}`,
    undefined,
    p.cat,
    11,
  );
  if (p.outline)
    path(
      c,
      `M24-12 C88 2 84 ${-56 + tail} 62 ${-49 + tail} Q50 ${-39 + tail} 57 ${-33 + tail}`,
      undefined,
      p.ink,
      p.outline,
    );
  if (id === 'bauhaus') {
    ellipse(c, 9, -35, 31, 31, '#285b80', p.ink, 2);
    path(c, 'M-19-77 L-18-112-2-94 15-112 18-77Z', p.accent, p.ink, 2);
    ellipse(c, -8, -91, 3, 4, p.ink);
    ellipse(c, 8, -91, 3, 4, p.ink);
    line(c, -24, -91, 21, -91, p.ink, 1);
    rect(c, -17, -4, 57, 5, p.ink);
    c.restore();
    return;
  }
  if (id === 'cubism') {
    path(c, 'M-22-13 L-25-55-8-85 25-66 39-18 20 0-24 0Z', p.cat, p.ink, 2);
    path(c, 'M-10-58 L-26-89-24-116-7-104 7-116 24-99 18-70Z', '#c6bc9d', p.ink, 1.5);
    path(c, 'M-7-104 L5-85 18-102 18-70-2-74Z', '#898c75', p.ink, 1);
    ellipse(c, -15, -91, 3, 3, p.ink);
    ellipse(c, 4, -90, 3, 4, p.ink);
    line(c, -2, -88, -7, -79, p.ink, 1.5);
    c.restore();
    return;
  }
  if (id === 'cgi') {
    sphere(c, 9, -37, 31, p.cat);
    sphere(c, -4, -88, 26, p.cat);
    path(c, 'M-26-102 L-26-121-11-109Z', p.cat);
    path(c, 'M8-109 L20-122 23-100Z', p.cat);
    sphere(c, -12, -87, 5, '#8ab2c4');
    sphere(c, 7, -87, 5, '#8ab2c4');
    sphere(c, -17, -8, 11, p.cat);
    sphere(c, 24, -8, 11, p.cat);
    c.restore();
    return;
  }
  const body = path(
    c,
    'M-16-74 Q-35-49-27-17 Q-29 0-11 0 L34 0 Q42-8 33-29 Q27-49 14-70Z',
    p.cat,
    p.outline ? p.ink : undefined,
    p.outline,
  );
  if (id === 'renaissance') {
    c.save();
    c.clip(body);
    c.fillStyle = gradient(c, -25, -40, 35, -40, ['#eee6cd', p.cat, '#9e9a7b']);
    c.fillRect(-35, -90, 80, 100);
    c.restore();
  }
  if (id === 'ukiyo') {
    path(c, 'M17-62 Q42-51 31-22 L11-34Z', '#bc7953', p.ink, 0.8);
    path(c, 'M-25-39 Q-13-47-5-36 L-11-15-27-20Z', '#41474a');
  }
  if (id === 'modern' || id === 'impression' || id === 'post' || id === 'ukiyo') {
    path(c, 'M-11-61 Q-23-47-18-26 Q-14-9-6-4 L5-6 Q11-23 5-44Z', '#f3e5c4');
  }
  ellipse(c, -5, -89, 27, 24, p.cat, p.outline ? p.ink : undefined, p.outline);
  path(c, 'M-30-96 L-30-119-13-108Z', p.cat, p.outline ? p.ink : undefined, p.outline);
  path(c, 'M7-109 L22-119 21-93Z', p.cat, p.outline ? p.ink : undefined, p.outline);
  path(c, 'M-26-102 L-25-112-18-106Z', '#ce8878');
  path(c, 'M12-107 L19-112 17-103Z', '#ce8878');
  const blink = Math.sin(time * 1.71 + 1) > 0.992;
  const ancient = id === 'cave' || id === 'greek';
  if (id === 'egypt' || id === 'greek' || id === 'pop' || id === 'post') {
    ellipse(c, -15, -90, 6, 7, ancient ? p.accent : '#d8d29b', p.ink, 1);
    ellipse(c, 4, -90, 6, 7, ancient ? p.accent : '#d8d29b', p.ink, 1);
  }
  if (blink) {
    line(c, -19, -89, -12, -89, p.ink, 1.6);
    line(c, 0, -89, 6, -89, p.ink, 1.6);
  } else {
    ellipse(c, -15, -90, 2.8, 3.9, p.ink);
    ellipse(c, 4, -90, 2.8, 3.9, p.ink);
    if (id === 'modern') {
      ellipse(c, -14, -91, 1, 1, '#fff3d7');
      ellipse(c, 5, -91, 1, 1, '#fff3d7');
    }
  }
  path(c, 'M-8-83 L-1-83-4-79Z', ancient ? p.accent : '#9d6257');
  path(c, 'M-4-79 Q-9-72-13-78 M-4-79 Q2-73 5-79', undefined, ancient ? p.accent : p.ink, 1.1);
  if (!ancient)
    for (let i = 0; i < 3; i++) {
      line(c, -15, -80 + i * 4, -34, -84 + i * 7, id === 'modern' ? '#f7edce' : p.ink, 0.8);
      line(c, 8, -80 + i * 4, 29, -84 + i * 7, id === 'modern' ? '#f7edce' : p.ink, 0.8);
    }
  const stripe = id === 'modern' ? '#c18b42' : id === 'post' ? '#996734' : p.ink;
  if (!['greek', 'cave', 'gothic', 'renaissance', 'nouveau'].includes(id)) {
    for (let i = 0; i < 3; i++) path(c, `M${-18 + i * 9}-108 l3 8 3-8`, undefined, stripe, 1.8);
    for (let i = 0; i < 3; i++) path(c, `M20 ${-49 + i * 12} q10 4 12 10`, undefined, stripe, 2);
  }
  if (id === 'egypt' || id === 'nouveau') {
    path(
      c,
      'M-21-65 Q-4-54 16-65 L18-59 Q-4-48-24-58Z',
      id === 'egypt' ? '#b55443' : '#b77848',
      p.ink,
      0.8,
    );
    ellipse(c, -3, -56, 3, 4, '#e5c45d');
  }
  ellipse(
    c,
    -15,
    -3,
    15,
    5,
    id === 'modern' || id === 'ukiyo' ? '#f3e9d4' : p.cat,
    p.outline ? p.ink : undefined,
    p.outline,
  );
  ellipse(
    c,
    22,
    -3,
    14,
    5,
    id === 'modern' || id === 'ukiyo' ? '#f3e9d4' : p.cat,
    p.outline ? p.ink : undefined,
    p.outline,
  );
  if (pose.paw > 0) {
    const px = lerp(-14, -71, pose.paw),
      py = lerp(-28, -35, pose.paw);
    path(c, `M-12-51 Q-23-44 ${px} ${py} Q${px - 7} ${py + 9} ${px + 5} ${py + 12} L-5-31Z`, p.cat);
    ellipse(c, px, py + 5, 9, 7, '#f4e8c8');
  }
  c.restore();
}

export function drawCup(c: Ctx, id: string, time: number) {
  const p = PALETTES[id],
    pos = cupPosition(time, id);
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

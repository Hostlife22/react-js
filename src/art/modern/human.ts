import { EVENTS } from '../../timeline';
import { lerp, progress } from '../../animation/math';
import { ellipse, line, path, rect, type Ctx } from '../primitives';
import { COLORS as C, printedShape as shape } from './materials';
import { blink } from '../../animation/blink';

function hand(c: Ctx, x: number, y: number, open: number) {
  c.save();
  c.translate(x, y);
  c.rotate(-0.1 - open * 0.4);
  if (open > 0.2) {
    shape(
      c,
      'M-4 10 Q-13 4-13-2 L-23-10 Q-27-18-20-17 L-10-11 L-15-23 Q-17-30-11-29 L-4-16 L-5-31 Q-5-37 1-34 L4-19 L7-31 Q9-37 13-31 L12-16 Q21-24 23-18 L16-6 Q18 6 7 11Z',
      C.purple,
      0.6,
    );
  } else {
    shape(
      c,
      'M-13-2 Q-13-8-6-10 L8-10 Q16-8 16-3 Q14 2 7 1 L-3 0 Q-1 5 8 5 Q13 9 6 12 L-4 12 Q-15 10-13-2Z',
      C.purple,
      0.5,
    );
    path(c, 'M-3-5 H10 M-4-1 H10', undefined, C.purpleDark, 0.7);
  }
  c.restore();
}

export function drawModernHuman(c: Ctx, time: number) {
  const notice = progress(time, EVENTS.land - 0.1, EVENTS.land + 0.26);
  const shock = progress(time, EVENTS.swat - 0.035, EVENTS.swat + 0.18);
  const settle = progress(time, 14.0, 14.65),
    reaction = notice * 0.35 + shock * 0.65;
  c.save();
  c.translate(0, Math.sin(time * 2.4) * 0.65);
  // Both legs have visible calf, sock, shoe and sole; the thigh bends naturally.
  shape(
    c,
    'M674 350Q723 346 723 370Q724 392 646 391L620 427Q613 441 597 435Q583 430 589 413L615 373Q625 353 647 351Z',
    C.navy,
    0.65,
  );
  shape(c, 'M637 376Q614 383 606 412Q606 440 590 440Q574 439 580 418L597 374Z', '#34306d', 0.7);
  rect(c, 590, 423, 14, 18, C.purple, 3);
  rect(c, 610, 423, 15, 18, '#c9b2e7', 3);
  shape(c, 'M608 438Q615 432 625 437L633 449H591Q585 443 594 442Z', C.coral, 0.5);
  shape(c, 'M591 437Q599 434 607 443L609 449H566Q563 441 575 440Z', C.cream, 0.5);
  rect(c, 566, 448, 44, 4, C.coral, 2);
  rect(c, 593, 448, 41, 4, C.coralDark, 2);
  line(c, 574, 440, 584, 440, '#ded1b5', 1);
  // Upper body leans away after the cat lands. Rotation has a hip pivot.
  c.translate(689, 371);
  c.rotate(-reaction * 0.035);
  c.translate(-689, -371);
  shape(
    c,
    'M675 214 Q701 207 716 235 Q734 275 731 375 Q698 384 654 344 L654 243 Q655 221 675 214Z',
    C.coral,
    0.82,
  );
  shape(c, 'M711 235 Q731 278 730 375 L716 379 Q719 312 705 246Z', C.coralDark, 0.8);
  path(c, 'M665 365 Q690 375 716 369 M704 286 Q711 294 713 313', undefined, '#d66363', 1.2);
  // Back sleeve and a second hand move independently of the front arm.
  const backX = lerp(685, 648, shock),
    backY = lerp(350, 264, shock);
  line(c, 712, 244, 716, 301, '#f58c86', 33);
  line(c, 716, 301, backX, backY, '#f58c86', 27);
  hand(c, backX, backY, shock);
  // Neck, head, ears, face and hair remain separate parts.
  shape(c, 'M664 195 L685 198 L686 220 Q674 232 661 219Z', C.purple, 0.65);
  shape(c, 'M661 205 Q672 215 685 210 L685 220 Q673 224 666 219Z', C.purpleDark, 0.5);
  path(c, 'M658 218 Q670 230 688 218', undefined, C.coralDark, 6);
  c.save();
  c.translate(0, -40);
  c.translate(674, 235);
  c.rotate(-reaction * 0.07);
  c.translate(-674, -235);
  shape(
    c,
    'M645 181 Q663 160 690 177 Q708 193 696 223 Q686 249 659 246 Q645 244 640 228 L636 218 L627 213 Q624 209 632 203 L641 191Z',
    C.purple,
    0.62,
  );
  shape(
    c,
    'M675 170 Q711 174 710 209 Q707 233 686 245 L683 214 690 201 Q675 197 664 185Z',
    C.navy,
    0.75,
  );
  shape(c, 'M643 182 Q641 159 664 151 Q690 145 706 169 L705 189 Q677 175 643 182Z', C.navy, 0.7);
  ellipse(c, 707, 171, 20, 20, C.navy);
  ellipse(c, 707, 175, 13, 15, '#302d69');
  ellipse(c, 650, 222, 8.5, 8, '#d897b4');
  const eye = blink(time);
  ellipse(c, 649, 200, 5.1, eye * (4.8 + reaction * 1.8), C.navy);
  ellipse(c, 650.5, 198.4, 1.65, eye * 1.65, C.cream);
  path(
    c,
    `M643 ${190 - reaction * 3} Q650 ${188 - reaction * 4} 654 ${190 - reaction * 3}`,
    undefined,
    C.navy,
    1.7,
  );
  if (reaction > 0.25) {
    ellipse(c, 646, 233, 3.5 + reaction * 1.6, 3 + reaction * 4, C.navy);
    ellipse(c, 647, 235, 2.2, 2, C.coralDark);
  } else path(c, 'M642 233 Q647 237 653 233', undefined, '#674889', 1.5);
  path(c, 'M653 164 Q686 143 698 181', undefined, C.cream, 5.5);
  rect(c, 690, 176, 18, 39, '#d79720', 8);
  rect(c, 686, 179, 15, 34, C.yellow, 7);
  rect(c, 689, 184, 7, 22, '#f3cd66', 4);
  c.restore();
  // The forearm follows a two-bone rig instead of a narrow triangular wedge.
  const catchCat = progress(time, EVENTS.land - 0.15, EVENTS.land + 0.06),
    sitCat = progress(time, EVENTS.land + 0.11, EVENTS.land + 0.36);
  const hx = lerp(lerp(527, 564, catchCat), 618, sitCat) - shock * 4 - settle * 3,
    hy = lerp(lerp(313, 304, catchCat), 274, sitCat) - shock * 4 + settle * 7;
  const ex = lerp(648, 690, notice),
    ey = lerp(307, 299, notice);
  line(c, 689, 240, ex, ey, C.coralDark, 31);
  line(c, ex, ey, hx + 12, hy, C.coral, 26);
  ellipse(c, ex, ey, 14, 14, C.coral);
  line(c, lerp(ex, hx + 12, 0.9), lerp(ey, hy, 0.9), hx + 9, hy, '#f29187', 28);
  hand(c, hx, hy, shock);
  if ((shock > 0.2 && shock < 1) || (notice > 0.1 && notice < 0.98)) {
    c.globalAlpha = Math.sin((reaction - 0.1) * Math.PI) * 0.8;
    for (let i = 0; i < 3; i++) line(c, 638 + i * 13, 151, 633 + i * 16, 142, C.coralDark, 2);
    c.globalAlpha = 1;
  }
  c.restore();
}

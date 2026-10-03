import { progress } from '../../animation/math';
import { text, type Ctx } from '../primitives';
import { COLORS } from './materials';
import { drawModernRoom } from './room';
import { drawModernHuman } from './human';
import { drawModernCat } from './cat';
import { drawModernCup } from './cup';

export function drawModern(c: Ctx, time: number) {
  drawModernRoom(c, time);
  drawModernHuman(c, time);
  drawModernCat(c, time);
  drawModernCup(c, time);
  c.save();
  c.globalAlpha = progress(time, 14.1, 14.65);
  text(c, "Times change. Cats don't.", 912, 511, 18, COLORS.navy, '"Outfit"', 'right');
  c.restore();
}

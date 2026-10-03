import { armJoint } from '../animation/rig';
import { cupMotion } from '../animation/cup';
import { drawCup } from './cup';
import { drawHuman } from './geometricHuman';
import { drawFigure } from './historical/human';
import { drawHistoricalCat } from './historical/cat';
import { drawPaintedCat, drawPaintedFigure } from './painted';
import { drawRetroCat, drawRetroFigure } from './retro3d';
import { drawStyledCat, hasStyledCat } from './styledCats';
import type { Ctx } from './primitives';

type Placement = { anchor: [number, number]; scale: [number, number]; origin: [number, number] };
const personPlacement: Placement = { anchor: [681, 448], scale: [1.06, 1.18], origin: [681, 438] };
const catPlacement: Placement = { anchor: [280, 450], scale: [1.2, 1.1], origin: [317, 438] };
const retroCatPlacement: Placement = { ...catPlacement, scale: [1.1, 1.1] };

function drawPlaced(c: Ctx, placement: Placement, draw: () => void) {
  c.save();
  try {
    c.translate(...placement.anchor);
    c.scale(...placement.scale);
    c.translate(-placement.origin[0], -placement.origin[1]);
    draw();
  } finally {
    c.restore();
  }
}

export function drawSceneActors(c: Ctx, id: string, time: number) {
  if (id === 'renaissance') {
    drawPaintedFigure(c, time, cupMotion(time, id));
    drawPaintedCat(c, time);
    return;
  }

  drawPlaced(c, personPlacement, () => {
    if (id === 'cgi') drawRetroFigure(c, time, cupMotion(time, id), armJoint);
    else if (id === 'cubism' || id === 'bauhaus' || id === 'cave') drawHuman(c, id, time);
    else drawFigure(c, id, time);
    drawCup(c, id, time);
  });
  drawPlaced(c, id === 'cgi' ? retroCatPlacement : catPlacement, () => {
    if (id === 'cgi') drawRetroCat(c, time);
    else if (hasStyledCat(id)) drawStyledCat(c, id, time);
    else drawHistoricalCat(c, id, time);
  });
}

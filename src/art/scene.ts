import { background } from './backgrounds';
import { drawCup } from './cup';
import { environmentMotion } from './environment';
import { ART, type Ctx } from './primitives';
import { drawModern } from './modern';
import { atmosphere } from './scenery';
import { paintedRoom, renaissanceFlight } from './classicRoom';
import { impastoRoom, impastoMotion } from './impastoRoom';
import { decoratedRoom, decoratedMotion } from './decoratedRooms';
import { finishMedia } from './media';
import { drawSceneActors } from './actors';

type RoomLayers = {
  drawStatic: (c: Ctx) => void;
  drawMotion: (c: Ctx, time: number) => void;
};

function roomFor<Id extends string>(
  id: Id,
  drawStatic: (c: Ctx, id: Id) => void,
  drawMotion: (c: Ctx, id: Id, time: number) => void,
): RoomLayers {
  return { drawStatic: (c) => drawStatic(c, id), drawMotion: (c, time) => drawMotion(c, id, time) };
}

const roomLayers: Partial<Record<string, RoomLayers>> = {
  renaissance: roomFor('renaissance', paintedRoom, environmentMotion),
  post: roomFor('post', impastoRoom, impastoMotion),
  impression: roomFor('impression', impastoRoom, impastoMotion),
  gothic: roomFor('gothic', decoratedRoom, decoratedMotion),
  nouveau: roomFor('nouveau', decoratedRoom, decoratedMotion),
  ukiyo: roomFor('ukiyo', decoratedRoom, decoratedMotion),
};

export function drawScene(c: Ctx, id: string, time: number) {
  if (id === 'modern') {
    drawModern(c, time);
    return;
  }
  const room = roomLayers[id];
  if (room) {
    room.drawStatic(c);
    room.drawMotion(c, time);
  } else {
    c.drawImage(background(id), 0, 0, ART.width, ART.height);
    environmentMotion(c, id, time);
  }
  if (id === 'cgi') {
    c.save();
    c.beginPath();
    c.rect(0, 443, 960, 97);
    c.clip();
    c.globalAlpha = 0.18;
    c.translate(0, 610);
    c.scale(1, -0.38);
    drawSceneActors(c, id, time);
    c.restore();
  }
  drawSceneActors(c, id, time);
  if (id === 'renaissance') drawCup(c, id, time);
  atmosphere(c, id, time);
  if (id === 'renaissance') renaissanceFlight(c, time);
  finishMedia(c, id);
}

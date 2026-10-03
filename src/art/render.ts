import { VIDEO, chapterAt, clamp } from '../timeline';
import { background } from './backgrounds';
import { drawCup, drawHuman } from './characters';
import { environmentMotion } from './environment';
import { eraLabels } from './lettering';
import { ART, random, type Ctx } from './primitives';
import { drawModern } from './modern';
import { armJoint, cupMotion, drawFigure, drawHistoricalCat } from './figures';
import { atmosphere } from './scenery';
import { drawPaintedCat, drawPaintedFigure } from './painted';
import { drawRetroCat, drawRetroFigure } from './retro3d';
import { paintedRoom, renaissanceFlight } from './classicRoom';
import { impastoRoom, impastoMotion } from './impastoRoom';
import { drawStyledCat, hasStyledCat } from './styledCats';
import { decoratedRoom, decoratedMotion } from './decoratedRooms';
import { blendScene, transitionAt, transitionEase, transitionYear } from './transitions';

let buffer: HTMLCanvasElement | undefined;
let incoming: HTMLCanvasElement | undefined;
let pixelBuffer: HTMLCanvasElement | undefined;

function finishMedia(c: Ctx, id: string) {
  if (id === 'mosaic') {
    const pixels = c.getImageData(0, 0, VIDEO.width, VIDEO.height).data,
      rng = random(711),
      scale = VIDEO.width / ART.width;
    c.fillStyle = '#b6b09b';
    c.fillRect(0, 0, 960, 540);
    for (let y = 0; y < 540; y += 2.8)
      for (let x = 0; x < 960; x += 2.8) {
        const at =
            (Math.round((y + 1.4) * scale) * VIDEO.width + Math.round((x + 1.4) * scale)) * 4,
          shift = (rng() - 0.5) * 15;
        const r = clamp(pixels[at] + shift, 0, 255),
          g = clamp(pixels[at + 1] + shift, 0, 255),
          b = clamp(pixels[at + 2] + shift, 0, 255);
        c.fillStyle = `rgb(${r},${g},${b})`;
        c.fillRect(x + 0.19, y + 0.16, 2.42, 2.48);
      }
  }
  if (id === 'impression') {
    const pixels = c.getImageData(0, 0, VIDEO.width, VIDEO.height).data,
      rng = random(17),
      scale = VIDEO.width / ART.width;
    c.save();
    for (let i = 0; i < 22000; i++) {
      const x = Math.floor(rng() * 958),
        y = Math.floor(rng() * 538),
        at = (y * scale * VIDEO.width + x * scale) * 4;
      c.strokeStyle = `rgba(${pixels[at]},${pixels[at + 1]},${pixels[at + 2]},.65)`;
      c.lineWidth = 0.6 + rng() * 2;
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + 1 + rng() * 4, y - 1 - rng() * 3);
      c.stroke();
    }
    c.restore();
  }
  if (id === 'pixel') {
    pixelBuffer ??= document.createElement('canvas');
    pixelBuffer.width = 320;
    pixelBuffer.height = 180;
    const small = pixelBuffer.getContext('2d', { willReadFrequently: true })!;
    small.imageSmoothingEnabled = false;
    small.drawImage(c.canvas, 0, 0, 320, 180);
    c.save();
    c.imageSmoothingEnabled = false;
    c.drawImage(pixelBuffer, 0, 0, 960, 540);
    c.restore();
  }
  if (['cave', 'renaissance', 'cgi'].includes(id)) {
    const g = c.createRadialGradient(480, 270, 180, 480, 270, 590);
    g.addColorStop(0, '#00000000');
    g.addColorStop(1, id === 'cave' ? '#160e2069' : '#15171c43');
    c.fillStyle = g;
    c.fillRect(0, 0, 960, 540);
  }
}

function drawScene(c: Ctx, id: string, time: number) {
  if (id === 'modern') {
    drawModern(c, time);
    return;
  }
  if (id === 'renaissance') paintedRoom(c);
  else if (id === 'post' || id === 'impression') impastoRoom(c, id);
  else if (id === 'gothic' || id === 'nouveau' || id === 'ukiyo') decoratedRoom(c, id);
  else c.drawImage(background(id), 0, 0, 960, 540);
  if (id === 'post' || id === 'impression') impastoMotion(c, id, time);
  else if (id === 'gothic' || id === 'nouveau' || id === 'ukiyo') decoratedMotion(c, id, time);
  else environmentMotion(c, id, time);
  const figures = () => {
    if (id === 'renaissance') {
      drawPaintedFigure(c, time, cupMotion(time, id));
      drawPaintedCat(c, time);
    } else if (id === 'cgi') {
      c.save();
      c.translate(681, 448);
      c.scale(1.06, 1.18);
      c.translate(-681, -438);
      drawRetroFigure(c, time, cupMotion(time, id), armJoint);
      drawCup(c, id, time);
      c.restore();
      c.save();
      c.translate(280, 450);
      c.scale(1.1, 1.1);
      c.translate(-317, -438);
      drawRetroCat(c, time);
      c.restore();
    } else {
      c.save();
      c.translate(681, 448);
      c.scale(1.06, 1.18);
      c.translate(-681, -438);
      if (id === 'cubism' || id === 'bauhaus' || id === 'cave') drawHuman(c, id, time);
      else drawFigure(c, id, time);
      drawCup(c, id, time);
      c.restore();
      c.save();
      c.translate(280, 450);
      c.scale(1.2, 1.1);
      c.translate(-317, -438);
      if (hasStyledCat(id)) drawStyledCat(c, id, time);
      else drawHistoricalCat(c, id, time);
      c.restore();
    }
  };
  if (id === 'cgi') {
    c.save();
    c.beginPath();
    c.rect(0, 443, 960, 97);
    c.clip();
    c.globalAlpha = 0.18;
    c.translate(0, 610);
    c.scale(1, -0.38);
    figures();
    c.restore();
  }
  figures();
  if (id === 'renaissance') drawCup(c, id, time);
  atmosphere(c, id, time);
  if (id === 'renaissance') renaissanceFlight(c, time);
  finishMedia(c, id);
}

function frameContext(canvas: HTMLCanvasElement) {
  const c = canvas.getContext('2d', { willReadFrequently: true })!;
  c.reset();
  c.setTransform(VIDEO.width / ART.width, 0, 0, VIDEO.height / ART.height, 0, 0);
  c.globalAlpha = 1;
  c.globalCompositeOperation = 'source-over';
  c.filter = 'none';
  c.clearRect(0, 0, ART.width, ART.height);
  return c;
}

export function renderArt(canvas: HTMLCanvasElement, frame: number) {
  const time = clamp(frame / VIDEO.fps, 0, VIDEO.duration - 1 / VIDEO.fps),
    chapter = chapterAt(time);
  if (!buffer) {
    buffer = document.createElement('canvas');
    buffer.width = VIDEO.width;
    buffer.height = VIDEO.height;
  }
  const c = frameContext(buffer),
    transition = transitionAt(time);
  if (transition) {
    drawScene(c, transition.from.id, time);
    if (!incoming) {
      incoming = document.createElement('canvas');
      incoming.width = VIDEO.width;
      incoming.height = VIDEO.height;
    }
    drawScene(frameContext(incoming), transition.to.id, time);
    blendScene(c, incoming, transition);
    // Lettering changes separately from the room, while the date advances continuously.
    const fade = transitionEase(transition.progress),
      year = transitionYear(transition);
    c.save();
    c.globalAlpha = 1 - fade;
    eraLabels(c, transition.from.id, year);
    c.globalAlpha = fade;
    eraLabels(c, transition.to.id, year);
    c.restore();
  } else {
    drawScene(c, chapter.id, time);
    eraLabels(c, chapter.id);
  }
  const target = canvas.getContext('2d', { willReadFrequently: true })!;
  target.clearRect(0, 0, canvas.width, canvas.height);
  target.imageSmoothingEnabled = chapter.id !== 'pixel';
  if (canvas.width === VIDEO.width && canvas.height === VIDEO.height)
    target.putImageData(c.getImageData(0, 0, VIDEO.width, VIDEO.height), 0, 0);
  else target.drawImage(buffer, 0, 0, canvas.width, canvas.height);
}

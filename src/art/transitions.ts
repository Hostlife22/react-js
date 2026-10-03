import timeline from '../timeline.json';
import { CHAPTERS, transitionDuration, type Chapter } from '../timeline';
import { clamp } from '../animation/math';
import { ART, type Ctx } from './primitives';

type Pattern = 'wash' | 'sweep' | 'scroll' | 'wave' | 'bloom' | 'diagonal' | 'dissolve';
export type Transition = {
  from: Chapter;
  to: Chapter;
  duration: number;
  progress: number;
  pattern: Pattern;
};
const metrics = timeline.transitions;
const fields = new Map<Pattern, Float32Array>();
let mask: HTMLCanvasElement | undefined;
let maskPixels: ImageData | undefined;

/** Zero velocity and acceleration at either end of the style change. */
export function transitionEase(value: number) {
  const t = clamp(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function transitionAt(time: number): Transition | undefined {
  const index = CHAPTERS.findIndex((chapter) => time >= chapter.start && time < chapter.end);
  if (index <= 0) return undefined;
  const chapter = CHAPTERS[index];
  if (!('transition' in chapter) || !chapter.transition) return undefined;
  const duration = transitionDuration(chapter);
  const p = (time - chapter.start) / duration;
  if (p < 0 || p >= 1) return undefined;
  return {
    from: CHAPTERS[index - 1],
    to: chapter,
    duration,
    progress: p,
    pattern: chapter.transition.pattern as Pattern,
  };
}

function fieldFor(pattern: Pattern) {
  const existing = fields.get(pattern);
  if (existing) return existing;
  const values = new Float32Array(metrics.maskWidth * metrics.maskHeight);
  let min = Infinity,
    max = -Infinity;
  for (let y = 0; y < metrics.maskHeight; y++)
    for (let x = 0; x < metrics.maskWidth; x++) {
      const u = x / (metrics.maskWidth - 1),
        v = y / (metrics.maskHeight - 1);
      const grain = Math.sin(u * 18 + v * 10) * 0.012 + Math.cos(u * 8 - v * 16) * 0.012;
      let distance = u;
      if (pattern === 'scroll') distance = 1 - u + (v - 0.5) * 0.09;
      else if (pattern === 'diagonal') distance = u * 0.78 + v * 0.22;
      else if (pattern === 'wave') distance = u + Math.sin(v * 5.6) * 0.075;
      else if (pattern === 'bloom') distance = Math.hypot((u - 0.53) * 1.55, v - 0.54);
      else if (pattern === 'wash') distance = u * 0.72 + v * 0.28 + Math.sin(v * 8 + u * 3) * 0.03;
      const value = distance + grain,
        at = y * metrics.maskWidth + x;
      values[at] = value;
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
  for (let i = 0; i < values.length; i++) values[i] = (values[i] - min) / (max - min);
  fields.set(pattern, values);
  return values;
}

/** Deterministic flowing mask. Every blended frame contains two live code drawings. */
export function transitionMask(pattern: Pattern, progress: number) {
  if (!mask) {
    mask = document.createElement('canvas');
    mask.width = metrics.maskWidth;
    mask.height = metrics.maskHeight;
    maskPixels = new ImageData(metrics.maskWidth, metrics.maskHeight);
  }
  const field = pattern === 'dissolve' ? undefined : fieldFor(pattern),
    front = (1 + metrics.feather) * transitionEase(progress) - metrics.feather / 2;
  const pixels = maskPixels!.data;
  for (let i = 0; i < pixels.length / 4; i++) {
    const local = field
      ? clamp((front - field[i] + metrics.feather / 2) / metrics.feather)
      : transitionEase(progress);
    const a = field ? local * local * (3 - 2 * local) : local,
      at = i * 4;
    pixels[at] = 255;
    pixels[at + 1] = 255;
    pixels[at + 2] = 255;
    pixels[at + 3] = Math.round(a * 255);
  }
  mask.getContext('2d', { willReadFrequently: true })!.putImageData(maskPixels!, 0, 0);
  return mask;
}

export function blendScene(target: Ctx, incoming: HTMLCanvasElement, transition: Transition) {
  const c = incoming.getContext('2d', { willReadFrequently: true })!;
  c.save();
  c.globalCompositeOperation = 'destination-in';
  c.imageSmoothingEnabled = true;
  c.drawImage(transitionMask(transition.pattern, transition.progress), 0, 0, ART.width, ART.height);
  c.restore();
  target.save();
  target.imageSmoothingEnabled = true;
  target.drawImage(incoming, 0, 0, ART.width, ART.height);
  target.restore();
}

export function transitionYear(transition: Transition) {
  const number = (chapter: Chapter) =>
    Number(chapter.year.replace(/[^\d]/g, '')) * (chapter.year.includes('BC') ? -1 : 1);
  const year = Math.round(
    number(transition.from) +
      (number(transition.to) - number(transition.from)) * transitionEase(transition.progress),
  );
  const digits =
    Math.abs(year) >= 10000 ? Math.abs(year).toLocaleString('en-US') : String(Math.abs(year));
  return digits + (year < 0 ? ' BC' : '');
}

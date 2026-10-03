import { path, random, type Ctx } from '../primitives';

export const COLORS = {
  paper: '#f6efd9',
  navy: '#27265c',
  purple: '#b5a0e3',
  purpleDark: '#9b81c9',
  coral: '#ed7771',
  coralDark: '#d95557',
  yellow: '#efbb42',
  yellowDark: '#ce942e',
  green: '#377a60',
  mint: '#9abfa0',
  cream: '#fff9e8',
};
let paper: HTMLCanvasElement | undefined;

export function paperTexture() {
  if (paper) return paper;
  paper = document.createElement('canvas');
  paper.width = 960;
  paper.height = 540;
  const c = paper.getContext('2d', { willReadFrequently: true })!,
    rng = random(4301);
  for (let i = 0; i < 46000; i++) {
    c.fillStyle = i % 4 ? '#4c3544' : '#fff8df';
    c.globalAlpha = 0.06 + rng() * 0.23;
    const size = 0.25 + rng() * 0.75;
    c.fillRect(rng() * 960, rng() * 540, size, size);
  }
  return paper;
}

export function printedShape(c: Ctx, d: string, color: string, density = 0.46) {
  const p = path(c, d, color);
  c.save();
  c.globalAlpha = density;
  c.fillStyle = c.createPattern(paperTexture(), 'repeat')!;
  c.fill(p);
  c.restore();
  return p;
}

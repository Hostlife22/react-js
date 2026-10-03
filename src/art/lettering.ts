import { CHAPTERS } from '../timeline';
import { PALETTES } from './palettes';
import { rect, text, type Ctx } from './primitives';

type EraType = {
  family: string;
  size: number;
  weight?: string;
  captionFamily?: string;
  captionSize?: number;
  captionWeight?: string;
};
// Source lettering changes its character with each medium; all faces are bundled locally.
const ERA_TYPE: Record<string, EraType> = {
  cave: { family: '"Patrick Hand SC"', size: 31, captionSize: 11 },
  egypt: { family: '"IM Fell English"', size: 35, weight: 'italic 400', captionSize: 10 },
  greek: {
    family: '"IM Fell English"',
    size: 32,
    captionFamily: '"Patrick Hand SC"',
    captionSize: 12,
  },
  mosaic: { family: '"Patrick Hand SC"', size: 34, captionSize: 12 },
  gothic: { family: '"IM Fell English"', size: 45, captionSize: 11 },
  renaissance: {
    family: '"IM Fell English"',
    size: 46,
    captionFamily: '"Cormorant Garamond"',
    captionWeight: '700',
    captionSize: 13,
  },
  ukiyo: { family: '"Cormorant Garamond"', size: 47, captionSize: 12 },
  impression: { family: '"Cormorant Garamond"', size: 48, weight: 'italic 400', captionSize: 12 },
  post: { family: '"Kalam"', size: 45, weight: '700', captionSize: 11, captionWeight: '700' },
  nouveau: {
    family: '"Cormorant Garamond"',
    size: 51,
    weight: '700',
    captionSize: 12,
    captionWeight: '700',
  },
  cubism: { family: '"Outfit"', size: 44, weight: '900', captionSize: 12, captionWeight: '800' },
  bauhaus: { family: '"Outfit"', size: 45, weight: '800', captionSize: 13, captionWeight: '500' },
  pop: { family: '"Bangers"', size: 46, captionSize: 17 },
  pixel: { family: '"Press Start 2P"', size: 29, captionSize: 11 },
  cgi: { family: '"Outfit"', size: 45, weight: '800', captionSize: 12, captionWeight: '800' },
  modern: { family: '"Outfit"', size: 47, weight: '800', captionSize: 13, captionWeight: '600' },
};

export function eraLabels(c: Ctx, id: string, yearOverride?: string) {
  const chapter = CHAPTERS.find((x) => x.id === id)!,
    p = PALETTES[id],
    face = ERA_TYPE[id];
  const dark = ['cave', 'renaissance', 'pixel', 'cgi', 'greek'].includes(id);
  const ink = id === 'post' ? '#f2d65f' : id === 'gothic' ? '#a9463b' : dark ? '#f1e5c9' : p.ink;
  c.save();
  if (['mosaic', 'greek', 'pop', 'pixel'].includes(id))
    rect(
      c,
      id === 'pop' ? 825 : 789,
      19,
      id === 'pop' ? 116 : 152,
      86,
      id === 'pop' ? '#efda47' : id === 'greek' ? '#2a241d' : p.paper,
      0,
      id === 'mosaic' || id === 'pop' ? p.ink : undefined,
      1.2,
    );
  const value = yearOverride ?? chapter.year,
    year = value + (id === 'mosaic' && !value.endsWith('BC') ? ' AD' : '');
  if (id === 'cgi') {
    c.shadowColor = '#a557a6';
    c.shadowBlur = 0;
    c.shadowOffsetX = 2;
    c.shadowOffsetY = 2;
  }
  text(c, year, 931, 68, face.size, ink, face.family, 'right', face.weight ?? '400');
  c.shadowOffsetX = 0;
  c.shadowOffsetY = 0;
  text(
    c,
    chapter.en,
    931,
    94,
    face.captionSize ?? 10,
    id === 'modern' ? '#df6262' : id === 'cgi' ? '#f2d974' : ink,
    face.captionFamily ?? face.family,
    'right',
    face.captionWeight ?? '400',
  );
  if (id === 'cave')
    text(c, 'ART HISTORY SPEEDRUN', 480, 504, 24, '#2d261c', '"Patrick Hand SC"', 'center');
  c.restore();
}

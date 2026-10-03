import { publicAsset } from './assets';

const faces = [
  {
    family: 'Patrick Hand SC',
    weight: '400',
    style: 'normal',
    file: 'PatrickHandSC-400.woff2',
  },
  {
    family: 'IM Fell English',
    weight: '400',
    style: 'italic',
    file: 'IMFellEnglish-italic-400.woff2',
  },
  {
    family: 'IM Fell English',
    weight: '400',
    style: 'normal',
    file: 'IMFellEnglish-400.woff2',
  },
  {
    family: 'Cormorant Garamond',
    weight: '400',
    style: 'italic',
    file: 'CormorantGaramond-italic-400.woff2',
  },
  {
    family: 'Cormorant Garamond',
    weight: '400',
    style: 'normal',
    file: 'CormorantGaramond-400.woff2',
  },
  {
    family: 'Cormorant Garamond',
    weight: '700',
    style: 'normal',
    file: 'CormorantGaramond-700.woff2',
  },
  {
    family: 'Outfit',
    weight: '400',
    style: 'normal',
    file: 'Outfit-400.woff2',
  },
  {
    family: 'Outfit',
    weight: '500',
    style: 'normal',
    file: 'Outfit-500.woff2',
  },
  {
    family: 'Outfit',
    weight: '600',
    style: 'normal',
    file: 'Outfit-600.woff2',
  },
  {
    family: 'Outfit',
    weight: '700',
    style: 'normal',
    file: 'Outfit-700.woff2',
  },
  {
    family: 'Outfit',
    weight: '800',
    style: 'normal',
    file: 'Outfit-800.woff2',
  },
  {
    family: 'Outfit',
    weight: '900',
    style: 'normal',
    file: 'Outfit-900.woff2',
  },
  {
    family: 'Kalam',
    weight: '700',
    style: 'normal',
    file: 'Kalam-700.woff2',
  },
  {
    family: 'Bangers',
    weight: '400',
    style: 'normal',
    file: 'Bangers-400.woff2',
  },
  {
    family: 'Press Start 2P',
    weight: '400',
    style: 'normal',
    file: 'PressStart2P-400.woff2',
  },
];

let loading: Promise<void> | undefined;
export function loadFonts() {
  loading ??= Promise.all(
    faces.map(async ({ family, weight, style, file }) => {
      const face = new FontFace(family, `url(${publicAsset('fonts/' + file)})`, { weight, style });
      await face.load();
      document.fonts.add(face);
    }),
  ).then(() => undefined);
  return loading;
}

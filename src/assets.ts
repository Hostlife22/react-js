import { staticFile } from 'remotion';

/** Vite's public base in the website; Remotion's static server during export. */
export function publicAsset(file: string) {
  const base =
    typeof document === 'undefined'
      ? undefined
      : document.querySelector<HTMLMetaElement>('meta[name="application-base"]')?.content;
  return base ? `${base}${file}` : staticFile(file);
}

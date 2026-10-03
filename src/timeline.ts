import data from './timeline.json';

export const VIDEO = {
  width: data.width,
  height: data.height,
  fps: data.fps,
  duration: data.duration,
  frames: data.fps * data.duration,
};
export const CHAPTERS = data.chapters;
export const EVENTS = data.events;
export type Chapter = (typeof CHAPTERS)[number];
export const chapterAt = (time: number) =>
  CHAPTERS.find((chapter) => time < chapter.end) ?? CHAPTERS[CHAPTERS.length - 1];
export const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
export const smooth = (n: number) => {
  const t = clamp(n);
  return t * t * (3 - 2 * t);
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const progress = (time: number, start: number, end: number) =>
  smooth((time - start) / (end - start));

export function transitionDuration(chapter: Chapter) {
  return chapter.transition
    ? Math.min(
        chapter.transition.duration,
        (chapter.end - chapter.start) * data.transitions.maxEraShare,
      )
    : 0;
}
export function chapterPreviewTime(chapter: Chapter) {
  return (
    chapter.start +
    Math.min(chapter.end - chapter.start - 1 / VIDEO.fps, transitionDuration(chapter) + 0.04)
  );
}

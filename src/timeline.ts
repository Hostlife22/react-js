import data from './timeline.json';
import { getChapterPreviewTime, getTransitionDuration } from './animation/timing';

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
export function transitionDuration(chapter: Chapter) {
  return getTransitionDuration(chapter, data.transitions.maxEraShare);
}
export function chapterPreviewTime(chapter: Chapter) {
  return getChapterPreviewTime(chapter, VIDEO.fps, data.transitions.maxEraShare);
}

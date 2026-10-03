type TimedChapter = {
  start: number;
  end: number;
  transition?: { duration: number };
};

export function getTransitionDuration(chapter: TimedChapter, maxEraShare: number) {
  return chapter.transition
    ? Math.min(chapter.transition.duration, (chapter.end - chapter.start) * maxEraShare)
    : 0;
}

/** Shared by the player and still exporter; short eras must retain a settled frame. */
export function getChapterPreviewTime(
  chapter: TimedChapter,
  fps: number,
  maxEraShare: number,
  minimumOffset = 0,
) {
  return (
    chapter.start +
    Math.min(
      chapter.end - chapter.start - 1 / fps,
      Math.max(minimumOffset, getTransitionDuration(chapter, maxEraShare) + 0.04),
    )
  );
}

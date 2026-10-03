import { VIDEO, chapterAt } from '../timeline';
import { clamp } from '../animation/math';
import { createFrameCanvas, frameContext, presentFrame } from './canvas';
import { drawScene } from './scene';
import { eraLabels } from './lettering';
import { blendScene, transitionAt, transitionEase, transitionYear } from './transitions';

/** Each player or export owns its reusable frame buffers. */
export function createArtRenderer() {
  let buffer: HTMLCanvasElement | undefined;
  let incoming: HTMLCanvasElement | undefined;

  return (canvas: HTMLCanvasElement, frame: number) => {
    const time = clamp(frame / VIDEO.fps, 0, VIDEO.duration - 1 / VIDEO.fps),
      chapter = chapterAt(time);
    buffer ??= createFrameCanvas();
    const c = frameContext(buffer),
      transition = transitionAt(time);
    if (transition) {
      drawScene(c, transition.from.id, time);
      incoming ??= createFrameCanvas();
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
    presentFrame(buffer, canvas, chapter.id === 'pixel');
  };
}

// Standalone frame tools can reuse one renderer without a React lifecycle.
export const renderArt = createArtRenderer();

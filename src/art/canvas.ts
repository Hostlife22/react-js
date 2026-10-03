import { VIDEO } from '../timeline';
import { ART } from './primitives';

export function createFrameCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = VIDEO.width;
  canvas.height = VIDEO.height;
  return canvas;
}

export function frameContext(canvas: HTMLCanvasElement) {
  const c = canvas.getContext('2d', { willReadFrequently: true })!;
  c.reset();
  c.setTransform(VIDEO.width / ART.width, 0, 0, VIDEO.height / ART.height, 0, 0);
  c.globalAlpha = 1;
  c.globalCompositeOperation = 'source-over';
  c.filter = 'none';
  c.clearRect(0, 0, ART.width, ART.height);
  return c;
}

export function presentFrame(
  source: HTMLCanvasElement,
  target: HTMLCanvasElement,
  pixelated: boolean,
) {
  const c = target.getContext('2d', { willReadFrequently: true })!;
  c.clearRect(0, 0, target.width, target.height);
  c.imageSmoothingEnabled = !pixelated;
  if (target.width === VIDEO.width && target.height === VIDEO.height) {
    // Copy native pixels without GPU resampling; exported frames must not acquire repeated tiles.
    c.putImageData(
      source
        .getContext('2d', { willReadFrequently: true })!
        .getImageData(0, 0, VIDEO.width, VIDEO.height),
      0,
      0,
    );
  } else {
    c.drawImage(source, 0, 0, target.width, target.height);
  }
}

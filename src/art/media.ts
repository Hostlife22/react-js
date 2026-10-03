import { VIDEO } from '../timeline';
import { clamp } from '../animation/math';
import { ART, random, type Ctx } from './primitives';

let pixelBuffer: HTMLCanvasElement | undefined;

export function finishMedia(c: Ctx, id: string) {
  if (id === 'mosaic') {
    const pixels = c.getImageData(0, 0, VIDEO.width, VIDEO.height).data,
      rng = random(711),
      scale = VIDEO.width / ART.width;
    c.fillStyle = '#b6b09b';
    c.fillRect(0, 0, 960, 540);
    for (let y = 0; y < 540; y += 2.8)
      for (let x = 0; x < 960; x += 2.8) {
        const at =
            (Math.round((y + 1.4) * scale) * VIDEO.width + Math.round((x + 1.4) * scale)) * 4,
          shift = (rng() - 0.5) * 15;
        const r = clamp(pixels[at] + shift, 0, 255),
          g = clamp(pixels[at + 1] + shift, 0, 255),
          b = clamp(pixels[at + 2] + shift, 0, 255);
        c.fillStyle = `rgb(${r},${g},${b})`;
        c.fillRect(x + 0.19, y + 0.16, 2.42, 2.48);
      }
  }
  if (id === 'impression') {
    const pixels = c.getImageData(0, 0, VIDEO.width, VIDEO.height).data,
      rng = random(17),
      scale = VIDEO.width / ART.width;
    c.save();
    for (let i = 0; i < 22000; i++) {
      const x = Math.floor(rng() * 958),
        y = Math.floor(rng() * 538),
        at = (y * scale * VIDEO.width + x * scale) * 4;
      c.strokeStyle = `rgba(${pixels[at]},${pixels[at + 1]},${pixels[at + 2]},.65)`;
      c.lineWidth = 0.6 + rng() * 2;
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + 1 + rng() * 4, y - 1 - rng() * 3);
      c.stroke();
    }
    c.restore();
  }
  if (id === 'pixel') {
    pixelBuffer ??= document.createElement('canvas');
    pixelBuffer.width = 320;
    pixelBuffer.height = 180;
    const small = pixelBuffer.getContext('2d', { willReadFrequently: true })!;
    small.imageSmoothingEnabled = false;
    small.drawImage(c.canvas, 0, 0, 320, 180);
    c.save();
    c.imageSmoothingEnabled = false;
    c.drawImage(pixelBuffer, 0, 0, 960, 540);
    c.restore();
  }
  if (['cave', 'renaissance', 'cgi'].includes(id)) {
    const g = c.createRadialGradient(480, 270, 180, 480, 270, 590);
    g.addColorStop(0, '#00000000');
    g.addColorStop(1, id === 'cave' ? '#160e2069' : '#15171c43');
    c.fillStyle = g;
    c.fillRect(0, 0, 960, 540);
  }
}

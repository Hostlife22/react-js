import { renderMedia } from '@remotion/renderer';
import { copyFile } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export const filmSettings = {
  codec: 'h264',
  crf: 16,
  pixelFormat: 'yuv420p',
  imageFormat: 'png',
  concurrency: 3,
};

export async function renderFilm({ root, composition, serveUrl, browser }) {
  let last = -1;
  await renderMedia({
    composition,
    serveUrl,
    puppeteerInstance: browser,
    outputLocation: path.join(root, 'out/art-history.mp4'),
    ...filmSettings,
    audioCodec: 'aac',
    audioBitrate: '192k',
    onProgress: ({ progress }) => {
      const percent = Math.floor(progress * 100);
      if (percent >= last + 10) {
        last = percent;
        console.log(`Rendering ${percent}%`);
      }
    },
  });
  execFileSync('python3', [path.join(root, 'scripts/check-export.py')], { stdio: 'inherit' });
  await copyFile(path.join(root, 'out/art-history.mp4'), path.join(root, 'public/art-history.mp4'));
  console.log('Finished: out/art-history.mp4');
}

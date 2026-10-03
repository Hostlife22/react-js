import { renderStill } from '@remotion/renderer';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { getChapterPreviewTime } from '../../src/animation/timing.ts';

export async function renderSamples({ root, timeline, composition, serveUrl, browser }) {
  const samples = [
    ...timeline.chapters.map((chapter) => ({
      id: chapter.id,
      time:
        chapter.id === 'modern'
          ? timeline.events.land + 0.8
          : getChapterPreviewTime(chapter, timeline.fps, timeline.transitions.maxEraShare, 0.3),
    })),
    { id: 'cat-jump', time: timeline.events.jump + 0.2 },
    { id: 'cat-swat', time: timeline.events.swat + 0.04 },
    { id: 'ending', time: 14.7 },
  ];
  for (const sample of samples) {
    await renderStill({
      composition,
      serveUrl,
      puppeteerInstance: browser,
      frame: Math.round(sample.time * timeline.fps),
      output: path.join(root, `out/stills/${sample.id}.png`),
      imageFormat: 'png',
      inputProps: { withAudio: false },
    });
    console.log(`Still: ${sample.id}`);
  }
  execFileSync('python3', [path.join(root, 'scripts/storyboard.py')], { stdio: 'inherit' });
}

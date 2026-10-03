import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { renderMedia } from '@remotion/renderer';
import { withRenderSession } from './lib/render-session.mjs';
import { renderFilm, filmSettings } from './lib/render-film.mjs';
import { renderSamples } from './lib/render-stills.mjs';

await withRenderSession(process.cwd(), async (session) => {
  const { root, composition, serveUrl, browser } = session;
  if (process.argv.includes('--transition-probe')) {
    await mkdir(path.join(root, 'out/checks/transitions'), { recursive: true });
    await renderMedia({
      composition,
      serveUrl,
      puppeteerInstance: browser,
      outputLocation: path.join(root, 'out/checks/transitions/probe.mp4'),
      ...filmSettings,
      frameRange: [300, 490],
      inputProps: { withAudio: false },
    });
    console.log('Finished transition probe.');
  } else if (process.argv.includes('--stills')) {
    await renderSamples(session);
  } else {
    await renderFilm(session);
    await renderSamples(session);
  }
});

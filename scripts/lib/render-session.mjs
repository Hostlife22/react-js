import { bundle } from '@remotion/bundler';
import { openBrowser, selectComposition } from '@remotion/renderer';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

export async function withRenderSession(root, render) {
  const timeline = JSON.parse(await readFile(path.join(root, 'src/timeline.json'), 'utf8'));
  await mkdir(path.join(root, 'out/stills'), { recursive: true });

  console.log('Preparing composition…');
  const serveUrl = await bundle({
    entryPoint: path.join(root, 'src/video/Root.tsx'),
    publicDir: path.join(root, 'public'),
  });
  // Use the browser tested with the pinned renderer, independently of desktop Chrome updates.
  const browser = await openBrowser('chrome');
  try {
    const composition = await selectComposition({
      serveUrl,
      id: 'ArtHistory',
      puppeteerInstance: browser,
    });
    await render({ root, timeline, composition, serveUrl, browser });
  } finally {
    await browser.close({ silent: true });
  }
}

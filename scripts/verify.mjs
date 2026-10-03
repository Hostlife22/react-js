import assert from 'node:assert/strict';
import { withPreview } from './lib/preview.mjs';
import { verifyInterface } from './checks/interface.mjs';
import { verifyAnimation } from './checks/animation.mjs';
import { verifyResponsive } from './checks/responsive.mjs';
import { verifyVideo } from './checks/video.mjs';
import { verifyDownloadStates } from './checks/download.mjs';

await withPreview({ port: 4178 }, async ({ page, url }) => {
  const errors = [],
    imageRequests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (request.url().includes('/artwork/')) imageRequests.push(request.url());
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await verifyInterface(page, url);
  await verifyAnimation(page);
  await verifyResponsive(page);
  await verifyDownloadStates(page, url);
  assert.deepEqual(errors, [], 'Browser errors');
  assert.deepEqual(imageRequests, [], 'The film requests generated illustration files');
  if (!process.argv.includes('--preview-only')) await verifyVideo(url);
  console.log(
    'Passed: pure code drawing, deterministic frames, 16 distinct styles, 90 transition frames, soft masks with monotonic coverage, animated dates, animated historical scenes, 10 independent scenery regions, local fonts, English interface, arm geometry, continuous cat motion, replay, chapter selection, 3 viewport sizes, reduced motion, browser errors.',
  );
});

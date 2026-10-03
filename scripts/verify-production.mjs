import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { withPreview } from './lib/preview.mjs';

const hasFilm = existsSync('public/art-history.mp4');
await withPreview({ port: 4179, production: true }, async ({ page, url }) => {
  const errors = [],
    failed = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    const optionalFilm = !hasFilm && new URL(response.url()).pathname.endsWith('/art-history.mp4');
    if (response.status() >= 400 && !optionalFilm)
      failed.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction(
    () => [...document.fonts].filter((face) => face.status === 'loaded').length >= 15,
  );
  assert.equal(
    await page.locator('meta[name="application-base"]').getAttribute('content'),
    '/cat-through-time/',
  );
  assert.equal(await page.locator('.wordmark').getAttribute('href'), '/cat-through-time/');
  const files = [
    'favicon.svg',
    'social-preview.png',
    'soundtrack.wav',
    ...(hasFilm ? ['art-history.mp4'] : []),
  ];
  for (const file of files)
    assert((await fetch(url + file, { method: 'HEAD' })).ok, `Missing production asset: ${file}`);
  if (hasFilm)
    assert.equal(
      await page.locator('a[download]').getAttribute('href'),
      '/cat-through-time/art-history.mp4',
    );
  else
    assert(
      await page.getByRole('button', { name: 'Preparing file' }).isDisabled(),
      'Download should be unavailable before export',
    );
  await page.keyboard.press('Tab');
  assert(
    await page.locator('.skip-link').evaluate((element) => element === document.activeElement),
    'Skip link is not the first keyboard target',
  );
  await page.keyboard.press('Enter');
  assert(
    await page.locator('#film').evaluate((element) => element === document.activeElement),
    'Skip link does not focus the film',
  );
  await page.locator('.chapter-button').last().click();
  assert.match(await page.locator('.now-playing').innerText(), /Contemporary/);
  await page.locator('.button-secondary').click();
  await page.waitForFunction(
    () => parseFloat(document.querySelector('.timecode').textContent) > 0.1,
  );
  await page.locator('.chapter-button').first().click();
  assert.deepEqual(errors, [], 'Production browser errors');
  assert.deepEqual(failed, [], 'Failed production assets');
  await page.screenshot({ path: 'out/checks/production-pages.png', fullPage: true });
  console.log(
    'Passed: production base, local fonts, audio, download availability, metadata assets, keyboard focus, eras and replay.',
  );
});

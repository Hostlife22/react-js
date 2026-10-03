import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

await mkdir('out/checks', { recursive: true });
const server = spawn(
  process.execPath,
  [
    'node_modules/vite/bin/vite.js',
    'preview',
    '--host',
    '127.0.0.1',
    '--port',
    '4179',
    '--strictPort',
  ],
  { stdio: ['ignore', 'pipe', 'pipe'] },
);
let output = '';
server.stdout.on('data', (chunk) => (output += chunk.toString()));
server.stderr.on('data', (chunk) => (output += chunk.toString()));
const url = 'http://127.0.0.1:4179/cat-through-time/';
const hasFilm = existsSync('public/art-history.mp4');
let browser;
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error(output);
    try {
      if ((await fetch(url)).ok) {
        ready = true;
        break;
      }
    } catch {
      /* Preview may still be starting. */
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert(ready, 'Production preview did not start');
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  browser = await chromium.launch({
    headless: true,
    ...(existsSync(chrome) ? { executablePath: chrome } : {}),
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } }),
    errors = [],
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
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}

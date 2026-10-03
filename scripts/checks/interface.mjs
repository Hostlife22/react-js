import assert from 'node:assert/strict';

export async function verifyInterface(page, url) {
  await page.evaluate(async () => {
    const { loadFonts } = await import('/src/typography.ts');
    await loadFonts();
  });
  assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  assert(
    !/[А-Яа-яЁё]/.test(await page.locator('body').innerText()),
    'The interface still contains Russian labels',
  );
  assert(
    await page.evaluate(() =>
      [
        'Patrick Hand SC',
        'IM Fell English',
        'Cormorant Garamond',
        'Outfit',
        'Kalam',
        'Bangers',
        'Press Start 2P',
      ].every((family) =>
        [...document.fonts].some(
          (face) => face.family.replaceAll('"', '') === family && face.status === 'loaded',
        ),
      ),
    ),
    'Local era typefaces did not load',
  );
  assert.equal(await page.locator('.chapter-button').count(), 16);
  assert.equal(
    await page.locator('link[rel="canonical"]').getAttribute('href'),
    'https://hostlife22.github.io/cat-through-time/',
  );
  assert.equal(await page.locator('meta[property="og:type"]').getAttribute('content'), 'website');
  assert.equal(
    await page.locator('meta[name="twitter:card"]').getAttribute('content'),
    'summary_large_image',
  );
  const structured = JSON.parse(
    await page.locator('script[type="application/ld+json"]').textContent(),
  );
  assert.equal(structured.name, 'Cat Through Time');
  for (const file of ['favicon.svg', 'social-preview.png'])
    assert((await fetch(`${url}/${file}`)).ok, `Missing metadata asset: ${file}`);
  await page.keyboard.press('Tab');
  assert(
    await page.locator('.skip-link').evaluate((element) => element === document.activeElement),
    'Skip link is not the first keyboard target',
  );
  await page.keyboard.press('Enter');
  assert(
    await page.locator('#film').evaluate((element) => element === document.activeElement),
    'Skip link does not move focus to the film',
  );
  assert(
    (await page.locator('#film-description').innerText()).includes('knocks the cup'),
    'The film lacks a textual action description',
  );
  await page.keyboard.press('Tab');
  assert(
    await page
      .getByRole('button', { name: 'Play video', exact: true })
      .evaluate((element) => element === document.activeElement),
    'The skip target does not lead to the play control',
  );
  await page.keyboard.press('Space');
  await page.waitForFunction(
    () => parseFloat(document.querySelector('.timecode').textContent) > 0.1,
  );
  await page.getByRole('button', { name: 'Pause video', exact: true }).press('Space');
  assert(
    await page
      .getByRole('button', { name: 'Play video', exact: true })
      .evaluate((element) => element === document.activeElement),
    'Playback changes steal keyboard focus',
  );
  await page.locator('.chapter-button').last().focus();
  await page.keyboard.press('Space');
  assert.equal(
    await page.locator('.chapter-button').last().getAttribute('aria-pressed'),
    'true',
    'An era cannot be selected with the keyboard',
  );
  await page.locator('.chapter-button').last().click();
  await page.waitForTimeout(150);
  assert.match(await page.locator('.now-playing').innerText(), /Contemporary/);
  assert.equal(await page.locator('.chapter-button[aria-pressed="true"]').count(), 1);
  await page.locator('.button-secondary').click();
  await page.waitForFunction(
    () => parseFloat(document.querySelector('.timecode').textContent) > 0.1,
    undefined,
    { timeout: 5000 },
  );
  assert(parseFloat(await page.locator('.timecode').innerText()) > 0.1, 'Replay did not advance');
  await page.locator('.chapter-button').first().click();
}

import assert from 'node:assert/strict';

/** Check real polling, including a slow request, Vite's HTML fallback and recovery. */
export async function verifyDownloadStates(page, url) {
  let requests = 0;
  let pending;
  let mode = 'pending';
  const pattern = '**/art-history.mp4';
  await page.route(pattern, async (route) => {
    requests++;
    if (mode === 'pending') {
      pending = route;
      return;
    }
    if (mode === 'network-error') {
      await route.abort();
      return;
    }
    await route.fulfill({ status: 200, contentType: 'video/mp4', body: '' });
  });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const unavailable = page.getByRole('button', { name: 'Preparing file' });
    await unavailable.waitFor();
    assert(await unavailable.isDisabled());
    await page.waitForTimeout(5500);
    assert.equal(requests, 1, 'Download checks overlap while a request is pending');
    assert(pending, 'The download was not checked');
    const response = page.waitForResponse((response) =>
      response.url().endsWith('/art-history.mp4'),
    );
    await pending.fulfill({ status: 200, contentType: 'text/html', body: '' });
    await response;
    await page.waitForTimeout(100);
    assert(await unavailable.isDisabled(), 'An HTML fallback enables the MP4 download');

    mode = 'available';
    await page.locator('a[download]').waitFor({ timeout: 8000 });
    assert.equal(await page.locator('a[download]').getAttribute('href'), '/art-history.mp4');
    mode = 'network-error';
    await unavailable.waitFor({ timeout: 8000 });
    assert(await unavailable.isDisabled(), 'A failed request leaves the download enabled');
    mode = 'available';
    await page.locator('a[download]').waitFor({ timeout: 8000 });
  } finally {
    await page.unroute(pattern);
  }
}

import assert from 'node:assert/strict';

export async function verifyResponsive(page) {
  for (const [label, width, height] of [
    ['desktop', 1440, 1100],
    ['tablet', 768, 1024],
    ['mobile', 375, 812],
  ]) {
    await page.setViewportSize({ width, height });
    const layout = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      width: innerWidth,
      buttons: [...document.querySelectorAll('.chapter-button,.button')].map(
        (element) => element.getBoundingClientRect().height,
      ),
      labelsFit: [...document.querySelectorAll('.chapter-name')].every(
        (element) => element.scrollWidth <= element.clientWidth + 1,
      ),
    }));
    assert(layout.scroll <= layout.width, `${label}: horizontal overflow`);
    assert(
      layout.buttons.every((height) => height >= 44),
      `${label}: touch target too small`,
    );
    assert(layout.labelsFit, `${label}: chapter label overlaps another cell`);
    await page.screenshot({ path: `out/checks/${label}.png`, fullPage: true });
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(
    await page
      .locator('.button')
      .first()
      .evaluate((element) => getComputedStyle(element).transitionDuration),
    '0s',
  );
  const pausedTime = await page.locator('.timecode').innerText();
  await page.waitForTimeout(200);
  assert.equal(
    await page.locator('.timecode').innerText(),
    pausedTime,
    'Paused playback advances under reduced motion',
  );
}

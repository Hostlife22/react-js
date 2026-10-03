import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

await mkdir('out/checks', { recursive: true });
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '4178', '--strictPort'],
  { stdio: ['ignore', 'pipe', 'pipe'] },
);
let output = '';
server.stdout.on('data', (chunk) => (output += chunk.toString()));
server.stderr.on('data', (chunk) => (output += chunk.toString()));
const url = 'http://127.0.0.1:4178';
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
      /* The server may still be starting. */
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert(ready, 'Preview server did not start');
  const executable = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  browser = await chromium.launch({
    headless: true,
    ...(existsSync(executable) ? { executablePath: executable } : {}),
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const errors = [],
    imageRequests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (request.url().includes('/artwork/')) imageRequests.push(request.url());
  });
  await page.goto(url, { waitUntil: 'networkidle' });
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

  const integrity = await page.evaluate(async () => {
    const { renderArt } = await import('/src/art/render.ts');
    const { transitionAt, transitionMask, transitionYear } =
      await import('/src/art/transitions.ts');
    const { CHAPTERS, VIDEO, EVENTS, chapterPreviewTime } = await import('/src/timeline.ts');
    const { catPose } = await import('/src/art/characters.ts');
    const { armJoint, cupMotion } = await import('/src/art/figures.ts');
    const { paintedArmPose } = await import('/src/art/painted.ts');
    const { environmentMotion } = await import('/src/art/environment.ts');
    const { decoratedMotion } = await import('/src/art/decoratedRooms.ts');
    const { impastoMotion } = await import('/src/art/impastoRoom.ts');
    const { drawModernEnvironment } = await import('/src/art/modern.ts');
    // Isolate scenery: moving people, the cat and steam cannot make these checks pass.
    const scenery = document.createElement('canvas');
    scenery.width = 960;
    scenery.height = 540;
    const sc = scenery.getContext('2d', { willReadFrequently: true });
    const cases = [
      ['cave', 0.3, 0.9, [198, 150, 180, 130]],
      ['egypt', 1.8, 2.1, [202, 190, 198, 105]],
      ['gothic', 4.6, 4.9, [40, 120, 88, 380]],
      ['ukiyo', 6.4, 6.7, [180, 62, 225, 215]],
      ['impression', 7.1, 7.4, [143, 49, 33, 260]],
      ['post', 7.8, 8.1, [194, 69, 216, 210]],
      ['nouveau', 8.5, 8.8, [42, 77, 93, 355]],
      ['pop', 10.1, 10.3, [182, 121, 244, 221]],
      ['cgi', 10.6, 10.75, [192, 123, 230, 100]],
      ['modern', 12, 13, [775, 145, 155, 238]],
    ];
    const scenerySample = (id, time, box) => {
      sc.clearRect(0, 0, 960, 540);
      sc.fillStyle = '#f4eddc';
      sc.fillRect(0, 0, 960, 540);
      if (['gothic', 'nouveau', 'ukiyo'].includes(id)) decoratedMotion(sc, id, time);
      else if (['post', 'impression'].includes(id)) impastoMotion(sc, id, time);
      else if (id === 'modern') drawModernEnvironment(sc, time);
      else environmentMotion(sc, id, time);
      return sc.getImageData(...box).data;
    };
    const sceneryMotion = cases.map(([id, a, b, box]) => {
      const first = scenerySample(id, a, box),
        next = scenerySample(id, b, box),
        repeat = scenerySample(id, a, box);
      let changed = 0,
        repeatChanged = 0;
      for (let i = 0; i < first.length; i++) {
        if (first[i] !== next[i]) changed++;
        if (first[i] !== repeat[i]) repeatChanged++;
      }
      return { id, changed, repeatChanged };
    });
    const canvas = document.createElement('canvas');
    canvas.width = VIDEO.width;
    canvas.height = VIDEO.height;
    const transitionPixels = new Map();
    const checksum = (frame, mode) => {
      renderArt(canvas, frame);
      const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
      let hash = 2166136261,
        energy = 0;
      for (let i = 0; i < pixels.length; i += 100) {
        hash = Math.imul(hash ^ pixels[i], 16777619);
        energy += pixels[i] + pixels[i + 1] + pixels[i + 2];
      }
      const result = { hash: hash >>> 0, energy };
      if (mode === 'remember' || mode === 'compare') {
        const samples = new Uint8Array(Math.ceil(pixels.length / 100) * 3);
        let at = 0;
        for (let i = 0; i < pixels.length; i += 100) {
          samples[at++] = pixels[i];
          samples[at++] = pixels[i + 1];
          samples[at++] = pixels[i + 2];
        }
        if (mode === 'remember') transitionPixels.set(frame, samples);
        else {
          const expected = transitionPixels.get(frame);
          let maxDifference = 0,
            changed = 0;
          for (let i = 0; i < samples.length; i++) {
            const difference = Math.abs(samples[i] - expected[i]);
            maxDifference = Math.max(maxDifference, difference);
            if (difference) changed++;
          }
          result.consistency = { maxDifference, changedFraction: changed / samples.length };
        }
      }
      return result;
    };
    const samples = CHAPTERS.map((chapter) => Math.round(chapterPreviewTime(chapter) * VIDEO.fps));
    const first = samples.map(checksum);
    const reverse = [...samples].reverse().map(checksum).reverse();
    const masks = CHAPTERS.slice(1).map((chapter) => {
      const transition = transitionAt(chapter.start),
        steps = [0, 0.25, 0.5, 0.75, 1],
        data = steps.map((p) => {
          const mask = transitionMask(transition.pattern, p);
          return mask
            .getContext('2d', { willReadFrequently: true })
            .getImageData(0, 0, mask.width, mask.height).data;
        });
      let start = 0,
        end = 255,
        backwards = 0,
        soft = 0;
      for (let i = 3; i < data[0].length; i += 4) {
        start = Math.max(start, data[0][i]);
        end = Math.min(end, data.at(-1)[i]);
        for (let step = 1; step < steps.length; step++)
          if (data[step][i] < data[step - 1][i]) backwards++;
        if (data[2][i] > 0 && data[2][i] < 255) soft++;
      }
      return {
        id: chapter.id,
        start,
        end,
        backwards,
        soft,
        duration: transition.duration,
        year: transitionYear({ ...transition, progress: 1 }),
        expected: chapter.year,
      };
    });
    const transitionFrames = CHAPTERS.slice(1).flatMap((chapter) => {
      const transition = transitionAt(chapter.start);
      return [
        chapter.start - 1 / VIDEO.fps,
        ...[0, 0.25, 0.5, 0.75, 1].map((p) => chapter.start + p * transition.duration),
      ].map((t) => Math.round(t * VIDEO.fps));
    });
    const transitionChecks = transitionFrames.map((frame) => checksum(frame, 'remember'));
    const transitionRepeat = [...transitionFrames]
      .reverse()
      .map((frame) => checksum(frame, 'compare'))
      .reverse();
    const poses = [EVENTS.jump, EVENTS.jump + 0.2, EVENTS.land, EVENTS.swat, EVENTS.impact].map(
      (t) => catPose(t, 'modern'),
    );
    const motionFrames = [11.3, 11.65, 12.15, 13.25].map((t) =>
      checksum(Math.round(t * VIDEO.fps)),
    );
    const historicalMotion = CHAPTERS.slice(0, -1).map((chapter) => {
      const start = chapterPreviewTime(chapter);
      return [
        checksum(Math.round(start * VIDEO.fps)),
        checksum(Math.round((chapter.end - 0.015) * VIDEO.fps)),
      ];
    });
    let boneError = 0,
      elbowStep = 0,
      lastJoint,
      paintedBoneError = 0,
      paintedElbowStep = 0,
      lastPainted;
    for (let frame = 0; frame < 11.15 * VIDEO.fps; frame++) {
      const cup = cupMotion(frame / VIDEO.fps, 'egypt'),
        wrist = { x: cup.x + 20, y: cup.y - 12 };
      const joint = armJoint(671, 278, wrist.x, wrist.y);
      boneError = Math.max(
        boneError,
        Math.abs(Math.hypot(joint.x - 671, joint.y - 278) - 77),
        Math.abs(Math.hypot(wrist.x - joint.x, wrist.y - joint.y) - 93),
      );
      if (lastJoint)
        elbowStep = Math.max(elbowStep, Math.hypot(joint.x - lastJoint.x, joint.y - lastJoint.y));
      lastJoint = joint;
      const painted = paintedArmPose(cupMotion(frame / VIDEO.fps, 'renaissance'));
      paintedBoneError = Math.max(
        paintedBoneError,
        Math.abs(
          Math.hypot(painted.elbow.x - painted.shoulder.x, painted.elbow.y - painted.shoulder.y) -
            77,
        ),
        Math.abs(
          Math.hypot(painted.wrist.x - painted.elbow.x, painted.wrist.y - painted.elbow.y) - 125,
        ),
      );
      if (lastPainted)
        paintedElbowStep = Math.max(
          paintedElbowStep,
          Math.hypot(painted.elbow.x - lastPainted.x, painted.elbow.y - lastPainted.y),
        );
      lastPainted = painted.elbow;
    }
    const jumpContinuity = [EVENTS.jump, EVENTS.land].map((t) => {
      const a = catPose(t - 0.0001, 'modern'),
        b = catPose(t + 0.0001, 'modern');
      return {
        position: Math.hypot(b.x - a.x, b.y - a.y),
        scale: Math.abs(b.scale - a.scale),
        rotation: Math.abs(b.rotation - a.rotation),
      };
    });
    return {
      masks,
      sceneryMotion,
      first,
      reverse,
      transitionChecks,
      transitionRepeat,
      poses,
      motionFrames,
      historicalMotion,
      boneError,
      elbowStep,
      paintedBoneError,
      paintedElbowStep,
      jumpContinuity,
    };
  });
  assert(
    integrity.masks.every(
      (x) => x.start === 0 && x.end === 255 && x.backwards === 0 && x.soft > 100,
    ),
    'A transition mask flashes, reverses, or has a hard edge',
  );
  assert(
    integrity.masks.every((x) => x.year === x.expected),
    'The animated date does not settle on the correct year',
  );
  assert(
    integrity.masks.every((x) => x.duration >= 0.12),
    'A transition is too short',
  );
  assert(
    integrity.sceneryMotion.every((x) => x.changed > 50),
    `A scenery element does not animate: ${JSON.stringify(integrity.sceneryMotion)}`,
  );
  assert(
    integrity.sceneryMotion.every((x) => x.repeatChanged === 0),
    `Scenery motion depends on rendering order: ${JSON.stringify(integrity.sceneryMotion)}`,
  );
  assert.deepEqual(integrity.first, integrity.reverse, 'Rendering depends on the order of frames');
  // Permit one-level raster rounding in under 0.01% of samples; reject changes in geometry or state.
  assert(
    integrity.transitionRepeat.every(
      (x) => x.consistency.maxDifference <= 1 && x.consistency.changedFraction < 0.0001,
    ),
    'Transitions depend on the order of frames',
  );
  assert.equal(
    new Set(integrity.first.map((x) => x.hash)).size,
    16,
    'Chapter drawings are not distinct',
  );
  assert(
    integrity.transitionChecks.every((x) => x.energy > 1_000_000),
    'A transition contains a blank frame',
  );
  assert(
    integrity.poses.every((pose) => Object.values(pose).every(Number.isFinite)),
    'Cat motion contains invalid coordinates',
  );
  assert(integrity.poses[1].y < integrity.poses[0].y, 'Cat jump has no upward arc');
  assert(Math.abs(integrity.poses[2].y - 320) < 1, 'Cat does not land on the tabletop');
  assert.equal(
    new Set(integrity.motionFrames.map((x) => x.hash)).size,
    4,
    'Final action does not animate',
  );
  assert(
    integrity.historicalMotion.every(([a, b]) => a.hash !== b.hash),
    'A historical scene is a static illustration',
  );
  assert(integrity.boneError < 0.001, 'Arm segments change length while carrying the cup');
  assert(integrity.elbowStep < 8, 'The elbow snaps during the drinking gesture');
  assert(integrity.paintedBoneError < 0.001, 'The painted arm changes bone lengths');
  assert(integrity.paintedElbowStep < 8, 'The painted elbow snaps during the drinking gesture');
  assert(
    integrity.jumpContinuity.every((x) => x.position < 0.2 && x.scale < 0.01 && x.rotation < 0.01),
    'Cat pose jumps at takeoff or landing',
  );

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
  assert.deepEqual(errors, [], 'Browser errors');
  assert.deepEqual(imageRequests, [], 'The film requests generated illustration files');

  if (!process.argv.includes('--preview-only')) {
    const data = JSON.parse(
      execFileSync(
        'ffprobe',
        ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', 'out/art-history.mp4'],
        { encoding: 'utf8' },
      ),
    );
    const video = data.streams.find((x) => x.codec_type === 'video'),
      audio = data.streams.find((x) => x.codec_type === 'audio');
    assert.equal(video.width, 1920);
    assert.equal(video.height, 1080);
    assert.equal(video.avg_frame_rate, '60/1');
    assert.equal(Number(video.nb_frames), 900);
    assert(audio, 'Missing soundtrack');
    assert.equal(Number(audio.sample_rate), 48000);
    assert(Math.abs(Number(data.format.duration) - 15) < 0.1);
    execFileSync('python3', ['scripts/check-export.py'], { stdio: 'inherit' });
    const response = await fetch(`${url}/art-history.mp4`);
    assert(response.ok);
    assert.match(response.headers.get('content-type'), /video\/mp4/);
    console.log('MP4: 1920×1080, 60 fps, 900 frames, 15 seconds, 48 kHz audio.');
  }
  console.log(
    'Passed: pure code drawing, deterministic frames, 16 distinct styles, 90 transition frames, soft masks with monotonic coverage, animated dates, animated historical scenes, 10 independent scenery regions, local fonts, English interface, arm geometry, continuous cat motion, replay, chapter selection, 3 viewport sizes, reduced motion, browser errors.',
  );
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}

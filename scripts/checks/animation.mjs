import assert from 'node:assert/strict';

export async function verifyAnimation(page) {
  const integrity = await page.evaluate(async () => {
    const { renderArt } = await import('/src/art/render.ts');
    const { transitionAt, transitionMask, transitionYear } =
      await import('/src/art/transitions.ts');
    const { CHAPTERS, VIDEO, EVENTS, chapterPreviewTime } = await import('/src/timeline.ts');
    const { modernCatPose } = await import('/src/animation/cat.ts');
    const { armJoint, paintedArmPose } = await import('/src/animation/rig.ts');
    const { cupMotion } = await import('/src/animation/cup.ts');
    const { environmentMotion } = await import('/src/art/environment.ts');
    const { decoratedMotion } = await import('/src/art/decoratedRooms.ts');
    const { impastoMotion } = await import('/src/art/impastoRoom.ts');
    const { drawModernEnvironment } = await import('/src/art/modern/environment.ts');
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
      (t) => modernCatPose(t),
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
      const a = modernCatPose(t - 0.0001),
        b = modernCatPose(t + 0.0001);
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
}

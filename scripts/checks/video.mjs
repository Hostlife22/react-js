import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

export async function verifyVideo(url) {
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

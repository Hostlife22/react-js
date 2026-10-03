"""Detect single-frame flashes or repeated canvas tiles in the encoded film."""
from pathlib import Path
import subprocess
import sys
import numpy as np

root = Path(__file__).resolve().parents[1]
movie = Path(sys.argv[1]) if len(sys.argv) > 1 else root / 'out/art-history.mp4'
width, height = 160, 90
raw = subprocess.check_output([
    'ffmpeg', '-v', 'error', '-xerror', '-i', str(movie),
    '-vf', f'scale={width}:{height}', '-pix_fmt', 'rgb24',
    '-f', 'rawvideo', '-threads', '1', '-'])
frames = np.frombuffer(raw, np.uint8).reshape(-1, height, width, 3).astype(np.int16)
assert len(frames) >= 3, 'The export contains too few frames'
adjacent = np.abs(np.diff(frames, axis=0)).mean(axis=(1, 2, 3))
through = np.abs(frames[2:] - frames[:-2]).mean(axis=(1, 2, 3))
# A normal transition advances towards the next style. A damaged frame makes
# two large changes, then returns almost exactly to the previous drawing.
smaller_jump = np.minimum(adjacent[:-1], adjacent[1:])
suspect = np.flatnonzero((smaller_jump > 8) & (through < smaller_jump * .35)) + 1
assert not len(suspect), f'Single-frame visual discontinuities: {suspect.tolist()}'
print(f'Encoded frames: {len(frames)} decoded, no large single-frame flashes.')

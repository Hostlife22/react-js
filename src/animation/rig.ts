import { clamp } from './math';
import type { CupPose } from './cup';

export type Point = { x: number; y: number };

export function armJoint(sx: number, sy: number, hx: number, hy: number) {
  return solveArmJoint(sx, sy, hx, hy, 77, 93);
}

function solveArmJoint(
  sx: number,
  sy: number,
  hx: number,
  hy: number,
  l1: number,
  l2: number,
): Point {
  const dx = hx - sx,
    dy = hy - sy,
    d = clamp(Math.hypot(dx, dy), 0.01, l1 + l2 - 0.01);
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d),
    h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  return { x: sx + (dx / d) * a + (dy / d) * h, y: sy + (dy / d) * a - (dx / d) * h };
}

export function paintedArmPose(cup: CupPose) {
  const shoulder = { x: 704, y: 276 };
  const wrist = { x: (cup.x - 681) / 1.04 + 681 + 15, y: (cup.y - 333) / 1.1 + 356 + 7 };
  const elbow = solveArmJoint(shoulder.x, shoulder.y, wrist.x, wrist.y, 77, 125);
  return { shoulder, elbow, wrist };
}

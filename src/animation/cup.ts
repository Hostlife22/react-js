import { lerp, progress } from './math';

export type CupPose = { x: number; y: number; sip: number };

const sipKeyframes: [[number, number], ...[number, number][]] = [
  [0, 0],
  [0.3, 0],
  [1.25, 0.72],
  [2.2, 1],
  [3.3, 0.6],
  [4.1, 0.05],
  [4.8, 0.18],
  [5.55, 1],
  [6.55, 0.8],
  [7.5, 0.15],
  [8.2, 0.2],
  [9.0, 0.02],
  [9.9, 0.8],
  [10.8, 0],
  [15, 0],
];
export function cupMotion(time: number, id: string): CupPose {
  if (id === 'modern') return { x: 508, y: 330, sip: 0 };
  let sip = 0;
  for (let i = 1; i < sipKeyframes.length; i++)
    if (time <= sipKeyframes[i][0]) {
      sip = lerp(
        sipKeyframes[i - 1][1],
        sipKeyframes[i][1],
        progress(time, sipKeyframes[i - 1][0], sipKeyframes[i][0]),
      );
      break;
    }
  if (id === 'renaissance') return { x: lerp(508, 612, sip), y: lerp(319, 200, sip), sip };
  return { x: lerp(508, 628, sip), y: lerp(337, 265, sip), sip };
}

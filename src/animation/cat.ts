import { EVENTS } from '../timeline';
import { clamp, lerp, progress } from './math';

export function modernCatPose(time: number) {
  const phase = clamp((time - EVENTS.jump) / (EVENTS.land - EVENTS.jump)),
    flight = time >= EVENTS.jump && time < EVENTS.land;
  const anticipation = progress(time, EVENTS.jump - 0.2, EVENTS.jump);
  const landing =
    time >= EVENTS.land
      ? Math.exp(-(time - EVENTS.land) * 12) * Math.sin((time - EVENTS.land) * 26)
      : 0;
  const paw =
    progress(time, EVENTS.reach, EVENTS.swat) -
    progress(time, EVENTS.swat + 0.15, EVENTS.swat + 0.5);
  const scale = flight
    ? lerp(0.78, 1, progress(time, EVENTS.jump, EVENTS.jump + 0.11))
    : time < EVENTS.jump
      ? 1 - anticipation * 0.22
      : 1 - landing * 0.1;
  const stretch =
    progress(time, EVENTS.jump, EVENTS.jump + 0.065) *
    (1 - progress(time, EVENTS.land, EVENTS.land + 0.36));
  return {
    x: lerp(280, 578, phase),
    y: lerp(450, 320, phase) - (flight ? Math.sin(Math.PI * phase) * 38 : 0),
    rotation: flight ? -0.2 * Math.sin(Math.PI * phase) : 0,
    scale,
    paw,
    flight: flight ? Math.sin(Math.PI * phase) : 0,
    stretch,
    phase,
  };
}

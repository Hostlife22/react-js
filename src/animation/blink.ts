export function blink(time: number, offset = 0) {
  const t = (time + offset) % 3.1;
  return t > 2.81 && t < 2.96 ? Math.max(0.05, Math.abs((t - 2.885) / 0.075)) : 1;
}

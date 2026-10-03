export type Ctx = CanvasRenderingContext2D;
export const ART = {width: 960, height: 540, floor: 438, table: {x: 506, y: 337}, person: {x: 681, y: 215}, cat: {x: 317, y: 438}};

export function random(seed: number) {
  let value = seed >>> 0;
  return () => {value += 0x6D2B79F5; let x = Math.imul(value ^ value >>> 15, 1 | value); x ^= x + Math.imul(x ^ x >>> 7, 61 | x); return ((x ^ x >>> 14) >>> 0) / 4294967296;};
}
export function path(c: Ctx, d: string, fill?: string, stroke?: string, width = 2) {
  const p = new Path2D(d);
  if (fill) {c.fillStyle = fill; c.fill(p);}
  if (stroke) {c.strokeStyle = stroke; c.lineWidth = width; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(p);}
  return p;
}
export function ellipse(c: Ctx, x: number, y: number, rx: number, ry: number, fill: string, stroke?: string, width = 2) {
  c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fillStyle = fill; c.fill();
  if (stroke) {c.strokeStyle = stroke; c.lineWidth = width; c.stroke();}
}
export function rect(c: Ctx, x: number, y: number, w: number, h: number, fill: string, radius = 0, stroke?: string, width = 2) {
  c.beginPath(); c.roundRect(x, y, w, h, radius); c.fillStyle = fill; c.fill();
  if (stroke) {c.strokeStyle = stroke; c.lineWidth = width; c.stroke();}
}
export function line(c: Ctx, x1: number, y1: number, x2: number, y2: number, color: string, width = 2) {
  c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round'; c.stroke();
}
export function text(c: Ctx, value: string, x: number, y: number, size: number, color: string, family = 'Georgia', align: CanvasTextAlign = 'left', weight = '400') {
  c.fillStyle = color; c.textAlign = align; c.font = `${weight} ${size}px ${family}`; c.fillText(value, x, y);
}
export function gradient(c: Ctx, x0: number, y0: number, x1: number, y1: number, colors: string[]) {
  const g = c.createLinearGradient(x0, y0, x1, y1); colors.forEach((v, i) => g.addColorStop(i / (colors.length - 1), v)); return g;
}
export function wash(c: Ctx, color: string) {c.fillStyle = color; c.fillRect(0, 0, ART.width, ART.height);}
export function grain(c: Ctx, seed: number, amount = 6500, color = '#533b2a', opacity = .1) {
  const rng = random(seed); c.save(); c.fillStyle = color;
  for (let i = 0; i < amount; i++) {c.globalAlpha = rng() * opacity; const size = .5 + rng() * 1.5; c.fillRect(rng() * ART.width, rng() * ART.height, size, size);}
  c.restore();
}
export function branch(c: Ctx, x: number, y: number, length: number, angle: number, color: string, width = 3) {
  c.save(); c.translate(x, y); c.rotate(angle); line(c, 0, 0, 0, -length, color, width);
  for (let i = 1; i < 6; i++) {
    const by = -length * i / 6, side = i % 2 ? -1 : 1;
    path(c, `M 0 ${by} Q ${side * 48} ${by - 48} ${side * 54} ${by - 20} Q ${side * 27} ${by + 12} 0 ${by}`, color);
  }
  c.restore();
}

/** Chart geometry shared by the analytics and dashboard components. */
export type ArPoint = [number, number];

export const rnd = (n: number): number => Math.round(n * 10) / 10;

/** Smooth path through points (Catmull-Rom converted to cubic Béziers). */
export function smoothPath(pts: ArPoint[]): string {
  if (!pts.length) return '';
  let d = `M${rnd(pts[0][0])} ${rnd(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    d += ` C${rnd(p1[0] + (p2[0] - p0[0]) / 6)} ${rnd(p1[1] + (p2[1] - p0[1]) / 6)} ${rnd(p2[0] - (p3[0] - p1[0]) / 6)} ${rnd(p2[1] - (p3[1] - p1[1]) / 6)} ${rnd(p2[0])} ${rnd(p2[1])}`;
  }
  return d;
}

/** Maps values onto a w×h box (y grows downward), leaving `pad` on every side. */
export function scalePts(values: number[], w: number, h: number, pad = 0): ArPoint[] {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  return values.map((v, i) => [pad + (i / Math.max(1, values.length - 1)) * (w - pad * 2), pad + (1 - (v - min) / span) * (h - pad * 2)]);
}

/** Straight polyline path. */
export function linePath(pts: ArPoint[]): string {
  return pts.map((q, i) => `${i ? 'L' : 'M'}${rnd(q[0])} ${rnd(q[1])}`).join(' ');
}

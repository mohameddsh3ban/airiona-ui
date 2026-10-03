import { rnd } from '../core/chart.utils';

/** Default colour tokens for the 1st..4th segment of gauges, stacked bars and stripe groups. */
export const AR_SEG_TONES = ['blue-500', 'blue-300', 'action', 'line-strong'];

/** Heatmap levels 0–4: surface-sunken, blue-200, blue-400, blue-600, blue-900. */
export const AR_HEAT_TONES = ['surface-sunken', 'blue-200', 'blue-400', 'blue-600', 'blue-900'];

/** `var(--{tone})`, falling back to the i-th default segment tone. */
export function arSegColor(tone: string | undefined, i: number): string {
  return `var(--${tone || AR_SEG_TONES[i]})`;
}

/** Annular sector between radii r and R, angles in degrees (0 = 3 o'clock, counter-clockwise). */
export function arSectorPath(cx0: number, cy0: number, R: number, r: number, a0: number, a1: number): string {
  const pt = (rad: number, a: number) => {
    const t = (a * Math.PI) / 180;
    return `${rnd(cx0 + rad * Math.cos(t))} ${rnd(cy0 - rad * Math.sin(t))}`;
  };
  const large = Math.abs(a0 - a1) > 180 ? 1 : 0;
  return `M${pt(R, a0)} A${R} ${R} 0 ${large} 1 ${pt(R, a1)} L${pt(r, a1)} A${r} ${r} 0 ${large} 0 ${pt(r, a0)} Z`;
}

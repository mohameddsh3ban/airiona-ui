/** Joins truthy class names. */
export function cx(...parts: Array<string | false | null | undefined | 0>): string {
  return parts.filter(Boolean).join(' ');
}

export const pad2 = (n: number): string => (n < 10 ? '0' : '') + n;
export const clamp = (v: number, min: number, max: number): number => Math.max(min, Math.min(max, v));

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const DOW_MON = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
export const DOW_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

let seq = 0;
/** Stable unique id for aria wiring. Call once per component instance (field initialiser). */
export function uid(prefix = 'ar'): string {
  seq += 1;
  return `${prefix}-${seq}`;
}

/** "84210" -> "84,210" with fixed decimals. */
export function fmtNumber(n: number, dec: number, commas: boolean): string {
  const t = n.toFixed(dec);
  if (!commas) return t;
  const p = t.split('.');
  p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return p.join('.');
}

export function initials(name: string | undefined | null): string {
  return (name || '?').split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

/** Deterministic 0–4 tint for avatars. */
export function nameHue(name: string | undefined | null): number {
  let n = 0;
  for (const ch of name || '') n += ch.charCodeAt(0);
  return n % 5;
}

/** Keeps the call site readable when a value may be a plain string or an option object. */
export interface ArOption<T = string> {
  value: T;
  label: string;
  icon?: string;
  count?: number;
  disabled?: boolean;
  description?: string;
  meta?: string;
}

export function toOption(o: string | ArOption): ArOption {
  return typeof o === 'string' ? { value: o, label: o } : o;
}

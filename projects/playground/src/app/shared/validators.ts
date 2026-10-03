import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validators the page pipeline uses beyond Angular's built-ins. Each returns one error key, matching the
 * `validators[].type` names in a page spec. Copy into the product app as they are.
 */
const empty = (v: unknown) => v == null || v === '' || (Array.isArray(v) && v.length === 0);

/** International phone number: optional +, 7 to 15 digits, spaces, dashes and brackets allowed. Error: `phone`. */
export const phone: ValidatorFn = (c) => (empty(c.value) || /^\+?[\d\s()-]{7,20}$/.test(c.value) && String(c.value).replace(/\D/g, '').length >= 7 && String(c.value).replace(/\D/g, '').length <= 15 ? null : { phone: true });

/** A date range `[start, end]` (ISO strings) with both ends set and end after start. Error: `dateRange`. */
export const dateRange: ValidatorFn = (c) => {
  const v = c.value as [string | null, string | null] | null;
  if (empty(v)) return null;
  if (!Array.isArray(v) || !v[0] || !v[1]) return { dateRange: 'incomplete' };
  return v[1] > v[0] ? null : { dateRange: 'order' };
};

/** An ISO date today or later (or a range whose start is). Error: `futureDate`. */
export function futureDate(today = new Date().toISOString().slice(0, 10)): ValidatorFn {
  return (c) => {
    const v = Array.isArray(c.value) ? c.value[0] : c.value;
    return empty(v) || String(v) >= today ? null : { futureDate: true };
  };
}

/** Age from an ISO birth date is at least `years` on `on` (default today). Error: `minAge`. */
export function minAge(years: number, on = new Date()): ValidatorFn {
  return (c) => {
    if (empty(c.value)) return null;
    const b = new Date(String(c.value));
    if (Number.isNaN(b.getTime())) return { minAge: true };
    let age = on.getFullYear() - b.getFullYear();
    if (on.getMonth() < b.getMonth() || (on.getMonth() === b.getMonth() && on.getDate() < b.getDate())) age--;
    return age >= years ? null : { minAge: { required: years, actual: age } };
  };
}

/** Passport number: 6 to 9 letters or digits. Error: `passport`. */
export const passport: ValidatorFn = (c) => (empty(c.value) || /^[A-Z0-9]{6,9}$/i.test(String(c.value).trim()) ? null : { passport: true });

/** Postal code: 3 to 10 letters, digits, spaces or dashes (country specific rules belong on the server). Error: `postalCode`. */
export const postalCode: ValidatorFn = (c) => (empty(c.value) || /^[A-Z0-9][A-Z0-9 -]{1,8}[A-Z0-9]$/i.test(String(c.value).trim()) ? null : { postalCode: true });

/** Group validator: the control at `path` must equal the one at `other` (confirm email, confirm password). Error on the group: `match`. */
export function match(path: string, other: string): ValidatorFn {
  return (g: AbstractControl): ValidationErrors | null => {
    const a = g.get(path), b = g.get(other);
    if (!a || !b || empty(b.value)) return null;
    const err = a.value === b.value ? null : { match: true };
    b.setErrors(err ? { ...(b.errors ?? {}), ...err } : b.errors && Object.keys(b.errors).filter((k) => k !== 'match').length ? b.errors : null);
    return err;
  };
}

/** Names the pipeline accepts in `validators[].type`, with how the scaffold writes them. */
export const VALIDATOR_NAMES = ['required', 'requiredTrue', 'email', 'minLength', 'maxLength', 'min', 'max', 'pattern', 'phone', 'dateRange', 'futureDate', 'minAge', 'passport', 'postalCode'] as const;

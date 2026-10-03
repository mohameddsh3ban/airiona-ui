import { ElementRef, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormGroup } from '@angular/forms';

/** Error messages per field: `{ email: { required: 'Enter your email', email: 'Use name@example.com' } }`. */
export type FieldMessages = Record<string, Record<string, string>>;

/**
 * Form state for generated pages: which message to show under each field, and a submit that validates,
 * reveals every error and moves focus to the first invalid field. Works zoneless (reads form events as a signal).
 *
 * ```ts
 * readonly form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
 * readonly f = pageForm(this.form, { email: { required: 'Enter your email.', email: 'Use name@example.com.' } });
 * // template: <ar-text-field formControlName="email" [error]="f.error('email')" />
 * ```
 */
export function pageForm(form: FormGroup, messages: FieldMessages) {
  const host = inject<ElementRef<HTMLElement>>(ElementRef);
  const events = toSignal(form.events, { initialValue: null });
  const submitted = signal(false);
  const pending = signal(false);

  /** The message for a field once it has been touched or the form submitted, else null. */
  function error(path: string): string | null {
    events();
    const c: AbstractControl | null = form.get(path);
    if (!c || c.valid || !(c.touched || submitted())) return null;
    const key = Object.keys(c.errors ?? {})[0];
    return messages[path]?.[key] ?? messages[path]?.['default'] ?? 'Check this field.';
  }

  /** Validates; on success runs `onValid` with the raw value. Returns whether the form was valid. */
  function submit(onValid: (value: ReturnType<FormGroup['getRawValue']>) => void | Promise<void>): boolean {
    submitted.set(true);
    form.markAllAsTouched();
    if (form.invalid) {
      queueMicrotask(() => {
        const first = host.nativeElement.querySelector<HTMLElement>('.ng-invalid[formcontrolname]');
        const target = first?.querySelector<HTMLElement>('input, button, [tabindex="0"], textarea, select') ?? first;
        target?.focus();
        first?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
      return false;
    }
    const result = onValid(form.getRawValue());
    if (result instanceof Promise) {
      pending.set(true);
      result.finally(() => pending.set(false));
    }
    return true;
  }

  return { error, submit, submitted: submitted.asReadonly(), pending: pending.asReadonly() };
}

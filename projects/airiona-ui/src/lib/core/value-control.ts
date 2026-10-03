import { Directive, ModelSignal, Provider, Type, booleanAttribute, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Base for every Airiona form control. Works three ways, all at once:
 *  - signals:        `<ar-switch [(value)]="alerts" />`
 *  - template forms: `<ar-switch [(ngModel)]="alerts" />`
 *  - reactive forms: `<ar-switch formControlName="alerts" />`
 *
 * Subclasses declare `readonly value = model<T>(default)` and add `providers: [arValueAccessor(Self)]`.
 * Call `commit(v)` when the user changes the value and `touch()` on blur.
 */
@Directive()
export abstract class ArValueControl<T> implements ControlValueAccessor {
  abstract readonly value: ModelSignal<T>;

  readonly disabled = input(false, { transform: booleanAttribute });
  private readonly formDisabled = signal(false);
  /** Disabled by the input or by the form. */
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private onChange: (v: T) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: T): void {
    this.value.set(v);
  }
  registerOnChange(fn: (v: T) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }

  protected commit(v: T): void {
    if (this.isDisabled()) return;
    this.value.set(v);
    this.onChange(v);
  }
  protected touch(): void {
    this.onTouched();
  }
}

/** `providers: [arValueAccessor(ArSwitch)]` */
export function arValueAccessor(type: () => Type<unknown>): Provider;
export function arValueAccessor(type: Type<unknown>): Provider;
export function arValueAccessor(type: Type<unknown> | (() => Type<unknown>)): Provider {
  return { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => (isTypeFactory(type) ? type() : type)), multi: true };
}
function isTypeFactory(t: unknown): t is () => Type<unknown> {
  return typeof t === 'function' && !(t as { prototype?: unknown }).prototype;
}

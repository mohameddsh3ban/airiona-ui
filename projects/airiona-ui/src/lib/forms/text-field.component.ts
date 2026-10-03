import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArValueControl, arValueAccessor } from '../core/value-control';
import { cx, uid } from '../core/utils';

/**
 * Labelled text input with optional icon, hint and error. Passwords get a show/hide toggle.
 *
 * ```html
 * <ar-text-field label="Email" type="email" iconStart="envelope" formControlName="email" />
 * <ar-text-field label="Card number" [error]="cardError()" [(value)]="card" />
 * ```
 */
@Component({
  selector: 'ar-text-field',
  imports: [ArIcon],
  providers: [arValueAccessor(() => ArTextField)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()' },
  template: `
    @if (label()) {
      <label class="ar-field__label" [attr.for]="fieldId()">{{ label() }}</label>
    }
    <div class="ar-field__control">
      @if (iconStart()) {
        <ar-icon [name]="iconStart()!" [size]="18" />
      }
      <input
        class="ar-field__input"
        [id]="fieldId()"
        [type]="inputType()"
        [value]="value() ?? ''"
        [placeholder]="placeholder() ?? ''"
        [attr.name]="name() || null"
        [attr.autocomplete]="autocomplete() || null"
        [attr.inputmode]="inputMode() || null"
        [attr.maxlength]="maxLength() ?? null"
        [readOnly]="readonly()"
        [disabled]="isDisabled()"
        [attr.aria-invalid]="error() ? 'true' : null"
        [attr.aria-describedby]="message() ? fieldId() + '-m' : null"
        (input)="commit($any($event.target).value)"
        (blur)="touch()"
      />
      @if (type() === 'password') {
        <button type="button" class="ar-field__toggle" [attr.aria-label]="reveal() ? 'Hide password' : 'Show password'" (click)="reveal.set(!reveal())">
          <ar-icon [name]="reveal() ? 'eye-slash' : 'eye'" [size]="18" />
        </button>
      }
    </div>
    @if (message()) {
      <div class="ar-field__hint" [id]="fieldId() + '-m'">
        @if (error()) {
          <ar-icon name="exclamation-triangle" [size]="14" />
        }
        {{ message() }}
      </div>
    }
  `,
})
export class ArTextField extends ArValueControl<string | null> {
  readonly value = model<string | null>('');
  readonly label = input<string>();
  readonly type = input<'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number'>('text');
  readonly placeholder = input<string>();
  readonly hint = input<string>();
  /** Shows the message in red, shakes the field once and sets aria-invalid. */
  readonly error = input<string | null>();
  readonly iconStart = input<string>();
  readonly variant = input<'outline' | 'sunken'>('outline');
  readonly id = input<string>();
  readonly name = input<string>();
  readonly autocomplete = input<string>();
  readonly inputMode = input<string>();
  readonly maxLength = input<number>();
  readonly readonly = input(false);

  private readonly autoId = uid('ar-f');
  protected readonly fieldId = computed(() => this.id() || this.autoId);
  protected readonly reveal = signal(false);
  protected readonly inputType = computed(() => (this.type() === 'password' && this.reveal() ? 'text' : this.type()));
  protected readonly message = computed(() => this.error() || this.hint());
  protected readonly hostClass = computed(() =>
    cx('ar-field', this.variant() === 'sunken' && 'ar-field--sunken', !!this.error() && 'ar-field--error'),
  );
}

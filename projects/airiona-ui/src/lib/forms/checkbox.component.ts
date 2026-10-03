import { ChangeDetectionStrategy, Component, booleanAttribute, input, model } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArValueControl, arValueAccessor } from '../core/value-control';

/**
 * 20px square check for independent yes/no choices inside a form that is submitted later.
 * For settings that apply immediately use `ArSwitch`. Extra label content can be projected.
 *
 * ```html
 * <ar-checkbox label="Remember me" [(value)]="remember" />
 * <ar-checkbox label="Add travel insurance" formControlName="insurance" />
 * ```
 */
@Component({
  selector: 'ar-checkbox',
  imports: [ArIcon],
  providers: [arValueAccessor(() => ArCheckbox)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <label class="ar-check">
      <input
        type="checkbox"
        [checked]="!!value()"
        [disabled]="isDisabled()"
        [attr.name]="name() || null"
        [attr.id]="inputId() || null"
        [attr.required]="required() ? '' : null"
        (change)="commit($any($event.target).checked)"
        (blur)="touch()"
      />
      <span class="ar-check__box" aria-hidden="true"><ar-icon name="check" [size]="14" [strokeWidth]="2.5" /></span>{{ label() }}<ng-content />
    </label>
  `,
})
export class ArCheckbox extends ArValueControl<boolean> {
  /** Checked state. */
  readonly value = model<boolean>(false);
  readonly label = input<string>();
  readonly name = input<string>();
  /** id of the native input. */
  readonly inputId = input<string>();
  readonly required = input(false, { transform: booleanAttribute });
}

import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { ArValueControl, arValueAccessor } from '../core/value-control';

/**
 * On/off control for settings that take effect immediately. The label states the setting,
 * the description states the consequence. Inside a form with a Save button use `ArCheckbox`.
 * Extra label content can be projected.
 *
 * ```html
 * <ar-switch label="Price alerts" description="Email me when this route drops below $480." [(value)]="alerts" />
 * <ar-switch label="Instant book" formControlName="instant" />
 * ```
 */
@Component({
  selector: 'ar-switch',
  providers: [arValueAccessor(() => ArSwitch)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <label class="ar-switch">
      <input
        type="checkbox"
        role="switch"
        [checked]="!!value()"
        [disabled]="isDisabled()"
        [attr.name]="name() || null"
        [attr.id]="inputId() || null"
        (change)="commit($any($event.target).checked)"
        (blur)="touch()"
      />
      <span class="ar-switch__track" aria-hidden="true"><span class="ar-switch__knob"></span></span>
      <span class="ar-switch__text">{{ label() }}<ng-content />@if (description()) {<span class="ar-switch__desc">{{ description() }}</span>}</span>
    </label>
  `,
})
export class ArSwitch extends ArValueControl<boolean> {
  /** On/off state. */
  readonly value = model<boolean>(false);
  readonly label = input<string>();
  readonly description = input<string>();
  readonly name = input<string>();
  /** id of the native input. */
  readonly inputId = input<string>();
}

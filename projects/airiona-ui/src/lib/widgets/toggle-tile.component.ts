import { ChangeDetectionStrategy, Component, computed, inject, input, model, output } from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArIcon } from '../core/icon.component';
import { ArPlatform } from '../core/platform';
import { ArWidgetTone, widgetClass } from '../core/primitives';
import { ArValueControl, arValueAccessor } from '../core/value-control';
import { cx } from '../core/utils';

/**
 * Square tile for one setting: icon disc, open arrow, title, status line and a large switch with a soft glow when on.
 * Works with `[(value)]`, `[(ngModel)]` and `formControlName`.
 *
 * ```html
 * <ar-toggle-tile title="Wi-Fi" status="On · Airiona_Guest" icon="wifi" [(value)]="wifi" (open)="openWifi()" />
 * <ar-toggle-tile title="Do not disturb" status="Until 08:00" icon="moon" formControlName="dnd" />
 * ```
 */
@Component({
  selector: 'ar-toggle-tile',
  imports: [ArIcon, ArIconButton],
  providers: [arValueAccessor(() => ArToggleTile)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.role]': 'ariaLabel() ? "region" : null',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.title]': 'null',
  },
  template: `
    <div class="ar-w__row">
      <span class="ar-w__badge"><ar-icon [name]="icon()" [size]="20" /></span>
      <button arIconButton icon="arrow-up-right" size="sm" variant="soft" [label]="'Open ' + title()" (click)="open.emit()"></button>
    </div>
    <div class="ar-toggle__text">
      <b>{{ title() }}</b>
      <span>{{ value() ? status() : offStatus() }}</span>
    </div>
    <label class="ar-switch ar-toggle__switch">
      <input
        type="checkbox"
        role="switch"
        [checked]="value()"
        [disabled]="isDisabled()"
        [attr.aria-label]="title()"
        (change)="onToggle($event)"
        (blur)="touch()"
      />
      <span class="ar-switch__track" aria-hidden="true"><span class="ar-switch__knob"></span></span>
    </label>
  `,
})
export class ArToggleTile extends ArValueControl<boolean> {
  private readonly platform = inject(ArPlatform);
  /** On/off. Defaults to on, like the React `defaultChecked`. */
  readonly value = model<boolean>(true);
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  readonly title = input<string>('');
  /** Status line while on. */
  readonly status = input<string>('');
  /** Status line while off. */
  readonly offStatus = input<string>('Off');
  readonly icon = input<string>('wifi');
  /** The arrow button was pressed. */
  readonly open = output<void>();

  protected readonly hostClass = computed(() => widgetClass(this.tone(), cx('ar-toggle', this.value() && 'is-on')));

  protected onToggle(ev: Event): void {
    this.commit((ev.target as HTMLInputElement).checked);
    this.platform.haptic();
  }
}

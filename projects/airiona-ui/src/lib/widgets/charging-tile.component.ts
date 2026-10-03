import { ChangeDetectionStrategy, Component, computed, input, numberAttribute } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArWidgetTone, widgetClass } from '../core/primitives';
import { clamp } from '../core/utils';

/**
 * EV charging tile: state line, "68% · 37 min left", a 0/50/100 scale and a meter.
 *
 * ```html
 * <ar-charging-tile [percent]="68" timeLeft="37 min left" />
 * ```
 */
@Component({
  selector: 'ar-charging-tile',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.role]': 'ariaLabel() ? "region" : null',
  },
  template: `
    <span class="ar-charge__state"><ar-icon name="bolt" variant="solid" [size]="16" />{{ status() || 'Charging…' }}</span>
    <b class="ar-charge__value">{{ p() }}% · {{ timeLeft() }}</b>
    <div class="ar-charge__scale" aria-hidden="true"><span>0</span><span>50</span><span>100</span></div>
    <div class="ar-charge__track" role="meter" [attr.aria-valuenow]="p()" aria-valuemin="0" aria-valuemax="100" aria-label="Charge">
      <i [style.width.%]="p()"><b></b></i>
    </div>
  `,
})
export class ArChargingTile {
  readonly tone = input<ArWidgetTone>('dark');
  readonly ariaLabel = input<string>();
  /** 0–100. */
  readonly percent = input(0, { transform: numberAttribute });
  readonly timeLeft = input.required<string>();
  /** Default "Charging…". */
  readonly status = input<string>();
  protected readonly p = computed(() => clamp(this.percent() || 0, 0, 100));
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-charge'));
}

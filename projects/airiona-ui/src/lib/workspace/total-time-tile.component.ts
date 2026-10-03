import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ArCountUp } from '../core/count-up.component';
import { ArIcon } from '../core/icon.component';
import { ArWidgetTone, widgetClass } from '../core/primitives';

/**
 * Sky tile with an icon, a label and one big counted-up total.
 *
 * ```html
 * <ar-total-time-tile icon="moon" label="Total nights booked" value="645" unit="nights" />
 * ```
 */
@Component({
  selector: 'ar-total-time-tile',
  imports: [ArIcon, ArCountUp],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.role]': 'ariaLabel() ? "region" : null',
  },
  template: `
    <div class="ar-total__head">
      <span class="ar-total__icon"><ar-icon [name]="icon() || 'clock'" [size]="22" /></span>
      <span>{{ label() }}</span>
    </div>
    <b class="ar-total__value"><ar-count-up [value]="value()" /><small>{{ ' ' + (unit() || '') }}</small></b>
  `,
})
export class ArTotalTimeTile {
  readonly tone = input<ArWidgetTone>('sky');
  readonly ariaLabel = input<string>();
  /** Default "clock". */
  readonly icon = input<string>();
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly unit = input<string>();
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-total'));
}

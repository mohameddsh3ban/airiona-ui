import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ArCountUp } from '../core/count-up.component';
import { ArIcon } from '../core/icon.component';

/**
 * A personal stat for a traveller's home screen: title, period, a big number that counts up, and a delta pill.
 *
 * ```html
 * <ar-mini-stat-card title="Trips done" subtitle="Over the last year" value="9" delta="-3.48%" />
 * ```
 */
@Component({
  selector: 'ar-mini-stat-card',
  imports: [ArCountUp, ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'm-ministat', '[attr.title]': 'null' },
  template: `
    <b class="m-ministat__title">{{ title() }}</b><span class="m-ministat__sub">{{ subtitle() }}</span>
    <div class="m-ministat__row">
      <b class="m-ministat__value"><ar-count-up [value]="value()" /></b>
      @if (delta()) {
        <span class="m-ministat__delta" [class.is-down]="down()" [class.is-up]="!down()"><ar-icon [name]="down() ? 'arrow-trending-down' : 'arrow-trending-up'" [size]="14" [strokeWidth]="2" />{{ delta() }}</span>
      }
    </div>
  `,
})
export class ArMiniStatCard {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly value = input<string | number>('');
  /** With sign, e.g. "-3.48%". A leading "-" turns the pill red with a falling arrow. */
  readonly delta = input<string>();
  protected readonly down = computed(() => (this.delta() ?? '').charAt(0) === '-');
}

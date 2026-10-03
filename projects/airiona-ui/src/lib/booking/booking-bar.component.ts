import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';
import { ArButton, ArButtonVariant } from '../actions/button.component';
import { cx } from '../core/utils';

/**
 * Sticky price-and-action bar at the bottom of a listing or checkout. `floating` for the desktop right column.
 *
 * ```html
 * <ar-booking-bar price="€128" unit="/ night" dates="20–25 May · 2 guests" (action)="check()" />
 * <ar-booking-bar floating was="$1,420" price="$1,284" unit="total" cta="Continue to payment" ctaVariant="brand" arrow="arrow-right" />
 * ```
 */
@Component({
  selector: 'ar-booking-bar',
  imports: [ArButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()' },
  template: `
    <div>
      <div class="ar-bbar__price">
        @if (was()) {
          <span class="ar-bbar__was">{{ was() }}</span>
        }
        <span class="ar-bbar__amount">{{ price() }}</span>
        @if (unit()) {
          <span class="ar-bbar__unit">{{ unit() }}</span>
        }
      </div>
      @if (dates()) {
        <div class="ar-bbar__dates">{{ dates() }}</div>
      }
    </div>
    <button arButton [variant]="ctaVariant()" size="lg" [arrow]="arrow()" (click)="action.emit()">{{ cta() }}</button>
  `,
})
export class ArBookingBar {
  readonly price = input.required<string>();
  readonly unit = input<string>();
  /** Struck-through previous price. */
  readonly was = input<string>();
  /** Dates line (opens the date picker) or a fees note. */
  readonly dates = input<string>();
  readonly cta = input('Check availability');
  readonly ctaVariant = input<ArButtonVariant>('primary');
  /** Arrow disc on the button: `true` or an icon name. */
  readonly arrow = input<boolean | string>(false);
  readonly floating = input(false, { transform: booleanAttribute });
  readonly action = output<void>();

  protected readonly hostClass = computed(() => cx('ar-bbar', this.floating() && 'ar-bbar--floating'));
}

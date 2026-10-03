import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ArCountUp } from '../core/count-up.component';
import { ArIcon } from '../core/icon.component';
import { ArWidgetTone, widgetClass } from '../core/primitives';
import { cx } from '../core/utils';

export interface ArMetricSplit {
  value: string | number;
  label: string;
  /** Colour token for the figure, e.g. 'success'. Defaults to 'ink'. */
  tone?: string;
}

/**
 * Compact KPI tile: label with an icon square, a big counted-up figure, a caption and either a delta or two side figures.
 *
 * ```html
 * <ar-metric-tile label="Guests today" value="327" caption="New arrivals" delta="+4.7%" icon="user" />
 * <ar-metric-tile label="Status breakdown" value="1,350" caption="Bookings" [split]="[{ value: '87', label: 'Confirmed', tone: 'success' }]" />
 * ```
 */
@Component({
  selector: 'ar-metric-tile',
  imports: [ArCountUp, ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', '[attr.role]': 'ariaLabel() ? "region" : null', '[attr.aria-label]': 'ariaLabel() || null' },
  template: `
    <div class="ar-metric__head">
      <span class="ar-w__eyebrow">{{ label() }}</span>
      @if (icon()) {
        <span class="ar-metric__icon"><ar-icon [name]="icon()!" [size]="20" /></span>
      }
    </div>
    <div class="ar-metric__body">
      <div>
        <div class="ar-metric__value"><ar-count-up [value]="value()" /></div>
        @if (caption()) {
          <div class="ar-metric__caption">{{ caption() }}</div>
        }
      </div>
      @if (split(); as parts) {
        <div class="ar-metric__split">
          @for (s of parts; track s.label) {
            <div>
              <div class="ar-metric__splitv" [style.color]="'var(--' + (s.tone || 'ink') + ')'">{{ s.value }}</div>
              <div class="ar-metric__caption">{{ s.label }}</div>
            </div>
          }
        </div>
      } @else if (delta()) {
        <span [class]="deltaClass()">{{ delta() }}<span class="ar-metric__arrow"><ar-icon [name]="down() ? 'arrow-down' : 'arrow-up'" [size]="12" [strokeWidth]="2.5" /></span></span>
      }
    </div>
  `,
})
export class ArMetricTile {
  readonly tone = input<ArWidgetTone>('light');
  /** Accessible name; makes the tile a labelled region. */
  readonly ariaLabel = input<string>();
  readonly label = input<string>('');
  /** Counted up from zero on first render. */
  readonly value = input<string | number | null>('');
  readonly caption = input<string>();
  readonly icon = input<string>();
  /** Starts with + or -. Ignored when `split` is given. */
  readonly delta = input<string>();
  /** Up to two side figures, e.g. Confirmed / Pending. */
  readonly split = input<ArMetricSplit[]>();

  protected readonly down = computed(() => (this.delta() || '').charAt(0) === '-');
  protected readonly deltaClass = computed(() => cx('ar-metric__delta', this.down() && 'is-down'));
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-metric'));
}

import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArCountUp } from '../core/count-up.component';
import { ArIndicator } from '../core/indicator.directive';
import { ArWidgetTone, widgetClass } from '../core/primitives';

export interface ArBalanceTooltip {
  value: string;
  date: string;
}

const DEFAULT_RANGES = ['1W', '1M', '3M', '6M', 'YTD', '1Y'];

/**
 * Total-balance chart: counted-up value, line/bar view toggle, y labels, bars with a selection band and
 * tooltip, and range tabs with one sliding indicator. `range` is two-way (`[(range)]`).
 *
 * ```html
 * <ar-balance-chart label="Total revenue" value="$325,000.69" [bars]="bars" [selection]="[3, 8]"
 *   [tooltip]="{ value: '$42,250.69', date: 'Jan 25, 2026' }" [(range)]="range" />
 * ```
 */
@Component({
  selector: 'ar-balance-chart',
  imports: [ArIconButton, ArCountUp, ArIndicator],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.role]': 'ariaLabel() ? "region" : null',
  },
  template: `
    <div class="ar-w__row" style="align-items: flex-start">
      <div class="ar-w__titles">
        <span class="ar-w__eyebrow">{{ heading() }}</span>
        <b class="ar-balance__value"><ar-count-up [value]="value()" /></b>
      </div>
      <div class="ar-row" style="gap: 8px">
        <button arIconButton icon="presentation-chart-line" size="md" [variant]="view() === 'line' ? 'ink' : 'outline'" label="Line view"
          [attr.aria-pressed]="view() === 'line' ? 'true' : 'false'" (click)="view.set('line')"></button>
        <button arIconButton icon="chart-bar" size="md" [variant]="view() === 'bars' ? 'ink' : 'outline'" label="Bar view"
          [attr.aria-pressed]="view() === 'bars' ? 'true' : 'false'" (click)="view.set('bars')"></button>
      </div>
    </div>
    <div class="ar-balance__chart">
      <div class="ar-balance__y">
        @for (l of yLabels(); track l) {
          <span>{{ l }}</span>
        }
      </div>
      <div class="ar-balance__plot" role="img" [attr.aria-label]="heading() + ', ' + current()">
        <div [class]="view() === 'line' ? 'ar-balance__bars is-line' : 'ar-balance__bars'">
          @for (v of bars(); track $index) {
            <i [style.height.%]="(v / maxValue()) * 100"></i>
          }
        </div>
        <span class="ar-balance__sel" [style.left.%]="selLeft()" [style.width.%]="selWidth()"></span>
        @if (tooltip(); as t) {
          <span class="ar-balance__tip" [style.left.%]="selRight()"><b>{{ t.value }}</b><span>{{ t.date }}</span></span>
        }
      </div>
    </div>
    <div class="ar-balance__ranges" role="tablist" aria-label="Range">
      <span class="ar-balance__ind" arIndicator='[aria-selected="true"]'></span>
      @for (r of rangeList(); track r) {
        <button type="button" role="tab" [attr.aria-selected]="r === current() ? 'true' : 'false'" (click)="range.set(r)">{{ r }}</button>
      }
    </div>
  `,
})
export class ArBalanceChart {
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  /** Default "Total balance". */
  readonly label = input<string>();
  readonly value = input.required<string | number>();
  readonly bars = input<number[]>([]);
  /** Value of a full-height bar; defaults to the largest bar. */
  readonly max = input<number>();
  readonly yLabels = input<string[]>([]);
  /** [fromIndex, toIndex] of the highlighted range. */
  readonly selection = input<[number, number]>([3, 8]);
  readonly tooltip = input<ArBalanceTooltip>();
  readonly ranges = input<string[]>(DEFAULT_RANGES);
  /** Selected range (two-way). Null falls back to the second range. */
  readonly range = model<string | null>(null);

  protected readonly view = signal<'line' | 'bars'>('bars');
  protected readonly heading = computed(() => this.label() || 'Total balance');
  protected readonly rangeList = computed(() => this.ranges() || DEFAULT_RANGES);
  protected readonly current = computed(() => this.range() ?? this.rangeList()[1] ?? '1M');
  protected readonly maxValue = computed(() => this.max() || Math.max(...this.bars(), 1));
  private readonly sel = computed(() => this.selection() || [3, 8]);
  private readonly count = computed(() => this.bars().length || 1);
  protected readonly selLeft = computed(() => (this.sel()[0] / this.count()) * 100);
  protected readonly selWidth = computed(() => ((this.sel()[1] - this.sel()[0]) / this.count()) * 100);
  protected readonly selRight = computed(() => (this.sel()[1] / this.count()) * 100);
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-balance'));
}

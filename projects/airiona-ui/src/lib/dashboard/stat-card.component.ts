import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArCountUp } from '../core/count-up.component';
import { ArIcon } from '../core/icon.component';
import { cx } from '../core/utils';

export interface ArStatBars {
  values: number[];
  /** Index of the solid Ion Blue bar. One per chart. */
  highlight?: number;
  /** Value flag on the highlighted bar. */
  flag?: string;
  axis?: string[];
  inkIndex?: number;
  /** Accessible name of the chart. */
  label?: string;
}

interface BarView {
  cls: string;
  height: string;
  flag: string | null;
}

/**
 * Dashboard tile: label with icon, a counting headline figure, a delta with an arrow and an optional hatched bar chart.
 * `openable` shows the round open button that emits `open`.
 *
 * ```html
 * <ar-stat-card icon="wallet" label="Revenue this week" value="$84,210" delta="+12.4%" caption="vs last week" openable
 *               [bars]="{ values: [42, 58, 36, 74], highlight: 3, flag: '$18.2k' }" (open)="go()" />
 * ```
 */
@Component({
  selector: 'ar-stat-card',
  imports: [ArCountUp, ArIcon, ArIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <section [class]="hostClass()">
      <div class="ar-stat__head">
        <div class="ar-stat__label">
          @if (icon()) {
            <span class="ar-stat__icon"><ar-icon [name]="icon()!" [size]="18" /></span>
          }
          {{ label() }}
        </div>
        @if (openable()) {
          <button arIconButton icon="arrow-up-right" size="sm" [variant]="tone() === 'surface' ? 'surface' : 'white'" [label]="'Open ' + label()" (click)="open.emit()"></button>
        }
      </div>
      <div>
        <div class="ar-stat__value"><ar-count-up [value]="value()" /></div>
        @if (delta() || caption()) {
          <div class="ar-stat__foot">
            @if (delta()) {
              <span [class]="down() ? 'ar-stat__delta is-down' : 'ar-stat__delta'"><ar-icon [name]="down() ? 'arrow-down-right' : 'arrow-up-right'" [size]="13" [strokeWidth]="2.25" />{{ deltaText() }}</span>
            }
            {{ caption() }}
          </div>
        }
      </div>
      @if (bars(); as b) {
        <div>
          <div class="ar-bars" role="img" [attr.aria-label]="b.label || 'Bar chart'">
            @for (bar of barViews(); track $index) {
              <div [class]="bar.cls" [style.height]="bar.height">
                @if (bar.flag) {
                  <span class="ar-bars__flag">{{ bar.flag }}</span>
                }
              </div>
            }
          </div>
          @if (b.axis) {
            <div class="ar-bars__axis" aria-hidden="true">
              @for (a of b.axis; track $index) {
                <span>{{ a }}</span>
              }
            </div>
          }
        </div>
      }
    </section>
  `,
})
export class ArStatCard {
  readonly label = input.required<string>();
  /** Formatted figure; the number inside counts up. */
  readonly value = input<string | number>('');
  readonly icon = input<string>();
  /** Starts with + or -; the sign picks the arrow and colour. */
  readonly delta = input<string>();
  /** What the delta is compared to. */
  readonly caption = input<string>();
  readonly tone = input<'surface' | 'ink' | 'brand'>('surface');
  /** Shows the round open button that emits `open`. */
  readonly openable = input(false, { transform: booleanAttribute });
  readonly bars = input<ArStatBars>();
  readonly open = output<void>();

  protected readonly down = computed(() => String(this.delta() ?? '').charAt(0) === '-');
  protected readonly deltaText = computed(() => String(this.delta() ?? '').replace(/^[+-]/, ''));
  protected readonly hostClass = computed(() => cx('ar-stat', this.tone() !== 'surface' && `ar-stat--${this.tone()}`));
  protected readonly barViews = computed<BarView[]>(() => {
    const b = this.bars();
    if (!b) return [];
    const vals = b.values || [];
    const max = Math.max(...vals, 1);
    return vals.map((v, i) => {
      const hot = i === b.highlight;
      return {
        cls: cx('ar-bars__bar', 'ar-hatch', hot && 'is-hot', b.inkIndex === i && 'is-ink'),
        height: Math.max(12, (v / max) * 100) + '%',
        flag: hot && b.flag ? b.flag : null,
      };
    });
  });
}

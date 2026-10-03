import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArWidgetTone, widgetClass } from '../core/primitives';

export interface ArHoldingItem {
  name: string;
  sub?: string;
  /** Letter in the coin when there is no icon. */
  symbol?: string;
  icon?: string;
  tone?: 'sky' | 'brand';
  value?: string | number;
  spark?: number[];
  /** Shown instead of `value`, e.g. "+6.5%". */
  change?: string;
}

export interface ArHoldingGroup {
  title: string;
  items: ArHoldingItem[];
}

const DEFAULT_SPARK = [2, 3, 2, 5, 9, 6, 4, 2, 3];

/**
 * Tiny decorative bar sparkline; the tallest bar is highlighted.
 *
 * ```html
 * <ar-spark-bars [values]="[2, 3, 2, 5, 9, 6]" />
 * ```
 */
@Component({
  selector: 'ar-spark-bars',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ar-sparkbars', 'aria-hidden': 'true' },
  template: `
    @for (b of items(); track $index) {
      <i [class]="b.hi ? 'is-hi' : ''" [style.height.%]="b.h"></i>
    }
  `,
})
export class ArSparkBars {
  readonly values = input<number[]>(DEFAULT_SPARK);
  protected readonly items = computed(() => {
    const v = this.values() || DEFAULT_SPARK;
    const max = Math.max(...v);
    const hi = v.indexOf(max);
    return v.map((x, i) => ({ hi: i === hi, h: Math.max(12, (x / max) * 100) }));
  });
}

/**
 * Dark list of holdings in titled groups: coin, name and subtitle, optional sparkbars, and a value or change.
 *
 * ```html
 * <ar-holdings-panel title="Top properties" linkLabel="See all properties" href="/properties" [groups]="groups" />
 * ```
 */
@Component({
  selector: 'ar-holdings-panel',
  imports: [ArIcon, ArSparkBars],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.role]': 'ariaLabel() ? "region" : null',
    '[attr.title]': 'null',
  },
  template: `
    <div class="ar-w__row">
      <b class="ar-holdings__title">{{ title() || 'Holding' }}</b>
      @if (linkLabel()) {
        <a class="ar-holdings__link" [attr.href]="href() || '#'" (click)="link.emit($event)">{{ linkLabel() }}<ar-icon name="chevron-right" [size]="14" /></a>
      }
    </div>
    <div class="ar-holdings__panel">
      @for (g of groups(); track $index) {
        <div class="ar-holdings__group">
          <span class="ar-holdings__label">{{ g.title }}</span>
          @for (it of g.items; track it.name) {
            <div class="ar-holdings__row">
              <span [class]="it.tone ? 'ar-holdings__coin is-' + it.tone : 'ar-holdings__coin'">
                @if (it.icon) {
                  <ar-icon [name]="it.icon" [size]="16" />
                } @else {
                  {{ it.symbol }}
                }
              </span>
              <span class="ar-holdings__who"><b>{{ it.name }}</b><span>{{ it.sub }}</span></span>
              @if (it.spark) {
                <ar-spark-bars [values]="it.spark" />
              }
              @if (it.change) {
                <span class="ar-holdings__chg">{{ it.change }}</span>
              } @else {
                <b class="ar-holdings__val">{{ it.value }}</b>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class ArHoldingsPanel {
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  /** Default "Holding". */
  readonly title = input<string>();
  readonly linkLabel = input<string>();
  readonly href = input<string>();
  readonly groups = input<ArHoldingGroup[]>([]);
  /** The header link was clicked; call `preventDefault()` on the event to route in-app. */
  readonly link = output<MouseEvent>();
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-holdings'));
}

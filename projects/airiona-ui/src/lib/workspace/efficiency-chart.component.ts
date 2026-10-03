import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ArPoint, scalePts, smoothPath } from '../core/chart.utils';
import { ArIcon } from '../core/icon.component';
import { ArWidgetTone, widgetClass } from '../core/primitives';
import { uid } from '../core/utils';

const W0 = 260;
const H0 = 150;
const DEFAULT_DATA = [20, 26, 22, 30, 28, 52, 46, 40, 44, 38, 42];

/**
 * Dark area chart with a glowing line, a highlighted point and a delta flag.
 *
 * ```html
 * <ar-efficiency-chart title="Occupancy" period="January" delta="+40%" />
 * ```
 */
@Component({
  selector: 'ar-efficiency-chart',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.role]': 'ariaLabel() ? "region" : null',
    '[attr.title]': 'null',
  },
  template: `
    <b class="ar-eff__title">{{ heading() }}</b>
    <span class="ar-eff__period">{{ period() }}<ar-icon name="chevron-down" [size]="14" /></span>
    <div class="ar-eff__chart">
      <svg class="ar-reveal" [attr.viewBox]="'0 0 ' + w + ' ' + h" preserveAspectRatio="none" role="img" [attr.aria-label]="heading() + ' ' + (delta() ?? '')">
        <defs>
          <linearGradient [attr.id]="id" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--blue-400)" stop-opacity="0.55" />
            <stop offset="1" stop-color="var(--blue-400)" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path [attr.d]="area()" [attr.fill]="'url(#' + id + ')'" />
        <path [attr.d]="line()" class="ar-eff__line" fill="none" />
      </svg>
      <span class="ar-eff__dot" [style.left.%]="hiX()" [style.top.%]="hiY()"></span>
      <span class="ar-eff__flag" [style.left.%]="hiX()" [style.top.%]="hiY()">{{ delta() }}</span>
    </div>
  `,
})
export class ArEfficiencyChart {
  protected readonly w = W0;
  protected readonly h = H0;
  protected readonly id = uid('ar-eff');
  readonly tone = input<ArWidgetTone>('dark');
  readonly ariaLabel = input<string>();
  /** Default "Efficiency". */
  readonly title = input<string>();
  readonly period = input<string>();
  /** Flag text at the highlighted point, e.g. "+40%". */
  readonly delta = input<string>();
  readonly data = input<number[]>();
  /** Index of the highlighted point, default 5. */
  readonly highlight = input<number>();

  protected readonly heading = computed(() => this.title() || 'Efficiency');
  private readonly pts = computed<ArPoint[]>(() =>
    scalePts(this.data() || DEFAULT_DATA, W0, H0 - 20, 4).map((p): ArPoint => [p[0], p[1] + 20]),
  );
  protected readonly line = computed(() => smoothPath(this.pts()));
  protected readonly area = computed(() => `${this.line()} L${W0} ${H0} L0 ${H0} Z`);
  private readonly hiPt = computed<ArPoint>(() => {
    const pts = this.pts();
    const hi = this.highlight() ?? 5;
    return pts[hi] ?? pts[pts.length - 1] ?? [0, 0];
  });
  protected readonly hiX = computed(() => (this.hiPt()[0] / W0) * 100);
  protected readonly hiY = computed(() => (this.hiPt()[1] / H0) * 100);
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-eff'));
}

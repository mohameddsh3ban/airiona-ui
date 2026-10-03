import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ArPoint, linePath, scalePts, smoothPath } from '../core/chart.utils';
import { ArCountUp } from '../core/count-up.component';
import { ArIcon } from '../core/icon.component';
import { ArWidgetTone, widgetClass } from '../core/primitives';
import { cx } from '../core/utils';

/** Chart panel spec for ChannelCard. */
export interface ArChannelChartData {
  type: 'line' | 'bars' | 'meter' | 'step';
  data?: number[];
  /** Index of the marked point (line, step). Defaults to the last point. */
  marker?: number;
  /** Index of the highlighted bar (bars). */
  highlight?: number;
  /** 0–1 fill (meter). */
  value?: number;
  label?: string;
  date?: string;
}

const W0 = 240;
const H0 = 90;
const BARCODE = Array.from({ length: 46 }, (_, i) => Math.max(0.12, 1 - (i / 46) * 0.85));

/** The four chart panels of ChannelCard: line, step, bars and meter. Used inside `ar-channel-card`. */
@Component({
  selector: 'ar-channel-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    @switch (type()) {
      @case ('bars') {
        <div class="ar-cc__panel is-bars" role="img" [attr.aria-label]="ariaLabel()">
          <div class="ar-cc__bars">
            @for (b of bars(); track $index) {
              <i [class]="b.cls" [style.height.%]="b.h"></i>
            }
          </div>
          @if (c().label) {
            <span class="ar-cc__tip" [style.left.%]="tipLeft()"><small>{{ c().date }}</small>{{ c().label }}</span>
          }
        </div>
      }
      @case ('meter') {
        <div class="ar-cc__panel is-meter" role="img" [attr.aria-label]="ariaLabel()">
          <span class="ar-cc__meterfill" [style.width.%]="(c().value || 0.2) * 100"></span>
          <div class="ar-cc__barcode">
            @for (o of barcode; track $index) {
              <i [style.opacity]="o"></i>
            }
          </div>
          @if (c().label) {
            <span class="ar-cc__meterlabel">{{ c().label }}<small>{{ c().date }}</small></span>
          }
        </div>
      }
      @default {
        <div [class]="panelClass()" role="img" [attr.aria-label]="ariaLabel()">
          <span class="ar-cc__hatch"></span>
          <svg [attr.viewBox]="'0 0 ' + w + ' ' + h" preserveAspectRatio="none" class="ar-cc__svg ar-reveal">
            @if (isStep()) {
              <path [attr.d]="curve()" class="ar-cc__line" fill="none" />
            } @else {
              <path [attr.d]="curve()" class="ar-cc__line" fill="none" stroke-linejoin="round" stroke-linecap="round" />
            }
          </svg>
          <span class="ar-cc__marker" [style.left.%]="mkX()" [style.top.%]="mkY()"></span>
          @if (c().label) {
            <span [class]="valueClass()" [style.left.%]="isStep() ? mkX() : null" [style.top.%]="isStep() ? mkY() : null"
              >{{ c().label }}@if (c().date) {<small>{{ c().date }}</small>}</span
            >
          }
        </div>
      }
    }
  `,
})
export class ArChannelChart {
  protected readonly w = W0;
  protected readonly h = H0;
  protected readonly barcode = BARCODE;
  readonly chart = input<ArChannelChartData>();
  readonly ariaLabel = input<string>();

  protected readonly c = computed<ArChannelChartData>(() => this.chart() ?? { type: 'line' });
  protected readonly type = computed(() => this.c().type || 'line');
  protected readonly isStep = computed(() => this.type() === 'step');
  protected readonly panelClass = computed(() => cx('ar-cc__panel', this.isStep() ? 'is-step' : 'is-line'));
  protected readonly valueClass = computed(() => cx('ar-cc__value', this.isStep() && 'is-pill'));

  // bars
  protected readonly bars = computed(() => {
    const c = this.c();
    const vals = c.data || [];
    const max = Math.max(...vals, 1);
    return vals.map((v, i) => ({ h: (v / max) * 100, cls: i === c.highlight ? 'is-hi' : v / max > 0.55 ? 'is-mid' : '' }));
  });
  protected readonly tipLeft = computed(() => {
    const c = this.c();
    return (((c.highlight ?? 0) + 0.5) / Math.max(1, (c.data || []).length)) * 100;
  });

  // line / step
  private readonly pts = computed<ArPoint[]>(() => {
    const vals = this.c().data || [];
    if (!vals.length) return [];
    const pts = scalePts(vals, W0, H0, 12);
    return this.isStep() ? pts.map((q): ArPoint => [q[0], 40 + ((q[1] - 12) / (H0 - 24)) * (H0 - 54)]) : pts;
  });
  protected readonly curve = computed(() => (this.isStep() ? smoothPath(this.pts()) : linePath(this.pts())));
  private readonly mk = computed<ArPoint>(() => {
    const pts = this.pts();
    const m = this.c().marker;
    return pts[m !== undefined ? m : pts.length - 1] ?? [W0, H0 / 2];
  });
  protected readonly mkX = computed(() => (this.mk()[0] / W0) * 100);
  protected readonly mkY = computed(() => (this.mk()[1] / H0) * 100);
}

/**
 * Sales-channel card: icon and name, a counted-up amount with delta and freshness, then one chart panel
 * (`line`, `step`, `bars` or `meter`).
 *
 * ```html
 * <ar-channel-card name="Direct" icon="globe-alt" amount="$42,850" delta="+5.9%" updated="56 sec ago"
 *   [chart]="{ type: 'line', data: [30, 34, 31, 58, 44], label: '$25,000', date: 'Fri, Dec 31' }" />
 * ```
 */
@Component({
  selector: 'ar-channel-card',
  imports: [ArIcon, ArCountUp, ArChannelChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.role]': 'ariaLabel() ? "region" : null',
  },
  template: `
    <div class="ar-cc__head">
      <span class="ar-cc__icon"><ar-icon [name]="icon() || 'globe-alt'" [size]="18" /></span>
      <b>{{ name() }}</b>
    </div>
    <div class="ar-cc__amount">
      <b><ar-count-up [value]="amount()" /></b>
      @if (delta()) {
        <span class="ar-cc__delta"><ar-icon name="arrow-up-right" [size]="12" [strokeWidth]="2.5" />{{ delta() }}</span>
      }
      @if (updated()) {
        <span class="ar-cc__updated"><i></i>{{ updated() }}</span>
      }
    </div>
    <ar-channel-chart [chart]="chart()" [ariaLabel]="name() + ' trend'" />
  `,
})
export class ArChannelCard {
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  readonly name = input.required<string>();
  /** Default "globe-alt". */
  readonly icon = input<string>();
  readonly amount = input.required<string | number>();
  readonly delta = input<string>();
  /** Freshness note, e.g. "56 sec ago". */
  readonly updated = input<string>();
  readonly chart = input.required<ArChannelChartData>();
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-cc'));
}

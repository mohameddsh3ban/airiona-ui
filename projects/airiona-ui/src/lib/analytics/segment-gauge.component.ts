import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';
import { ArCountUp } from '../core/count-up.component';
import { ArCardHead, ArWidgetTone, widgetClass } from '../core/primitives';
import { arSectorPath, arSegColor } from './analytics.utils';

export interface ArGaugeSegment {
  label: string;
  value: number;
  /** Shown in the legend instead of the raw value, e.g. '80%'. */
  display?: string;
  /** Colour token; defaults to blue-500, blue-300, action, line-strong in order. */
  tone?: string;
}

/**
 * Half-donut of chunky rounded segments with a gap between each, the total in the middle and a legend underneath.
 *
 * ```html
 * <ar-segment-gauge eyebrow="Booking mix" title="Rate status" total="800" totalLabel="Total bookings" [segments]="segs" />
 * ```
 */
@Component({
  selector: 'ar-segment-gauge',
  imports: [ArCardHead, ArCountUp],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', '[attr.role]': 'ariaLabel() ? "region" : null', '[attr.aria-label]': 'ariaLabel() || null', '[attr.title]': 'null' },
  template: `
    <ar-card-head [eyebrow]="eyebrow()" [title]="title()" [openable]="openable()" (open)="open.emit()" />
    <div class="ar-gauge__chart">
      <svg viewBox="0 0 280 150" role="img" [attr.aria-label]="chartLabel()">
        @for (p of paths(); track $index) {
          <path [attr.d]="p.d" [style.fill]="p.color" [style.stroke]="p.color" stroke-width="10" stroke-linejoin="round" />
        }
      </svg>
      <div class="ar-gauge__center">
        <b><ar-count-up [value]="total()" /></b>
        <span>{{ totalLabel() }}</span>
      </div>
    </div>
    <div class="ar-gauge__legend">
      @for (s of segments(); track s.label; let i = $index) {
        <div>
          <span class="ar-legend"><i [style.background]="color(s, i)"></i>{{ s.label }}</span>
          <b>{{ s.display || s.value }}</b>
        </div>
      }
    </div>
  `,
})
export class ArSegmentGauge {
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  /** 2–4 segments. */
  readonly segments = input<ArGaugeSegment[]>([]);
  /** Counted up in the middle of the gauge. */
  readonly total = input<string | number | null>('');
  readonly totalLabel = input<string>();
  readonly eyebrow = input<string>();
  readonly title = input<string>();
  readonly openable = input(false, { transform: booleanAttribute });
  readonly open = output<void>();

  protected readonly paths = computed(() => {
    const segs = this.segments();
    const total = segs.reduce((s, x) => s + x.value, 0) || 1;
    const gap = 4;
    let a = 180;
    return segs.map((s, i) => {
      const sweep = (180 * s.value) / total;
      const a0 = a - (i ? gap / 2 : 0);
      const a1 = a - sweep + (i < segs.length - 1 ? gap / 2 : 0);
      a -= sweep;
      return { d: arSectorPath(140, 140, 126, 86, a0, a1), color: arSegColor(s.tone, i) };
    });
  });
  protected readonly chartLabel = computed(() => this.segments().map((s) => s.label + ' ' + (s.display ?? s.value)).join(', '));
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-gauge'));

  protected color(s: ArGaugeSegment, i: number): string {
    return arSegColor(s.tone, i);
  }
}

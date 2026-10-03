import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, linkedSignal, output } from '@angular/core';
import { ArCardHead, ArWidgetTone, widgetClass } from '../core/primitives';

export interface ArBarDatum {
  label: string;
  value: number;
}

/**
 * Tall rounded bars inside pale pill tracks; one is highlighted with a value tooltip, and hover moves the highlight.
 *
 * ```html
 * <ar-pill-bar-chart eyebrow="Bookings by stay type" title="Track your stays" unit="bookings" [data]="data" [highlight]="4" openable (open)="go()" />
 * ```
 */
@Component({
  selector: 'ar-pill-bar-chart',
  imports: [ArCardHead],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', '[attr.role]': 'ariaLabel() ? "region" : null', '[attr.aria-label]': 'ariaLabel() || null', '[attr.title]': 'null' },
  template: `
    <ar-card-head [eyebrow]="eyebrow()" [title]="title()" [openable]="openable()" (open)="open.emit()" />
    <div class="ar-pillbars__chart" role="img" [attr.aria-label]="chartLabel()">
      @for (d of data(); track d.label; let i = $index) {
        <div class="ar-pillbars__col" (mouseenter)="active.set(i)">
          <div class="ar-pillbars__track">
            <div [class]="i === active() ? 'ar-pillbars__fill is-on' : 'ar-pillbars__fill'" [style.height]="barHeight(d.value) + '%'">
              @if (i === active()) {
                <span class="ar-pillbars__tip">{{ d.value + ' ' + (unit() || '') }}</span>
              }
            </div>
          </div>
          <span class="ar-pillbars__label">{{ d.label }}</span>
        </div>
      }
    </div>
  `,
})
export class ArPillBarChart {
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  /** 4–8 items. */
  readonly data = input<ArBarDatum[]>([]);
  readonly eyebrow = input<string>();
  readonly title = input<string>();
  /** Word after the tooltip value. */
  readonly unit = input<string>();
  /** Index highlighted initially; hovering a bar moves the highlight. */
  readonly highlight = input<number>();
  /** Scale maximum; defaults to the largest value. */
  readonly max = input<number>();
  /** Shows the chevron button that emits (open). */
  readonly openable = input(false, { transform: booleanAttribute });
  readonly open = output<void>();

  protected readonly active = linkedSignal(() => this.highlight() ?? -1);
  private readonly top = computed(() => this.max() || Math.max(...this.data().map((d) => d.value), 1));
  protected readonly chartLabel = computed(
    () => (this.title() || 'Bar chart') + ': ' + this.data().map((d) => d.label + ' ' + d.value).join(', '),
  );
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-pillbars'));

  protected barHeight(v: number): number {
    return Math.max(14, (v / this.top()) * 100);
  }
}

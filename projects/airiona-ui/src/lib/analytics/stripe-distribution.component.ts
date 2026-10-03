import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { arSegColor } from './analytics.utils';

export interface ArStripeGroup {
  label: string;
  count: string | number;
  /** Number of stripes drawn for this group. */
  bars: number;
  tone?: string;
}

/**
 * A row of thin pill stripes coloured by group, each group's count above it and a legend below.
 * Not a card on its own: place it inside an `.ar-w` surface.
 *
 * ```html
 * <ar-stripe-distribution unit="cancellations" [groups]="groups" />
 * ```
 */
@Component({
  selector: 'ar-stripe-distribution',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ar-stripes' },
  template: `
    <div class="ar-stripes__counts">
      @for (g of groups(); track g.label) {
        <span [style.flex]="g.bars + ' 1 0'"><b>{{ g.count }}</b> {{ unit() || '' }}</span>
      }
    </div>
    <div class="ar-stripes__bars" role="img" [attr.aria-label]="chartLabel()">
      @for (s of stripes(); track $index) {
        <i [style.background]="s"></i>
      }
    </div>
    <div class="ar-w__legendrow">
      @for (g of groups(); track g.label; let gi = $index) {
        <span class="ar-legend"><i [style.background]="color(g, gi)"></i>{{ g.label }}</span>
      }
    </div>
  `,
})
export class ArStripeDistribution {
  readonly groups = input<ArStripeGroup[]>([]);
  /** Word after each count. */
  readonly unit = input<string>();

  protected readonly stripes = computed(() =>
    this.groups().flatMap((g, gi) => Array.from({ length: Math.max(0, g.bars) }, () => arSegColor(g.tone, gi))),
  );
  protected readonly chartLabel = computed(() => this.groups().map((g) => g.label + ' ' + g.count).join(', '));

  protected color(g: ArStripeGroup, gi: number): string {
    return arSegColor(g.tone, gi);
  }
}

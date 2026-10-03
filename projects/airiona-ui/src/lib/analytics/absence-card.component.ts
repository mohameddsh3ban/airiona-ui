import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArWidgetTone, widgetClass } from '../core/primitives';
import { ArHeatmap } from './heatmap.component';
import { ArStripeDistribution, ArStripeGroup } from './stripe-distribution.component';

/**
 * The combined analytics card: an inner white card with title, info note and a stripe distribution, beside a heatmap, on a sunken tray.
 *
 * ```html
 * <ar-absence-card eyebrow="Identify cancellation causes" title="Cancellations" unit="stays" [groups]="groups"
 *   [heatRows]="rows" [heatCols]="cols" [heat]="levels" [heatHighlight]="[3, 3]" heatLabel="Cancellation rate by weekday" />
 * ```
 */
@Component({
  selector: 'ar-absence-card',
  imports: [ArHeatmap, ArIcon, ArStripeDistribution],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', '[attr.role]': 'ariaLabel() ? "region" : null', '[attr.aria-label]': 'ariaLabel() || null', '[attr.title]': 'null' },
  template: `
    <div class="ar-absence__main">
      <div class="ar-absence__top">
        <div class="ar-w__titles">
          <span class="ar-w__eyebrow">{{ eyebrow() }}</span>
          <h3 class="ar-w__title">{{ title() }}</h3>
        </div>
        @if (info()) {
          <p class="ar-w__note" style="max-width: 220px; margin: 0"><ar-icon name="information-circle" [size]="16" />{{ info() }}</p>
        }
      </div>
      <ar-stripe-distribution [groups]="groups()" [unit]="unit()" />
    </div>
    <ar-heatmap [rows]="heatRows()" [cols]="heatCols()" [values]="heat()" [highlight]="heatHighlight()" [label]="heatLabel()" />
  `,
})
export class ArAbsenceCard {
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  readonly eyebrow = input<string>();
  readonly title = input<string>('');
  readonly info = input<string>();
  readonly groups = input<ArStripeGroup[]>([]);
  readonly unit = input<string>();
  readonly heatRows = input<string[]>([]);
  readonly heatCols = input<string[]>([]);
  /** Matrix of levels 0–4. */
  readonly heat = input<number[][]>([]);
  readonly heatHighlight = input<[number, number] | null>(null);
  readonly heatLabel = input<string>();

  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-absence'));
}

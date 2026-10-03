import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArWidgetTone, widgetClass } from '../core/primitives';
import { clamp } from '../core/utils';

/**
 * Charge level as a bolt and percentage over rounded cells that fill from the bottom, with time remaining.
 *
 * ```html
 * <ar-battery-tile [percent]="57" caption="~ 5 hours left" label="Key card battery" />
 * ```
 */
@Component({
  selector: 'ar-battery-tile',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', '[attr.role]': 'ariaLabel() ? "region" : null', '[attr.aria-label]': 'ariaLabel() || null' },
  template: `
    <div class="ar-battery__value"><ar-icon name="bolt" variant="solid" [size]="26" /><b>{{ pct() }}%</b></div>
    <div class="ar-battery__cells" role="meter" [attr.aria-valuenow]="pct()" aria-valuemin="0" aria-valuemax="100" [attr.aria-label]="label() || 'Battery'">
      @for (f of fills(); track $index) {
        <span><i [style.height]="f * 100 + '%'"></i></span>
      }
    </div>
    <span class="ar-battery__caption">{{ caption() }}</span>
  `,
})
export class ArBatteryTile {
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  /** 0–100. */
  readonly percent = input<number>(0);
  readonly caption = input<string>();
  readonly cells = input<number>(5);
  /** Accessible name of the meter. Defaults to "Battery". */
  readonly label = input<string>();

  protected readonly pct = computed(() => clamp(this.percent() || 0, 0, 100));
  protected readonly fills = computed(() => {
    const n = this.cells() || 5;
    const p = this.pct();
    return Array.from({ length: n }, (_, i) => clamp(p / (100 / n) - i, 0, 1));
  });
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-battery'));
}

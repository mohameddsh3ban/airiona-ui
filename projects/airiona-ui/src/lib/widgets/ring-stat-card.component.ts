import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArRing, ArWidgetTone, widgetClass } from '../core/primitives';

export interface ArRingStatRing {
  /** 0–1. */
  value: number;
  label: string;
  unit?: string;
}

export interface ArRingStat {
  label: string;
  value: string | number;
}

/**
 * Headline measurement with its unit, a thin progress ring, and three labelled stats below a hairline.
 * Light for activity summaries, dark for live navigation.
 *
 * ```html
 * <ar-ring-stat-card value="2.8" unit="km" [ring]="{ value: 0.64, label: '64', unit: 'km' }" [stats]="stats" />
 * ```
 */
@Component({
  selector: 'ar-ring-stat-card',
  imports: [ArIcon, ArRing],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', '[attr.role]': 'ariaLabel() ? "region" : null', '[attr.aria-label]': 'ariaLabel() || null' },
  template: `
    <div class="ar-w__row">
      <div class="ar-ringstat__value">
        @if (icon()) {
          <ar-icon [name]="icon()!" [size]="30" [strokeWidth]="2" />
        }
        <b>{{ value() }}</b>
        <span>{{ unit() }}</span>
      </div>
      @if (ring(); as r) {
        <ar-ring [size]="58" [stroke]="2.5" [value]="r.value"><b>{{ r.label }}</b><span>{{ r.unit }}</span></ar-ring>
      }
    </div>
    <div class="ar-ringstat__stats">
      @for (s of stats(); track s.label) {
        <div><span>{{ s.label }}</span><b>{{ s.value }}</b></div>
      }
    </div>
  `,
})
export class ArRingStatCard {
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  readonly value = input<string | number>('');
  readonly unit = input<string>();
  /** Leading icon, e.g. arrow-turn-left-up for navigation. */
  readonly icon = input<string>();
  readonly ring = input<ArRingStatRing | null>(null);
  /** Exactly three stats. */
  readonly stats = input<ArRingStat[]>([]);

  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-ringstat'));
}

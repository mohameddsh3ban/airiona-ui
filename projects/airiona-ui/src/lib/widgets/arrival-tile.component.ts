import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArWidgetTone, widgetClass } from '../core/primitives';

export interface ArAirportStop {
  code: string;
  city: string;
  time: string;
}

/**
 * Midnight tile counting down to landing: big ETA, both airports with times, and a glowing progress line along the bottom.
 *
 * ```html
 * <ar-arrival-tile eta="53min" [from]="{ code: 'DXB', city: 'Dubai', time: '14:30' }" [to]="{ code: 'IST', city: 'Istanbul', time: '16:30' }" [progress]="0.6" />
 * ```
 */
@Component({
  selector: 'ar-arrival-tile',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', '[attr.role]': 'ariaLabel() ? "region" : null', '[attr.aria-label]': 'ariaLabel() || null' },
  template: `
    <span class="ar-w__eyebrow">{{ eyebrow() }}</span>
    <b class="ar-arrival__eta">{{ eta() }}</b>
    <div class="ar-arrival__route">
      <div><span>{{ from()?.time }}</span><b>{{ from()?.code }}</b><span>{{ from()?.city }}</span></div>
      <span class="ar-arrival__plane"><ar-icon name="plane" [size]="16" /></span>
      <div style="text-align: right"><span>{{ to()?.time }}</span><b>{{ to()?.code }}</b><span>{{ to()?.city }}</span></div>
    </div>
    <div class="ar-arrival__bar" role="progressbar" [attr.aria-valuenow]="percent()" aria-valuemin="0" aria-valuemax="100" aria-label="Flight progress">
      <i [style.width]="(progress() || 0) * 100 + '%'"></i>
    </div>
  `,
})
export class ArArrivalTile {
  readonly tone = input<ArWidgetTone>('dark');
  readonly ariaLabel = input<string>();
  readonly eyebrow = input<string>('Arrival in');
  readonly eta = input<string>('');
  readonly from = input<ArAirportStop | null>(null);
  readonly to = input<ArAirportStop | null>(null);
  /** 0–1. */
  readonly progress = input<number>(0);

  protected readonly percent = computed(() => Math.round((this.progress() || 0) * 100));
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-arrival'));
}

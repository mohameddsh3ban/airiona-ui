import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ArIcon } from '../core/icon.component';

export interface ArStripStat {
  /** Heroicons name. */
  icon: string;
  /** The figure, e.g. "140". */
  value: string;
  label: string;
  /** Tint of the icon disc. Default blue. */
  tone?: 'blue' | 'green' | 'amber';
}

/**
 * Three or four proof figures in one white card, each with a tinted icon disc.
 *
 * ```html
 * <ar-stat-strip label="Airiona in numbers" [items]="[{ icon: 'map-pin', value: '140', label: 'Airports' }]" />
 * ```
 */
@Component({
  selector: 'ar-stat-strip',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <ul class="ar ar-statstrip" [attr.aria-label]="label() || null">
      @for (it of items(); track $index) {
        <li [class]="'ar-statstrip__item ar-statstrip__item--' + (it.tone || 'blue')">
          <span class="ar-statstrip__icon" aria-hidden="true"><ar-icon [name]="it.icon" [size]="20" /></span>
          <span class="ar-statstrip__text"><b>{{ it.value }}</b><span>{{ it.label }}</span></span>
        </li>
      }
    </ul>
  `,
})
export class ArStatStrip {
  readonly items = input<ArStripStat[]>([]);
  /** Accessible name of the list. */
  readonly label = input<string>();
}

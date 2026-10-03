import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ArIcon } from '../core/icon.component';

export interface ArInfoStat {
  /** Heroicons name, drawn solid. */
  icon: string;
  label: string;
}

/**
 * Three quick facts, each with a solid icon in a small grey square.
 *
 * ```html
 * <ar-info-stat-row [items]="[{ icon: 'clock', label: '2h drive' }, { icon: 'sun', label: '16°C' }, { icon: 'star', label: '4.8' }]" />
 * ```
 */
@Component({
  selector: 'ar-info-stat-row',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'm-infostats' },
  template: `
    @for (it of items(); track it.label) {
      <span><i><ar-icon [name]="it.icon" [size]="16" variant="solid" /></i>{{ it.label }}</span>
    }
  `,
})
export class ArInfoStatRow {
  readonly items = input<ArInfoStat[]>([]);
}

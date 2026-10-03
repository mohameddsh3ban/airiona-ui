import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { cx } from '../core/utils';

export interface ArAmenity {
  icon: string;
  label: string;
}

/**
 * Row of icon tiles that sums up a stay: guests, rooms, key facilities. Show 4–6 items.
 *
 * ```html
 * <ar-amenity-list [items]="[{ icon: 'users', label: '4 guests' }, { icon: 'bed', label: '2 bedrooms' }]" />
 * ```
 */
@Component({
  selector: 'ar-amenity-list',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <ul [class]="listClass()" style="list-style: none; margin: 0px; padding: 0px">
      @for (it of items(); track it.label) {
        <li class="ar-amen__item"><span class="ar-amen__icon"><ar-icon [name]="it.icon" [size]="22" [strokeWidth]="1.5" /></span>{{ it.label }}</li>
      }
    </ul>
  `,
})
export class ArAmenityList {
  readonly items = input<ArAmenity[]>([]);
  /** No tile behind the icons. */
  readonly plain = input(false, { transform: booleanAttribute });
  protected readonly listClass = computed(() => cx('ar-amen', this.plain() && 'ar-amen--plain'));
}

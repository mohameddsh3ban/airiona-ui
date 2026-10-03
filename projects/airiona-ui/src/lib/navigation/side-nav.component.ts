import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArIndicator } from '../core/indicator.directive';

export interface ArNavItem {
  value: string;
  label: string;
  icon: string;
  /** Only for things waiting on the user. */
  count?: number;
}
export interface ArNavSection {
  title?: string;
  items: ArNavItem[];
}

/**
 * Vertical app navigation for the operator dashboard. The active item is an ink pill that slides between items.
 *
 * ```html
 * <ar-side-nav [sections]="sections" [(value)]="page" />
 * ```
 */
@Component({
  selector: 'ar-side-nav',
  imports: [ArIcon, ArIndicator],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <nav class="ar-side" [attr.aria-label]="label()">
      <span class="ar-side__ind" arIndicator='[aria-current="page"]' arIndicatorAxis="y"></span>
      @for (sec of sections(); track sec.title ?? $index) {
        @if (sec.title) {
          <div class="ar-side__group"><span class="ar-overline">{{ sec.title }}</span></div>
        }
        @for (it of sec.items; track it.value) {
          <button type="button" class="ar-side__item" [attr.aria-current]="value() === it.value ? 'page' : null" (click)="value.set(it.value)">
            <ar-icon [name]="it.icon" [size]="19" /><span>{{ it.label }}</span>
            @if (it.count) {
              <span class="ar-side__count">{{ it.count }}</span>
            }
          </button>
        }
      }
    </nav>
  `,
})
export class ArSideNav {
  readonly sections = input<ArNavSection[]>([]);
  /** Active item value. Two-way: `[(value)]`. */
  readonly value = model<string | null>(null);
  /** Accessible name of the navigation landmark. */
  readonly label = input('Main');
}

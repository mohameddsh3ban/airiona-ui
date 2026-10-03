import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, model, output } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArIndicator } from '../core/indicator.directive';
import { ArPlatform } from '../core/platform';
import { cx } from '../core/utils';

export interface ArTabItem {
  value: string;
  /** Accessible name; shown under the icon in the `labels` variant. */
  label: string;
  icon: string;
  /** Red dot for unread items. */
  badge?: boolean;
}

export type ArTabBarVariant = 'dot' | 'fab' | 'pill' | 'labels';

/**
 * Bottom navigation: `dot` (solid icon + blue dot), `fab` (raised centre create button), `pill` (floating midnight capsule)
 * or `labels`. One indicator slides to the active tab; tab changes fire a light haptic tick.
 *
 * ```html
 * <ar-tab-bar [items]="nav" [(value)]="tab" />
 * <ar-tab-bar variant="fab" [items]="nav" (fab)="create()" />
 * ```
 */
@Component({
  selector: 'ar-tab-bar',
  imports: [ArIcon, ArIndicator, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', role: 'tablist', '[attr.aria-label]': 'label()' },
  template: `
    <ng-template #tab let-it>
      <button
        type="button"
        role="tab"
        [attr.aria-selected]="it.value === current() ? 'true' : 'false'"
        [attr.aria-label]="it.label"
        [class]="'m-tabbar__item m-tap' + (it.value === current() ? ' is-on' : '')"
        (click)="pick(it.value)"
      >
        <ar-icon [name]="it.icon" [size]="24" [variant]="it.value === current() && variant() !== 'pill' ? 'solid' : 'outline'" [strokeWidth]="1.6" />
        @if (it.badge) {
          <span class="m-tabbar__badge"></span>
        }
        @if (variant() === 'labels') {
          <span class="m-tabbar__label">{{ it.label }}</span>
        }
      </button>
    </ng-template>
    <span class="m-tabbar__ind" arIndicator=".m-tabbar__item.is-on"></span>
    @if (variant() === 'fab') {
      @for (it of firstHalf(); track it.value) {
        <ng-container [ngTemplateOutlet]="tab" [ngTemplateOutletContext]="{ $implicit: it }" />
      }
      <button type="button" class="m-tabbar__fab m-tap" [attr.aria-label]="fabLabel()" (click)="pressFab()">
        <ar-icon [name]="fabIcon()" [size]="24" [strokeWidth]="2.2" />
      </button>
      @for (it of secondHalf(); track it.value) {
        <ng-container [ngTemplateOutlet]="tab" [ngTemplateOutletContext]="{ $implicit: it }" />
      }
    } @else {
      @for (it of items(); track it.value) {
        <ng-container [ngTemplateOutlet]="tab" [ngTemplateOutletContext]="{ $implicit: it }" />
      }
    }
  `,
})
export class ArTabBar {
  private readonly platform = inject(ArPlatform);

  /** 3–5 tabs. */
  readonly items = input<ArTabItem[]>([]);
  /** Active tab value; defaults to the first item. */
  readonly value = model<string | null>(null);
  readonly variant = input<ArTabBarVariant>('dot');
  /** Accessible name of the bar. */
  readonly label = input<string>('Main');
  readonly fabIcon = input<string>('plus');
  readonly fabLabel = input<string>('Create');
  /** The centre create button was pressed (`fab` variant). */
  readonly fab = output<void>();

  protected readonly current = computed(() => this.value() ?? this.items()[0]?.value ?? null);
  private readonly half = computed(() => Math.ceil(this.items().length / 2));
  protected readonly firstHalf = computed(() => this.items().slice(0, this.half()));
  protected readonly secondHalf = computed(() => this.items().slice(this.half()));
  protected readonly hostClass = computed(() => cx('m-tabbar', `m-tabbar--${this.variant()}`));

  protected pick(v: string): void {
    this.platform.haptic();
    this.value.set(v);
  }

  protected pressFab(): void {
    this.platform.haptic(12);
    this.fab.emit();
  }
}

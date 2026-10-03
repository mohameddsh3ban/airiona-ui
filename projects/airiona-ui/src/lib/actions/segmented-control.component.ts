import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArIndicator } from '../core/indicator.directive';
import { ArValueControl, arValueAccessor } from '../core/value-control';
import { ArOption, cx, toOption } from '../core/utils';

/**
 * Pill group for switching between peer views or modes. One indicator slides to the selected option.
 * Works with `[(value)]`, `[(ngModel)]` and `formControlName`.
 *
 * ```html
 * <ar-segmented-control label="Trip type" [options]="['One way', 'Round trip']" [(value)]="trip" />
 * <ar-segmented-control label="Views" [options]="[{ value: 'all', label: 'All', count: 12 }]" formControlName="view" />
 * ```
 */
@Component({
  selector: 'ar-segmented-control',
  imports: [ArIcon, ArIndicator],
  providers: [arValueAccessor(() => ArSegmentedControl)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', role: 'tablist', '[attr.aria-label]': 'label()' },
  template: `
    <span class="ar-seg__ind" arIndicator='[aria-selected="true"]'></span>
    @for (o of opts(); track o.value) {
      <button
        type="button"
        role="tab"
        class="ar-seg__item"
        [attr.aria-selected]="current() === o.value ? 'true' : 'false'"
        [disabled]="isDisabled() || o.disabled"
        (click)="commit(o.value); touch()"
      >
        @if (o.icon) {
          <ar-icon [name]="o.icon" [size]="16" />
        }
        {{ o.label }}
        @if (o.count !== undefined) {
          <span class="ar-seg__count">{{ o.count }}</span>
        }
      </button>
    }
  `,
})
export class ArSegmentedControl extends ArValueControl<string | null> {
  readonly value = model<string | null>(null);
  readonly options = input<Array<string | ArOption>>([]);
  /** Accessible name of the group. */
  readonly label = input<string>();
  readonly tone = input<'ink' | 'brand' | 'surface'>('ink');
  readonly variant = input<'track' | 'pills'>('track');
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  protected readonly opts = computed(() => this.options().map(toOption));
  /** Falls back to the first option when nothing is selected yet. */
  protected readonly current = computed(() => this.value() ?? this.opts()[0]?.value ?? null);
  protected readonly hostClass = computed(() =>
    cx('ar-seg', `ar-seg--${this.tone()}`, this.variant() === 'pills' && 'ar-seg--pills', this.size() !== 'md' && `ar-seg--${this.size()}`),
  );
}

import { ChangeDetectionStrategy, Component, booleanAttribute, computed, inject, input, model, output } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArPlatform } from '../core/platform';
import { ArValueControl, arValueAccessor } from '../core/value-control';
import { ArOption, toOption } from '../core/utils';

/**
 * Horizontally scrolling single-choice chips that bleed to the screen edges, with an optional leading filter button.
 * The selection is a form value: `[(value)]`, `[(ngModel)]`, `formControlName`.
 *
 * ```html
 * <ar-chip-scroller label="Sort places" [options]="['Most viewed', 'Nearby', 'Latest']" [(value)]="sort" />
 * <ar-chip-scroller tone="brand" showFilter (filter)="openFilters()" [options]="filters" formControlName="by" />
 * ```
 */
@Component({
  selector: 'ar-chip-scroller',
  imports: [ArIcon],
  providers: [arValueAccessor(() => ArChipScroller)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'm-chips', role: 'radiogroup', '[attr.aria-label]': 'label()' },
  template: `
    @if (showFilter()) {
      <button type="button" class="m-chips__filter m-tap" aria-label="All filters" (click)="filter.emit()">
        <ar-icon name="funnel" [size]="18" />
      </button>
    }
    @for (o of opts(); track o.value) {
      <button
        type="button"
        role="radio"
        [attr.aria-checked]="o.value === current() ? 'true' : 'false'"
        [class]="tone() === 'brand' ? 'm-chip m-tap is-brand' : 'm-chip m-tap'"
        [disabled]="isDisabled() || o.disabled"
        (click)="pick(o.value)"
      >{{ o.label }}</button>
    }
  `,
})
export class ArChipScroller extends ArValueControl<string | null> {
  private readonly platform = inject(ArPlatform);

  readonly value = model<string | null>(null);
  readonly options = input<Array<string | ArOption>>([]);
  /** Accessible name of the group. */
  readonly label = input<string>('Filter');
  readonly tone = input<'ink' | 'brand'>('ink');
  /** Shows the leading filter button, which emits (filter). React: passing `onFilter`. */
  readonly showFilter = input(false, { transform: booleanAttribute });
  readonly filter = output<void>();

  protected readonly opts = computed(() => this.options().map(toOption));
  /** Falls back to the first option when nothing is selected yet. */
  protected readonly current = computed(() => this.value() ?? this.opts()[0]?.value ?? null);

  protected pick(v: string): void {
    if (this.isDisabled()) return;
    this.platform.haptic();
    this.commit(v);
    this.touch();
  }
}

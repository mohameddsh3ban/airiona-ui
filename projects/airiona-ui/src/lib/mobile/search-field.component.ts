import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, model, output } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArValueControl, arValueAccessor } from '../core/value-control';
import { cx, uid } from '../core/utils';

/**
 * 56px mobile search with the keyboard's search key and an optional filter button: `filled` (sunken) or `outline`.
 * The text is a form value: `[(value)]`, `[(ngModel)]`, `formControlName`.
 *
 * ```html
 * <ar-search-field placeholder="Search stays" [(value)]="q" showFilter (filter)="filtersOpen.set(true)" />
 * ```
 */
@Component({
  selector: 'ar-search-field',
  imports: [ArIcon],
  providers: [arValueAccessor(() => ArSearchField)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', role: 'search' },
  template: `
    <label [attr.for]="fieldId()" class="m-search__field">
      <ar-icon name="magnifying-glass" [size]="20" />
      <input
        [id]="fieldId()"
        type="search"
        inputmode="search"
        enterkeyhint="search"
        [placeholder]="placeholder()"
        [attr.aria-label]="label() || placeholder() || 'Search'"
        [value]="value() ?? ''"
        [disabled]="isDisabled()"
        (input)="commit($any($event.target).value)"
        (blur)="touch()"
      />
    </label>
    @if (showFilter()) {
      <button type="button" class="m-search__filter m-tap" [attr.aria-label]="filterLabel()" (click)="filter.emit()">
        <ar-icon name="adjustments-horizontal" [size]="20" />
      </button>
    }
  `,
})
export class ArSearchField extends ArValueControl<string | null> {
  readonly value = model<string | null>('');
  readonly placeholder = input<string>('Search');
  /** Accessible name; defaults to the placeholder. */
  readonly label = input<string>();
  readonly variant = input<'filled' | 'outline'>('filled');
  /** Shows the filter button, which emits (filter). React: passing `onFilter`. */
  readonly showFilter = input(false, { transform: booleanAttribute });
  readonly filterLabel = input<string>('Filters');
  readonly id = input<string>();
  readonly filter = output<void>();

  private readonly autoId = uid('m-search');
  protected readonly fieldId = computed(() => this.id() || this.autoId);
  protected readonly hostClass = computed(() => cx('m-search', `m-search--${this.variant()}`));
}

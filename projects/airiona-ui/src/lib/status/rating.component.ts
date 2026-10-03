import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, numberAttribute } from '@angular/core';
import { ArIcon } from '../core/icon.component';

/**
 * Star score with the number and, when known, the review count. Use `compact` (one star + number) in cards and rows.
 *
 * ```html
 * <ar-rating [value]="4.8" count="2,104" />
 * <ar-rating [value]="4.9" compact />
 * ```
 */
@Component({
  selector: 'ar-rating',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ar-rating', '[attr.aria-label]': 'ariaLabel()' },
  template: `
    @if (compact()) {
      <ar-icon name="star" variant="solid" [size]="size()" style="color: var(--rating)" />
    } @else {
      <span class="ar-rating__stars" aria-hidden="true">
        @for (on of stars(); track $index) {
          <ar-icon name="star" variant="solid" [size]="size()" [iconClass]="on ? '' : 'ar-rating__star--off'" />
        }
      </span>
    }
    <span aria-hidden="true">{{ shown() }}</span>
    @if (count()) {
      <span class="ar-rating__count" aria-hidden="true">({{ count() }})</span>
    }
  `,
})
export class ArRating {
  /** 0–5. */
  readonly value = input(0, { transform: numberAttribute });
  /** Preformatted review count, e.g. "2,104". */
  readonly count = input<string>();
  /** Star size in px. */
  readonly size = input(16, { transform: numberAttribute });
  /** One star and the number. */
  readonly compact = input(false, { transform: booleanAttribute });

  protected readonly stars = computed(() => {
    const r = Math.round(this.value() || 0);
    return [1, 2, 3, 4, 5].map((i) => i <= r);
  });
  protected readonly shown = computed(() => (this.value() || 0).toFixed(1));
  protected readonly ariaLabel = computed(
    () => 'Rated ' + (this.value() || 0) + ' out of 5' + (this.count() ? ' from ' + this.count() + ' reviews' : ''),
  );
}

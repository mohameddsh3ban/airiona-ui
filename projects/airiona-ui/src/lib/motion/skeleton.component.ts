import { ChangeDetectionStrategy, Component, computed, input, numberAttribute } from '@angular/core';

/**
 * Shimmering placeholder in the shape of what is loading. Show it only after ~300ms of waiting.
 *
 * ```html
 * @if (stay.isLoading()) { <ar-skeleton variant="card" label="Loading stay" /> }
 * ```
 */
@Component({
  selector: 'ar-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"ar-skel ar-skel--" + variant()',
    role: 'status',
    '[attr.aria-label]': 'label()',
    'aria-busy': 'true',
  },
  template: `
    @if (variant() === 'card') {
      <i class="ar-skel__media"></i>
    }
    @if (variant() === 'row') {
      <i class="ar-skel__avatar"></i>
    }
    <div class="ar-skel__lines">
      @for (w of widths(); track $index) {
        <i class="ar-skel__line" [style.width]="w"></i>
      }
    </div>
  `,
})
export class ArSkeleton {
  readonly variant = input<'card' | 'row' | 'text'>('card');
  readonly lines = input(3, { transform: numberAttribute });
  readonly label = input('Loading');
  protected readonly widths = computed(() =>
    Array.from({ length: this.lines() }, (_, i) => (i === this.lines() - 1 ? '58%' : `${92 - i * 6}%`)),
  );
}

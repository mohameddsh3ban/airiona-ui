import { ChangeDetectionStrategy, Component, computed, input, numberAttribute, signal } from '@angular/core';
import { cx } from '../core/utils';

/**
 * A description clamped to a few lines that fades out, with Read more / Show less.
 *
 * ```html
 * <ar-expandable-text [lines]="3">A black timber cabin with floor-to-ceiling glass…</ar-expandable-text>
 * ```
 */
@Component({
  selector: 'ar-expandable-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()' },
  template: `
    <p [style.--lines]="lines()"><ng-content /></p>
    <button type="button" class="m-expand__btn m-tap" [attr.aria-expanded]="open() ? 'true' : 'false'" (click)="open.set(!open())">
      {{ open() ? 'Show less' : moreLabel() }}
    </button>
  `,
})
export class ArExpandableText {
  /** Lines shown while collapsed. */
  readonly lines = input(4, { transform: numberAttribute });
  readonly moreLabel = input('Read more');

  protected readonly open = signal(false);
  protected readonly hostClass = computed(() => cx('m-expand', this.open() && 'is-open'));
}

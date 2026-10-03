import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { cx } from '../core/utils';

export type ArIconButtonVariant = 'surface' | 'soft' | 'outline' | 'ink' | 'brand' | 'glass' | 'white' | 'ghost';

/**
 * Round icon-only button. `label` is required: it becomes the accessible name and tooltip.
 * For a toggle (save heart), bind `[attr.aria-pressed]`.
 *
 * ```html
 * <button arIconButton icon="bell" label="Notifications" badge></button>
 * <button arIconButton icon="heart" label="Save" variant="glass" [attr.aria-pressed]="saved()" (click)="saved.set(!saved())"></button>
 * ```
 */
@Component({
  selector: 'button[arIconButton]',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-label]': 'label()',
    '[attr.title]': 'label()',
    '[attr.data-icon]': 'icon()',
  },
  template: `
    <ar-icon [name]="icon()" [size]="iconSize()" />
    @if (badge()) {
      <span class="ar-iconbtn__badge"></span>
    }
  `,
})
export class ArIconButton {
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly variant = input<ArIconButtonVariant>('surface');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  /** Red dot for unread items. */
  readonly badge = input(false, { transform: booleanAttribute });

  protected readonly iconSize = computed(() => (this.size() === 'sm' ? 16 : this.size() === 'lg' ? 22 : 18));
  protected readonly hostClass = computed(() =>
    cx('ar-iconbtn', `ar-iconbtn--${this.variant()}`, this.size() !== 'md' && `ar-iconbtn--${this.size()}`),
  );
}

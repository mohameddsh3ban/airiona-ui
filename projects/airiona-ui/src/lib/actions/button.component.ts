import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { cx } from '../core/utils';

export type ArButtonVariant = 'primary' | 'brand' | 'secondary' | 'soft' | 'ghost' | 'glass' | 'white' | 'danger';

/**
 * Pill button on a native `<button>` or `<a>`, so forms, `routerLink`, `type` and `disabled` work as usual.
 *
 * ```html
 * <button arButton variant="primary" arrow>Book now</button>
 * <a arButton variant="secondary" iconStart="arrow-down-tray" routerLink="/invoice">Invoice</a>
 * <button arButton [loading]="paying()">Pay $1,284</button>
 * ```
 */
@Component({
  selector: 'button[arButton], a[arButton]',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.disabled]': 'disabled() || loading() ? "" : null',
    '[attr.aria-disabled]': 'disabled() || loading() ? "true" : null',
    '[attr.aria-busy]': 'loading() ? "true" : null',
  },
  template: `
    @if (loading()) {
      <span class="ar-btn__spinner" aria-hidden="true"></span>
    } @else if (iconStart()) {
      <ar-icon [name]="iconStart()!" [size]="iconSize()" />
    }
    <ng-content />
    @if (iconEnd() && !hasArrow()) {
      <ar-icon [name]="iconEnd()!" [size]="iconSize()" />
    }
    @if (hasArrow()) {
      <span class="ar-btn__disc" aria-hidden="true"><ar-icon [name]="arrowIcon()" [size]="16" [strokeWidth]="2" /></span>
    }
  `,
})
export class ArButton {
  readonly variant = input<ArButtonVariant>('primary');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly iconStart = input<string>();
  readonly iconEnd = input<string>();
  /** `true` shows the arrow-up-right disc; or pass another icon name for the disc. */
  readonly arrow = input<boolean | string>(false);
  readonly block = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Shows a spinner and disables the button. Change the label too ("Paying…"). */
  readonly loading = input(false, { transform: booleanAttribute });

  protected readonly iconSize = computed(() => (this.size() === 'lg' ? 20 : 18));
  /** A bare `arrow` attribute arrives as '' and still means "show the disc". */
  protected readonly hasArrow = computed(() => this.arrow() !== false && this.arrow() !== 'false');
  protected readonly arrowIcon = computed(() => {
    const a = this.arrow();
    return typeof a === 'string' && a !== '' && a !== 'true' ? a : 'arrow-up-right';
  });
  protected readonly hostClass = computed(() =>
    cx(
      'ar-btn',
      `ar-btn--${this.variant()}`,
      this.size() !== 'md' && `ar-btn--${this.size()}`,
      this.block() && 'ar-btn--block',
      this.hasArrow() && 'ar-btn--arrow',
    ),
  );
}

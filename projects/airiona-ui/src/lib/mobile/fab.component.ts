import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArPlatform } from '../core/platform';
import { cx } from '../core/utils';

/**
 * Floating action button on a native `<button>`: round (60px) or extended with a label and a white icon disc.
 * One per screen. Fires a haptic tick on press.
 *
 * ```html
 * <button arFab ariaLabel="New booking" (click)="create()"></button>
 * <button arFab label="Add booking" tone="brand"></button>
 * ```
 */
@Component({
  selector: 'button[arFab]',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: 'button',
    '[class]': 'hostClass()',
    '[attr.aria-label]': 'label() ? null : ariaLabel() || "Create"',
    '(click)': 'tick()',
  },
  template: `
    @if (label()) {
      <span>{{ label() }}</span>
    }
    <span class="m-fab__icon"><ar-icon [name]="icon()" [size]="22" [strokeWidth]="2.2" /></span>
  `,
})
export class ArFab {
  private readonly platform = inject(ArPlatform);

  /** Visible label; makes the button extended. */
  readonly label = input<string>();
  readonly icon = input<string>('plus');
  readonly tone = input<'ink' | 'brand'>('ink');
  /** Accessible name for the round button (default "Create"). */
  readonly ariaLabel = input<string>();

  protected readonly hostClass = computed(() => cx('m-fab', 'm-tap', !!this.label() && 'm-fab--extended', `m-fab--${this.tone()}`));

  protected tick(): void {
    this.platform.haptic(12);
  }
}

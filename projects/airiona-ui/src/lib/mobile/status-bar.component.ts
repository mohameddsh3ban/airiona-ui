import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { cx } from '../core/utils';

/**
 * The 9:41 time with signal, Wi-Fi and battery glyphs over the top of a mobile screen. Docs and prototypes only.
 *
 * ```html
 * <ar-status-bar tone="light" />
 * ```
 */
@Component({
  selector: 'ar-status-bar',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', 'aria-hidden': 'true' },
  template: `
    <b>{{ time() }}</b>
    <span class="m-status__icons">
      <svg width="18" height="12" viewBox="0 0 18 12">
        @for (hh of bars; track $index) {
          <rect [attr.x]="$index * 4.6" [attr.y]="12 - hh" width="3.2" [attr.height]="hh" rx="1" fill="currentColor" />
        }
      </svg>
      <ar-icon name="wifi" [size]="16" [strokeWidth]="2.2" />
      <svg width="27" height="13" viewBox="0 0 27 13">
        <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity="0.4" />
        <rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor" />
        <rect x="24.5" y="4" width="1.6" height="5" rx="0.8" fill="currentColor" opacity="0.5" />
      </svg>
    </span>
  `,
})
export class ArStatusBar {
  /** `dark` text on light screens, `light` on dark headers. */
  readonly tone = input<'dark' | 'light'>('dark');
  readonly time = input<string>('9:41');
  protected readonly bars = [3, 6, 9, 12];
  protected readonly hostClass = computed(() => cx('m-status', this.tone() === 'light' && 'is-light'));
}

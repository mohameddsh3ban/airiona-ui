import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';
import { cx } from '../core/utils';
import { ArStatusBar } from './status-bar.component';

/**
 * A 390 × 820 device frame with status bar, dynamic island and home indicator, for presenting mobile screens in docs.
 *
 * ```html
 * <ar-phone-frame statusTone="light">
 *   <div class="m-screen is-flush is-top">…</div>
 *   <ar-tab-bar [items]="nav" />
 * </ar-phone-frame>
 * ```
 */
@Component({
  selector: 'ar-phone-frame',
  imports: [ArStatusBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', '[style.width]': 'cssWidth()' },
  template: `
    <div class="m-phone__screen" [style.height]="cssHeight()">
      <span class="m-phone__island" aria-hidden="true"></span>
      @if (statusBar()) {
        <ar-status-bar [tone]="statusTone() || (dark() ? 'light' : 'dark')" />
      }
      <ng-content />
      <span class="m-phone__home" [class.is-light]="homeTone() === 'light'" aria-hidden="true"></span>
    </div>
  `,
})
export class ArPhoneFrame {
  readonly dark = input(false, { transform: booleanAttribute });
  /** Shows the status bar (default true). */
  readonly statusBar = input(true, { transform: booleanAttribute });
  /** Status bar text colour; defaults to light on a dark frame. */
  readonly statusTone = input<'dark' | 'light'>();
  readonly homeTone = input<'dark' | 'light'>('dark');
  /** Number (px) or any CSS length. */
  readonly width = input<number | string>();
  /** Screen height, number (px) or any CSS length. */
  readonly height = input<number | string>();

  protected readonly cssWidth = computed(() => toCss(this.width()));
  protected readonly cssHeight = computed(() => toCss(this.height()));
  protected readonly hostClass = computed(() => cx('ar', 'm-phone', this.dark() && 'm-phone--dark'));
}

function toCss(v: number | string | undefined | null): string | null {
  if (v === undefined || v === null || v === '') return null;
  return typeof v === 'number' ? `${v}px` : v;
}

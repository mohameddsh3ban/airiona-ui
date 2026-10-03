import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, numberAttribute, output } from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArIcon } from '../core/icon.component';
import { cx } from '../core/utils';

export type ArToastTone = 'info' | 'success' | 'warning' | 'danger';

const TOAST_ICON: Record<ArToastTone, string> = { info: 'bell', success: 'check-circle', warning: 'clock', danger: 'exclamation-triangle' };

/**
 * A short notice that floats above the page. The projected content is the one-sentence message.
 * `dismissible` shows the close button; `duration` (ms) shows a timer bar that pauses on hover and emits `closed` when it ends.
 * Danger toasts use `role="alert"`.
 *
 * ```html
 * <ar-toast tone="success" title="Booking confirmed" time="now" action="View itinerary" dismissible
 *           [duration]="6000" (actionPress)="open()" (closed)="remove()">
 *   Scandinavian Forest Cabin · 15–19 Oct.
 * </ar-toast>
 * ```
 */
@Component({
  selector: 'ar-toast',
  imports: [ArIcon, ArIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.role]': 'tone() === "danger" ? "alert" : "status"',
    // `title` is an input here; keep the native tooltip attribute off the host.
    '[attr.title]': 'null',
  },
  template: `
    <div class="ar-toast__icon"><ar-icon [name]="iconName()" [size]="18" [strokeWidth]="2" /></div>
    <div class="ar-toast__body">
      <div class="ar-toast__title">{{ title() }}@if (time()) {<span class="ar-toast__time">{{ time() }}</span>}</div>
      <div class="ar-toast__msg"><ng-content /></div>
      @if (action()) {
        <button type="button" class="ar-toast__action" (click)="actionPress.emit()">{{ action() }}</button>
      }
    </div>
    @if (dismissible()) {
      <button
        arIconButton
        icon="x-mark"
        size="sm"
        variant="ghost"
        label="Dismiss"
        style="background: transparent; color: var(--ink-subtle); margin-top: -4px; margin-right: -4px"
        (click)="closed.emit()"
      ></button>
    }
    @if (duration()) {
      <span class="ar-toast__timer" aria-hidden="true" [style.animation-duration.ms]="duration()" (animationend)="closed.emit()"></span>
    }
  `,
})
export class ArToast {
  readonly title = input<string>('');
  readonly tone = input<ArToastTone>('info');
  /** Overrides the tone's icon. */
  readonly icon = input<string>();
  /** Relative time, e.g. "2m". */
  readonly time = input<string>();
  /** Label of the inline action button. */
  readonly action = input<string>();
  /** Shows the close button (emits `closed`). */
  readonly dismissible = input(false, { transform: booleanAttribute });
  /** Milliseconds; shows a timer bar and emits `closed` when it ends. Hover pauses it. */
  readonly duration = input(0, { transform: numberAttribute });

  readonly actionPress = output<void>();
  readonly closed = output<void>();

  protected readonly iconName = computed(() => this.icon() || TOAST_ICON[this.tone()] || TOAST_ICON.info);
  protected readonly hostClass = computed(() => cx('ar-toast', `ar-toast--${this.tone()}`));
}

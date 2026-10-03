import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArIcon } from '../core/icon.component';
import { ArAvatarStack } from '../core/primitives';
import { cx } from '../core/utils';

/**
 * An event card: time, title in display type, a sub-line, people, duration chips and an open arrow.
 * The `done` variant collapses to a grey row with a check.
 *
 * ```html
 * <ar-agenda-card time="12:00 – 13:00" title="Airport transfer" subtitle="Driver meets you at gate B"
 *   [people]="['Omar Saleh', 'Lina Park']" [chips]="['Today', '1h']" openable (open)="go()" />
 * <ar-agenda-card variant="done" title="Host welcome call" subtitle="Arrival details with your host" />
 * ```
 */
@Component({
  selector: 'ar-agenda-card',
  imports: [ArIcon, ArIconButton, ArAvatarStack],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.title]': 'null',
    '[attr.role]': "!isDone() && pressable() ? 'button' : null",
    '[attr.tabindex]': '!isDone() && pressable() ? 0 : null',
    '(click)': 'press.emit()',
    '(keydown.enter)': 'onKey($event)',
    '(keydown.space)': 'onKey($event)',
  },
  template: `
    @if (isDone()) {
      <div><b class="m-agenda__title">{{ title() }}</b><span class="m-agenda__sub">{{ subtitle() }}</span></div>
      <span class="m-agenda__check" aria-label="Done"><ar-icon name="check" [size]="18" [strokeWidth]="2.4" /></span>
    } @else {
      <div class="m-agenda__row">
        <span class="m-agenda__time">{{ time() }}</span>
        @if (people()) {
          <ar-avatar-stack [people]="people()!" size="xs" />
        }
      </div>
      <b class="m-agenda__title">{{ title() }}</b><span class="m-agenda__sub">{{ subtitle() }}</span>
      @if (chips() || openable()) {
        <div class="m-agenda__row" style="margin-top: 18px">
          <div class="m-agenda__chips">
            @for (c of chips() || []; track c) {
              <span>{{ c }}</span>
            }
          </div>
          <button arIconButton type="button" icon="arrow-up-right" variant="ink" [label]="'Open ' + title()" (click)="onOpen($event)"></button>
        </div>
      }
    }
  `,
})
export class ArAgendaCard {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly time = input<string>();
  readonly people = input<string[]>();
  readonly chips = input<string[]>();
  readonly variant = input<'default' | 'done'>('default');
  /** Makes the default card a keyboard-reachable button (role="button", tabindex 0). Bind (press) with it. */
  readonly pressable = input(false, { transform: booleanAttribute });
  /** Shows the round arrow button that emits (open). */
  readonly openable = input(false, { transform: booleanAttribute });

  /** The card was clicked. */
  readonly press = output<void>();
  /** The arrow button was clicked (does not also emit press). */
  readonly open = output<void>();

  protected readonly isDone = computed(() => this.variant() === 'done');
  protected readonly hostClass = computed(() => cx('m-agenda', this.isDone() && 'is-done', 'm-tap'));

  protected onOpen(ev: Event): void {
    ev.stopPropagation();
    this.open.emit();
  }

  protected onKey(ev: Event): void {
    if (this.isDone() || !this.pressable() || ev.target !== ev.currentTarget) return;
    ev.preventDefault();
    this.press.emit();
  }
}

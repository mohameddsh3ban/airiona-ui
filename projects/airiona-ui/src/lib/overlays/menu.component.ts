import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArIcon } from '../core/icon.component';
import { arDismiss, arPopPosition } from '../core/platform';
import { cx, uid } from '../core/utils';

/** One entry of `ar-menu`. `{ divider: true }` draws a separator. */
export interface ArMenuItem {
  label?: string;
  icon?: string;
  /** Shown as a `kbd` at the right ("M", "⌘K"). */
  shortcut?: string;
  tone?: 'danger';
  disabled?: boolean;
  divider?: boolean;
  /** Free identifier for your `(action)` handler. */
  id?: string;
}

/**
 * Action dropdown under a ghost "more" button or any trigger you project with `arTrigger`.
 * Keyboard: Enter, Space or ↓ on the trigger opens and focuses the first item; ↑ ↓ move; Escape closes.
 * Emits `(action)` with the picked item.
 *
 * ```html
 * <ar-menu label="Booking actions" heading="Booking K7QX2M" [items]="items" (action)="run($event)" />
 * <ar-menu align="start" [items]="exports">
 *   <button arButton arTrigger variant="secondary" size="sm" iconEnd="chevron-down">Export</button>
 * </ar-menu>
 * ```
 */
@Component({
  selector: 'ar-menu',
  imports: [ArIcon, ArIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.align]': 'null', class: 'ar-menu', '(keydown)': 'onKey($event)', '(click)': 'onHostClick($event)' },
  template: `
    <ng-content select="[arTrigger]">
      <button
        arIconButton
        icon="ellipsis-horizontal"
        size="sm"
        variant="ghost"
        class="ar-menu__trigger"
        [label]="label() || 'More actions'"
        aria-haspopup="menu"
        [attr.aria-expanded]="open() ? 'true' : 'false'"
        [attr.aria-controls]="menuId()"
      ></button>
    </ng-content>
    @if (open()) {
      <div #pop role="menu" class="ar-pop ar-menu__pop" [id]="menuId()" [attr.aria-label]="label() || 'Actions'" [style]="popStyle()">
        @if (heading()) {
          <div class="ar-menu__heading">{{ heading() }}</div>
        }
        @for (it of items(); track $index; let i = $index) {
          @if (it.divider) {
            <div role="separator" class="ar-menu__sep"></div>
          } @else {
            <button
              type="button"
              role="menuitem"
              tabindex="-1"
              [attr.data-mi]="i"
              [disabled]="!!it.disabled"
              [class]="it.tone === 'danger' ? 'ar-menu__item is-danger' : 'ar-menu__item'"
              (mouseenter)="active.set(i)"
              (click)="pick(it)"
            >
              @if (it.icon) {
                <ar-icon [name]="it.icon" [size]="17" />
              }
              <span>{{ it.label }}</span>
              @if (it.shortcut) {
                <kbd class="ar-menu__kbd">{{ it.shortcut }}</kbd>
              }
            </button>
          }
        }
      </div>
    }
  `,
})
export class ArMenu {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly items = input<ArMenuItem[]>([]);
  /** Accessible name of the menu and the default trigger. */
  readonly label = input<string>();
  readonly heading = input<string>();
  /** `end` (default) aligns the popover's right edge to the trigger. */
  readonly align = input<'start' | 'end'>('end');
  /** Two-way. Starts open with `[open]="true"` (React `defaultOpen`). */
  readonly open = model(false);
  readonly id = input<string>();
  /** The picked item. */
  readonly action = output<ArMenuItem>();

  private readonly autoId = uid('ar-menu');
  protected readonly menuId = computed(() => this.id() || this.autoId);
  protected readonly active = signal(-1);
  private readonly actionable = computed(() =>
    this.items().reduce<number[]>((acc, it, i) => (it.divider || it.disabled ? acc : [...acc, i]), []),
  );

  private readonly pop = viewChild<ElementRef<HTMLElement>>('pop');
  protected readonly popStyle = arPopPosition(
    this.open,
    () => this.trigger(),
    () => this.pop()?.nativeElement,
    () => (this.align() === 'start' ? 'start' : 'end'),
    220,
  );

  constructor() {
    arDismiss(this.open, () => [this.host.nativeElement], () => this.open.set(false));
    // Keep a projected trigger's ARIA in sync, like React's cloneElement.
    afterRenderEffect(() => {
      const open = this.open();
      const id = this.menuId();
      const t = this.host.nativeElement.querySelector<HTMLElement>(':scope > [artrigger]');
      if (!t) return;
      t.setAttribute('aria-haspopup', 'menu');
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
      t.setAttribute('aria-controls', id);
    });
    // Roving focus on the active item.
    afterRenderEffect(() => {
      if (!this.open()) return;
      const el = this.host.nativeElement.querySelector<HTMLElement>(`[data-mi="${this.active()}"]`);
      el?.focus();
    });
  }

  private trigger(): HTMLElement | null {
    return this.host.nativeElement.querySelector<HTMLElement>('[aria-haspopup]');
  }

  private toggle(first: boolean): void {
    const nv = !this.open();
    this.open.set(nv);
    this.active.set(nv && first ? (this.actionable()[0] ?? -1) : -1);
  }

  private move(d: number): void {
    const a = this.actionable();
    if (!a.length) return;
    const pos = a.indexOf(this.active());
    this.active.set(a[(pos + d + a.length) % a.length]);
  }

  protected pick(it: ArMenuItem): void {
    this.open.set(false);
    this.action.emit(it);
    this.host.nativeElement.querySelector<HTMLElement>('.ar-menu__trigger, [aria-haspopup=menu]')?.focus();
  }

  protected onHostClick(ev: MouseEvent): void {
    const t = this.trigger();
    if (t && t.contains(ev.target as Node)) this.toggle(false);
  }

  protected onKey(ev: KeyboardEvent): void {
    const target = ev.target as HTMLElement;
    if (!this.open() && (ev.key === 'ArrowDown' || ev.key === 'Enter' || ev.key === ' ') && target.getAttribute?.('aria-haspopup') === 'menu') {
      ev.preventDefault();
      this.toggle(true);
      return;
    }
    if (!this.open()) return;
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      this.move(1);
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      this.move(-1);
    } else if (ev.key === 'Tab') {
      this.open.set(false);
    }
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  booleanAttribute,
  computed,
  inject,
  input,
  linkedSignal,
  model,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { arDismiss, arPopPosition } from '../core/platform';
import { ArValueControl, arValueAccessor } from '../core/value-control';
import { ArOption, cx, toOption, uid } from '../core/utils';

/** One entry of `ar-select`. Plain strings are accepted too. */
export interface ArSelectOption {
  value: string;
  label: string;
  /** What makes this option different ("Lie-flat seat, lounge access"). Also searched. */
  description?: string;
  icon?: string;
  /** Price or code shown in mono at the right. */
  meta?: string;
  disabled?: boolean;
}

/**
 * Dropdown listbox for picking one value: cabin class, airport, currency, sort order.
 * The trigger matches `ar-text-field`, so selects and fields line up in one form grid.
 * Keyboard: Enter, Space or ↓ opens; ↑ ↓ Home End move; Enter picks; Escape and Tab close.
 * Works with `[(value)]`, `[(ngModel)]` and `formControlName`.
 *
 * ```html
 * <ar-select label="Cabin class" [options]="cabins" [(value)]="cabin" />
 * <ar-select label="Departure airport" searchable searchPlaceholder="City or airport code" [options]="airports" formControlName="from" />
 * ```
 */
@Component({
  selector: 'ar-select',
  imports: [ArIcon],
  providers: [arValueAccessor(() => ArSelect)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.align]': 'null', '[class]': 'hostClass()', '(keydown)': 'onKey($event)' },
  template: `
    @if (label()) {
      <span class="ar-field__label" [id]="selId() + '-l'">{{ label() }}</span>
    }
    <button
      #trigger
      type="button"
      class="ar-field__control ar-select__trigger"
      [disabled]="isDisabled()"
      aria-haspopup="listbox"
      [attr.aria-expanded]="open() ? 'true' : 'false'"
      [attr.aria-controls]="selId() + '-list'"
      [attr.aria-labelledby]="label() ? selId() + '-l ' + selId() + '-v' : null"
      [attr.aria-label]="label() ? null : placeholder()"
      [attr.aria-describedby]="message() ? selId() + '-m' : null"
      (click)="setOpen(!open())"
    >
      @if (current()?.icon || iconStart()) {
        <ar-icon [name]="current()?.icon || iconStart()!" [size]="18" />
      }
      <span [class]="current() ? 'ar-select__value' : 'ar-select__value is-placeholder'" [id]="selId() + '-v'">{{
        current() ? current()!.label : placeholder() || 'Choose…'
      }}</span>
      @if (current()?.meta && !hideMeta()) {
        <span class="ar-select__meta">{{ current()!.meta }}</span>
      }
      <ar-icon name="chevron-down" [size]="18" iconClass="ar-select__chev" />
    </button>
    @if (open()) {
      <div #pop class="ar-pop ar-select__pop" [style]="popStyle()">
        @if (searchable()) {
          <div class="ar-select__search">
            <ar-icon name="magnifying-glass" [size]="16" />
            <input
              #search
              [value]="query()"
              [placeholder]="searchPlaceholder() || 'Search'"
              aria-label="Filter options"
              [attr.aria-controls]="selId() + '-list'"
              [attr.aria-activedescendant]="shown()[active()] ? selId() + '-o' + active() : null"
              (input)="onQuery($any($event.target).value)"
            />
          </div>
        }
        <ul #list role="listbox" class="ar-select__list" tabindex="-1" [id]="selId() + '-list'" [attr.aria-labelledby]="label() ? selId() + '-l' : null">
          @if (shown().length === 0) {
            <li class="ar-select__empty">{{ emptyText() || 'No matches' }}</li>
          }
          @for (o of shown(); track o.value; let idx = $index) {
            <li
              role="option"
              [id]="selId() + '-o' + idx"
              [attr.data-idx]="idx"
              [attr.aria-selected]="o.value === value() ? 'true' : 'false'"
              [attr.aria-disabled]="o.disabled ? 'true' : null"
              [class]="optionClass(o, idx)"
              (mouseenter)="active.set(idx)"
              (mousedown)="$event.preventDefault()"
              (click)="choose(o)"
            >
              @if (o.icon) {
                <span class="ar-option__icon"><ar-icon [name]="o.icon" [size]="18" /></span>
              }
              <span class="ar-option__text">
                <span class="ar-option__label">{{ o.label }}</span>
                @if (o.description) {
                  <span class="ar-option__desc">{{ o.description }}</span>
                }
              </span>
              @if (o.meta) {
                <span class="ar-option__meta">{{ o.meta }}</span>
              }
              <span class="ar-option__check" aria-hidden="true">
                @if (o.value === value()) {
                  <ar-icon name="check" [size]="16" [strokeWidth]="2.25" />
                }
              </span>
            </li>
          }
        </ul>
      </div>
    }
    @if (message()) {
      <div class="ar-field__hint" [id]="selId() + '-m'">
        @if (error()) {
          <ar-icon name="exclamation-triangle" [size]="14" />
        }
        {{ message() }}
      </div>
    }
  `,
})
export class ArSelect extends ArValueControl<string | null> {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly value = model<string | null>(null);
  readonly options = input<Array<string | ArSelectOption>>([]);
  /** Two-way. Starts the popover open (React `defaultOpen`). */
  readonly open = model(false);
  readonly label = input<string>();
  readonly placeholder = input<string>();
  readonly hint = input<string>();
  readonly error = input<string | null>();
  /** Adds a filter field at the top of the list. Turn on above 8 options. */
  readonly searchable = input(false, { transform: booleanAttribute });
  readonly searchPlaceholder = input<string>();
  readonly emptyText = input<string>();
  readonly variant = input<'outline' | 'sunken'>('outline');
  /** `sm` is a 40px pill for toolbars. */
  readonly size = input<'md' | 'sm'>('md');
  /** `end` opens right-aligned. */
  readonly align = input<'start' | 'end'>('start');
  readonly iconStart = input<string>();
  /** Hide the selected option's meta in the trigger. */
  readonly hideMeta = input(false, { transform: booleanAttribute });
  readonly id = input<string>();

  private readonly autoId = uid('ar-sel');
  protected readonly selId = computed(() => this.id() || this.autoId);
  protected readonly query = signal('');
  /** Highlighted option; resets to the selected option each time the list opens. */
  protected readonly active = linkedSignal({
    source: () => this.open(),
    computation: () => untracked(() => Math.max(0, this.shown().findIndex((o) => o.value === this.value()))),
  });

  protected readonly opts = computed<ArSelectOption[]>(() => this.options().map((o) => toOption(o as string | ArOption) as ArSelectOption));
  protected readonly shown = computed(() => {
    const q = this.query().toLowerCase();
    if (!q) return this.opts();
    return this.opts().filter((o) => o.label.toLowerCase().includes(q) || (o.description || '').toLowerCase().includes(q));
  });
  protected readonly current = computed(() => this.opts().find((o) => o.value === this.value()) ?? null);
  protected readonly message = computed(() => this.error() || this.hint());
  protected readonly hostClass = computed(() =>
    cx(
      'ar-field',
      'ar-select',
      this.variant() === 'sunken' && 'ar-field--sunken',
      !!this.error() && 'ar-field--error',
      this.size() === 'sm' && 'ar-select--sm',
      this.open() && 'is-open',
    ),
  );

  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly pop = viewChild<ElementRef<HTMLElement>>('pop');
  private readonly list = viewChild<ElementRef<HTMLElement>>('list');
  private readonly search = viewChild<ElementRef<HTMLInputElement>>('search');

  protected readonly popStyle = arPopPosition(
    this.open,
    () => this.trigger()?.nativeElement,
    () => this.pop()?.nativeElement,
    () => this.align(),
    240,
  );

  constructor() {
    super();
    arDismiss(this.open, () => [this.host.nativeElement], () => this.setOpen(false));
    // Focus the filter and keep the active option in view.
    afterRenderEffect(() => {
      if (!this.open()) return;
      const idx = this.active();
      if (this.searchable()) this.search()?.nativeElement.focus();
      const el = this.list()?.nativeElement.querySelector(`[data-idx="${idx}"]`) as HTMLElement | null;
      el?.scrollIntoView?.({ block: 'nearest' });
    });
  }

  /** Opens or closes the list. Opening highlights the selected option. */
  setOpen(v: boolean): void {
    if (v && this.isDisabled()) return;
    if (!v) {
      this.query.set('');
      if (this.open()) this.touch();
    }
    this.open.set(v);
  }

  protected optionClass(o: ArSelectOption, idx: number): string {
    return cx('ar-option', idx === this.active() && 'is-active', o.disabled && 'is-disabled');
  }

  protected onQuery(v: string): void {
    this.query.set(v);
    this.active.set(0);
  }

  protected choose(o: ArSelectOption | undefined): void {
    if (!o || o.disabled) return;
    this.commit(o.value);
    this.setOpen(false);
    this.trigger()?.nativeElement.focus();
  }

  protected onKey(ev: KeyboardEvent): void {
    const k = ev.key;
    const open = this.open();
    if (!open && (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || k === ' ')) {
      ev.preventDefault();
      this.setOpen(true);
      return;
    }
    if (!open) return;
    const n = this.shown().length;
    if (k === 'ArrowDown') {
      ev.preventDefault();
      this.active.set(Math.min(n - 1, this.active() + 1));
    } else if (k === 'ArrowUp') {
      ev.preventDefault();
      this.active.set(Math.max(0, this.active() - 1));
    } else if (k === 'Home') {
      ev.preventDefault();
      this.active.set(0);
    } else if (k === 'End') {
      ev.preventDefault();
      this.active.set(n - 1);
    } else if (k === 'Enter') {
      ev.preventDefault();
      this.choose(this.shown()[this.active()]);
    } else if (k === 'Tab') {
      this.setOpen(false);
    } else if (k === ' ' && !this.searchable()) {
      ev.preventDefault();
      this.choose(this.shown()[this.active()]);
    }
  }
}

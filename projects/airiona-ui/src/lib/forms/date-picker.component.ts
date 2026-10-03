import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
  numberAttribute,
  signal,
  viewChild,
} from '@angular/core';
import { ArButton } from '../actions/button.component';
import { ArIconButton } from '../actions/icon-button.component';
import { ArIcon } from '../core/icon.component';
import { ArPlatform, arDismiss, arPopPosition } from '../core/platform';
import { ArValueControl, arValueAccessor } from '../core/value-control';
import { DOW_MON, DOW_SHORT, MONTHS, MONTHS_SHORT, cx, pad2, uid } from '../core/utils';

/** `[checkIn, checkOut]` as ISO dates; either side may be null while picking. */
export type ArDateRange = [string | null, string | null];
/** ISO date (`'2026-10-15'`) in single mode, a range in range mode, or null. */
export type ArDateValue = string | ArDateRange | null;

export interface ArDatePreset {
  label: string;
  value: string | ArDateRange;
}

interface DayCell {
  iso: string;
  day: number;
  off: boolean;
  cls: string;
  pressed: boolean;
  label: string;
  price: string | null;
  focusable: boolean;
}
interface MonthView {
  key: string;
  title: string;
  lead: number[];
  days: DayCell[];
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function fromISO(s: string): Date {
  const p = String(s).split('-');
  return new Date(+p[0], +p[1] - 1, +p[2]);
}
function addDays(iso: string, n: number): string {
  const d = fromISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}
function nightsBetween(a: string, b: string): number {
  return Math.round((fromISO(b).getTime() - fromISO(a).getTime()) / 86400000);
}
function fmtLong(iso: string): string {
  const d = fromISO(iso);
  return `${DOW_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}
function fmtRange(a: string, b: string): string {
  const x = fromISO(a);
  const y = fromISO(b);
  return x.getMonth() === y.getMonth()
    ? `${x.getDate()}–${y.getDate()} ${MONTHS_SHORT[y.getMonth()]}`
    : `${x.getDate()} ${MONTHS_SHORT[x.getMonth()]} – ${y.getDate()} ${MONTHS_SHORT[y.getMonth()]}`;
}

/**
 * Date field that opens a calendar popover. Picks one date, or a check-in / check-out range across two months,
 * with presets, nightly prices, low-price days, booked-out days and a footer that states the result.
 * Values are ISO date strings. Works with `[(value)]`, `[(ngModel)]` and `formControlName`.
 * Keyboard: arrows by day and week, Page Up / Down by month, Home / End to the week's ends, Enter picks, Escape closes.
 *
 * ```html
 * <ar-date-picker label="Departure" min="2026-10-03" [(value)]="departure" />
 * <ar-date-picker mode="range" variant="tiles" [prices]="prices" [unavailable]="booked" formControlName="stay" />
 * ```
 */
@Component({
  selector: 'ar-date-picker',
  imports: [ArIcon, ArIconButton, ArButton],
  providers: [arValueAccessor(() => ArDatePicker)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.align]': 'null', '[class]': 'hostClass()' },
  template: `
    @if (label()) {
      <span class="ar-field__label" [id]="dpId() + '-l'">{{ label() }}</span>
    }
    @if (mode() === 'range' && variant() === 'tiles') {
      <div class="ar-dp__tiles">
        <button
          type="button"
          [class]="open() && activeEdge() === 'start' ? 'ar-tile is-active' : 'ar-tile'"
          aria-haspopup="dialog"
          [attr.aria-expanded]="open() ? 'true' : 'false'"
          (click)="open() && activeEdge() === 'start' ? setOpen(false) : setOpen(true, 'start')"
        >
          <span class="ar-tile__label"><ar-icon name="calendar-days" [size]="14" />{{ startLabel() || 'Check-in' }}</span>
          <span [class]="start() ? 'ar-tile__value' : 'ar-tile__value is-placeholder'">{{ start() ? long(start()!) : 'Add date' }}</span>
        </button>
        <button
          type="button"
          [class]="open() && activeEdge() === 'end' ? 'ar-tile is-active' : 'ar-tile'"
          aria-haspopup="dialog"
          [attr.aria-expanded]="open() ? 'true' : 'false'"
          (click)="open() && activeEdge() === 'end' ? setOpen(false) : setOpen(true, start() ? 'end' : 'start')"
        >
          <span class="ar-tile__label"><ar-icon name="calendar-days" [size]="14" />{{ endLabel() || 'Check-out' }}</span>
          <span [class]="end() ? 'ar-tile__value' : 'ar-tile__value is-placeholder'">{{ end() ? long(end()!) : 'Add date' }}</span>
        </button>
      </div>
    } @else {
      <button
        type="button"
        class="ar-field__control ar-select__trigger"
        [disabled]="isDisabled()"
        aria-haspopup="dialog"
        [attr.aria-expanded]="open() ? 'true' : 'false'"
        [attr.aria-labelledby]="label() ? dpId() + '-l ' + dpId() + '-v' : null"
        [attr.aria-describedby]="message() ? dpId() + '-m' : null"
        (click)="setOpen(!open())"
      >
        <ar-icon name="calendar-days" [size]="18" />
        <span [class]="triggerText() ? 'ar-select__value' : 'ar-select__value is-placeholder'" [id]="dpId() + '-v'">{{
          triggerText() || placeholder() || (mode() === 'range' ? 'Add dates' : 'Add date')
        }}</span>
        @if (mode() === 'range' && nights()) {
          <span class="ar-select__meta">{{ nights() }} {{ unitLabel() }}</span>
        }
        <ar-icon name="chevron-down" [size]="18" iconClass="ar-select__chev" />
      </button>
    }
    @if (open()) {
      <div
        #pop
        class="ar-pop ar-dp__pop"
        role="dialog"
        aria-modal="false"
        [attr.aria-label]="label() || (mode() === 'range' ? 'Choose dates' : 'Choose a date')"
        [style]="popStyle()"
      >
        @if (presets().length) {
          <div class="ar-dp__presets">
            @for (p of presets(); track p.label) {
              <button type="button" class="ar-chip ar-dp__preset" [attr.aria-pressed]="presetOn(p) ? 'true' : 'false'" (click)="applyPreset(p)">
                {{ p.label }}
              </button>
            }
          </div>
        }
        <div class="ar-dp__nav">
          <button arIconButton icon="chevron-left" size="sm" variant="soft" label="Previous month" (click)="shiftView(-1)"></button>
          <button arIconButton icon="chevron-right" size="sm" variant="soft" label="Next month" (click)="shiftView(1)"></button>
        </div>
        @for (k of [viewKey()]; track k) {
          <div
            #grid
            [class]="'ar-dp__months ar-slide-in ' + slideDir()"
            [style.grid-template-columns]="'repeat(' + monthCount() + ', minmax(0, 1fr))'"
            (keydown)="onGridKey($event)"
            (mouseleave)="hover.set(null)"
          >
            @for (mv of monthViews(); track mv.key) {
              <div class="ar-dp__month">
                <div class="ar-dp__title" aria-live="polite">{{ mv.title }}</div>
                <div class="ar-cal__grid" role="group" [attr.aria-label]="mv.title">
                  @for (w of dow; track w) {
                    <span class="ar-cal__dow" aria-hidden="true">{{ w }}</span>
                  }
                  @for (b of mv.lead; track b) {
                    <span class="ar-cal__day is-out" aria-hidden="true"></span>
                  }
                  @for (c of mv.days; track c.iso) {
                    <button
                      type="button"
                      [attr.data-iso]="c.iso"
                      [disabled]="c.off"
                      [attr.tabindex]="c.focusable ? 0 : -1"
                      [attr.aria-pressed]="c.pressed ? 'true' : 'false'"
                      [attr.aria-label]="c.label"
                      [class]="c.cls"
                      (click)="focusIso.set(c.iso); pick(c.iso)"
                      (mouseenter)="onHover(c.iso)"
                    >
                      {{ c.day }}
                      @if (c.price) {
                        <span class="ar-cal__price">{{ c.price }}</span>
                      }
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        }
        <div class="ar-dp__foot">
          <span class="ar-dp__summary" aria-live="polite">{{ summary() }}</span>
          <div class="ar-dp__actions">
            <button arButton variant="ghost" size="sm" [disabled]="!start()" (click)="clear()">Clear</button>
            <button arButton variant="primary" size="sm" (click)="setOpen(false)">Done</button>
          </div>
        </div>
      </div>
    }
    @if (message()) {
      <div class="ar-field__hint" [id]="dpId() + '-m'">
        @if (error()) {
          <ar-icon name="exclamation-triangle" [size]="14" />
        }
        {{ message() }}
      </div>
    }
  `,
})
export class ArDatePicker extends ArValueControl<ArDateValue> {
  /** `'2026-10-15'` for a local Date. */
  static readonly toISO = toISO;
  /** Adds n days to an ISO date. */
  static readonly addDays = addDays;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platform = inject(ArPlatform);

  readonly value = model<ArDateValue>(null);
  readonly mode = input<'single' | 'range'>('single');
  /** `tiles` (range only) shows Check-in and Check-out side by side. */
  readonly variant = input<'field' | 'tiles' | 'sunken'>('field');
  /** Two-way. `[open]="true"` starts it open (React `defaultOpen`). */
  readonly open = model(false);
  readonly label = input<string>();
  readonly placeholder = input<string>();
  readonly hint = input<string>();
  readonly error = input<string | null>();
  readonly min = input<string>();
  readonly max = input<string>();
  /** Booked-out ISO dates (hatched and struck through). */
  readonly unavailable = input<string[]>([]);
  readonly isDateDisabled = input<(iso: string) => boolean>();
  /** `{ '2026-10-15': '$128' }`, shown under each day. */
  readonly prices = input<Record<string, string>>({});
  /** Days whose price turns green. */
  readonly lowPrices = input<string[]>([]);
  readonly presets = input<ArDatePreset[]>([]);
  /** 1 or 2; range defaults to 2. Narrow screens always get 1. */
  readonly months = input<number | undefined, unknown>(undefined, { transform: (v: unknown) => (v == null || v === '' ? undefined : numberAttribute(v)) });
  readonly startLabel = input<string>();
  readonly endLabel = input<string>();
  /** Replaces "night"/"nights". */
  readonly unit = input<string>();
  /** Count both ends (day ranges). */
  readonly inclusive = input(false, { transform: booleanAttribute });
  readonly maxNights = input<number>();
  /** ISO date treated as today (defaults to the real date). */
  readonly today = input<string>();
  readonly align = input<'start' | 'end'>('start');
  readonly id = input<string>();

  protected readonly dow = DOW_MON;
  private readonly autoId = uid('ar-dp');
  protected readonly dpId = computed(() => this.id() || this.autoId);
  protected readonly hover = signal<string | null>(null);
  protected readonly focusIso = signal<string | null>(null);
  protected readonly activeEdge = signal<'start' | 'end' | null>(null);
  protected readonly slideDir = signal('');
  private readonly view = signal<{ y: number; m: number } | null>(null);
  private readonly narrow = signal(false);

  protected readonly todayISO = computed(() => this.today() || toISO(new Date()));
  protected readonly start = computed<string | null>(() => {
    const v = this.value();
    return this.mode() === 'range' ? (Array.isArray(v) ? v[0] : null) : typeof v === 'string' ? v : null;
  });
  protected readonly end = computed<string | null>(() => {
    const v = this.value();
    return this.mode() === 'range' && Array.isArray(v) ? v[1] : null;
  });
  protected readonly monthCount = computed(() => (this.narrow() ? 1 : this.months() || (this.mode() === 'range' ? 2 : 1)));
  /** View month; until the first navigation it follows the selected start (or min / today). */
  private readonly viewYM = computed(() => {
    const v = this.view();
    if (v) return v;
    const d = fromISO(this.start() || this.min() || this.todayISO());
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  protected readonly viewKey = computed(() => `${this.viewYM().y}-${this.viewYM().m}`);
  protected readonly nights = computed(() => {
    const s = this.start();
    const e = this.end();
    return s && e ? nightsBetween(s, e) + (this.inclusive() ? 1 : 0) : 0;
  });
  protected readonly unitLabel = computed(() => this.unit() || (this.nights() === 1 ? 'night' : 'nights'));
  protected readonly summary = computed(() => {
    const s = this.start();
    const e = this.end();
    if (this.mode() === 'single') return s ? fmtLong(s) : 'Choose a date';
    if (!s) return `${this.startLabel() || 'Check-in'}: choose a date`;
    if (!e) return `Now choose ${(this.endLabel() || 'check-out').toLowerCase()}`;
    return `${fmtRange(s, e)} · ${this.nights()} ${this.unitLabel()}`;
  });
  protected readonly triggerText = computed(() => {
    const s = this.start();
    const e = this.end();
    if (this.mode() === 'single') return s ? fmtLong(s) : null;
    return s && e ? fmtRange(s, e) : s ? `${fmtLong(s)} – …` : null;
  });
  protected readonly message = computed(() => this.error() || this.hint());
  protected readonly hostClass = computed(() =>
    cx('ar-field', 'ar-select', 'ar-dp', this.variant() === 'sunken' && 'ar-field--sunken', !!this.error() && 'ar-field--error', this.open() && 'is-open'),
  );

  protected readonly monthViews = computed<MonthView[]>(() => {
    const { y: vy, m: vm } = this.viewYM();
    const range = this.mode() === 'range';
    const start = this.start();
    const end = this.end();
    const hover = this.hover();
    const today = this.todayISO();
    const prices = this.prices();
    const low = this.lowPrices();
    const min = this.min();
    const max = this.max();
    const focus = this.focusIso();
    const previewEnd = range && start && !end && hover && hover > start ? hover : null;
    const out: MonthView[] = [];
    for (let offset = 0; offset < this.monthCount(); offset++) {
      const base = new Date(vy, vm + offset, 1);
      const y = base.getFullYear();
      const m = base.getMonth();
      const lead = Array.from({ length: (base.getDay() + 6) % 7 }, (_, i) => i);
      const count = new Date(y, m + 1, 0).getDate();
      const days: DayCell[] = [];
      for (let d = 1; d <= count; d++) {
        const iso = `${y}-${pad2(m + 1)}-${pad2(d)}`;
        const off = this.isOff(iso);
        const isS = iso === start;
        const isE = iso === end || iso === previewEnd;
        const rangeEnd = end || previewEnd;
        const inR = !!start && !!rangeEnd && iso > start && iso < rangeEnd;
        const price = prices[iso] && !off ? prices[iso] : null;
        days.push({
          iso,
          day: d,
          off,
          focusable: iso === focus,
          pressed: isS || isE || inR,
          price,
          label:
            `${fmtLong(iso)} ${y}` +
            (off ? ', unavailable' : prices[iso] ? `, ${prices[iso]}` : '') +
            (isS && range ? ', check-in' : '') +
            (iso === end ? ', check-out' : ''),
          cls: cx(
            'ar-cal__day',
            off && ((!!min && iso < min) || (!!max && iso > max)) && 'is-past',
            (isS || isE) && 'is-edge',
            isS && 'is-start',
            isE && 'is-end',
            range && !!rangeEnd && 'has-range',
            inR && 'is-in',
            !end && !!previewEnd && (inR || iso === previewEnd) && 'is-preview',
            iso === today && 'is-today',
            low.includes(iso) && 'is-low',
          ),
        });
      }
      out.push({ key: `${y}-${m}`, title: `${MONTHS[m]} ${y}`, lead, days });
    }
    return out;
  });

  private readonly pop = viewChild<ElementRef<HTMLElement>>('pop');
  private readonly grid = viewChild<ElementRef<HTMLElement>>('grid');
  private readonly basePop = arPopPosition(
    this.open,
    () => this.host.nativeElement.querySelector<HTMLElement>('[aria-haspopup]'),
    () => this.pop()?.nativeElement,
    () => this.align(),
  );
  /** React passes a minimum width of 620 (two months) or 320 (one month). */
  protected readonly popStyle = computed(() => {
    const s = this.basePop();
    const mw = s['min-width'];
    return mw ? { ...s, 'min-width': `max(${mw}, ${this.monthCount() === 2 ? 620 : 320}px)` } : s;
  });

  constructor() {
    super();
    arDismiss(this.open, () => [this.host.nativeElement], () => this.setOpen(false));
    afterRenderEffect(() => {
      const iso = this.focusIso();
      this.viewKey();
      if (!this.open() || !iso) return;
      const el = this.grid()?.nativeElement.querySelector<HTMLElement>(`[data-iso="${iso}"]`);
      el?.focus({ preventScroll: true });
    });
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const win = this.platform.window;
      if (!win) return;
      const check = () => this.narrow.set(win.innerWidth < 720);
      check();
      win.addEventListener('resize', check);
      destroyRef.onDestroy(() => win.removeEventListener('resize', check));
    });
  }

  private isOff(iso: string): boolean {
    const min = this.min();
    const max = this.max();
    const fn = this.isDateDisabled();
    return (!!min && iso < min) || (!!max && iso > max) || this.unavailable().includes(iso) || (fn ? fn(iso) : false);
  }

  private setView(iso: string): void {
    const d = fromISO(iso);
    this.view.set({ y: d.getFullYear(), m: d.getMonth() });
  }

  /** Opens at the edge being edited (`which`), or closes. */
  setOpen(v: boolean, which?: 'start' | 'end'): void {
    if (v) {
      const today = this.todayISO();
      const f = (which === 'end' && this.end()) || this.start() || (this.isOff(today) ? null : today) || this.min() || today;
      this.setView(f);
      this.focusIso.set(f);
      this.activeEdge.set(which || 'start');
    } else {
      this.hover.set(null);
      this.activeEdge.set(null);
      if (this.open()) this.touch();
    }
    this.open.set(v);
  }

  protected long(iso: string): string {
    return fmtLong(iso);
  }

  protected shiftView(n: number): void {
    const { y, m } = this.viewYM();
    this.slideDir.set(n > 0 ? 'is-next' : 'is-prev');
    const nm = m + n;
    this.view.set({ y: y + Math.floor(nm / 12), m: ((nm % 12) + 12) % 12 });
  }

  protected onHover(iso: string): void {
    if (this.mode() === 'range' && this.start() && !this.end()) this.hover.set(iso);
  }

  protected pick(iso: string): void {
    if (this.isOff(iso)) return;
    if (!this.view()) this.view.set(this.viewYM());
    if (this.mode() === 'single') {
      this.commit(iso);
      this.setOpen(false);
      return;
    }
    const start = this.start();
    const end = this.end();
    if (!start || end || iso <= start) {
      this.commit([iso, null]);
      this.activeEdge.set('end');
      return;
    }
    for (let d = start; d <= iso; d = addDays(d, 1)) {
      if (this.isOff(d)) {
        this.commit([iso, null]);
        this.activeEdge.set('end');
        return;
      }
    }
    const maxN = this.maxNights();
    if (maxN && nightsBetween(start, iso) > maxN) {
      this.commit([iso, null]);
      return;
    }
    this.commit([start, iso]);
    this.activeEdge.set(null);
  }

  protected presetOn(p: ArDatePreset): boolean {
    const v = this.value();
    if (this.mode() === 'range') return Array.isArray(v) && Array.isArray(p.value) && p.value[0] === v[0] && p.value[1] === v[1];
    return p.value === v;
  }

  protected applyPreset(p: ArDatePreset): void {
    this.commit(Array.isArray(p.value) ? [p.value[0], p.value[1]] : p.value);
    const first = Array.isArray(p.value) ? p.value[0] : p.value;
    if (first) {
      this.setView(first);
      this.focusIso.set(first);
    }
  }

  protected clear(): void {
    if (!this.view()) this.view.set(this.viewYM());
    this.commit(this.mode() === 'range' ? [null, null] : null);
    this.activeEdge.set('start');
  }

  protected onGridKey(ev: KeyboardEvent): void {
    const f = (ev.target as HTMLElement)?.getAttribute?.('data-iso') || this.focusIso();
    if (!f) return;
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    let n: string | null = null;
    if (map[ev.key] !== undefined) n = addDays(f, map[ev.key]);
    else if (ev.key === 'PageUp' || ev.key === 'PageDown') {
      const d = fromISO(f);
      const t = new Date(d.getFullYear(), d.getMonth() + (ev.key === 'PageUp' ? -1 : 1), 1);
      t.setDate(Math.min(d.getDate(), new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate()));
      n = toISO(t);
    } else if (ev.key === 'Home') n = addDays(f, -((fromISO(f).getDay() + 6) % 7));
    else if (ev.key === 'End') n = addDays(f, 6 - ((fromISO(f).getDay() + 6) % 7));
    if (!n) return;
    ev.preventDefault();
    this.focusIso.set(n);
    if (this.mode() === 'range' && this.start() && !this.end()) this.hover.set(n);
    const { y, m } = this.viewYM();
    const nd = fromISO(n);
    const first = new Date(y, m, 1);
    const last = new Date(y, m + this.monthCount(), 0);
    if (nd < first) this.view.set({ y: nd.getFullYear(), m: nd.getMonth() });
    else if (nd > last) {
      const vd = new Date(nd.getFullYear(), nd.getMonth() - (this.monthCount() - 1), 1);
      this.view.set({ y: vd.getFullYear(), m: vd.getMonth() });
    } else if (!this.view()) this.view.set({ y, m });
  }
}

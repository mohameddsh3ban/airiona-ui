import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, linkedSignal, model, numberAttribute } from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArValueControl, arValueAccessor } from '../core/value-control';
import { DOW_MON, MONTHS, cx } from '../core/utils';

/** `[startDay, endDay]` inside the shown month; `null` for an open end. */
export type ArDayRange = [number | null, number | null];

interface CalDay {
  d: number;
  off: boolean;
  pressed: boolean;
  label: string;
  price: string | null;
  cls: string;
}

/**
 * Month grid for picking a date range, with the nightly price under each day and booked-out days hatched.
 * First click sets check-in, second sets check-out; a range that would cross an unavailable day restarts there.
 * The range is a form value: `[(range)]`, `[(ngModel)]` or `formControlName`.
 *
 * ```html
 * <ar-calendar [year]="2026" [month]="9" [today]="3" [unavailable]="[6, 7, 8]" [prices]="{ 12: '$98' }" [(range)]="stay" />
 * ```
 */
@Component({
  selector: 'ar-calendar',
  imports: [ArIconButton],
  providers: [arValueAccessor(() => ArCalendar)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ar-cal' },
  template: `
    <div class="ar-cal__head">
      <div class="ar-cal__title">{{ title() }}</div>
      <div class="ar-cal__nav">
        <button arIconButton icon="chevron-left" size="sm" variant="soft" label="Previous month" (click)="shift(-1)"></button>
        <button arIconButton icon="chevron-right" size="sm" variant="soft" label="Next month" (click)="shift(1)"></button>
      </div>
    </div>
    @for (k of [gridKey()]; track k) {
      <div [class]="gridClass()">
        @for (w of dow; track w) {
          <span class="ar-cal__dow">{{ w }}</span>
        }
        @for (b of blanks(); track $index) {
          <span class="ar-cal__day is-out"></span>
        }
        @for (c of cells(); track c.d) {
          <button
            type="button"
            [class]="c.cls"
            [disabled]="c.off || isDisabled()"
            [attr.aria-pressed]="c.pressed ? 'true' : 'false'"
            [attr.aria-label]="c.label"
            (click)="pick(c.d)"
            (blur)="touch()"
          >{{ c.d }}@if (c.price) {<span class="ar-cal__price">{{ c.price }}</span>}</button>
        }
      </div>
    }
    @if (legend()) {
      <div class="ar-cal__legend">
        <span><i class="ar-cal__swatch" style="background: var(--blue-500)"></i>Your stay</span>
        <span><i class="ar-cal__swatch ar-hatch" style="color: var(--line-control); background: var(--surface-sunken)"></i>Booked out</span>
        <span><i class="ar-cal__swatch" style="background: var(--success-tint); box-shadow: inset 0 0 0 1.5px var(--success)"></i>Lowest price</span>
      </div>
    }
  `,
})
export class ArCalendar extends ArValueControl<ArDayRange | null> {
  /** Selected range. Two-way: `[(range)]`. */
  readonly value = model<ArDayRange | null>([null, null], { alias: 'range' });
  /** Year shown first. */
  readonly year = input(2026, { transform: numberAttribute });
  /** Month shown first, 0–11. */
  readonly month = input(9, { transform: numberAttribute });
  /** Day numbers that are booked out. */
  readonly unavailable = input<number[]>([]);
  /** Nightly price per day number, e.g. `{ 12: '$98' }`. Keep to 4 characters. */
  readonly prices = input<Record<number, string>>({});
  /** Day numbers marked as lowest price. */
  readonly lowPrices = input<number[]>([]);
  readonly today = input<number>();
  readonly legend = input(true, { transform: booleanAttribute });

  protected readonly dow = DOW_MON;
  /** Shown month plus the slide direction of the last change. */
  private readonly view = linkedSignal(() => ({ y: this.year(), m: this.month(), dir: '' }));

  protected readonly title = computed(() => `${MONTHS[this.view().m]} ${this.view().y}`);
  protected readonly gridKey = computed(() => `${this.view().y}-${this.view().m}`);
  protected readonly gridClass = computed(() => cx('ar-cal__grid', 'ar-slide-in', this.view().dir));
  protected readonly blanks = computed(() => {
    const { y, m } = this.view();
    return Array.from({ length: (new Date(y, m, 1).getDay() + 6) % 7 });
  });
  protected readonly cells = computed<CalDay[]>(() => {
    const { y, m } = this.view();
    const days = new Date(y, m + 1, 0).getDate();
    const [s, e] = this.value() ?? [null, null];
    const off = this.unavailable();
    const prices = this.prices();
    const low = this.lowPrices();
    const today = this.today();
    const out: CalDay[] = [];
    for (let d = 1; d <= days; d++) {
      const isOff = off.indexOf(d) >= 0;
      const isS = d === s;
      const isE = d === e;
      const inR = s !== null && e !== null && d > s && d < e;
      const price = prices[d];
      out.push({
        d,
        off: isOff,
        pressed: isS || isE || inR,
        label: d + ' ' + MONTHS[m] + (isOff ? ', unavailable' : price ? ', ' + price : ''),
        price: price && !isOff ? price : null,
        cls: cx(
          'ar-cal__day',
          (isS || isE) && 'is-edge',
          isS && 'is-start',
          isE && 'is-end',
          e !== null && 'has-range',
          inR && 'is-in',
          today === d && 'is-today',
          low.indexOf(d) >= 0 && 'is-low',
        ),
      });
    }
    return out;
  });

  protected pick(d: number): void {
    const [s, e] = this.value() ?? [null, null];
    if (s === null || e !== null || d < s) this.commit([d, null]);
    else if (d === s) this.commit([null, null]);
    else {
      const off = this.unavailable();
      for (let i = s; i <= d; i++) {
        if (off.indexOf(i) >= 0) {
          this.commit([d, null]);
          return;
        }
      }
      this.commit([s, d]);
    }
  }

  protected shift(n: number): void {
    const { y, m } = this.view();
    const nm = m + n;
    this.view.set({ y: y + Math.floor(nm / 12), m: ((nm % 12) + 12) % 12, dir: n > 0 ? 'is-next' : 'is-prev' });
  }
}

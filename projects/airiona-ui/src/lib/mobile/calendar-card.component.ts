import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, model, numberAttribute } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArPlatform } from '../core/platform';
import { MONTHS } from '../core/utils';
import { ArValueControl, arValueAccessor } from '../core/value-control';

const CAL_DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/**
 * A midnight month card: SUN–SAT headers, blue dots on days with bookings, an underlined today,
 * and tap to select a day. The selected day number is a form value (`[(value)]`, `ngModel`, `formControlName`).
 *
 * ```html
 * <ar-calendar-card [year]="2026" [month]="5" [today]="9" [marks]="[2, 5, 14]" [(value)]="day" />
 * ```
 */
@Component({
  selector: 'ar-calendar-card',
  imports: [ArIcon],
  providers: [arValueAccessor(() => ArCalendarCard)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'm-cal' },
  template: `
    <div class="m-cal__head">
      <button type="button" class="m-cal__nav m-tap" aria-label="Previous month" (click)="shift(-1)"><ar-icon name="chevron-left" [size]="18" /></button>
      <b>{{ heading() }}</b>
      <button type="button" class="m-cal__nav m-tap" aria-label="Next month" (click)="shift(1)"><ar-icon name="chevron-right" [size]="18" /></button>
    </div>
    <div class="m-cal__grid">
      @for (w of dows; track w) {
        <span class="m-cal__dow">{{ w }}</span>
      }
      @for (n of grid().lead; track $index) {
        <span class="m-cal__day is-out">{{ n }}</span>
      }
      @for (d of grid().days; track d) {
        <button
          type="button"
          class="m-cal__day m-tap"
          [class.is-today]="d === today()"
          [class.is-sel]="d === value()"
          [attr.aria-pressed]="d === value() ? 'true' : 'false'"
          [attr.aria-label]="d + ' ' + monthName() + (isMarked(d) ? ', has bookings' : '')"
          [disabled]="isDisabled()"
          (click)="pick(d)"
        >{{ d }}@if (isMarked(d)) {<i aria-hidden="true"></i>}</button>
      }
      @for (n of grid().trail; track $index) {
        <span class="m-cal__day is-out">{{ n }}</span>
      }
    </div>
  `,
})
export class ArCalendarCard extends ArValueControl<number | null> {
  private readonly platform = inject(ArPlatform);

  /** The selected day of the month (1–31), or null. */
  readonly value = model<number | null>(null);
  readonly year = input(2026, { transform: numberAttribute });
  /** 0–11. */
  readonly month = input(5, { transform: numberAttribute });
  /** Day number underlined as today. */
  readonly today = input<number>();
  /** Day numbers that show a booking dot. */
  readonly marks = input<number[]>([]);

  protected readonly dows = CAL_DOW;
  /** The month on screen; starts at year/month and moves with the arrows. */
  private readonly view = linkedSignal(() => ({ y: this.year(), m: this.month() }));
  protected readonly monthName = computed(() => MONTHS[this.view().m]);
  protected readonly heading = computed(() => `${this.monthName()} ${this.view().y}`);
  protected readonly grid = computed(() => {
    const { y, m } = this.view();
    const lead = new Date(y, m, 1).getDay();
    const count = new Date(y, m + 1, 0).getDate();
    const prev = new Date(y, m, 0).getDate();
    const leadDays: number[] = [];
    for (let i = lead; i > 0; i--) leadDays.push(prev - i + 1);
    const days = Array.from({ length: count }, (_, i) => i + 1);
    const trail = (7 - ((lead + count) % 7)) % 7;
    return { lead: leadDays, days, trail: Array.from({ length: trail }, (_, i) => i + 1) };
  });

  protected isMarked(d: number): boolean {
    return this.marks().indexOf(d) >= 0;
  }

  protected shift(n: number): void {
    const { y, m } = this.view();
    const nm = m + n;
    this.view.set({ y: y + Math.floor(nm / 12), m: ((nm % 12) + 12) % 12 });
  }

  protected pick(d: number): void {
    this.platform.haptic();
    this.commit(d);
    this.touch();
  }
}

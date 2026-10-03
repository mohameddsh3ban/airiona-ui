import { ChangeDetectionStrategy, Component, computed, inject, input, model } from '@angular/core';
import { ArPlatform } from '../core/platform';
import { ArValueControl, arValueAccessor } from '../core/value-control';

export interface ArWeekDay {
  /** Day of month, also the value ("15"). */
  date: string;
  weekday: string;
  /** Shows the "has plans" dot. */
  dot?: boolean;
}

/**
 * Seven tall day pills; the selected day becomes an ink capsule. The value is the selected `date`
 * (defaults to the first day). Works with `[(value)]`, `[(ngModel)]` and `formControlName`.
 *
 * ```html
 * <ar-week-strip [days]="week" [(value)]="day" />
 * ```
 */
@Component({
  selector: 'ar-week-strip',
  providers: [arValueAccessor(() => ArWeekStrip)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'm-week', role: 'radiogroup', '[attr.aria-label]': 'label()' },
  template: `
    @for (d of days(); track d.date) {
      <button
        type="button"
        role="radio"
        class="m-week__day m-tap"
        [attr.aria-checked]="d.date === current() ? 'true' : 'false'"
        [disabled]="isDisabled()"
        (click)="pick(d.date)"
        (blur)="touch()"
      >
        <b>{{ d.date }}</b><span>{{ d.weekday }}</span>
        @if (d.dot) {
          <i aria-label="Has plans"></i>
        }
      </button>
    }
  `,
})
export class ArWeekStrip extends ArValueControl<string | null> {
  private readonly platform = inject(ArPlatform);

  readonly value = model<string | null>(null);
  readonly days = input<ArWeekDay[]>([]);
  /** Accessible name of the group. */
  readonly label = input('Choose a day');

  /** Falls back to the first day when nothing is selected yet. */
  protected readonly current = computed(() => this.value() ?? this.days()[0]?.date ?? null);

  protected pick(date: string): void {
    this.platform.haptic();
    this.commit(date);
  }
}

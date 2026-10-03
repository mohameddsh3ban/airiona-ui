import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArWidgetTone, widgetClass } from '../core/primitives';
import { ArValueControl, arValueAccessor } from '../core/value-control';
import { ArSelect, ArSelectOption } from '../forms/select.component';

export interface ArMeetingDay {
  date: number | string;
  weekday: string;
  /** Meetings that day; shows a dot when above 0. */
  count?: number;
}

/**
 * "Upcoming meetings" card: a month picker, a summary line and a row of pill days with a dot rail.
 * The selected day is a form value (`[(value)]`, ngModel, formControlName).
 *
 * ```html
 * <ar-meetings-strip [days]="days" summary="3 calls · Thu, 11" [months]="months" [(month)]="month" [(value)]="day" />
 * ```
 */
@Component({
  selector: 'ar-meetings-strip',
  imports: [ArIcon, ArSelect],
  providers: [arValueAccessor(() => ArMeetingsStrip)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', '[attr.title]': 'null', '[attr.role]': 'ariaLabel() ? "region" : null', '[attr.aria-label]': 'ariaLabel() || null' },
  template: `
    <div class="ar-w__row" style="align-items: flex-start">
      <h3 class="ar-meet__title">{{ title() }}</h3>
      @if (months().length) {
        <ar-select class="ar-meet__month" size="sm" align="end" [options]="months()" [(value)]="month" />
      }
    </div>
    <span class="ar-meet__summary"><ar-icon name="phone" [size]="16" />{{ summary() }}</span>
    <div class="ar-meet__days" role="radiogroup" aria-label="Choose a day">
      @for (d of days(); track d.date) {
        <button type="button" role="radio" class="ar-meet__day" [attr.aria-checked]="current() === d.date ? 'true' : 'false'" [disabled]="isDisabled()" (click)="commit(d.date); touch()">
          <b>{{ d.date }}</b><span>{{ d.weekday }}</span>
          @if (d.count) {
            <i [attr.aria-label]="d.count + ' meetings'"></i>
          }
        </button>
      }
    </div>
    <div class="ar-meet__dots" aria-hidden="true">
      @for (d of days(); track d.date) {
        <i [class.is-on]="current() === d.date"></i>
      }
    </div>
  `,
})
export class ArMeetingsStrip extends ArValueControl<number | string | null> {
  /** Selected day's `date`; falls back to the first day. */
  readonly value = model<number | string | null>(null);
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  readonly title = input('Upcoming Meetings');
  readonly summary = input<string>();
  readonly days = input<ArMeetingDay[]>([]);
  readonly months = input<Array<string | ArSelectOption>>([]);
  readonly month = model<string | null>(null);

  protected readonly current = computed(() => this.value() ?? this.days()[0]?.date ?? null);
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-meet'));
}

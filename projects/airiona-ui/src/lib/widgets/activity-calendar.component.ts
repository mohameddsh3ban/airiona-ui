import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArWidgetTone, widgetClass } from '../core/primitives';
import { MONTHS, MONTHS_SHORT, cx } from '../core/utils';

export type ArActivityState = 'goal' | 'partial' | 'today';

interface DayCell {
  key: string;
  cls: string;
  day: number;
  title: string | null;
  tag: string | null;
}

/**
 * Midnight month of round day cells: goal met (blue fill), partly met (blue ring), today (red), with a month tag over day 1.
 *
 * ```html
 * <ar-activity-calendar title="Daily activity" [year]="2026" [month]="10" [days]="{ 2: 'goal', 3: 'partial', 8: 'today' }" />
 * ```
 */
@Component({
  selector: 'ar-activity-calendar',
  imports: [ArIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.role]': 'ariaLabel() ? "region" : null',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.title]': 'null',
  },
  template: `
    <div class="ar-actcal__head">
      <b class="ar-actcal__title">{{ title() || 'Daily Activity' }}</b>
      <div class="ar-actcal__month">
        <button arIconButton icon="calendar" size="sm" variant="soft" label="Choose month" class="ar-w__darkbtn" (click)="chooseMonth.emit()"></button>
        <span class="ar-actcal__pill"><span>{{ monthName() }}</span><i></i><span>{{ year() }}</span></span>
      </div>
    </div>
    <div class="ar-actcal__grid" role="img" [attr.aria-label]="(title() || 'Daily activity') + ', ' + monthName() + ' ' + year()">
      @for (c of cells(); track c.key) {
        <span [class]="c.cls" [attr.title]="c.title">
          @if (c.tag) {
            <em class="ar-actcal__tag">{{ c.tag }}</em>
          }
          {{ c.day }}
        </span>
      }
    </div>
    @if (legend()) {
      <div class="ar-w__legendrow ar-actcal__legend">
        <span class="ar-legend"><i style="background: var(--blue-400)"></i>Goal met</span>
        <span class="ar-legend"><i style="background: transparent; box-shadow: inset 0 0 0 1.5px var(--blue-400)"></i>Partly</span>
        <span class="ar-legend"><i style="background: var(--danger)"></i>Today</span>
      </div>
    }
  `,
})
export class ArActivityCalendar {
  readonly tone = input<ArWidgetTone>('dark');
  readonly ariaLabel = input<string>();
  readonly year = input<number>(2026);
  /** 0–11. */
  readonly month = input<number>(10);
  /** `{ dayNumber: 'goal' | 'partial' | 'today' }`. */
  readonly days = input<Record<number, ArActivityState>>({});
  readonly title = input<string>();
  readonly legend = input(true, { transform: booleanAttribute });
  readonly showMonthTag = input(true, { transform: booleanAttribute });
  /** The calendar button was pressed. */
  readonly chooseMonth = output<void>();

  protected readonly monthName = computed(() => MONTHS[this.month()]);
  protected readonly cells = computed<DayCell[]>(() => {
    const y = this.year();
    const m = this.month();
    const st = this.days() || {};
    const lead = (new Date(y, m, 1).getDay() + 6) % 7;
    const count = new Date(y, m + 1, 0).getDate();
    const prevCount = new Date(y, m, 0).getDate();
    const out: DayCell[] = [];
    for (let i = lead; i > 0; i--) {
      out.push({ key: 'p' + i, cls: 'ar-actcal__day is-out', day: prevCount - i + 1, title: null, tag: null });
    }
    for (let d = 1; d <= count; d++) {
      const s = st[d];
      out.push({
        key: 'd' + d,
        cls: cx('ar-actcal__day', s && 'is-' + s),
        day: d,
        title: s ? d + ' ' + MONTHS[m] + ': ' + s : null,
        tag: d === 1 && this.showMonthTag() ? MONTHS_SHORT[m] : null,
      });
    }
    const trail = (7 - (out.length % 7)) % 7;
    for (let t = 1; t <= trail; t++) {
      out.push({ key: 'n' + t, cls: 'ar-actcal__day is-out', day: t, title: null, tag: null });
    }
    return out;
  });
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-actcal'));
}

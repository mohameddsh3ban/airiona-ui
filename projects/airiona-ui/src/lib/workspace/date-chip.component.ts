import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Pill with a big day number in a disc, then "Tue," / "January".
 *
 * ```html
 * <ar-date-chip day="19" weekday="Tue" month="January" />
 * ```
 */
@Component({
  selector: 'ar-date-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ar-datechip' },
  template: `<b>{{ day() }}</b><span>{{ weekday() }},<br />{{ month() }}</span>`,
})
export class ArDateChip {
  readonly day = input.required<string | number>();
  readonly weekday = input.required<string>();
  readonly month = input.required<string>();
}

import { ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';
import { ArIcon } from '../core/icon.component';

/**
 * Checkout progress line. Done steps are ink with a tick, the current step is Ion Blue, upcoming steps are numbers.
 * Keep labels to one word so five steps fit at 360px.
 *
 * ```html
 * <ar-booking-steps [current]="2" />
 * <ar-booking-steps [steps]="['Dates', 'Guests', 'Pay']" [current]="0" />
 * ```
 */
@Component({
  selector: 'ar-booking-steps',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <ol class="ar-steps">
      @for (s of steps(); track s; let i = $index) {
        <li
          [class]="i < current() ? 'ar-steps__step is-done' : i === current() ? 'ar-steps__step is-current' : 'ar-steps__step'"
          [attr.aria-current]="i === current() ? 'step' : null"
        >
          <span class="ar-steps__dot">
            @if (i < current()) {
              <ar-icon name="check" [size]="15" [strokeWidth]="2.5" />
            } @else {
              {{ i + 1 }}
            }
          </span>
          <span class="ar-steps__label">{{ s }}</span>
        </li>
      }
    </ol>
  `,
})
export class ArBookingSteps {
  readonly steps = input<string[]>(['Search', 'Select', 'Travellers', 'Payment', 'Confirmed']);
  /** 0-based index of the current step. */
  readonly current = input(0, { transform: numberAttribute });
}

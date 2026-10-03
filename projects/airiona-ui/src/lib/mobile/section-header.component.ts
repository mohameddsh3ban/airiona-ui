import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';
import { ArIcon } from '../core/icon.component';

/**
 * A 21px section title with a quiet "View all" action on the right.
 *
 * ```html
 * <ar-section-header title="Upcoming bookings" action="See all" chevron (press)="openAll()" />
 * ```
 */
@Component({
  selector: 'ar-section-header',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.title]': 'null', class: 'm-section' },
  template: `
    <h2 class="m-section__title">{{ title() }}</h2>
    @if (action()) {
      <button type="button" class="m-section__action m-tap" (click)="press.emit()">
        {{ action() }}
        @if (chevron()) {
          <ar-icon name="chevron-right" [size]="16" />
        }
      </button>
    }
  `,
})
export class ArSectionHeader {
  readonly title = input<string>();
  /** Label of the action button ("View all"); the button is shown only when set. */
  readonly action = input<string>();
  readonly chevron = input(false, { transform: booleanAttribute });
  /** The action button was pressed. React: `onAction`. */
  readonly press = output<void>();
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArWidgetTone, widgetClass } from '../core/primitives';

/**
 * Ticket-like tile with punched corner dots and an arrow: gate code in large display type, status and time.
 *
 * ```html
 * <ar-gate-tile code="B18" title="Gate open" caption="Boarding closes in 26 min" />
 * ```
 */
@Component({
  selector: 'ar-gate-tile',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.role]': 'ariaLabel() ? "region" : null',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.title]': 'null',
  },
  template: `
    <i class="ar-gate__dot is-tl"></i><i class="ar-gate__dot is-tr"></i><i class="ar-gate__dot is-bl"></i><i class="ar-gate__dot is-br"></i>
    <ar-icon name="arrow-up-right" [size]="30" [strokeWidth]="2" iconClass="ar-gate__arrow" />
    <b class="ar-gate__code">{{ code() }}</b>
    <b class="ar-gate__title">{{ title() }}</b>
    <span class="ar-gate__caption">{{ caption() }}</span>
  `,
})
export class ArGateTile {
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  readonly code = input<string>('');
  readonly title = input<string>('');
  readonly caption = input<string>();

  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-gate'));
}

import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArBadge } from '../core/primitives';

export interface ArTicketEnd {
  time: string;
  code: string;
  city: string;
}

/**
 * A flight result shaped like a ticket: times, codes and cities around a plane line, a dashed
 * perforation with half-circle notches, then class, price and airline.
 *
 * ```html
 * <ar-ticket-card badge="Best" [from]="{ time: '07:00', code: 'DXB', city: 'Dubai' }"
 *   [to]="{ time: '11:35', code: 'LHR', city: 'London' }" duration="7h 35m" cabin="Economy"
 *   price="$649" airline="Emirates" pressable (press)="pick()" />
 * ```
 */
@Component({
  selector: 'ar-ticket-card',
  imports: [ArIcon, ArBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'm-ticket m-tap',
    '[attr.role]': "pressable() ? 'button' : 'article'",
    '[attr.tabindex]': 'pressable() ? 0 : null',
    '(click)': 'press.emit()',
    '(keydown.enter)': 'onKey($event)',
    '(keydown.space)': 'onKey($event)',
  },
  template: `
    <div class="m-ticket__top">
      <ar-icon name="arrow-top-right-on-square" [size]="18" />
      @if (badge()) {
        <ar-badge tone="success" size="sm">{{ badge() }}</ar-badge>
      }
    </div>
    <div class="m-ticket__route">
      <div><span>{{ from()?.time }}</span><b>{{ from()?.code }}</b><span>{{ from()?.city }}</span></div>
      <div class="m-ticket__mid">
        <span class="m-ticket__line"><ar-icon name="plane" [size]="18" /></span>
        <span>{{ duration() }}</span>
      </div>
      <div style="text-align: right"><span>{{ to()?.time }}</span><b>{{ to()?.code }}</b><span>{{ to()?.city }}</span></div>
    </div>
    <div class="m-ticket__perf" aria-hidden="true"></div>
    <div class="m-ticket__foot">
      <span>{{ cabin() }}</span>
      <b>{{ price() }}@if (priceUnit()) {<small>{{ ' ' + priceUnit() }}</small>}</b>
      <span class="m-ticket__airline">{{ airline() }}</span>
    </div>
  `,
})
export class ArTicketCard {
  readonly from = input<ArTicketEnd>();
  readonly to = input<ArTicketEnd>();
  readonly duration = input<string>();
  readonly cabin = input<string>();
  readonly price = input<string>();
  /** Shown small after the price, e.g. "/ person". */
  readonly priceUnit = input<string>();
  readonly airline = input<string>();
  /** Green pill in the corner, e.g. "Best". */
  readonly badge = input<string>();
  /** Makes the ticket a keyboard-reachable button (role="button", tabindex 0). Bind (press) with it. */
  readonly pressable = input(false, { transform: booleanAttribute });
  readonly press = output<void>();

  protected onKey(ev: Event): void {
    if (!this.pressable() || ev.target !== ev.currentTarget) return;
    ev.preventDefault();
    this.press.emit();
  }
}

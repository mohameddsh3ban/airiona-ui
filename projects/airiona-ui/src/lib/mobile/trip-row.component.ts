import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';
import { ArIcon } from '../core/icon.component';

export interface ArTripEnd {
  time: string;
  city: string;
}

/**
 * An upcoming trip in a list: date, airline mark, departure and arrival with cities, and a dotted
 * route with a plane disc and duration. Project a custom mark with `arLogo`, or pass `logo` text.
 *
 * ```html
 * <ar-trip-row date="August 12, 2026" logo="EK" [from]="{ time: '07:00', city: 'Dubai' }"
 *   [to]="{ time: '11:35', city: 'London' }" duration="7h 35min" pressable (press)="open()" />
 * ```
 */
@Component({
  selector: 'ar-trip-row',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'm-trip m-tap',
    '[attr.role]': "pressable() ? 'button' : null",
    '[attr.tabindex]': 'pressable() ? 0 : null',
    '(click)': 'press.emit()',
    '(keydown.enter)': 'onKey($event)',
    '(keydown.space)': 'onKey($event)',
  },
  template: `
    @if (date()) {
      <span class="m-trip__date">{{ date() }}</span>
    }
    <div class="m-trip__row">
      <span class="m-trip__logo" [style.background]="logoBg()"><ng-content select="[arLogo]">{{ logo() }}</ng-content></span>
      <div class="m-trip__end"><b>{{ from()?.time }}</b><span>{{ from()?.city }}</span></div>
      <div class="m-trip__mid">
        <span class="m-trip__lbl">Duration</span>
        <span class="m-trip__line"><i class="m-trip__plane"><ar-icon name="plane" [size]="12" /></i></span>
        <span class="m-trip__dur">{{ duration() }}</span>
      </div>
      <div class="m-trip__end is-to"><b>{{ to()?.time }}</b><span>{{ to()?.city }}</span></div>
    </div>
  `,
})
export class ArTripRow {
  readonly date = input<string>();
  /** 2–3 letter airline code. For a richer mark, project `<img arLogo>` instead. */
  readonly logo = input<string>();
  /** Colour token name for the logo disc, e.g. 'blue-100' → background: var(--blue-100). */
  readonly logoTone = input<string>();
  readonly from = input<ArTripEnd>();
  readonly to = input<ArTripEnd>();
  readonly duration = input<string>();
  /** Makes the row a keyboard-reachable button (role="button", tabindex 0). Bind (press) with it. */
  readonly pressable = input(false, { transform: booleanAttribute });
  readonly press = output<void>();

  protected readonly logoBg = computed(() => (this.logoTone() ? `var(--${this.logoTone()})` : null));

  protected onKey(ev: Event): void {
    if (!this.pressable() || ev.target !== ev.currentTarget) return;
    ev.preventDefault();
    this.press.emit();
  }
}

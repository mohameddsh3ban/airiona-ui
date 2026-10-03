import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import { ArIcon } from '../core/icon.component';

/**
 * Large tappable field on a native `<button>`: uppercase label, optional icon, value, and a trailing icon or chevron.
 * It opens a picker sheet rather than the keyboard; listen to `(click)`.
 *
 * ```html
 * <button arFieldTile label="Departure" icon="calendar-days" value="27 Aug, 2026" (click)="datesOpen.set(true)"></button>
 * <button arFieldTile label="Passengers" icon="user" placeholder="Add travellers" chevron></button>
 * ```
 */
@Component({
  selector: 'button[arFieldTile]',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { type: 'button', class: 'm-field m-tap' },
  template: `
    @if (label()) {
      <span class="m-field__label">{{ label() }}</span>
    }
    <span class="m-field__row">
      @if (icon()) {
        <ar-icon [name]="icon()!" [size]="20" iconClass="m-field__icon" />
      }
      <span class="m-field__value" [class.is-placeholder]="!value()">{{ value() || placeholder() }}</span>
      @if (trailingIcon()) {
        <ar-icon [name]="trailingIcon()!" [size]="20" iconClass="m-field__trail" />
      }
      @if (chevron()) {
        <ar-icon name="chevron-down" [size]="18" iconClass="m-field__trail" />
      }
    </span>
  `,
})
export class ArFieldTile {
  readonly label = input<string>();
  readonly value = input<string | null>();
  /** Shown in a muted weight when there is no value. */
  readonly placeholder = input<string>();
  readonly icon = input<string>();
  readonly trailingIcon = input<string>();
  /** Trailing chevron-down, for selects. */
  readonly chevron = input(false, { transform: booleanAttribute });
}

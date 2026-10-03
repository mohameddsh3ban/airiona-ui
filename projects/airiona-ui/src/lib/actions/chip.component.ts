import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArValueControl, arValueAccessor } from '../core/value-control';

/**
 * Toggle pill for filters and quick choices. Selected chips turn ink. Several chips can be selected at once;
 * for mutually exclusive choices use `ArSegmentedControl`.
 * Works with `[(selected)]`, `[(ngModel)]` and `formControlName` (a boolean).
 *
 * ```html
 * <button arChip icon="building-office-2" [(selected)]="hotels">Hotels</button>
 * <button arChip icon="wifi" [count]="128" formControlName="wifi">Fast Wi-Fi</button>
 * ```
 */
@Component({
  selector: 'button[arChip]',
  imports: [ArIcon],
  providers: [arValueAccessor(() => ArChip)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: 'button',
    class: 'ar-chip',
    '[attr.aria-pressed]': 'value() ? "true" : "false"',
    '[attr.disabled]': 'isDisabled() ? "" : null',
    '(click)': 'commit(!value())',
    '(blur)': 'touch()',
  },
  template: `
    @if (icon()) {
      <ar-icon [name]="icon()!" [size]="16" />
    }
    <ng-content />
    @if (count() !== undefined) {
      <span class="ar-chip__count">{{ count() }}</span>
    }
  `,
})
export class ArChip extends ArValueControl<boolean> {
  /** Selected state. Two-way: `[(selected)]`. */
  readonly value = model<boolean>(false, { alias: 'selected' });
  readonly icon = input<string>();
  /** Number of results that match the filter. */
  readonly count = input<number>();
}

import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, model, numberAttribute } from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArValueControl, arValueAccessor } from '../core/value-control';
import { cx } from '../core/utils';

/**
 * Labelled minus / value / plus row for counting guests, rooms and bags. The number rolls up or down on change.
 * Buttons disable at `min` and `max`. Stacked steppers get a divider between them.
 * Works with `[(value)]`, `[(ngModel)]` and `formControlName`; a `null` value shows `min`.
 *
 * ```html
 * <ar-quantity-stepper label="Adults" description="Ages 13 or above" [min]="1" [(value)]="adults" />
 * <ar-quantity-stepper label="Infants" description="Under 2, on lap" [max]="2" formControlName="infants" />
 * ```
 */
@Component({
  selector: 'ar-quantity-stepper',
  imports: [ArIconButton],
  providers: [arValueAccessor(() => ArQuantityStepper)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ar-stepper' },
  template: `
    <div>
      <div class="ar-stepper__label">{{ label() }}</div>
      @if (description()) {
        <div class="ar-stepper__sub">{{ description() }}</div>
      }
    </div>
    <div class="ar-stepper__ctrl">
      <button
        arIconButton
        icon="minus"
        variant="outline"
        size="sm"
        [label]="'Fewer ' + (label() || '')"
        [disabled]="isDisabled() || current() <= min()"
        (click)="step(-1)"
        (blur)="touch()"
      ></button>
      <output class="ar-stepper__value" aria-live="polite">
        @for (k of [roll().v]; track k) {
          <span [class]="rollClass()">{{ k }}</span>
        }
      </output>
      <button
        arIconButton
        icon="plus"
        variant="outline"
        size="sm"
        [label]="'More ' + (label() || '')"
        [disabled]="isDisabled() || current() >= max()"
        (click)="step(1)"
        (blur)="touch()"
      ></button>
    </div>
  `,
})
export class ArQuantityStepper extends ArValueControl<number | null> {
  /** The count. `null` (or unset) shows `min`. */
  readonly value = model<number | null>(null);
  readonly label = input<string>('');
  readonly description = input<string>();
  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(9, { transform: numberAttribute });

  protected readonly current = computed(() => this.value() ?? this.min());
  /** RollNumber: remembers the previous value to pick the roll direction; the keyed @for remounts the span. */
  protected readonly roll = linkedSignal<number, { v: number; dir: string }>({
    source: this.current,
    computation: (v, prev) => ({ v, dir: !prev ? '' : v > prev.source ? 'is-up' : v < prev.source ? 'is-down' : '' }),
  });
  protected readonly rollClass = computed(() => cx('ar-roll', this.roll().dir));

  protected step(delta: number): void {
    const next = delta < 0 ? Math.max(this.min(), this.current() - 1) : Math.min(this.max(), this.current() + 1);
    this.commit(next);
  }
}

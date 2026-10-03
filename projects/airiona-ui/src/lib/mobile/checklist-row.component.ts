import { ChangeDetectionStrategy, Component, booleanAttribute, computed, inject, input, model } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArPlatform } from '../core/platform';
import { cx } from '../core/utils';
import { ArValueControl, arValueAccessor } from '../core/value-control';

/**
 * Card-style task row: a 28px checkbox, text, optional meta line and a status dot. The whole row is the touch target.
 * Works with `[(value)]`, `[(ngModel)]` and `formControlName`. Extra rich text can be projected after `text`.
 *
 * ```html
 * <ar-checklist-row text="Restock welcome baskets" [(value)]="restocked" />
 * <ar-checklist-row text="Send check-in code to guest" meta="Due 12:00" dotTone="warning" formControlName="code" />
 * ```
 */
@Component({
  selector: 'ar-checklist-row',
  imports: [ArIcon],
  providers: [arValueAccessor(() => ArChecklistRow)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <label [class]="rowClass()">
      <input type="checkbox" [checked]="value()" [disabled]="isDisabled()" (change)="toggle($event)" (blur)="touch()" />
      <span class="m-check__box" aria-hidden="true"><ar-icon name="check" [size]="16" [strokeWidth]="2.6" /></span>
      <span class="m-check__text">{{ text() }}<ng-content />@if (meta()) {<small>{{ meta() }}</small>}</span>
      @if (dot()) {
        <i [class]="dotClass()" aria-hidden="true"></i>
      }
    </label>
  `,
})
export class ArChecklistRow extends ArValueControl<boolean> {
  private readonly platform = inject(ArPlatform);

  /** Checked state. */
  readonly value = model(false);
  readonly text = input<string>('');
  readonly meta = input<string>();
  /** Shows the status dot on the right (default true). */
  readonly dot = input(true, { transform: booleanAttribute });
  readonly dotTone = input<'brand' | 'warning'>();

  protected readonly rowClass = computed(() => cx('m-check', 'm-tap', this.value() && 'is-done'));
  protected readonly dotClass = computed(() => cx('m-check__dot', this.dotTone() && `is-${this.dotTone()}`));

  protected toggle(ev: Event): void {
    this.platform.haptic();
    this.commit((ev.target as HTMLInputElement).checked);
  }
}

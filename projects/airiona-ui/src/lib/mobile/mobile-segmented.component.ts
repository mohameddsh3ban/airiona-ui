import { ChangeDetectionStrategy, Component, computed, inject, input, model } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArPlatform } from '../core/platform';
import { ArValueControl, arValueAccessor } from '../core/value-control';
import { ArOption, cx, toOption } from '../core/utils';

/**
 * Full-width two- or three-way switch with a thumb that slides between options (`--i` / `--n`).
 * The selection is a form value: `[(value)]`, `[(ngModel)]`, `formControlName`.
 *
 * ```html
 * <ar-mobile-segmented label="Trip type" [options]="[{ value: 'round', label: 'Round trip', icon: 'arrows-right-left' }, { value: 'one', label: 'One way' }]" [(value)]="trip" />
 * ```
 */
@Component({
  selector: 'ar-mobile-segmented',
  imports: [ArIcon],
  providers: [arValueAccessor(() => ArMobileSegmented)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    role: 'tablist',
    '[attr.aria-label]': 'label()',
    '[style.--n]': 'opts().length',
    '[style.--i]': 'index()',
  },
  template: `
    <span class="m-seg__thumb" aria-hidden="true"></span>
    @for (o of opts(); track o.value) {
      <button
        type="button"
        role="tab"
        [attr.aria-selected]="o.value === current() ? 'true' : 'false'"
        class="m-seg__item m-tap"
        [disabled]="isDisabled() || o.disabled"
        (click)="pick(o.value)"
      >
        @if (o.icon) {
          <ar-icon [name]="o.icon" [size]="18" />
        }
        {{ o.label }}
      </button>
    }
  `,
})
export class ArMobileSegmented extends ArValueControl<string | null> {
  private readonly platform = inject(ArPlatform);

  readonly value = model<string | null>(null);
  readonly options = input<Array<string | ArOption>>([]);
  /** Accessible name of the group. */
  readonly label = input<string>();
  readonly tone = input<'brand' | 'ink'>('brand');

  protected readonly opts = computed(() => this.options().map(toOption));
  /** Falls back to the first option when nothing is selected yet. */
  protected readonly current = computed(() => this.value() ?? this.opts()[0]?.value ?? null);
  protected readonly index = computed(() => Math.max(0, this.opts().findIndex((o) => o.value === this.current())));
  protected readonly hostClass = computed(() => cx('m-seg', `m-seg--${this.tone()}`));

  protected pick(v: string): void {
    if (this.isDisabled()) return;
    this.platform.haptic();
    this.commit(v);
    this.touch();
  }
}

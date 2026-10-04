import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, model } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArPlatform } from '../core/platform';
import { ArValueControl, arValueAccessor } from '../core/value-control';
import { arAssetUrl } from '../core/scene.component';

export interface ArOptionCard {
  value: string;
  title: string;
  /** Short facts under the title, e.g. "7 seats · 6 h 50 m". */
  meta?: string;
  /** Formatted price on the right, e.g. "$48,400". */
  price?: string;
  /** Line under the price, e.g. "all-in". */
  note?: string;
  /** Thumbnail photo. */
  image?: string;
  /** Small pill above the title, e.g. "Best value". */
  badge?: string;
  disabled?: boolean;
}

/**
 * Pick one option from rich rows (photo, title, facts, price): the native way to choose an aircraft, a cabin or a
 * plan. A radio group: arrow keys move and select, and the whole row is the target. The choice is a form value:
 * `[(value)]`, `[(ngModel)]`, `formControlName`.
 *
 * ```html
 * <ar-option-list label="Aircraft" [options]="aircraft" formControlName="aircraft" [error]="form.error('aircraft')" />
 * ```
 */
@Component({
  selector: 'ar-option-list',
  imports: [ArIcon],
  providers: [arValueAccessor(() => ArOptionList)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': "error() ? 'ar ar-optlist is-invalid' : 'ar ar-optlist'" },
  template: `
    @if (label()) {
      <span class="ar-optlist__label" aria-hidden="true">{{ label() }}</span>
    }
    <div class="ar-optlist__items" role="radiogroup" [attr.aria-label]="label() || null" [attr.aria-invalid]="error() ? 'true' : null" (keydown)="onKey($event)">
      @for (o of options(); track o.value; let i = $index) {
        <button
          type="button"
          role="radio"
          [attr.aria-checked]="i === selected() ? 'true' : 'false'"
          [attr.tabindex]="i === tabStop() ? 0 : -1"
          [disabled]="isDisabled() || o.disabled"
          [class]="i === selected() ? 'ar-opt m-tap is-selected' : 'ar-opt m-tap'"
          (click)="choose(i, false)"
          (blur)="touch()"
        >
          @if (o.image) {
            <span class="ar-opt__media"><img [src]="src(o.image)" alt="" /></span>
          }
          <span class="ar-opt__body">
            @if (o.badge) {
              <span class="ar-opt__badge">{{ o.badge }}</span>
            }
            <b class="ar-opt__title">{{ o.title }}</b>
            @if (o.meta) {
              <span class="ar-opt__meta">{{ o.meta }}</span>
            }
          </span>
          @if (o.price || o.note) {
            <span class="ar-opt__side">
              @if (o.price) {
                <b class="ar-opt__price">{{ o.price }}</b>
              }
              @if (o.note) {
                <small>{{ o.note }}</small>
              }
            </span>
          }
          <span class="ar-opt__radio" aria-hidden="true"></span>
        </button>
      }
    </div>
    @if (error()) {
      <p class="ar-optlist__error" role="alert"><ar-icon name="exclamation-triangle" [size]="16" />{{ error() }}</p>
    }
  `,
})
export class ArOptionList extends ArValueControl<string | null> {
  private readonly platform = inject(ArPlatform);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly asset = arAssetUrl();

  readonly value = model<string | null>(null);
  readonly options = input<ArOptionCard[]>([]);
  /** Visible label and accessible name of the group. */
  readonly label = input<string>();
  /** Shows the message in red under the list and marks the group invalid. */
  readonly error = input<string | null>(null);

  protected readonly selected = computed(() => this.options().findIndex((o) => o.value === this.value()));
  /** Roving tab stop: the selected row, or the first one. */
  protected readonly tabStop = computed(() => Math.max(0, this.selected()));

  protected src(path: string): string | null {
    return this.asset(path);
  }

  protected choose(i: number, focus: boolean): void {
    const o = this.options()[i];
    if (!o || o.disabled || this.isDisabled()) return;
    this.platform.haptic();
    this.commit(o.value);
    if (focus) this.host.nativeElement.querySelectorAll<HTMLButtonElement>('.ar-opt')[i]?.focus();
  }

  protected onKey(e: KeyboardEvent): void {
    const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    const opts = this.options();
    if (!d || !opts.length) return;
    e.preventDefault();
    const n = opts.length;
    let i = this.tabStop();
    for (let k = 0; k < n; k++) {
      i = (i + d + n) % n;
      if (!opts[i].disabled) break;
    }
    this.choose(i, true);
  }

  protected override touch(): void {
    super.touch();
  }
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AR_HEAT_TONES } from './analytics.utils';

/**
 * Grid of rounded cells shaded in five Ion Blue steps with row and column labels; one cell can be highlighted in ink.
 * Not a card on its own: place it inside an `.ar-w` surface.
 *
 * ```html
 * <ar-heatmap label="Cancellation rate by weekday" [rows]="rows" [cols]="cols" [values]="levels" [highlight]="[3, 3]" />
 * ```
 */
@Component({
  selector: 'ar-heatmap',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ar-heat', role: 'img', '[attr.aria-label]': 'label() || "Heatmap"' },
  template: `
    <div class="ar-heat__grid" [style.grid-template-columns]="'auto repeat(' + cols().length + ', minmax(0, 1fr))'">
      @for (r of rows(); track $index; let ri = $index) {
        <span class="ar-heat__row"><i [style.background]="rowSwatch(ri)"></i>{{ r }}</span>
        @for (c of cols(); track $index; let ci = $index) {
          @let hi = isHi(ri, ci);
          <span [class]="hi ? 'ar-heat__cell is-hi' : 'ar-heat__cell'" [attr.title]="r + ' · ' + c" [style.background]="hi ? null : cellBg(ri, ci)"></span>
        }
      }
      <span></span>
      @for (c of cols(); track $index) {
        <span class="ar-heat__col">{{ c }}</span>
      }
    </div>
  `,
})
export class ArHeatmap {
  readonly rows = input<string[]>([]);
  readonly cols = input<string[]>([]);
  /** Matrix of levels 0–4: surface-sunken, blue-200, blue-400, blue-600, blue-900. */
  readonly values = input<number[][]>([]);
  /** `[row, col]` drawn in ink. */
  readonly highlight = input<[number, number] | null>(null);
  /** Accessible description. */
  readonly label = input<string>();

  protected rowSwatch(ri: number): string {
    return `var(--${AR_HEAT_TONES[Math.min(4, this.rows().length - ri)]})`;
  }
  protected cellBg(ri: number, ci: number): string {
    return `var(--${AR_HEAT_TONES[this.values()[ri]?.[ci] || 0]})`;
  }
  protected isHi(ri: number, ci: number): boolean {
    const hi = this.highlight();
    return !!hi && hi[0] === ri && hi[1] === ci;
  }
}

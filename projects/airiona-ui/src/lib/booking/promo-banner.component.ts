import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ArButton } from '../actions/button.component';
import { arAssetUrl } from '../core/scene.component';

/**
 * A photo offer card: a pill eyebrow, a title with a highlighted part, a line of text and one white action, over a
 * photo that fades into Ion Blue on the copy side.
 *
 * ```html
 * <ar-promo-banner image="…" eyebrow="Limited time" title="Empty legs up to" highlight="40% off"
 *   text="One-way repositioning flights this month." action="View deals" (press)="openDeals()" />
 * ```
 */
@Component({
  selector: 'ar-promo-banner',
  imports: [ArButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ar ar-promo', '[attr.title]': 'null', role: 'article' },
  template: `
    @if (image()) {
      <img class="ar-promo__img" [src]="imageSrc()" alt="" />
    }
    @if (eyebrow()) {
      <span class="ar-promo__eyebrow">{{ eyebrow() }}</span>
    }
    <p class="ar-promo__title">{{ title() }}@if (highlight()) {<span> {{ highlight() }}</span>}</p>
    @if (text()) {
      <p class="ar-promo__text">{{ text() }}</p>
    }
    @if (action()) {
      <button arButton type="button" variant="white" size="sm" iconEnd="arrow-right" (click)="press.emit()">{{ action() }}</button>
    }
  `,
})
export class ArPromoBanner {
  private readonly asset = arAssetUrl();

  readonly title = input.required<string>();
  /** Part of the title in gold, e.g. "30% off". */
  readonly highlight = input<string>();
  readonly eyebrow = input<string>();
  readonly text = input<string>();
  /** Photo; the copy side fades into Ion Blue so white text stays legible. */
  readonly image = input<string | null>(null);
  /** Label of the white button; the button shows only when set. */
  readonly action = input<string>();

  /** The action button was pressed. React: `onAction`. */
  readonly press = output<void>();

  protected readonly imageSrc = computed(() => this.asset(this.image()));
}

import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, TemplateRef, computed, contentChildren, inject, input, numberAttribute } from '@angular/core';

/** Marks one slide of an `ar-snap-carousel`: `<ar-feature-card *arSnapItem … />`. */
@Directive({ selector: '[arSnapItem]' })
export class ArSnapItem {
  readonly template = inject(TemplateRef);
}

/**
 * Horizontal list that snaps each card to the gutter and shows a peek of the next one.
 * Each `*arSnapItem` element is wrapped in `.m-carousel__item` (role listitem), like the React children.
 *
 * ```html
 * <ar-snap-carousel itemWidth="70%" label="Stats">
 *   @for (s of stats; track s.title) {
 *     <div *arSnapItem class="m-ministat">…</div>
 *   }
 * </ar-snap-carousel>
 * ```
 */
@Component({
  selector: 'ar-snap-carousel',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'm-carousel',
    role: 'list',
    '[attr.aria-label]': 'label()',
    '[style.--item]': 'itemWidth()',
    '[style.--gap]': 'gapPx()',
  },
  template: `
    @for (it of items(); track it) {
      <div class="m-carousel__item" role="listitem"><ng-container [ngTemplateOutlet]="it.template" /></div>
    }
  `,
})
export class ArSnapCarousel {
  /** Card width as a CSS length (default 78%). Keep the peek at 20–30%. */
  readonly itemWidth = input<string>('78%');
  /** Gap between cards in px (default 14). */
  readonly gap = input(14, { transform: numberAttribute });
  readonly label = input<string>();

  protected readonly items = contentChildren(ArSnapItem, { descendants: true });
  protected readonly gapPx = computed(() => `${this.gap() || 14}px`);
}

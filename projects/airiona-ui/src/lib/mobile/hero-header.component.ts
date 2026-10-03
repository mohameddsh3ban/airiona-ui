import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';
import { ArHeroPattern } from '../core/hero-pattern.component';
import { arAssetUrl } from '../core/scene.component';
import { cx } from '../core/utils';

/**
 * Midnight header with a photo / art backdrop, a dotted world map or flowing waves, and content that overlaps its
 * lower edge (default content, e.g. a search field). Slots: `arTrailing` (avatar or button), `arBelowTitle`, `arArt`.
 *
 * ```html
 * <ar-hero-header eyebrow="Good morning" title="Maya Haddad" overlap [image]="globe">
 *   <button arTrailing arIconButton icon="bell" label="Notifications" variant="white" badge></button>
 *   <ar-search-field placeholder="Where to next?" showFilter />
 * </ar-hero-header>
 * ```
 */
@Component({
  selector: 'ar-hero-header',
  imports: [ArHeroPattern],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.title]': 'null', '[class]': 'hostClass()' },
  template: `
    <div [class]="src() ? 'm-hero__bg has-image' : 'm-hero__bg'">
      @if (src()) {
        <img class="m-hero__img" [src]="src()" alt="" aria-hidden="true" draggable="false" />
      } @else {
        <ar-hero-pattern [pattern]="pattern()" />
      }
      <div class="m-hero__art"><ng-content select="[arArt]" /></div>
    </div>
    <div class="m-hero__content">
      <div class="m-hero__top">
        <div class="m-hero__titles">
          @if (eyebrow()) {
            <span class="m-hero__eyebrow">{{ eyebrow() }}</span>
          }
          @if (title()) {
            @switch (headingLevel()) {
              @case (2) { <h2 class="m-hero__title">{{ title() }}</h2> }
              @case (3) { <h3 class="m-hero__title">{{ title() }}</h3> }
              @default { <h1 class="m-hero__title">{{ title() }}</h1> }
            }
          }
        </div>
        <ng-content select="[arTrailing]" />
      </div>
      <ng-content select="[arBelowTitle]" />
    </div>
    <div class="m-hero__overlap"><ng-content /></div>
  `,
})
export class ArHeroHeader {
  private readonly asset = arAssetUrl();

  readonly title = input<string>();
  readonly eyebrow = input<string>();
  /** Backdrop photo or art; replaces the pattern. */
  readonly image = input<string | null>();
  readonly pattern = input<'map' | 'waves'>('waves');
  /** Default content straddles the bottom edge. */
  readonly overlap = input(false, { transform: booleanAttribute });
  /** Heading level of the title: 1 (default) for the page header, 2 or 3 when the hero sits inside a page that has its own h1. */
  readonly headingLevel = input<1 | 2 | 3>(1);

  protected readonly src = computed(() => this.asset(this.image()));
  protected readonly hostClass = computed(() => cx('m-hero', this.overlap() && 'has-overlap'));
}

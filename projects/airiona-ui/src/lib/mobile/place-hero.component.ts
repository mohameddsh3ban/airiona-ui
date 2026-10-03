import { ChangeDetectionStrategy, Component, inject, input, model, output } from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArIcon } from '../core/icon.component';
import { ArPlatform } from '../core/platform';
import { ArMedia, ArSceneVariant } from '../core/scene.component';

/**
 * The top of a place detail screen: a rounded photo with glass back and bookmark buttons, and a glass
 * caption with name, location and price. `saved` (the bookmark) is two-way.
 *
 * ```html
 * <ar-place-hero image="photos/forest-cabin.webp" title="Nordic Pine Lodge" location="Nuremberg, Germany"
 *   price="$264" (back)="goBack()" [(saved)]="bookmarked" />
 * ```
 */
@Component({
  selector: 'ar-place-hero',
  imports: [ArIcon, ArIconButton, ArMedia],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'm-placehero', '[attr.title]': 'null' },
  template: `
    <div class="m-placehero__media"><ar-media [image]="image()" [scene]="scene() || 'forest'" [alt]="title()" /></div>
    <div class="m-placehero__bar">
      <button arIconButton type="button" icon="chevron-left" variant="glass" size="md" label="Back" (click)="back.emit()"></button>
      <button
        arIconButton
        type="button"
        icon="bookmark"
        variant="glass"
        size="md"
        [label]="saved() ? 'Remove bookmark' : 'Bookmark'"
        [attr.aria-pressed]="saved() ? 'true' : 'false'"
        (click)="toggle()"
      ></button>
    </div>
    <div class="m-placehero__plate">
      <div><b>{{ title() }}</b><span><ar-icon name="map-pin" [size]="15" />{{ location() }}</span></div>
      @if (price()) {
        <div class="m-placehero__price"><span>{{ priceLabel() || 'Price' }}</span><b>{{ price() }}</b></div>
      }
    </div>
  `,
})
export class ArPlaceHero {
  private readonly platform = inject(ArPlatform);

  readonly title = input.required<string>();
  readonly location = input<string>();
  readonly price = input<string>();
  /** Default "Price". */
  readonly priceLabel = input<string>();
  readonly image = input<string | null>();
  /** Drawn fallback when there is no image, default 'forest'. */
  readonly scene = input<ArSceneVariant>();
  /** Bookmark state; two-way bindable. */
  readonly saved = model(false);
  /** The glass back button was clicked. */
  readonly back = output<void>();

  protected toggle(): void {
    this.platform.haptic();
    this.saved.set(!this.saved());
  }
}

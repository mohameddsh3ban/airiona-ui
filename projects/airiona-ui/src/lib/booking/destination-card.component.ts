import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { ArButton } from '../actions/button.component';
import { ArIconButton } from '../actions/icon-button.component';
import { ArIcon } from '../core/icon.component';
import { ArMedia, ArSceneVariant } from '../core/scene.component';
import { ArRating } from '../status/rating.component';

/**
 * Photo card with a frosted glass plate: name, rating, a location line and a small Book now button.
 * The glass heart toggles `saved` (two-way: `[(saved)]`).
 *
 * ```html
 * <ar-destination-card [image]="img" title="Nordic Pine Lodge" [rating]="4.9" meta="Nuremberg, Germany" (book)="go()" />
 * ```
 */
@Component({
  selector: 'ar-destination-card',
  imports: [ArButton, ArIcon, ArIconButton, ArMedia, ArRating],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // `title` is an input here; keep the native tooltip attribute off the host.
  host: { style: 'display: contents', '[attr.title]': 'null' },
  template: `
    <article class="ar-dest">
      <div class="ar-dest__media"><ar-media [image]="image()" [scene]="scene()" [alt]="title()" /></div>
      <button
        arIconButton
        icon="heart"
        variant="glass"
        size="sm"
        class="ar-dest__fav"
        [label]="saved() ? 'Remove from saved' : 'Save'"
        [attr.aria-pressed]="saved() ? 'true' : 'false'"
        (click)="saved.set(!saved())"
      ></button>
      <div class="ar-dest__plate">
        <div class="ar-dest__row">
          <h3 class="ar-dest__title">{{ title() }}</h3>
          @if (rating()) {
            <ar-rating [value]="rating()!" compact [size]="14" />
          }
        </div>
        <div class="ar-dest__row">
          <span class="ar-dest__meta"><ar-icon name="map-pin" [size]="14" />{{ meta() }}</span>
          <button arButton variant="primary" size="sm" (click)="book.emit()">{{ cta() }}</button>
        </div>
      </div>
    </article>
  `,
})
export class ArDestinationCard {
  readonly title = input.required<string>();
  readonly rating = input<number>();
  /** Distance or place, e.g. "1.2 km from centre". */
  readonly meta = input<string>('');
  readonly image = input<string | null>();
  readonly scene = input<ArSceneVariant>('coast');
  /** Saved to the wishlist. Two-way: `[(saved)]`. */
  readonly saved = model(false);
  readonly cta = input('Book now');
  readonly book = output<void>();
}

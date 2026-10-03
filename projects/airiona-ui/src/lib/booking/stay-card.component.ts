import { ChangeDetectionStrategy, Component, computed, input, model, numberAttribute, output } from '@angular/core';
import { ArButton } from '../actions/button.component';
import { ArIconButton } from '../actions/icon-button.component';
import { AR_SCENE_TINT, ArMedia, ArSceneVariant } from '../core/scene.component';

/**
 * Hero card for a place to stay: full-bleed photo fading into a deep tint, title and price, up to two tags
 * and a white Reserve button. The glass heart toggles `saved` (two-way: `[(saved)]`).
 *
 * ```html
 * <ar-stay-card [image]="img" tint="#16313b" [photos]="3" title="Swiss Alps Retreat" price="$710" unit="/night"
 *               [tags]="['Luxury stay', '2-night min']" [(saved)]="saved" (reserve)="book()" />
 * ```
 */
@Component({
  selector: 'ar-stay-card',
  imports: [ArButton, ArIconButton, ArMedia],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // `title` is an input here; keep the native tooltip attribute off the host.
  host: { style: 'display: contents', '[attr.title]': 'null' },
  template: `
    <article class="ar-stay" [style.--tint]="tintColor()">
      <div class="ar-stay__media"><ar-media [image]="image()" [scene]="scene()" [alt]="title()" /></div>
      <button
        arIconButton
        icon="heart"
        variant="glass"
        size="sm"
        class="ar-stay__fav"
        [label]="saved() ? 'Remove from saved' : 'Save'"
        [attr.aria-pressed]="saved() ? 'true' : 'false'"
        (click)="saved.set(!saved())"
      ></button>
      <div class="ar-stay__body">
        @if (photos() > 1) {
          <div class="ar-stay__dots" aria-hidden="true">
            @for (i of dots(); track $index) {
              <i></i>
            }
          </div>
        }
        <div class="ar-stay__top">
          <h3 class="ar-stay__title">{{ title() }}</h3>
          <span class="ar-stay__price">{{ price() }}@if (unit()) {<small>{{ unit() }}</small>}</span>
        </div>
        @if (description()) {
          <p class="ar-stay__desc">{{ description() }}</p>
        }
        @if (tags().length) {
          <div class="ar-stay__tags">
            @for (t of tags(); track t) {
              <span>{{ t }}</span>
            }
          </div>
        }
        <button arButton variant="white" size="lg" block (click)="reserve.emit()">{{ cta() }}</button>
      </div>
    </article>
  `,
})
export class ArStayCard {
  readonly title = input.required<string>();
  /** Formatted price, e.g. "$710". */
  readonly price = input.required<string>();
  readonly unit = input<string>();
  /** Max 3 lines; clamps. */
  readonly description = input<string>();
  /** Max 2. */
  readonly tags = input<string[]>([]);
  readonly image = input<string | null>();
  readonly scene = input<ArSceneVariant>('sky');
  /** Dark colour the photo fades into; white text must reach 4.5:1 on it. Defaults to the scene's tint. */
  readonly tint = input<string>();
  /** Photo count, shown as dots (max 5). */
  readonly photos = input(0, { transform: numberAttribute });
  /** Saved to the wishlist. Two-way: `[(saved)]`. */
  readonly saved = model(false);
  readonly cta = input('Reserve');
  readonly reserve = output<void>();

  protected readonly tintColor = computed(() => this.tint() || AR_SCENE_TINT[this.scene()] || AR_SCENE_TINT.sky);
  protected readonly dots = computed(() => Array.from({ length: Math.min(this.photos(), 5) }));
}

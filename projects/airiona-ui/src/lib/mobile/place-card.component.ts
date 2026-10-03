import { ChangeDetectionStrategy, Component, inject, input, model, output } from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArIcon } from '../core/icon.component';
import { ArPlatform } from '../core/platform';
import { ArMedia, ArSceneVariant } from '../core/scene.component';

/**
 * A tall photo card with a glass save button and a smoked-glass plate holding the name, region,
 * location and rating. `saved` is two-way (`[(saved)]`) and toggles the heart's aria-pressed.
 *
 * ```html
 * <ar-place-card image="photos/forest-cabin.webp" title="Nordic Pine Lodge" region="Bavaria"
 *   location="Nuremberg, Germany" rating="4.8" [(saved)]="isSaved" (press)="open()" />
 * ```
 */
@Component({
  selector: 'ar-place-card',
  imports: [ArIcon, ArIconButton, ArMedia],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'm-place m-tap', role: 'article', '[attr.title]': 'null', '(click)': 'press.emit()' },
  template: `
    <div class="m-place__media"><ar-media [image]="image()" [scene]="scene() || 'forest'" [alt]="title()" /></div>
    <button
      arIconButton
      type="button"
      icon="heart"
      variant="glass"
      size="sm"
      class="m-place__fav"
      [label]="saved() ? 'Remove from saved' : 'Save'"
      [attr.aria-pressed]="saved() ? 'true' : 'false'"
      (click)="toggle($event)"
    ></button>
    <div class="m-place__plate">
      <b>{{ title() }}@if (region()) {<small>{{ ', ' + region() }}</small>}</b>
      <div class="m-place__row">
        <span><ar-icon name="map-pin" [size]="14" />{{ location() }}</span>
        @if (rating()) {
          <span><ar-icon name="star" [size]="14" />{{ rating() }}</span>
        }
      </div>
    </div>
  `,
})
export class ArPlaceCard {
  private readonly platform = inject(ArPlatform);

  readonly title = input.required<string>();
  readonly region = input<string>();
  readonly location = input<string>();
  readonly rating = input<string>();
  readonly image = input<string | null>();
  /** Drawn fallback when there is no image, default 'forest'. */
  readonly scene = input<ArSceneVariant>();
  /** Heart state; two-way bindable. */
  readonly saved = model(false);
  /** The card was clicked (not the heart). */
  readonly press = output<void>();

  protected toggle(ev: Event): void {
    ev.stopPropagation();
    this.platform.haptic();
    this.saved.set(!this.saved());
  }
}

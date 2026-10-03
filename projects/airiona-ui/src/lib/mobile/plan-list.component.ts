import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ArScene, ArSceneVariant, arAssetUrl } from '../core/scene.component';

export interface ArPlanItem {
  title: string;
  time?: string;
  /** The current step: a midnight row with the image fading in behind it. */
  featured?: boolean;
  image?: string;
  /** Drawn fallback when a featured row has no image (default 'dusk'). */
  scene?: ArSceneVariant;
}

/**
 * Plan steps as large rounded rows; the featured step is a midnight card with an image behind it.
 *
 * ```html
 * <ar-plan-list [items]="[{ title: 'Land at Haneda', time: '2:00 PM', featured: true, image: 'photos/tokyo.webp' }]" />
 * ```
 */
@Component({
  selector: 'ar-plan-list',
  imports: [ArScene],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'm-plan' },
  template: `
    @for (it of items(); track $index) {
      <div class="m-plan__item m-tap" [class.is-featured]="it.featured">
        @if (it.featured) {
          <span class="m-plan__art" aria-hidden="true">
            @if (asset(it.image); as src) {
              <img [src]="src" alt="" />
            } @else {
              <ar-scene [variant]="it.scene || 'dusk'" />
            }
          </span>
        }
        <b>{{ it.title }}</b><span>{{ it.time }}</span>
      </div>
    }
  `,
})
export class ArPlanList {
  protected readonly asset = arAssetUrl();
  readonly items = input<ArPlanItem[]>([]);
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ArWidgetTone, widgetClass } from '../core/primitives';
import { arAssetUrl } from '../core/scene.component';

/** Drawn car used when RideTile has no `image` and no projected `[arArt]`. */
@Component({
  selector: 'svg[arCarArt]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ar-ride__car', '[attr.viewBox]': '"0 0 220 80"', 'aria-hidden': 'true' },
  template: `
    <svg:defs>
      <svg:linearGradient id="ar-car-body" x1="0" y1="0" x2="0" y2="1">
        <svg:stop offset="0" stop-color="#f4f6fa" /><svg:stop offset="0.55" stop-color="#c9cfdb" /><svg:stop offset="1" stop-color="#8f97a8" />
      </svg:linearGradient>
      <svg:linearGradient id="ar-car-glass" x1="0" y1="0" x2="1" y2="0">
        <svg:stop offset="0" stop-color="#2a3346" /><svg:stop offset="1" stop-color="#4b5a78" />
      </svg:linearGradient>
    </svg:defs>
    <svg:ellipse cx="110" cy="72" rx="96" ry="6" fill="rgba(10,15,36,.18)" />
    <svg:path d="M14 52c0-8 6-12 16-14l30-6c10-12 24-20 46-20h20c22 0 34 8 48 20l20 3c12 2 18 8 18 15v8c0 4-3 6-7 6H22c-5 0-8-3-8-7Z" fill="url(#ar-car-body)" />
    <svg:path d="M66 32c9-10 21-15 38-15h14v15Zm56-15h6c18 0 28 6 38 15h-44Z" fill="url(#ar-car-glass)" />
    <svg:path d="M20 50h184" stroke="rgba(255,255,255,.7)" stroke-width="1.5" />
    <svg:rect x="186" y="42" width="14" height="5" rx="2.5" fill="#fff4d6" />
    <svg:rect x="16" y="44" width="10" height="4" rx="2" fill="#e8665c" />
    @for (x of wheels; track x) {
      <svg:g>
        <svg:circle [attr.cx]="x" cy="62" r="13" fill="#1b2030" />
        <svg:circle [attr.cx]="x" cy="62" r="6.5" fill="#b8c0cf" />
        <svg:circle [attr.cx]="x" cy="62" r="2.5" fill="#1b2030" />
      </svg:g>
    }
  `,
})
class ArCarArt {
  protected readonly wheels = [52, 166];
}

/**
 * Ride-hail / transfer tile: provider, ETA disc, vehicle art, pickup title, vehicle and plate.
 * Shows `image` (3D car art) when given, else the drawn car; project `[arArt]` to replace both.
 *
 * ```html
 * <ar-ride-tile provider="Transfer" eta="2" title="Meet at the pickup point" vehicle="Mercedes-Benz E" plate="S00121" image="art/car-3d.webp" />
 * ```
 */
@Component({
  selector: 'ar-ride-tile',
  imports: [ArCarArt],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.role]': 'ariaLabel() ? "region" : null',
    '[attr.title]': 'null',
  },
  template: `
    <div class="ar-w__row">
      <b class="ar-ride__brand">{{ provider() }}</b>
      <span class="ar-ride__eta"><b>{{ eta() }}</b><span>{{ etaUnit() || 'min' }}</span></span>
    </div>
    <div class="ar-ride__art">
      <ng-content select="[arArt]">
        @if (src()) {
          <img class="ar-ride__img" [src]="src()" alt="" draggable="false" />
        } @else {
          <svg arCarArt></svg>
        }
      </ng-content>
    </div>
    <b class="ar-ride__title">{{ title() }}</b>
    <div class="ar-w__row ar-ride__meta"><span>{{ vehicle() }}</span><span class="ar-mono">{{ plate() }}</span></div>
  `,
})
export class ArRideTile {
  private readonly asset = arAssetUrl();
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  readonly provider = input.required<string>();
  readonly eta = input<string | number>('');
  /** Word under the ETA number, default "min". */
  readonly etaUnit = input<string>();
  readonly title = input.required<string>();
  readonly vehicle = input<string>();
  readonly plate = input<string>();
  /** 3D art URL (Art group: car-3d), resolved against `assetsUrl`. */
  readonly image = input<string | null>();
  protected readonly src = computed(() => this.asset(this.image()));
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-ride'));
}

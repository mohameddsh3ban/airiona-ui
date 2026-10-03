import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ArHeroPattern } from '../core/hero-pattern.component';
import { ArIcon } from '../core/icon.component';
import { arAssetUrl } from '../core/scene.component';
import { cx } from '../core/utils';
import { ArAppBar } from './app-bar.component';

export interface ArRouteEnd {
  code: string;
  city: string;
}

/**
 * Midnight results header over a 3D glass globe (`image`), or the dotted world map without one: compact app bar,
 * a dashed arc between two glowing airport dots with a plane at its peak, and the trip summary.
 * Slots: `arActions` (app bar actions), default content (filter and sort pills under the summary).
 *
 * ```html
 * <ar-route-header [image]="globe" title="Select flight" (back)="goBack()" [from]="{ code: 'DXB', city: 'Dubai' }"
 *   [to]="{ code: 'LHR', city: 'London' }" meta="27 Aug – 27 Sep · 1 traveller" />
 * ```
 */
@Component({
  selector: 'ar-route-header',
  imports: [ArAppBar, ArHeroPattern, ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.title]': 'null', '[class]': 'hostClass()' },
  template: `
    @if (src()) {
      <img class="m-routehead__art" [src]="src()" alt="" aria-hidden="true" draggable="false" />
    } @else {
      <ar-hero-pattern pattern="map" />
    }
    @if (title()) {
      <ar-app-bar [title]="title()" tone="dark" showBack (back)="back.emit()">
        <ng-container ngProjectAs="[arActions]"><ng-content select="[arActions]" /></ng-container>
      </ar-app-bar>
    }
    <div class="m-routehead__arc">
      <svg viewBox="0 0 300 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M30 78 C 90 6, 210 6, 270 78" fill="none" class="m-routehead__trail" />
        <path d="M30 78 C 90 6, 210 6, 270 78" fill="none" class="m-routehead__path" />
      </svg>
      <span class="m-routehead__plane"><ar-icon name="plane" [size]="26" /></span>
      <div class="m-routehead__end"><i></i><b>{{ from().code }}</b><span>{{ from().city }}</span></div>
      <div class="m-routehead__end is-to"><i></i><b>{{ to().code }}</b><span>{{ to().city }}</span></div>
    </div>
    @if (meta()) {
      <p class="m-routehead__meta">{{ meta() }}</p>
    }
    <div class="m-routehead__tools"><ng-content /></div>
  `,
})
export class ArRouteHeader {
  private readonly asset = arAssetUrl();

  readonly from = input<Partial<ArRouteEnd>>({});
  readonly to = input<Partial<ArRouteEnd>>({});
  /** App bar title; the bar (with its back button) only renders when set. */
  readonly title = input<string>();
  /** Trip summary under the arc. */
  readonly meta = input<string>();
  /** Backdrop art, e.g. the glass globe. Without it the dotted world map is drawn. */
  readonly image = input<string | null>();
  /** The app bar's back button was pressed. */
  readonly back = output<void>();

  protected readonly src = computed(() => this.asset(this.image()));
  protected readonly hostClass = computed(() => cx('m-routehead', !!this.src() && 'has-art'));
}

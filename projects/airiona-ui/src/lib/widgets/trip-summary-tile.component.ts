import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArWidgetTone, widgetClass } from '../core/primitives';
import { arAssetUrl } from '../core/scene.component';
import { cx } from '../core/utils';

export interface ArTripStat {
  label: string;
  value: string | number;
  unit?: string;
}

/** Drawn scooter used when TripSummaryTile has no `image` and no projected `[arArt]`. */
@Component({
  selector: 'svg[arScooterArt]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ar-trip__art',
    '[attr.viewBox]': '"0 0 48 48"',
    'aria-hidden': 'true',
    fill: 'none',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  },
  template: `
    <svg:path d="M33 8h5M35.5 8 31 38M9 38h22" stroke-width="2.4" stroke="currentColor" />
    <svg:circle cx="9" cy="38" r="4.5" stroke-width="2.4" stroke="currentColor" />
    <svg:circle cx="34" cy="38" r="4.5" stroke-width="2.4" stroke="currentColor" />
  `,
})
class ArScooterArt {}

/**
 * Finished-trip summary: art tile, title, date, a badge icon and a row of stats.
 *
 * ```html
 * <ar-trip-summary-tile title="Electric scooter" date="12 Aug 2026" image="art/scooter-3d.webp"
 *   [stats]="[{ label: 'Distance', value: '3.2', unit: 'km' }]" />
 * ```
 */
@Component({
  selector: 'ar-trip-summary-tile',
  imports: [ArIcon, ArScooterArt],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.role]': 'ariaLabel() ? "region" : null',
    '[attr.title]': 'null',
  },
  template: `
    <div class="ar-trip__head">
      <span [class]="iconClass()">
        <ng-content select="[arArt]">
          @if (src()) {
            <img [src]="src()" alt="" draggable="false" />
          } @else {
            <svg arScooterArt></svg>
          }
        </ng-content>
      </span>
      <div class="ar-w__titles" style="flex: 1; min-width: 0">
        <b class="ar-trip__title">{{ title() }}</b>
        <span class="ar-w__eyebrow">{{ date() }}</span>
      </div>
      <span class="ar-w__badge is-soft"><ar-icon [name]="badgeIcon() || 'bolt'" variant="solid" [size]="18" /></span>
    </div>
    <div class="ar-ringstat__stats">
      @for (s of stats(); track s.label) {
        <div>
          <span>{{ s.label }}</span>
          <b>{{ s.value }}@if (s.unit) {<small>{{ s.unit }}</small>}</b>
        </div>
      }
    </div>
  `,
})
export class ArTripSummaryTile {
  private readonly asset = arAssetUrl();
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  readonly title = input.required<string>();
  readonly date = input<string>();
  readonly stats = input<ArTripStat[]>([]);
  /** 3D art URL (Art group: scooter-3d), resolved against `assetsUrl`. */
  readonly image = input<string | null>();
  /** Solid icon in the round badge, default "bolt". */
  readonly badgeIcon = input<string>();
  protected readonly src = computed(() => this.asset(this.image()));
  protected readonly iconClass = computed(() => cx('ar-trip__icon', !!this.image() && 'has-image'));
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-trip'));
}

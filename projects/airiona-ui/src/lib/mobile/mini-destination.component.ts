import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ArScene, ArSceneVariant, arAssetUrl } from '../core/scene.component';

/**
 * Compact destination card: photo with the city name and an optional discount badge, then price, flight time and dates.
 * Without `image` it shows the drawn `scene`.
 *
 * ```html
 * <ar-mini-destination image="photos/lisbon-rooftops.webp" title="Lisbon" price="$480" duration="7h 30m" dates="12 Mar – 22 Mar" badge="-10%" (press)="open('lis')" />
 * ```
 */
@Component({
  selector: 'ar-mini-destination',
  imports: [ArScene],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'm-minidest m-tap',
    role: 'article',
    '[attr.title]': 'null',
    '(click)': 'press.emit()',
  },
  template: `
    <div class="m-minidest__media">
      @if (src()) {
        <img [src]="src()" [alt]="title()" loading="lazy" />
      } @else {
        <ar-scene [variant]="scene()" [label]="title()" />
      }
      <b>{{ title() }}</b>
      @if (badge()) {
        <span class="m-minidest__badge">{{ badge() }}</span>
      }
    </div>
    <div class="m-minidest__row"><b>{{ price() }}</b><span>{{ duration() }}</span></div>
    <span class="m-minidest__dates">{{ dates() }}</span>
  `,
})
export class ArMiniDestination {
  private readonly asset = arAssetUrl();

  readonly title = input<string>('');
  readonly price = input<string>();
  readonly duration = input<string>();
  readonly dates = input<string>();
  /** Small pill on the photo, e.g. "-10%". */
  readonly badge = input<string>();
  readonly image = input<string | null>();
  /** Drawn fallback when there is no image. */
  readonly scene = input<ArSceneVariant>('coast');
  /** The card was tapped. */
  readonly press = output<void>();

  protected readonly src = computed(() => this.asset(this.image()));
}

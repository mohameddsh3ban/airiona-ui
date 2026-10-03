import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { arAssetUrl } from '../core/scene.component';

/**
 * Grey panel pairing a small illustration (image, or an icon) with one or two sentences and an optional link.
 *
 * ```html
 * <ar-illustration-callout image="onboarding/onboarding-3.webp" linkLabel="House rules" (link)="rules()">
 *   Check-in from 15:00. Your code arrives by message at noon on arrival day.
 * </ar-illustration-callout>
 * ```
 */
@Component({
  selector: 'ar-illustration-callout',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'm-callout' },
  template: `
    <span class="m-callout__art">
      @if (src()) {
        <img [src]="src()" alt="" />
      } @else {
        <ar-icon [name]="icon()" [size]="30" />
      }
    </span>
    <p><ng-content />@if (linkLabel()) {<button type="button" class="m-callout__link" (click)="link.emit()">{{ linkLabel() }}</button>}</p>
  `,
})
export class ArIllustrationCallout {
  private readonly asset = arAssetUrl();

  readonly image = input<string | null>();
  /** Shown when there is no image. */
  readonly icon = input('light-bulb');
  readonly linkLabel = input<string>();
  /** The link button was tapped. */
  readonly link = output<void>();

  protected readonly src = computed(() => this.asset(this.image()));
}

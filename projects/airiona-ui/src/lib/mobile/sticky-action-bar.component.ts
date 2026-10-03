import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Bottom CTA bar for detail and checkout screens: an optional price summary (`arSummary`) and one 60px primary button.
 * Hide the tab bar on screens that use it.
 *
 * ```html
 * <ar-sticky-action-bar>
 *   <ng-container arSummary><b class="m-title-2">$264</b><span class="m-footnote">per night</span></ng-container>
 *   <button arButton size="lg" iconEnd="paper-airplane">Book now</button>
 * </ar-sticky-action-bar>
 * ```
 */
@Component({
  selector: 'ar-sticky-action-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'm-actionbar' },
  template: `
    <div class="m-actionbar__summary"><ng-content select="[arSummary]" /></div>
    <div class="m-actionbar__cta"><ng-content /></div>
  `,
})
export class ArStickyActionBar {}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ArWidgetTone, widgetClass } from '../core/primitives';

/**
 * A city's local time with a day-progress slider and the offset from you in a pill. Light and dark versions.
 *
 * ```html
 * <ar-world-clock city="Shibuya, Tokyo" zone="GMT +9 · Aug 12" period="PM" time="10:25" diff="+4H" [dayProgress]="0.66" />
 * ```
 */
@Component({
  selector: 'ar-world-clock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', '[attr.role]': 'ariaLabel() ? "region" : null', '[attr.aria-label]': 'ariaLabel() || null' },
  template: `
    <b class="ar-world__city">{{ city() }}</b>
    <span class="ar-w__eyebrow">{{ zone() }}</span>
    <div class="ar-world__slider" aria-hidden="true">
      <i [style.width]="pct() + '%'"></i>
      <b style="left: 0%"></b>
      <b class="is-now" [style.left]="pct() + '%'"></b>
    </div>
    <div class="ar-w__row" style="align-items: flex-end">
      <div>
        <span class="ar-world__period">{{ period() }}</span>
        <b class="ar-world__time">{{ time() }}</b>
      </div>
      @if (diff()) {
        <span [class]="ahead() ? 'ar-world__diff is-ahead' : 'ar-world__diff is-behind'">{{ diff() }}</span>
      }
    </div>
  `,
})
export class ArWorldClock {
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  readonly city = input<string>('');
  readonly zone = input<string>();
  /** AM / PM. */
  readonly period = input<string>();
  readonly time = input<string>('');
  /** Offset with sign, e.g. "+4H" or "-4H". */
  readonly diff = input<string>();
  /** 0–1. */
  readonly dayProgress = input<number>(0.62);

  protected readonly pct = computed(() => this.dayProgress() * 100);
  protected readonly ahead = computed(() => (this.diff() || '').charAt(0) !== '-');
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-world'));
}

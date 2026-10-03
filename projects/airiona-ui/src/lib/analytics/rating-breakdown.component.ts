import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';
import { ArCountUp } from '../core/count-up.component';
import { ArIcon } from '../core/icon.component';
import { ArCardHead, ArWidgetTone, widgetClass } from '../core/primitives';
import { arSegColor } from './analytics.utils';

export interface ArRatingSegment {
  label: string;
  /** Percentage of the whole. */
  value: number;
  tone?: string;
}

/**
 * Average score with a star, then a stacked bar split into rated bands with the percentage above each part.
 *
 * ```html
 * <ar-rating-breakdown eyebrow="Guest review results" title="Metrics rating" score="7.8" [segments]="bands" note="Tips from top hosts." />
 * ```
 */
@Component({
  selector: 'ar-rating-breakdown',
  imports: [ArCardHead, ArCountUp, ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', '[attr.role]': 'ariaLabel() ? "region" : null', '[attr.aria-label]': 'ariaLabel() || null', '[attr.title]': 'null' },
  template: `
    <ar-card-head [eyebrow]="eyebrow()" [title]="title()" [openable]="openable()" (open)="open.emit()" />
    <div class="ar-rating-bd__score">
      <ar-icon name="star" variant="solid" [size]="26" style="color: var(--rating)" />
      <b><ar-count-up [value]="score()" /></b>
      <span>{{ scoreLabel() }}</span>
    </div>
    <div class="ar-rating-bd__bars">
      @for (s of segments(); track s.label; let i = $index) {
        <div [style.flex]="s.value + ' 1 0'">
          <span>{{ s.value }}%</span>
          <i [style.background]="color(s, i)"></i>
        </div>
      }
    </div>
    <div class="ar-w__legendrow">
      @for (s of segments(); track s.label; let i = $index) {
        <span class="ar-legend"><i [style.background]="color(s, i)"></i>{{ s.label }}</span>
      }
    </div>
    @if (note()) {
      <p class="ar-w__note"><ar-icon name="information-circle" [size]="16" />{{ note() }}</p>
    }
  `,
})
export class ArRatingBreakdown {
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  /** Counted up next to the star. */
  readonly score = input<string | number | null>('');
  readonly scoreLabel = input<string>('Average rating');
  readonly segments = input<ArRatingSegment[]>([]);
  readonly note = input<string>();
  readonly eyebrow = input<string>();
  readonly title = input<string>();
  readonly openable = input(false, { transform: booleanAttribute });
  readonly open = output<void>();

  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-rating-bd'));

  protected color(s: ArRatingSegment, i: number): string {
    return arSegColor(s.tone, i);
  }
}

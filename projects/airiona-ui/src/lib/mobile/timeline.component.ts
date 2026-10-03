import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ArHeroPattern } from '../core/hero-pattern.component';
import { ArIcon } from '../core/icon.component';
import { ArAvatarStack } from '../core/primitives';

export interface ArTimelineItem {
  title: string;
  time?: string;
  text?: string;
  /** Names for the avatar stack. */
  people?: string[];
  /** The midnight card with the wave pattern, for what is next. */
  featured?: boolean;
  done?: boolean;
}

/**
 * Vertical day plan: an ink line with nodes, a featured midnight card for what is next, and plain entries after it.
 *
 * ```html
 * <ar-timeline [items]="[{ featured: true, title: 'Flight to Tokyo', time: '08:45', done: true }, { title: 'Hotel check-in', time: '14:00' }]" />
 * ```
 */
@Component({
  selector: 'ar-timeline',
  imports: [ArHeroPattern, ArIcon, ArAvatarStack],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <ol class="m-timeline">
      @for (it of items(); track $index) {
        <li class="m-timeline__item" [class.is-featured]="it.featured" [class.is-done]="it.done">
          <span class="m-timeline__node" aria-hidden="true"></span>
          <div class="m-timeline__card m-tap">
            @if (it.featured) {
              <ar-hero-pattern pattern="waves" />
            }
            <div class="m-timeline__top"><b>{{ it.title }}</b><span>{{ it.time }}</span></div>
            @if (it.text) {
              <p>{{ it.text }}</p>
            }
            @if (it.people || it.featured) {
              <div class="m-timeline__foot">
                @if (it.people) {
                  <ar-avatar-stack [people]="it.people" size="md" />
                } @else {
                  <span></span>
                }
                @if (it.featured) {
                  <span class="m-timeline__check" [attr.aria-label]="it.done ? 'Done' : 'Not done'"><ar-icon name="check" [size]="16" [strokeWidth]="2.4" /></span>
                }
              </div>
            }
          </div>
        </li>
      }
    </ol>
  `,
})
export class ArTimeline {
  readonly items = input<ArTimelineItem[]>([]);
}

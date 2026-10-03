import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ArScene, ArSceneVariant } from '../core/scene.component';

export interface ArActivityItem {
  title: string;
  time?: string;
  /** Drawn thumbnails attached to the event. */
  attachments?: ArSceneVariant[];
}

/**
 * Newest-first list of booking events as cards, with optional image attachments.
 *
 * ```html
 * <ar-activity-feed [items]="[{ title: 'Host sent the check-in code', time: 'Just now' }, { title: 'Photos added', time: 'Yesterday', attachments: ['forest'] }]" />
 * ```
 */
@Component({
  selector: 'ar-activity-feed',
  imports: [ArScene],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <ol class="m-feed">
      @for (it of items(); track $index) {
        <li>
          <b>{{ it.title }}</b><span>{{ it.time }}</span>
          @if (it.attachments) {
            <div class="m-feed__files">
              @for (a of it.attachments; track $index) {
                <span class="m-feed__file"><ar-scene [variant]="a" /></span>
              }
            </div>
          }
        </li>
      }
    </ol>
  `,
})
export class ArActivityFeed {
  readonly items = input<ArActivityItem[]>([]);
}

import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArWidgetTone, widgetClass } from '../core/primitives';

/**
 * Tile for a live capture: icon disc, title, state and elapsed time, with a large red stop button.
 * Pressing it switches to an ink start button.
 *
 * ```html
 * <ar-recording-tile title="Lobby camera" status="Recording" elapsed="00:34:20" [(recording)]="rec" />
 * ```
 */
@Component({
  selector: 'ar-recording-tile',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.role]': 'ariaLabel() ? "region" : null',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.title]': 'null',
  },
  template: `
    <span class="ar-w__badge"><ar-icon [name]="icon()" variant="solid" [size]="18" /></span>
    <div class="ar-rec__text">
      <b>{{ title() }}</b>
      <span>{{ recording() ? status() || 'Recording' : 'Stopped' }}</span>
      <span class="ar-rec__time">{{ elapsed() }}</span>
    </div>
    <button type="button" [class]="recording() ? 'ar-rec__btn' : 'ar-rec__btn is-idle'" [attr.aria-label]="recording() ? 'Stop recording' : 'Start recording'" (click)="recording.set(!recording())">
      <ar-icon [name]="recording() ? 'stop' : 'video-camera'" variant="solid" [size]="18" />
    </button>
  `,
})
export class ArRecordingTile {
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  readonly title = input<string>('');
  /** State while recording. Defaults to "Recording". */
  readonly status = input<string>();
  readonly elapsed = input<string>();
  readonly icon = input<string>('video-camera');
  /** Two-way bindable; the round button toggles it. */
  readonly recording = model<boolean>(true);

  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-rec'));
}

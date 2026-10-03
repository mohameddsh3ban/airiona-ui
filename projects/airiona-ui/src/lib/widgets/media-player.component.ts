import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArIcon } from '../core/icon.component';
import { ArWidgetTone, widgetClass } from '../core/primitives';
import { ArScene, ArSceneVariant } from '../core/scene.component';

export type ArMediaPlayerAction = 'shuffle' | 'previous' | 'next' | 'queue';

/**
 * Compact player: artwork, title and artist, brand disc, a scrubber with times, and five controls with play/pause in ink.
 * Project custom artwork with `arArt`; otherwise a drawn `scene` is shown.
 *
 * ```html
 * <ar-media-player title="Lounge at dusk" artist="Airiona Sessions" elapsed="0:18" remaining="-2:24" [progress]="0.3" [(playing)]="on" (action)="onControl($event)" />
 * <ar-media-player title="Mix"><img arArt src="cover.webp" alt="" /></ar-media-player>
 * ```
 */
@Component({
  selector: 'ar-media-player',
  imports: [ArIcon, ArIconButton, ArScene],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.role]': 'ariaLabel() ? "region" : null',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.title]': 'null',
  },
  template: `
    <div class="ar-player__top">
      <span class="ar-player__art"><ng-content select="[arArt]"><ar-scene [variant]="scene()" /></ng-content></span>
      <div class="ar-w__titles" style="flex: 1; min-width: 0">
        <b class="ar-player__title">{{ title() }}</b>
        <span class="ar-w__eyebrow">{{ artist() }}</span>
      </div>
      <span class="ar-player__brand"><ar-icon name="musical-note" variant="solid" [size]="18" /></span>
    </div>
    <div class="ar-player__progress">
      <div class="ar-player__track"><i [style.width]="pct() + '%'"></i><b [style.left]="pct() + '%'"></b></div>
      <div class="ar-w__row ar-player__times"><span>{{ elapsed() }}</span><span>{{ remaining() }}</span></div>
    </div>
    <div class="ar-player__controls">
      <button arIconButton icon="arrows-right-left" size="sm" variant="ghost" label="Shuffle" (click)="action.emit('shuffle')"></button>
      <button arIconButton icon="backward" size="sm" variant="ghost" label="Previous" (click)="action.emit('previous')"></button>
      <button arIconButton [icon]="playing() ? 'pause' : 'play'" size="sm" variant="ink" [label]="playing() ? 'Pause' : 'Play'" (click)="playing.set(!playing())"></button>
      <button arIconButton icon="forward" size="sm" variant="ghost" label="Next" (click)="action.emit('next')"></button>
      <button arIconButton icon="queue-list" size="sm" variant="ghost" label="Queue" (click)="action.emit('queue')"></button>
    </div>
  `,
})
export class ArMediaPlayer {
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  readonly title = input<string>('');
  readonly artist = input<string>();
  /** Drawn artwork used when nothing is projected with `arArt`. */
  readonly scene = input<ArSceneVariant>('dusk');
  readonly elapsed = input<string>();
  readonly remaining = input<string>();
  /** 0–1. */
  readonly progress = input<number>(0);
  /** Two-way bindable; the ink button toggles it. */
  readonly playing = model<boolean>(true);
  /** Shuffle, previous, next or queue was pressed. */
  readonly action = output<ArMediaPlayerAction>();

  protected readonly pct = computed(() => (this.progress() || 0) * 100);
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-player'));
}

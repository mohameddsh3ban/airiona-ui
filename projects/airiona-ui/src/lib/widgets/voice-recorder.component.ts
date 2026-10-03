import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArIcon } from '../core/icon.component';
import { ArWidgetTone, widgetClass } from '../core/primitives';
import { cx } from '../core/utils';

const DEFAULT_WAVE = [3, 5, 4, 8, 6, 10, 7, 12, 9, 14, 8, 11, 6, 16, 10, 7, 12, 5, 9, 4, 7, 3, 5, 3, 4, 2, 3];

/**
 * Midnight tile for a voice note: title, date, settings button, waveform with a red playhead, running time and a
 * red pause button. The waveform animates (`is-live`) while `playing`.
 *
 * ```html
 * <ar-voice-recorder title="Voice note" date="12.08.26" time="01:12:25" [position]="0.62" [(playing)]="live" />
 * ```
 */
@Component({
  selector: 'ar-voice-recorder',
  imports: [ArIcon, ArIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.role]': 'ariaLabel() ? "region" : null',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.title]': 'null',
  },
  template: `
    <div class="ar-w__row">
      <div class="ar-w__titles">
        <b class="ar-recorder__title">{{ title() }}</b>
        <span class="ar-w__eyebrow">{{ date() }}</span>
      </div>
      <button arIconButton icon="adjustments-horizontal" size="sm" variant="soft" label="Recording settings" class="ar-w__darkbtn" (click)="settings.emit()"></button>
    </div>
    <div [class]="waveClass()" aria-hidden="true">
      @for (b of bars(); track $index; let i = $index) {
        <i [class]="i / bars().length < position() ? 'is-played' : ''" [style.height.px]="b * 2 + 4"></i>
      }
      <span class="ar-recorder__head" [style.left]="position() * 100 + '%'"></span>
    </div>
    <div class="ar-w__row">
      <span class="ar-recorder__time">{{ time() }}</span>
      <button type="button" class="ar-recorder__btn" [attr.aria-label]="playing() ? 'Pause recording' : 'Resume recording'" (click)="playing.set(!playing())">
        <ar-icon [name]="playing() ? 'pause' : 'microphone'" variant="solid" [size]="16" />
      </button>
    </div>
  `,
})
export class ArVoiceRecorder {
  readonly tone = input<ArWidgetTone>('dark');
  readonly ariaLabel = input<string>();
  readonly title = input<string>('');
  readonly date = input<string>();
  /** Running time, e.g. 01:12:25. */
  readonly time = input<string>('');
  /** Bar heights. */
  readonly waveform = input<number[]>();
  /** Playhead position, 0–1. */
  readonly position = input<number>(0.62);
  /** Recording/playing state; the round button toggles it. Two-way bindable. */
  readonly playing = model<boolean>(true);
  /** The settings button was pressed. */
  readonly settings = output<void>();

  protected readonly bars = computed(() => this.waveform() || DEFAULT_WAVE);
  protected readonly waveClass = computed(() => cx('ar-recorder__wave', this.playing() && 'is-live'));
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-recorder'));
}

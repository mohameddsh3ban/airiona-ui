import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ArButton } from '../actions/button.component';
import { ArIcon } from '../core/icon.component';
import { ArWidgetTone, widgetClass } from '../core/primitives';
import { arAssetUrl } from '../core/scene.component';
import { cx } from '../core/utils';
import { ArAssistantOrb } from '../workspace/assistant-card.component';

export interface ArPromptSource {
  icon: string;
  label: string;
}

/**
 * "Question of the day" card: chip, 3D art, a suggested question, data-source icons and an Ask AI button.
 * Project `[arArt]` to replace the art.
 *
 * ```html
 * <ar-prompt-card image="art/ai-orb.webp" question="How did my bookings perform?" [sources]="sources" (ask)="ask()" />
 * ```
 */
@Component({
  selector: 'ar-prompt-card',
  imports: [ArIcon, ArButton, ArAssistantOrb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.role]': 'ariaLabel() ? "region" : null',
  },
  template: `
    <span class="ar-prompt__chip"><ar-icon name="chat-bubble-oval-left" variant="solid" [size]="14" />{{ eyebrow() || 'Question of the day' }}</span>
    <div [class]="artClass()">
      <ng-content select="[arArt]">
        @if (src()) {
          <img [src]="src()" alt="" draggable="false" />
        } @else {
          <svg arAssistantOrb></svg>
        }
      </ng-content>
    </div>
    <div class="ar-prompt__panel">
      <p class="ar-prompt__q">{{ question() }}</p>
      @if (sources(); as list) {
        <div class="ar-prompt__sources">
          @for (s of list; track s.icon) {
            <span [attr.title]="s.label"><ar-icon [name]="s.icon" [size]="15" /></span>
          }
        </div>
      }
      <button arButton variant="primary" size="lg" block iconStart="sparkles" (click)="ask.emit()">{{ cta() || 'Ask AI Assistant' }}</button>
    </div>
  `,
})
export class ArPromptCard {
  private readonly asset = arAssetUrl();
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  readonly question = input.required<string>();
  readonly sources = input<ArPromptSource[]>();
  /** Chip text, default "Question of the day". */
  readonly eyebrow = input<string>();
  /** Button text, default "Ask AI Assistant". */
  readonly cta = input<string>();
  /** 3D art URL (Art group: ai-orb), resolved against `assetsUrl`. */
  readonly image = input<string | null>();
  readonly ask = output<void>();
  protected readonly src = computed(() => this.asset(this.image()));
  protected readonly artClass = computed(() => cx('ar-prompt__art', !!this.image() && 'has-image'));
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-prompt'));
}

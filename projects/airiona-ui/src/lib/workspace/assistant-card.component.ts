import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArWidgetTone, widgetClass } from '../core/primitives';
import { arAssetUrl } from '../core/scene.component';
import { uid } from '../core/utils';
import { ArNotch } from './notch.component';

/**
 * Drawn assistant orb, the art fallback of AssistantCard and PromptCard.
 *
 * ```html
 * <svg arAssistantOrb></svg>
 * ```
 */
@Component({
  selector: 'svg[arAssistantOrb]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ar-assist__orb', '[attr.viewBox]': '"0 0 200 200"', 'aria-hidden': 'true' },
  template: `
    <svg:defs>
      <svg:radialGradient [attr.id]="id + 'a'" cx="35%" cy="30%" r="75%">
        <svg:stop offset="0" stop-color="#ffffff" />
        <svg:stop offset="0.25" stop-color="var(--blue-200)" />
        <svg:stop offset="0.7" stop-color="var(--blue-500)" />
        <svg:stop offset="1" stop-color="var(--blue-900)" />
      </svg:radialGradient>
      <svg:radialGradient [attr.id]="id + 'b'" cx="50%" cy="50%" r="50%">
        <svg:stop offset="0" stop-color="var(--blue-300)" stop-opacity="0.6" />
        <svg:stop offset="1" stop-color="var(--blue-300)" stop-opacity="0" />
      </svg:radialGradient>
    </svg:defs>
    <svg:circle cx="110" cy="104" r="92" [attr.fill]="'url(#' + id + 'b)'" />
    <svg:circle cx="110" cy="100" r="62" [attr.fill]="'url(#' + id + 'a)'" />
    <svg:ellipse cx="92" cy="76" rx="22" ry="12" fill="#ffffff" opacity="0.55" transform="rotate(-30 92 76)" />
    <svg:path d="M70 118c18 14 52 16 76-4" stroke="#ffffff" stroke-opacity="0.45" stroke-width="3" fill="none" stroke-linecap="round" />
  `,
})
export class ArAssistantOrb {
  protected readonly id = uid('ar-orb');
}

/**
 * "AI Smart Assistant" card: 3D orb art, a notched open button in the top-left, and three stacked words.
 * Project `[arArt]` to replace the art, and any other content to replace the default "AI / Smart / Assistant" lines.
 *
 * ```html
 * <ar-assistant-card image="art/ai-orb.webp" (open)="openAssistant()" />
 * ```
 */
@Component({
  selector: 'ar-assistant-card',
  imports: [ArNotch, ArIconButton, ArAssistantOrb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.role]': 'ariaLabel() ? "region" : null',
  },
  template: `
    <div class="ar-assist__art">
      <ng-content select="[arArt]">
        @if (src()) {
          <img [src]="src()" alt="" draggable="false" />
        } @else {
          <svg arAssistantOrb></svg>
        }
      </ng-content>
    </div>
    <ar-notch corner="tl">
      <button arIconButton icon="arrow-up-right" variant="brand" [label]="openLabel() || 'Open assistant'" (click)="open.emit()"></button>
    </ar-notch>
    <div class="ar-assist__text">
      <ng-content><span>AI</span><b>Smart</b><span>Assistant</span></ng-content>
    </div>
  `,
})
export class ArAssistantCard {
  private readonly asset = arAssetUrl();
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  /** Accessible name of the notched button, default "Open assistant". */
  readonly openLabel = input<string>();
  /** 3D art URL (Art group: ai-orb), resolved against `assetsUrl`. */
  readonly image = input<string | null>();
  readonly open = output<void>();
  protected readonly src = computed(() => this.asset(this.image()));
  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-assist'));
}

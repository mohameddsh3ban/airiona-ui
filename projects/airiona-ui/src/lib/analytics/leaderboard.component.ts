import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArAvatar, ArCardHead, ArWidgetTone, widgetClass } from '../core/primitives';

export interface ArLeaderboardItem {
  name: string;
  role: string;
  /** Text-safe colour token for the role: blue-600 (default), blue-700, success, warning. */
  roleTone?: string;
  score: string | number;
  label: string;
  avatar?: string;
  /** Colour token of the avatar ring. Defaults to blue-200. */
  ring?: string;
}

/**
 * Ranked list: avatar with a coloured ring, name, role in a tone colour, star score and a word rating.
 *
 * ```html
 * <ar-leaderboard eyebrow="Top host score" title="Top 5 rating" [items]="hosts" openable />
 * ```
 */
@Component({
  selector: 'ar-leaderboard',
  imports: [ArAvatar, ArCardHead, ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', '[attr.role]': 'ariaLabel() ? "region" : null', '[attr.aria-label]': 'ariaLabel() || null', '[attr.title]': 'null' },
  template: `
    <ar-card-head [eyebrow]="eyebrow()" [title]="title()" [openable]="openable()" (open)="open.emit()" />
    <ol class="ar-leader__list">
      @for (it of items(); track it.name) {
        <li>
          <span class="ar-leader__avatar" [style.box-shadow]="'0 0 0 2px var(--surface), 0 0 0 4px var(--' + (it.ring || 'blue-200') + ')'">
            <ar-avatar [name]="it.name" [src]="it.avatar" size="sm" />
          </span>
          <span class="ar-leader__who">
            <b>{{ it.name }}</b>
            <span [style.color]="'var(--' + (it.roleTone || 'blue-600') + ')'">{{ it.role }}</span>
          </span>
          <span class="ar-leader__score">
            <span class="ar-leader__pts"><ar-icon name="star" variant="solid" [size]="14" style="color: var(--rating)" /><b>{{ it.score }}</b></span>
            <span>{{ it.label }}</span>
          </span>
        </li>
      }
    </ol>
  `,
})
export class ArLeaderboard {
  readonly tone = input<ArWidgetTone>('light');
  readonly ariaLabel = input<string>();
  /** 3–5 items. */
  readonly items = input<ArLeaderboardItem[]>([]);
  readonly eyebrow = input<string>();
  readonly title = input<string>();
  readonly openable = input(false, { transform: booleanAttribute });
  readonly open = output<void>();

  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-leader'));
}

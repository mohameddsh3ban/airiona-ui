import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArRing, ArWidgetTone, widgetClass } from '../core/primitives';

/**
 * Midnight tile for a recurring task: eyebrow, task name, time left in blue, and a progress ring with an icon.
 *
 * ```html
 * <ar-habit-tile title="Daily check-in" caption="10m left" [progress]="0.72" icon="pencil-square" />
 * ```
 */
@Component({
  selector: 'ar-habit-tile',
  imports: [ArIcon, ArRing],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.role]': 'ariaLabel() ? "region" : null',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.title]': 'null',
  },
  template: `
    <span class="ar-w__eyebrow">{{ eyebrow() }}</span>
    <b class="ar-habit__title">{{ title() }}</b>
    <span class="ar-habit__caption">{{ caption() }}</span>
    <ar-ring class="ar-habit__ring" [size]="52" [stroke]="3" [value]="progress()"><ar-icon [name]="icon()" [size]="20" /></ar-ring>
  `,
})
export class ArHabitTile {
  readonly tone = input<ArWidgetTone>('dark');
  readonly ariaLabel = input<string>();
  readonly eyebrow = input<string>('Habits');
  readonly title = input<string>('');
  readonly caption = input<string>('');
  /** 0–1. */
  readonly progress = input<number>(0);
  readonly icon = input<string>('pencil-square');

  protected readonly hostClass = computed(() => widgetClass(this.tone(), 'ar-habit'));
}

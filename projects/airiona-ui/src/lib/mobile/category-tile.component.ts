import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, numberAttribute } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { clamp, cx } from '../core/utils';

/**
 * Small tile with an icon, name, count and a thin progress bar. The active tile lifts onto white with an ink icon.
 * Sits on a native `<button>`, so use `(click)` for the press.
 *
 * ```html
 * <button arCategoryTile icon="home-modern" title="Stays" subtitle="3 upcoming" [progress]="0.6" active (click)="open('stays')"></button>
 * ```
 */
@Component({
  selector: 'button[arCategoryTile]',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: 'button',
    '[class]': 'hostClass()',
    // `title` is an input here, not a tooltip: keep the native attribute off like the React tile.
    '[attr.title]': 'null',
  },
  template: `
    <span class="m-cat__icon"><ar-icon [name]="icon()" [size]="18" /></span>
    <b>{{ title() }}</b><span>{{ subtitle() }}</span>
    <i class="m-cat__bar" aria-hidden="true"><i [style.width]="pct() + '%'"></i></i>
  `,
})
export class ArCategoryTile {
  readonly icon = input.required<string>();
  readonly title = input<string>('');
  readonly subtitle = input<string>();
  /** 0–1. */
  readonly progress = input(0, { transform: numberAttribute });
  readonly active = input(false, { transform: booleanAttribute });

  protected readonly pct = computed(() => clamp(this.progress() || 0, 0, 1) * 100);
  protected readonly hostClass = computed(() => cx('m-cat', 'm-tap', this.active() && 'is-active'));
}

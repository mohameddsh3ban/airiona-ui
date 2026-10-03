import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArHeroPattern } from '../core/hero-pattern.component';
import { ArIcon } from '../core/icon.component';
import { cx } from '../core/utils';

/**
 * Tall card for a project or property: icon disc, title, two lines of text and an open button.
 * Dark with the wave pattern, or light blue.
 *
 * ```html
 * <ar-feature-card icon="home-modern" title="Nordic Pine Lodge" text="Refresh photos and rates." openable (open)="go()" />
 * ```
 */
@Component({
  selector: 'ar-feature-card',
  imports: [ArHeroPattern, ArIcon, ArIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.title]': 'null', '[class]': 'hostClass()', role: 'article' },
  template: `
    @if (tone() !== 'light') {
      <ar-hero-pattern pattern="waves" />
    }
    <span class="m-feature__icon"><ar-icon [name]="icon()" [size]="22" variant="solid" /></span>
    <b class="m-feature__title">{{ title() }}</b>
    <p class="m-feature__text">{{ text() }}</p>
    @if (openable()) {
      <button
        arIconButton
        icon="chevron-right"
        size="md"
        [variant]="tone() === 'light' ? 'ink' : 'white'"
        [label]="'Open ' + (title() ?? '')"
        class="m-feature__go"
        (click)="open.emit()"
      ></button>
    }
  `,
})
export class ArFeatureCard {
  readonly title = input<string>();
  readonly text = input<string>();
  readonly icon = input<string>('sparkles');
  readonly tone = input<'dark' | 'light'>('dark');
  /** Shows the round open button, which emits (open). React: passing `onOpen`. */
  readonly openable = input(false, { transform: booleanAttribute });
  readonly open = output<void>();

  protected readonly hostClass = computed(() => cx('m-feature', 'm-tap', `is-${this.tone()}`));
}

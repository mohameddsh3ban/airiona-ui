import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { cx } from '../core/utils';

/**
 * Top bar of a mobile screen: compact (back, centred title, actions) or a 34px large title for a tab's root screen.
 * Project up to two actions with `arActions`.
 *
 * ```html
 * <ar-app-bar title="Boarding pass" showBack (back)="location.back()">
 *   <button arActions arIconButton icon="arrow-up-on-square" label="Share" variant="soft"></button>
 * </ar-app-bar>
 * <ar-app-bar large eyebrow="October 15, 2026" title="Today" />
 * ```
 */
@Component({
  selector: 'ar-app-bar',
  imports: [ArIconButton, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.title]': 'null', '[class]': 'hostClass()' },
  template: `
    <ng-template #actionsTpl><ng-content select="[arActions]" /></ng-template>
    <ng-template #backTpl>
      <button arIconButton icon="chevron-left" size="md" [variant]="tone() === 'dark' ? 'glass' : 'soft'" [label]="backLabel()" class="m-tap" (click)="back.emit()"></button>
    </ng-template>
    @if (large()) {
      <div class="m-appbar__row">
        @if (showBack()) {
          <ng-container [ngTemplateOutlet]="backTpl" />
        } @else {
          <span></span>
        }
        <div class="m-appbar__actions"><ng-container [ngTemplateOutlet]="actionsTpl" /></div>
      </div>
      @if (eyebrow()) {
        <span class="m-appbar__eyebrow">{{ eyebrow() }}</span>
      }
      <h1 class="m-appbar__large">{{ title() }}
        @if (accent()) {
          <i class="m-appbar__dot" aria-hidden="true"></i>
        }
        @if (titleSuffix()) {
          <span class="m-appbar__suffix">{{ titleSuffix() }}</span>
        }
      </h1>
      @if (subtitle()) {
        <p class="m-appbar__sub">{{ subtitle() }}</p>
      }
    } @else {
      <div class="m-appbar__side">
        @if (showBack()) {
          <ng-container [ngTemplateOutlet]="backTpl" />
        }
      </div>
      <div class="m-appbar__center">
        <b class="m-appbar__title">{{ title() }}</b>
        @if (subtitle()) {
          <span class="m-appbar__subsmall">{{ subtitle() }}</span>
        }
      </div>
      <div class="m-appbar__side is-end"><ng-container [ngTemplateOutlet]="actionsTpl" /></div>
    }
  `,
})
export class ArAppBar {
  readonly title = input<string>();
  /** Large 34px title for the root screen of a tab. */
  readonly large = input(false, { transform: booleanAttribute });
  readonly eyebrow = input<string>();
  readonly subtitle = input<string>();
  /** Blue square after the large title. */
  readonly accent = input(false, { transform: booleanAttribute });
  readonly titleSuffix = input<string>();
  readonly tone = input<'light' | 'dark'>('light');
  /** Shows the round back button, which emits (back). React: passing `onBack`. */
  readonly showBack = input(false, { transform: booleanAttribute });
  readonly backLabel = input<string>('Back');
  readonly back = output<void>();

  protected readonly hostClass = computed(() => cx('m-appbar', this.large() && 'm-appbar--large', `is-${this.tone()}`));
}

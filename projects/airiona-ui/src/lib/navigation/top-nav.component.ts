import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArIcon } from '../core/icon.component';
import { ArIndicator } from '../core/indicator.directive';
import { ArAvatar, ArWordmark } from '../core/primitives';
import { cx } from '../core/utils';

export interface ArTopNavLink {
  value: string;
  label: string;
  icon?: string;
}
export interface ArTopNavUser {
  name: string;
  email?: string;
  avatar?: string;
}

/**
 * Top bar: wordmark, a pill group of primary sections, actions and the signed-in user.
 * Project `arBrand` to replace the wordmark and `arActions` elements to replace the default Search / Notifications buttons.
 *
 * ```html
 * <ar-top-nav [links]="links" [(value)]="section" [user]="{ name: 'Maya Haddad', email: 'maya.haddad@mail.com' }">
 *   <button arActions arButton size="sm">Sign in</button>
 * </ar-top-nav>
 * ```
 */
@Component({
  selector: 'ar-top-nav',
  imports: [ArAvatar, ArIcon, ArIconButton, ArIndicator, ArWordmark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <header [class]="headerClass()">
      <ng-content select="[arBrand]"><ar-wordmark /></ng-content>
      <nav class="ar-top__links" aria-label="Primary">
        <span class="ar-top__ind" arIndicator='[aria-current="page"]'></span>
        @for (l of links(); track l.value) {
          <button type="button" class="ar-top__link" [attr.aria-current]="current() === l.value ? 'page' : null" (click)="value.set(l.value)">
            @if (l.icon) {
              <ar-icon [name]="l.icon" [size]="17" />
            }
            {{ l.label }}
          </button>
        }
      </nav>
      <div class="ar-top__right">
        <ng-content select="[arActions]">
          <button arIconButton icon="magnifying-glass" label="Search"></button>
          <button arIconButton icon="bell" label="Notifications" badge></button>
        </ng-content>
        @if (user(); as u) {
          <div class="ar-top__user">
            <ar-avatar [name]="u.name" [src]="u.avatar" />
            @if (u.email) {
              <div class="ar-top__who"><div class="ar-top__name">{{ u.name }}</div><div class="ar-top__mail">{{ u.email }}</div></div>
            }
          </div>
        }
      </div>
    </header>
  `,
})
export class ArTopNav {
  readonly links = input<ArTopNavLink[]>([]);
  /** Active link value; defaults to the first link. Two-way: `[(value)]`. */
  readonly value = model<string | null>(null);
  /** `underline` is the pilot dashboard header: icon links with an ink underline. */
  readonly variant = input<'pill' | 'underline'>('pill');
  readonly user = input<ArTopNavUser>();

  protected readonly current = computed(() => this.value() ?? this.links()[0]?.value ?? null);
  protected readonly headerClass = computed(() => cx('ar-top', this.variant() === 'underline' && 'ar-top--underline'));
}

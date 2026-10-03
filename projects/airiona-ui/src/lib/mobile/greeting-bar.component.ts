import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import { ArAvatar } from '../core/primitives';

/**
 * Top of a home screen: a greeting, one line of context, and round actions (`arActions`) or the avatar.
 *
 * ```html
 * <ar-greeting-bar title="Hello, Maya!" subtitle="It's time to explore">
 *   <button arActions arIconButton icon="bell" label="Notifications" badge></button>
 * </ar-greeting-bar>
 * <ar-greeting-bar title="Hi, Maya" name="Maya Haddad" />
 * ```
 */
@Component({
  selector: 'ar-greeting-bar',
  imports: [ArAvatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.title]': 'null', class: 'm-greet' },
  template: `
    @if (avatarFirst()) {
      <ar-avatar [name]="name() ?? ''" [src]="avatar()" size="lg" />
    }
    <div class="m-greet__text">
      @if (eyebrow()) {
        <span class="m-greet__eyebrow">{{ eyebrow() }}</span>
      }
      <h1 class="m-greet__title">{{ title() }}</h1>
      @if (subtitle()) {
        <p class="m-greet__sub">{{ subtitle() }}</p>
      }
    </div>
    <div class="m-greet__actions">
      <ng-content select="[arActions]" />
      @if (!avatarFirst() && name()) {
        <ar-avatar [name]="name()!" [src]="avatar()" size="lg" />
      }
    </div>
  `,
})
export class ArGreetingBar {
  readonly title = input<string>();
  readonly subtitle = input<string>();
  readonly eyebrow = input<string>();
  /** Shows the avatar (initials when no `avatar` photo). */
  readonly name = input<string>();
  readonly avatar = input<string | null>();
  /** Avatar on the left instead of the right. */
  readonly avatarFirst = input(false, { transform: booleanAttribute });
}

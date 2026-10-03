import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ArAvatar } from '../core/primitives';

export interface ArProfileStat {
  value: string | number;
  label: string;
}

/**
 * Centred profile: rounded-square avatar, name, one line about them and up to three stats on a grey plate.
 *
 * ```html
 * <ar-profile-header name="Lina Park" subtitle="Your host · replies in 10 min" [stats]="[{ value: '4.9', label: 'Rating' }]" />
 * ```
 */
@Component({
  selector: 'ar-profile-header',
  imports: [ArAvatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'm-profile' },
  template: `
    <span class="m-profile__avatar"><ar-avatar [name]="name()" [src]="avatar()" size="lg" /></span>
    <b>{{ name() }}</b>
    @if (subtitle()) {
      <span>{{ subtitle() }}</span>
    }
    @if (stats(); as list) {
      <div class="m-profile__stats">
        @for (s of list; track s.label) {
          <div><b>{{ s.value }}</b><span>{{ s.label }}</span></div>
        }
      </div>
    }
  `,
})
export class ArProfileHeader {
  readonly name = input.required<string>();
  readonly avatar = input<string>();
  readonly subtitle = input<string>();
  readonly stats = input<ArProfileStat[]>();
}

import { ChangeDetectionStrategy, Component, computed, inject, input, model } from '@angular/core';
import { ArAvatar } from '../core/primitives';
import { ArPlatform } from '../core/platform';
import { ArValueControl, arValueAccessor } from '../core/value-control';

export interface ArPeoplePickerPerson {
  name: string;
  avatar?: string;
  /** Label under the face; defaults to the first name. */
  short?: string;
}

/**
 * A row of avatars where the chosen person grows and the others fade back. The chosen name is a
 * form value (`[(value)]`, `ngModel`, `formControlName`); with no value the second person is shown as chosen.
 *
 * ```html
 * <ar-people-picker [people]="[{ name: 'Omar Saleh' }, { name: 'Maya Haddad' }]" [(value)]="who" />
 * ```
 */
@Component({
  selector: 'ar-people-picker',
  imports: [ArAvatar],
  providers: [arValueAccessor(() => ArPeoplePicker)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'm-people', role: 'radiogroup', '[attr.aria-label]': "label() || 'Attendees'" },
  template: `
    @for (p of people(); track p.name) {
      <button
        type="button"
        role="radio"
        class="m-people__item m-tap"
        [attr.aria-checked]="p.name === current() ? 'true' : 'false'"
        [disabled]="isDisabled()"
        (click)="pick(p.name)"
      >
        <ar-avatar [name]="p.name" [src]="p.avatar" size="lg" />
        <span>{{ p.short || p.name.split(' ')[0] }}</span>
      </button>
    }
  `,
})
export class ArPeoplePicker extends ArValueControl<string | null> {
  private readonly platform = inject(ArPlatform);

  /** The chosen person's name. */
  readonly value = model<string | null>(null);
  readonly people = input<ArPeoplePickerPerson[]>([]);
  /** Accessible name of the group, default "Attendees". */
  readonly label = input<string>();

  /** Falls back to the second person (or the first) until something is chosen, like the React default. */
  protected readonly current = computed(() => {
    const v = this.value();
    if (v !== null && v !== undefined) return v;
    const list = this.people();
    return (list[1] || list[0])?.name ?? null;
  });

  protected pick(name: string): void {
    this.platform.haptic();
    this.commit(name);
    this.touch();
  }
}

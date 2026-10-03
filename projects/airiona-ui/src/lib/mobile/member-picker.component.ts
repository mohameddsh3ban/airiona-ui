import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArAvatar } from '../core/primitives';

export interface ArMember {
  name: string;
  avatar?: string;
}

/**
 * Rounded-square avatars of the people on a booking, with a dashed add button.
 *
 * ```html
 * <ar-member-picker [people]="['Lina Park', 'Omar Saleh']" (add)="invite()" />
 * ```
 */
@Component({
  selector: 'ar-member-picker',
  imports: [ArIcon, ArAvatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'm-members' },
  template: `
    @for (p of list(); track p.name) {
      <ar-avatar [name]="p.name" [src]="p.avatar" size="lg" />
    }
    <button type="button" class="m-members__add m-tap" [attr.aria-label]="addLabel()" (click)="add.emit()">
      <ar-icon name="plus" [size]="20" />
    </button>
  `,
})
export class ArMemberPicker {
  readonly people = input<Array<string | ArMember>>([]);
  readonly addLabel = input('Add member');
  /** The add button was tapped. */
  readonly add = output<void>();

  protected readonly list = computed<ArMember[]>(() => this.people().map((p) => (typeof p === 'string' ? { name: p } : p)));
}

import { ChangeDetectionStrategy, Component, booleanAttribute, inject, input, model, output } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArPlatform } from '../core/platform';
import { ArBottomSheet } from './bottom-sheet.component';

export interface ArSheetAction {
  label: string;
  icon?: string;
  /** Destructive actions go last, in `danger`. */
  tone?: 'danger';
}

/**
 * A list of commands in a bottom sheet with a separate Cancel button; the mobile counterpart of Menu.
 * Choosing an action emits (action) with the item, then closes.
 *
 * ```html
 * <ar-action-sheet [(open)]="more" title="Booking K7QX2M" [actions]="actions" (action)="run($event)" />
 * ```
 */
@Component({
  selector: 'ar-action-sheet',
  imports: [ArBottomSheet, ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.title]': 'null', style: 'display: contents' },
  template: `
    <ar-bottom-sheet [(open)]="open" [contained]="contained()" [label]="title() || 'Actions'" sheetClass="m-actions" (closed)="closed.emit()">
      @if (title()) {
        <p class="m-actions__title">{{ title() }}</p>
      }
      <div class="m-actions__group">
        @for (a of actions(); track a.label) {
          <button type="button" [class]="a.tone === 'danger' ? 'm-actions__item m-tap is-danger' : 'm-actions__item m-tap'" (click)="choose(a)">
            @if (a.icon) {
              <ar-icon [name]="a.icon" [size]="22" />
            }
            <span>{{ a.label }}</span>
          </button>
        }
      </div>
      <button type="button" class="m-actions__cancel m-tap" (click)="cancel()">{{ cancelLabel() }}</button>
    </ar-bottom-sheet>
  `,
})
export class ArActionSheet {
  private readonly platform = inject(ArPlatform);

  /** Two-way: `[(open)]`. */
  readonly open = model(true);
  readonly title = input<string>();
  /** Up to 6 actions. */
  readonly actions = input<ArSheetAction[]>([]);
  readonly cancelLabel = input<string>('Cancel');
  readonly contained = input(false, { transform: booleanAttribute });
  /** An action was chosen. */
  readonly action = output<ArSheetAction>();
  /** The sheet closed (action, Cancel, Escape, scrim or drag). */
  readonly closed = output<void>();

  protected choose(a: ArSheetAction): void {
    this.platform.haptic();
    this.action.emit(a);
    this.open.set(false);
    this.closed.emit();
  }

  protected cancel(): void {
    this.open.set(false);
    this.closed.emit();
  }
}

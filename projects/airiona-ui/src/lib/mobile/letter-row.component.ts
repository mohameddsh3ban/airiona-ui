import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/**
 * Compact list row led by a letter mark in a rounded square, with a sub-line and a time.
 * The mark defaults to the first two letters of the title.
 *
 * ```html
 * <ar-letter-row mark="In" title="In progress" subtitle="Tokyo trip" meta="12:50 PM" (press)="open()" />
 * ```
 */
@Component({
  selector: 'ar-letter-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'm-letter m-tap', '[attr.title]': 'null', '(click)': 'press.emit()' },
  template: `
    <span class="m-letter__mark">{{ markText() }}</span>
    <div><b>{{ title() }}</b><span>{{ subtitle() }}</span></div>
    <span class="m-letter__meta">{{ meta() }}</span>
  `,
})
export class ArLetterRow {
  readonly mark = input<string>();
  readonly title = input<string>('');
  readonly subtitle = input<string>();
  readonly meta = input<string>();
  /** The row was tapped. */
  readonly press = output<void>();

  protected readonly markText = computed(() => this.mark() || (this.title() || '?').slice(0, 2));
}

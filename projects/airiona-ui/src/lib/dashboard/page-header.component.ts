import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { ArSegmentedControl } from '../actions/segmented-control.component';
import { ArOption } from '../core/utils';

/**
 * Big page title with optional pill tabs and right-aligned actions. Mark projected actions with `arActions`.
 *
 * ```html
 * <ar-page-header title="Revenue" [tabs]="[{ value: 'overview', label: 'Overview' }]" [(tab)]="tab">
 *   <button arButton arActions variant="secondary" iconStart="plus">Add</button>
 * </ar-page-header>
 * ```
 */
@Component({
  selector: 'ar-page-header',
  imports: [ArSegmentedControl],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ar-pagehead', '[attr.title]': 'null' },
  template: `
    <div class="ar-pagehead__left">
      <h1 class="ar-pagehead__title">{{ title() }}</h1>
      @if (tabs(); as options) {
        <ar-segmented-control class="ar-pagehead__tabs" [label]="title() + ' views'" variant="pills" [options]="options" [(value)]="tab" />
      }
    </div>
    <div class="ar-pagehead__actions"><ng-content select="[arActions]" /></div>
  `,
})
export class ArPageHeader {
  readonly title = input.required<string>();
  readonly tabs = input<Array<string | ArOption>>();
  /** Selected tab value (two-way). Falls back to the first tab when null. */
  readonly tab = model<string | null>(null);
}

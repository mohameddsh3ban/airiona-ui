import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, TemplateRef, computed, contentChildren, inject, input } from '@angular/core';

export interface ArDetailItem {
  label: string;
  /** Plain value. For rich content (a Badge, mono text) add `<ng-template arDetailValue="Label">`. */
  value?: string | number;
}

/** Rich value for the DetailList row whose label matches: `<ng-template arDetailValue="Status">…</ng-template>`. */
@Directive({ selector: 'ng-template[arDetailValue]' })
export class ArDetailValue {
  readonly label = input.required<string>({ alias: 'arDetailValue' });
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

/**
 * Label and value pairs in rows separated by hairlines, for the facts of a booking.
 *
 * ```html
 * <ar-detail-list [items]="[{ label: 'Dates', value: '15–19 Oct' }, { label: 'Status' }]">
 *   <ng-template arDetailValue="Status"><ar-badge tone="success" dot size="sm">Confirmed</ar-badge></ng-template>
 * </ar-detail-list>
 * ```
 */
@Component({
  selector: 'ar-detail-list',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <dl class="m-details">
      @for (it of items(); track it.label) {
        <div>
          <dt>{{ it.label }}</dt>
          <dd>
            @if (templates().get(it.label); as t) {
              <ng-container [ngTemplateOutlet]="t" />
            } @else {
              {{ it.value }}
            }
          </dd>
        </div>
      }
    </dl>
  `,
})
export class ArDetailList {
  readonly items = input<ArDetailItem[]>([]);

  private readonly custom = contentChildren(ArDetailValue);
  protected readonly templates = computed(() => new Map(this.custom().map((d) => [d.label(), d.template] as const)));
}

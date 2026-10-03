import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  inject,
  input,
  model,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArIcon } from '../core/icon.component';
import { cx } from '../core/utils';

/** A table row. Any object; `rowKey` names its identifier field. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ArTableRow = Record<string, any>;
export type ArRowKey = string | number;

export interface ArTableSort {
  key: string;
  dir: 'asc' | 'desc';
}

/** Column definition. Custom cells: `<ng-template arCell="key" let-row>`. */
export interface ArTableColumn<T extends ArTableRow = ArTableRow> {
  key: string;
  /** Header text. */
  header: string;
  /** Render the header for screen readers only (e.g. an "Actions" column). */
  srHeader?: boolean;
  /** Raw value when it is not `row[key]`. */
  accessor?: (row: T) => unknown;
  sortable?: boolean;
  /** Value used for sorting when the rendered cell differs from the raw value. */
  sortValue?: (row: T) => unknown;
  /** Text searched for this column (e.g. name + email). */
  searchValue?: (row: T) => unknown;
  align?: 'left' | 'right' | 'center';
  width?: number | string;
  mono?: boolean;
  numeric?: boolean;
  muted?: boolean;
  /** First sort direction when the header is clicked. */
  defaultDir?: 'asc' | 'desc';
}

/**
 * Template context of `arCell`: `let-row` (implicit) and `let-value="value"`.
 * The row is typed `any` so templates can write `row.guest` (rows are caller-defined shapes).
 */
export interface ArCellContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $implicit: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
  value: unknown;
}

/**
 * Custom cell renderer for the column with the same key.
 *
 * ```html
 * <ng-template arCell="guest" let-row><b>{{ row.guest }}</b></ng-template>
 * ```
 */
@Directive({ selector: 'ng-template[arCell]' })
export class ArCell {
  readonly template = inject<TemplateRef<ArCellContext>>(TemplateRef);
  /** Column key. */
  readonly arCell = input.required<string>();
  static ngTemplateContextGuard(_dir: ArCell, ctx: unknown): ctx is ArCellContext {
    return true;
  }
}

/** Template context of `arBulk`: `let-selected` is the array of selected row keys. */
export interface ArBulkContext {
  $implicit: ArRowKey[];
}

/**
 * Bulk actions shown in the ink bar while rows are selected.
 *
 * ```html
 * <ng-template arBulk let-sel><button arButton variant="white" size="sm">Export {{ sel.length }}</button></ng-template>
 * ```
 */
@Directive({ selector: 'ng-template[arBulk]' })
export class ArBulk {
  readonly template = inject<TemplateRef<ArBulkContext>>(TemplateRef);
  static ngTemplateContextGuard(_dir: ArBulk, ctx: unknown): ctx is ArBulkContext {
    return true;
  }
}

function cellValue(row: ArTableRow, col: ArTableColumn): unknown {
  return col.accessor ? col.accessor(row) : row[col.key];
}

/**
 * Card that lists records with search, sorting (asc → desc → off), row selection with an ink bulk bar,
 * row menus and pagination. Toolbar slots: `[arActions]` (right of the search), `[arFilters]` (chip row).
 *
 * ```html
 * <ar-data-table title="Bookings" [rows]="rows" [columns]="cols" selectable searchable [pageSize]="5">
 *   <button arButton arActions size="sm" iconStart="plus">New booking</button>
 *   <ng-template arCell="status" let-row><ar-badge dot [tone]="tone(row)">{{ row.status }}</ar-badge></ng-template>
 *   <ng-template arBulk let-sel><button arButton variant="white" size="sm">Export {{ sel.length }}</button></ng-template>
 * </ar-data-table>
 * ```
 */
@Component({
  selector: 'ar-data-table',
  imports: [ArIcon, ArIconButton, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', '[attr.title]': 'null' },
  template: `
    @if (showToolbar()) {
      <div class="ar-table__bar">
        @if (selected().length && bulkTpl()) {
          <div class="ar-table__bulk">
            <span class="ar-table__bulk-count">{{ selected().length }} selected</span>
            <button type="button" class="ar-table__clear" (click)="selected.set([])">Clear</button>
            <div class="ar-table__bulk-actions">
              <ng-container [ngTemplateOutlet]="bulkTpl()!.template" [ngTemplateOutletContext]="{ $implicit: selected() }" />
            </div>
          </div>
        } @else {
          <div class="ar-table__title">
            @if (title()) {
              <h3>{{ title() }}</h3>
            }
            <span class="ar-table__count">{{ filtered().length }}</span>
          </div>
          <div class="ar-table__filters"><ng-content select="[arFilters]" /></div>
          <div class="ar-table__tools">
            @if (searchable()) {
              <label class="ar-table__search">
                <ar-icon name="magnifying-glass" [size]="16" />
                <input
                  [value]="query()"
                  [placeholder]="searchPlaceholder() || 'Search'"
                  [attr.aria-label]="searchPlaceholder() || 'Search table'"
                  (input)="onQuery($any($event.target).value)"
                />
              </label>
            }
            <ng-content select="[arActions]" />
          </div>
        }
      </div>
    }
    <div class="ar-table__scroll" tabindex="0" role="region" [attr.aria-label]="(title() || 'Table') + ', scrollable'">
      <table>
        @if (caption()) {
          <caption class="ar-sr">{{ caption() }}</caption>
        }
        <thead>
          <tr>
            @if (selectable()) {
              <th class="ar-table__check" scope="col">
                <label class="ar-check">
                  <input type="checkbox" [checked]="allOn()" [indeterminate]="someOn()" (change)="toggleAll()" aria-label="Select all rows on this page" />
                  <span class="ar-check__box" aria-hidden="true"><ar-icon [name]="someOn() ? 'minus' : 'check'" [size]="14" [strokeWidth]="2.5" /></span>
                </label>
              </th>
            }
            @for (c of columns(); track c.key) {
              <th scope="col" [style.width]="colWidth(c)" [style.text-align]="c.align || 'left'" [attr.aria-sort]="ariaSort(c)">
                @if (c.sortable) {
                  <button type="button" [class]="sortClass(c)" (click)="sortBy(c)">
                    <ng-container [ngTemplateOutlet]="headText" [ngTemplateOutletContext]="{ $implicit: c }" />
                    <ar-icon name="chevron-down" [size]="14" [strokeWidth]="2.25" [iconClass]="arrowClass(c)" />
                  </button>
                } @else {
                  <ng-container [ngTemplateOutlet]="headText" [ngTemplateOutletContext]="{ $implicit: c }" />
                }
              </th>
            }
          </tr>
        </thead>
        @for (k of [bodyKey()]; track k) {
          <tbody>
            @if (visible().length === 0) {
              <tr>
                <td class="ar-table__empty" [attr.colspan]="columns().length + (selectable() ? 1 : 0)">
                  <div class="ar-table__empty-inner">
                    <span class="ar-table__empty-icon"><ar-icon name="magnifying-glass" [size]="20" /></span>
                    <strong>{{ emptyTitle() || 'Nothing matches' }}</strong>
                    <span>{{ emptyMessage() }}</span>
                  </div>
                </td>
              </tr>
            }
            @for (r of visible(); track r[rowKey()]) {
              <tr [class]="rowClass(r)" (click)="onRow($event, r)">
                @if (selectable()) {
                  <td class="ar-table__check">
                    <label class="ar-check">
                      <input type="checkbox" [checked]="isSelected(r)" (change)="toggleRow(r[rowKey()])" [attr.aria-label]="'Select row ' + r[rowKey()]" />
                      <span class="ar-check__box" aria-hidden="true"><ar-icon name="check" [size]="14" [strokeWidth]="2.5" /></span>
                    </label>
                  </td>
                }
                @for (c of columns(); track c.key) {
                  <td [class]="cellClass(c)" [style.text-align]="c.align || 'left'">
                    @if (cellTpl(c.key); as tpl) {
                      <ng-container [ngTemplateOutlet]="tpl" [ngTemplateOutletContext]="{ $implicit: r, row: r, value: value(r, c) }" />
                    } @else {
                      {{ value(r, c) }}
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        }
      </table>
    </div>
    @if (pageSize() && filtered().length > pageSize()) {
      <div class="ar-table__foot">
        <span>Showing {{ page() * pageSize() + 1 }}–{{ pageEnd() }} of {{ filtered().length }}</span>
        <div class="ar-table__pager">
          <button arIconButton icon="chevron-left" size="sm" variant="outline" label="Previous page" [disabled]="page() === 0" (click)="pageIndex.set(page() - 1)"></button>
          @for (i of pageList(); track i) {
            <button type="button" [class]="i === page() ? 'ar-table__page is-current' : 'ar-table__page'" [attr.aria-current]="i === page() ? 'page' : null" (click)="pageIndex.set(i)">{{ i + 1 }}</button>
          }
          <button arIconButton icon="chevron-right" size="sm" variant="outline" label="Next page" [disabled]="page() >= pages() - 1" (click)="pageIndex.set(page() + 1)"></button>
        </div>
      </div>
    }
    <ng-template #headText let-c>
      @if (c.srHeader) {
        <span class="ar-sr">{{ c.header }}</span>
      } @else {
        {{ c.header }}
      }
    </ng-template>
  `,
})
export class ArDataTable {
  readonly columns = input<ArTableColumn[]>([]);
  readonly rows = input<ArTableRow[]>([]);
  /** Field that identifies a row. */
  readonly rowKey = input<string>('id');
  readonly title = input<string>();
  readonly caption = input<string>();
  readonly searchable = input(false, { transform: booleanAttribute });
  readonly searchPlaceholder = input<string>();
  readonly selectable = input(false, { transform: booleanAttribute });
  /** Two-way: keys of the selected rows. */
  readonly selected = model<ArRowKey[]>([]);
  /** Two-way: current sort (`{ key, dir }`), or null. Seed it for a default sort. */
  readonly sort = model<ArTableSort | null>(null);
  /** Rows per page; 0 shows all. */
  readonly pageSize = input(0, { transform: numberAttribute });
  readonly density = input<'comfortable' | 'compact'>('comfortable');
  readonly emptyTitle = input<string>();
  readonly emptyText = input<string>();
  /** Show the toolbar even without a title or search (when you only project `[arActions]` / `[arFilters]`). */
  readonly toolbar = input(false, { transform: booleanAttribute });
  /** Rows get a pointer and emit `rowClick` (clicks on buttons, links and inputs inside are ignored). */
  readonly clickableRows = input(false, { transform: booleanAttribute });
  readonly rowClick = output<ArTableRow>();

  private readonly cells = contentChildren(ArCell);
  protected readonly bulkTpl = contentChild(ArBulk);

  protected readonly query = signal('');
  protected readonly pageIndex = signal(0);

  protected readonly filtered = computed(() => {
    const q = this.query().toLowerCase();
    const cols = this.columns();
    let list = this.rows();
    if (q) {
      list = list.filter((r) =>
        cols.some((c) => {
          const v = c.searchValue ? c.searchValue(r) : cellValue(r, c);
          return v !== undefined && v !== null && String(v).toLowerCase().includes(q);
        }),
      );
    }
    const sort = this.sort();
    const sc = sort ? cols.find((c) => c.key === sort.key) : undefined;
    if (sort && sc) {
      const val = (row: ArTableRow) => (sc.sortValue ? sc.sortValue(row) : cellValue(row, sc));
      list = list.slice().sort((a, b) => {
        const x = val(a);
        const y = val(b);
        const r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y));
        return sort.dir === 'desc' ? -r : r;
      });
    }
    return list;
  });
  protected readonly pages = computed(() => (this.pageSize() ? Math.max(1, Math.ceil(this.filtered().length / this.pageSize())) : 1));
  protected readonly page = computed(() => Math.min(this.pageIndex(), this.pages() - 1));
  protected readonly pageList = computed(() => Array.from({ length: this.pages() }, (_, i) => i));
  protected readonly pageEnd = computed(() => Math.min(this.filtered().length, this.page() * this.pageSize() + this.pageSize()));
  protected readonly visible = computed(() => {
    const size = this.pageSize();
    const p = this.page();
    return size ? this.filtered().slice(p * size, p * size + size) : this.filtered();
  });
  private readonly pageKeys = computed(() => this.visible().map((r) => r[this.rowKey()] as ArRowKey));
  protected readonly allOn = computed(() => {
    const sel = this.selected();
    const keys = this.pageKeys();
    return keys.length > 0 && keys.every((k) => sel.includes(k));
  });
  protected readonly someOn = computed(() => !this.allOn() && this.pageKeys().some((k) => this.selected().includes(k)));
  /** Changing page, sort or query remounts tbody so the row stagger replays. */
  protected readonly bodyKey = computed(() => {
    const s = this.sort();
    return `${this.page()}-${s ? s.key + s.dir : ''}-${this.query()}`;
  });
  protected readonly showToolbar = computed(() => !!this.title() || this.searchable() || !!this.bulkTpl() || this.toolbar());
  protected readonly emptyMessage = computed(() =>
    this.query()
      ? `No rows match “${this.query()}”. Try a booking reference or guest name.`
      : this.emptyText() || 'There is nothing here yet.',
  );
  protected readonly hostClass = computed(() => cx('ar-table', this.density() === 'compact' && 'ar-table--compact'));

  protected cellTpl(key: string): TemplateRef<ArCellContext> | null {
    return this.cells().find((c) => c.arCell() === key)?.template ?? null;
  }
  protected value(r: ArTableRow, c: ArTableColumn): unknown {
    return cellValue(r, c);
  }
  protected isSelected(r: ArTableRow): boolean {
    return this.selected().includes(r[this.rowKey()]);
  }
  protected colWidth(c: ArTableColumn): string | null {
    return c.width === undefined ? null : typeof c.width === 'number' ? `${c.width}px` : c.width;
  }
  protected ariaSort(c: ArTableColumn): string | null {
    const s = this.sort();
    if (s && s.key === c.key) return s.dir === 'asc' ? 'ascending' : 'descending';
    return c.sortable ? 'none' : null;
  }
  protected sortClass(c: ArTableColumn): string {
    return cx('ar-table__sort', this.sort()?.key === c.key && 'is-active', c.align === 'right' && 'is-right');
  }
  protected arrowClass(c: ArTableColumn): string {
    const s = this.sort();
    return cx('ar-table__arrow', !!s && s.key === c.key && s.dir === 'asc' && 'is-up');
  }
  protected cellClass(c: ArTableColumn): string {
    return cx(c.mono && 'ar-table__mono', c.numeric && 'ar-num', c.muted && 'ar-table__muted');
  }
  protected rowClass(r: ArTableRow): string {
    return cx(this.isSelected(r) && 'is-selected', this.clickableRows() && 'is-clickable');
  }

  protected onQuery(v: string): void {
    this.query.set(v);
    this.pageIndex.set(0);
  }
  protected sortBy(c: ArTableColumn): void {
    if (!c.sortable) return;
    const cur = this.sort();
    this.sort.set(!cur || cur.key !== c.key ? { key: c.key, dir: c.defaultDir || 'asc' } : cur.dir === 'asc' ? { key: c.key, dir: 'desc' } : null);
  }
  protected toggleRow(k: ArRowKey): void {
    const sel = this.selected();
    this.selected.set(sel.includes(k) ? sel.filter((x) => x !== k) : [...sel, k]);
  }
  protected toggleAll(): void {
    const sel = this.selected();
    const keys = this.pageKeys();
    this.selected.set(this.allOn() ? sel.filter((k) => !keys.includes(k)) : [...sel, ...keys.filter((k) => !sel.includes(k))]);
  }
  protected onRow(ev: MouseEvent, r: ArTableRow): void {
    if (!this.clickableRows()) return;
    if ((ev.target as HTMLElement).closest('button, a, input, label')) return;
    this.rowClick.emit(r);
  }
}

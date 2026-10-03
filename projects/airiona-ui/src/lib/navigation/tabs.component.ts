import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  TemplateRef,
  afterEveryRender,
  booleanAttribute,
  computed,
  contentChildren,
  inject,
  input,
  linkedSignal,
  model,
  viewChild,
} from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArPlatform } from '../core/platform';
import { cx, uid } from '../core/utils';

/** One tab of `ar-tabs`. Give it `content` for a text panel, or project `<ng-template arTabPanel="value">`. */
export interface ArTab {
  value: string;
  label: string;
  icon?: string;
  count?: number | string;
  disabled?: boolean;
  /** Plain-text panel content. A matching `arTabPanel` template wins. */
  content?: string;
}

/**
 * Rich panel for the tab with the same value.
 *
 * ```html
 * <ng-template arTabPanel="rooms"><ul class="ar-amen">…</ul></ng-template>
 * ```
 */
@Directive({ selector: 'ng-template[arTabPanel]' })
export class ArTabPanel {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
  /** Value of the tab this panel belongs to. */
  readonly arTabPanel = input.required<string>();
}

/**
 * Switches between panels of related content in the same place. `line` slides a blue ink bar under the
 * active tab; `card` turns it into a folder tab that opens into the panel. Panels slide in from the side
 * of the tab you came from. Keyboard: ← → move and select, Home and End jump to the ends.
 *
 * ```html
 * <ar-tabs label="Listing sections" [tabs]="tabs" [(value)]="section">
 *   <button arButton arExtra variant="ghost" size="sm" iconStart="arrow-up-on-square">Share</button>
 *   <ng-template arTabPanel="reviews"><span class="ar-rating">…</span></ng-template>
 * </ar-tabs>
 * ```
 */
@Component({
  selector: 'ar-tabs',
  imports: [ArIcon, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()' },
  template: `
    <div class="ar-tabs__bar">
      <div #list role="tablist" class="ar-tabs__list" [attr.aria-label]="label()" (keydown)="onKey($event)">
        @for (t of tabs(); track t.value) {
          <button
            type="button"
            role="tab"
            class="ar-tabs__tab"
            [id]="tabsId() + '-t-' + t.value"
            [attr.data-value]="t.value"
            [attr.aria-selected]="t.value === current() ? 'true' : 'false'"
            [attr.aria-controls]="tabsId() + '-p-' + t.value"
            [attr.tabindex]="t.value === current() ? 0 : -1"
            [disabled]="!!t.disabled"
            (click)="value.set(t.value)"
          >
            @if (t.icon) {
              <ar-icon [name]="t.icon" [size]="18" />
            }
            <span>{{ t.label }}</span>
            @if (t.count !== undefined) {
              <span class="ar-tabs__count">{{ t.count }}</span>
            }
          </button>
        }
        @if (variant() === 'line') {
          <span #ink class="ar-tabs__ink" aria-hidden="true" style="opacity: 0"></span>
        }
      </div>
      <div class="ar-tabs__extra"><ng-content select="[arExtra]" /></div>
    </div>
    @if (panel(); as p) {
      @for (k of [p.tab.value]; track k) {
        <div
          role="tabpanel"
          tabindex="0"
          [id]="tabsId() + '-p-' + p.tab.value"
          [attr.aria-labelledby]="tabsId() + '-t-' + p.tab.value"
          [class]="panelClass()"
        >
          @if (p.template) {
            <ng-container [ngTemplateOutlet]="p.template" />
          } @else {
            {{ p.tab.content }}
          }
        </div>
      }
    }
  `,
})
export class ArTabs {
  private readonly platform = inject(ArPlatform);

  readonly tabs = input<ArTab[]>([]);
  /** Two-way. Defaults to the first enabled tab. */
  readonly value = model<string | null>(null);
  /** Accessible name of the tab list. */
  readonly label = input<string>();
  readonly variant = input<'line' | 'card'>('line');
  readonly size = input<'md' | 'sm'>('md');
  /** Tabs share the full width. */
  readonly fitted = input(false, { transform: booleanAttribute });
  readonly id = input<string>();

  private readonly panels = contentChildren(ArTabPanel);
  private readonly autoId = uid('ar-tabs');
  protected readonly tabsId = computed(() => this.id() || this.autoId);
  private readonly enabled = computed(() => this.tabs().filter((t) => !t.disabled));
  protected readonly current = computed(() => this.value() ?? this.enabled()[0]?.value ?? null);
  private readonly curIdx = computed(() => Math.max(0, this.tabs().findIndex((t) => t.value === this.current())));
  /** Slide direction relative to the previously selected tab. */
  private readonly dir = linkedSignal<number, string>({
    source: this.curIdx,
    computation: (idx, prev) => (!prev ? '' : idx > prev.source ? 'is-next' : idx < prev.source ? 'is-prev' : prev.value),
  });
  protected readonly panel = computed(() => {
    const tab = this.tabs().find((t) => t.value === this.current());
    if (!tab) return null;
    const template = this.panels().find((p) => p.arTabPanel() === tab.value)?.template ?? null;
    if (!template && tab.content === undefined) return null;
    return { tab, template };
  });
  protected readonly panelClass = computed(() => cx('ar-tabs__panel', this.dir()));
  protected readonly hostClass = computed(() =>
    cx('ar-tabs', `ar-tabs--${this.variant()}`, this.fitted() && 'ar-tabs--fitted', this.size() === 'sm' && 'ar-tabs--sm'),
  );

  private readonly list = viewChild<ElementRef<HTMLElement>>('list');
  private readonly ink = viewChild<ElementRef<HTMLElement>>('ink');
  private lastInk = '';
  private lastInkEl: HTMLElement | null = null;
  private observer: ResizeObserver | null = null;
  private observed: HTMLElement | null = null;

  constructor() {
    afterEveryRender({ write: () => this.measure(false) });
    const win = this.platform.window;
    if (win) {
      const onResize = () => this.measure(true);
      win.addEventListener('resize', onResize);
      // Tab widths change after render when web fonts swap in, so watch the selected tab directly.
      this.observer = typeof ResizeObserver === 'function' ? new ResizeObserver(() => this.measure(true)) : null;
      inject(DestroyRef).onDestroy(() => {
        win.removeEventListener('resize', onResize);
        this.observer?.disconnect();
      });
    }
  }

  /** Slides the ink under the selected tab (width + translateX only, like React). */
  private measure(force: boolean): void {
    const ink = this.ink()?.nativeElement;
    const el = this.list()?.nativeElement.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!ink || !el) return;
    if (this.observer && this.observed !== el) {
      if (this.observed) this.observer.unobserve(this.observed);
      this.observer.observe(el);
      this.observed = el;
    }
    const key = `${el.offsetLeft},${el.offsetWidth}`;
    if (key === this.lastInk && ink === this.lastInkEl && !force) return;
    this.lastInk = key;
    this.lastInkEl = ink;
    ink.style.opacity = '';
    ink.style.width = `${el.offsetWidth}px`;
    ink.style.transform = `translateX(${el.offsetLeft}px)`;
  }

  protected onKey(ev: KeyboardEvent): void {
    const en = this.enabled();
    if (!en.length) return;
    const idx = en.findIndex((t) => t.value === this.current());
    let next: ArTab | undefined;
    if (ev.key === 'ArrowRight') next = en[(idx + 1) % en.length];
    else if (ev.key === 'ArrowLeft') next = en[(idx - 1 + en.length) % en.length];
    else if (ev.key === 'Home') next = en[0];
    else if (ev.key === 'End') next = en[en.length - 1];
    if (!next) return;
    ev.preventDefault();
    this.value.set(next.value);
    this.list()?.nativeElement.querySelector<HTMLElement>(`[data-value="${next.value}"]`)?.focus();
  }
}

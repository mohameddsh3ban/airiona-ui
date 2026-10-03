import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  Renderer2,
  computed,
  effect,
  inject,
  input,
  model,
  numberAttribute,
  signal,
  viewChild,
} from '@angular/core';
import { ArPlatform } from '../core/platform';
import { uid } from '../core/utils';

export type ArTooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export type ArTooltipTone = 'ink' | 'light';

interface TipPos {
  top: number;
  left: number;
  p: ArTooltipPlacement;
  arrow: number;
}

/** Places a fixed tooltip next to its anchor, flipping when there is no room. Shared by the component and the directive. */
function placeTip(anchor: HTMLElement, tip: HTMLElement, placement: ArTooltipPlacement, win: Window): TipPos {
  const r = anchor.getBoundingClientRect();
  const tw = tip.offsetWidth;
  const th = tip.offsetHeight;
  const vw = win.innerWidth;
  const vh = win.innerHeight;
  const gap = 10;
  let p = placement;
  if (p === 'top' && r.top - th - gap < 8) p = 'bottom';
  else if (p === 'bottom' && r.bottom + th + gap > vh - 8) p = 'top';
  else if (p === 'left' && r.left - tw - gap < 8) p = 'right';
  else if (p === 'right' && r.right + tw + gap > vw - 8) p = 'left';
  if (p === 'top' || p === 'bottom') {
    const top = p === 'top' ? r.top - th - gap : r.bottom + gap;
    const left = Math.max(8, Math.min(r.left + r.width / 2 - tw / 2, vw - tw - 8));
    return { top, left, p, arrow: r.left + r.width / 2 - left };
  }
  const left = p === 'left' ? r.left - tw - gap : r.right + gap;
  const top = Math.max(8, Math.min(r.top + r.height / 2 - th / 2, vh - th - 8));
  return { top, left, p, arrow: r.top + r.height / 2 - top };
}

/**
 * Short label on hover (after 350ms) or immediately on keyboard focus; hides on blur, mouse leave and Escape.
 * Wraps exactly one focusable trigger and links it with `aria-describedby` while shown.
 *
 * ```html
 * <ar-tooltip content="Swap origin and destination" kbd="S" placement="bottom">
 *   <button arIconButton icon="arrows-right-left" label="Swap"></button>
 * </ar-tooltip>
 * ```
 * For a plain text tip on any element, use the `[arTooltip]` directive.
 */
@Component({
  selector: 'ar-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ar-tip-anchor',
    '[attr.title]': 'null',
    '(mouseenter)': 'show(false)',
    '(mouseleave)': 'hide()',
    '(focusin)': 'show(true)',
    '(focusout)': 'hide()',
  },
  template: `
    <ng-content />
    @if (open()) {
      <span
        #tip
        role="tooltip"
        [id]="tipId()"
        [attr.data-placement]="pos()?.p ?? 'top'"
        [class]="'ar-tip ar-tip--' + tone()"
        [style.top.px]="pos()?.top ?? 0"
        [style.left.px]="pos()?.left ?? 0"
        [style.visibility]="pos() ? 'visible' : 'hidden'"
      >
        @if (title()) {
          <span class="ar-tip__title">{{ title() }}</span>
        }
        <span class="ar-tip__text">{{ content() }}</span>
        @if (kbd()) {
          <kbd class="ar-tip__kbd">{{ kbd() }}</kbd>
        }
        <span class="ar-tip__arrow" [style.left.px]="arrowX()" [style.top.px]="arrowY()"></span>
      </span>
    }
  `,
})
export class ArTooltip {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platform = inject(ArPlatform);
  private readonly doc = inject(DOCUMENT);

  /** One short sentence. */
  readonly content = input<string>('');
  readonly title = input<string>();
  /** Keyboard shortcut shown as a `kbd` (React `shortcut`). */
  readonly kbd = input<string>();
  readonly placement = input<ArTooltipPlacement>('top');
  readonly tone = input<ArTooltipTone>('ink');
  readonly delay = input(350, { transform: numberAttribute });
  /** Two-way. `[open]="true"` starts it shown (React `defaultOpen`). */
  readonly open = model(false);
  readonly id = input<string>();

  private readonly autoId = uid('ar-tip');
  protected readonly tipId = computed(() => this.id() || this.autoId);
  protected readonly pos = signal<TipPos | null>(null);
  protected readonly arrowX = computed(() => {
    const p = this.pos();
    return p && (p.p === 'top' || p.p === 'bottom') ? p.arrow : null;
  });
  protected readonly arrowY = computed(() => {
    const p = this.pos();
    return p && (p.p === 'left' || p.p === 'right') ? p.arrow : null;
  });
  private readonly tip = viewChild<ElementRef<HTMLElement>>('tip');
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));

    // aria-describedby on the projected trigger while visible (React cloneElement).
    effect(() => {
      const visible = this.open();
      const id = this.tipId();
      const trigger = this.host.nativeElement.firstElementChild;
      if (!trigger || trigger.getAttribute('role') === 'tooltip') return;
      if (visible) trigger.setAttribute('aria-describedby', id);
      else if (trigger.getAttribute('aria-describedby') === id) trigger.removeAttribute('aria-describedby');
    });

    // Escape hides.
    effect((onCleanup) => {
      if (!this.open() || !this.platform.isBrowser) return;
      const onKey = (ev: KeyboardEvent) => {
        if (ev.key === 'Escape') this.hide();
      };
      this.doc.addEventListener('keydown', onKey);
      onCleanup(() => this.doc.removeEventListener('keydown', onKey));
    });

    // Position while visible.
    effect((onCleanup) => {
      const win = this.platform.window;
      const tipEl = this.tip()?.nativeElement;
      const placement = this.placement();
      this.content();
      if (!this.open() || !win || !tipEl) {
        this.pos.set(null);
        return;
      }
      const place = () => this.pos.set(placeTip(this.host.nativeElement, tipEl, placement, win));
      place();
      const raf = win.requestAnimationFrame(place);
      win.addEventListener('scroll', place, true);
      win.addEventListener('resize', place);
      onCleanup(() => {
        win.cancelAnimationFrame(raf);
        win.removeEventListener('scroll', place, true);
        win.removeEventListener('resize', place);
      });
    });
  }

  /** Shows after `delay`, or at once (keyboard focus). */
  show(now = false): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.open.set(true), now ? 0 : this.delay());
  }

  hide(): void {
    clearTimeout(this.timer);
    this.open.set(false);
  }
}

/**
 * Plain-text tooltip on any element, without a wrapper. Same look and timing as `ar-tooltip`.
 *
 * ```html
 * <button arButton arTooltip="Prices include taxes and fees">Price breakdown</button>
 * <span arTooltip="Refund until 13 Oct" arTooltipPlacement="right" arTooltipTone="light">Refundable</span>
 * ```
 */
@Directive({
  selector: '[arTooltip]',
  host: {
    '(mouseenter)': 'show(false)',
    '(mouseleave)': 'hide()',
    '(focusin)': 'show(true)',
    '(focusout)': 'hide()',
  },
})
export class ArTooltipDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly platform = inject(ArPlatform);
  private readonly doc = inject(DOCUMENT);

  readonly arTooltip = input<string>('');
  readonly arTooltipPlacement = input<ArTooltipPlacement>('top');
  readonly arTooltipTone = input<ArTooltipTone>('ink');
  readonly arTooltipDelay = input(350, { transform: numberAttribute });

  private readonly id = uid('ar-tip');
  private timer: ReturnType<typeof setTimeout> | undefined;
  private tipEl: HTMLElement | null = null;
  private cleanup: Array<() => void> = [];

  constructor() {
    inject(DestroyRef).onDestroy(() => this.hide());
  }

  show(now = false): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.render(), now ? 0 : this.arTooltipDelay());
  }

  hide(): void {
    clearTimeout(this.timer);
    this.cleanup.forEach((fn) => fn());
    this.cleanup = [];
    if (this.tipEl) {
      this.tipEl.remove();
      this.tipEl = null;
      this.renderer.removeAttribute(this.host.nativeElement, 'aria-describedby');
    }
  }

  private render(): void {
    const win = this.platform.window;
    if (!win || this.tipEl || !this.arTooltip()) return;
    const r = this.renderer;
    const tip = r.createElement('span') as HTMLElement;
    r.setAttribute(tip, 'role', 'tooltip');
    r.setAttribute(tip, 'id', this.id);
    r.setAttribute(tip, 'class', `ar ar-tip ar-tip--${this.arTooltipTone()}`);
    r.setAttribute(tip, 'data-placement', this.arTooltipPlacement());
    r.setStyle(tip, 'visibility', 'hidden');
    const text = r.createElement('span');
    r.setAttribute(text, 'class', 'ar-tip__text');
    r.appendChild(text, r.createText(this.arTooltip()));
    const arrow = r.createElement('span') as HTMLElement;
    r.setAttribute(arrow, 'class', 'ar-tip__arrow');
    r.appendChild(tip, text);
    r.appendChild(tip, arrow);
    r.appendChild(this.doc.body, tip);
    this.tipEl = tip;
    r.setAttribute(this.host.nativeElement, 'aria-describedby', this.id);

    const place = () => {
      const pos = placeTip(this.host.nativeElement, tip, this.arTooltipPlacement(), win);
      tip.setAttribute('data-placement', pos.p);
      tip.style.top = `${pos.top}px`;
      tip.style.left = `${pos.left}px`;
      tip.style.visibility = 'visible';
      arrow.style.left = pos.p === 'top' || pos.p === 'bottom' ? `${pos.arrow}px` : '';
      arrow.style.top = pos.p === 'left' || pos.p === 'right' ? `${pos.arrow}px` : '';
    };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') this.hide();
    };
    place();
    win.addEventListener('scroll', place, true);
    win.addEventListener('resize', place);
    this.doc.addEventListener('keydown', onKey);
    this.cleanup.push(
      () => win.removeEventListener('scroll', place, true),
      () => win.removeEventListener('resize', place),
      () => this.doc.removeEventListener('keydown', onKey),
    );
  }
}

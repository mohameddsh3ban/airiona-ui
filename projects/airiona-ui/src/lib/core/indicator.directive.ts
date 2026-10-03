import { DestroyRef, Directive, ElementRef, Renderer2, afterEveryRender, inject, input } from '@angular/core';
import { ArPlatform } from './platform';

/**
 * The single sliding indicator used by segmented controls, nav pills, tab bars and range tabs.
 * Put it on the indicator element; it measures the active sibling inside its parent after every render.
 *
 * ```html
 * <span class="ar-seg__ind" arIndicator='[aria-selected="true"]'></span>
 * ```
 * Adds `has-ind` to the parent once measured, which hides the per-item active background.
 */
@Directive({ selector: '[arIndicator]', host: { 'aria-hidden': 'true' } })
export class ArIndicator {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly platform = inject(ArPlatform);
  private last = '';
  private observer: ResizeObserver | null = null;
  private observed: HTMLElement | null = null;

  /** CSS selector of the active item inside the parent. */
  readonly arIndicator = input.required<string>();
  readonly arIndicatorAxis = input<'x' | 'y'>('x');

  constructor() {
    afterEveryRender({ write: () => this.measure() });
    const win = this.platform.window;
    if (win) {
      const onResize = () => this.measure(true);
      win.addEventListener('resize', onResize);
      // Item sizes change after render (web fonts swapping in, container queries), so watch them directly.
      this.observer = typeof ResizeObserver === 'function' ? new ResizeObserver(() => this.measure(true)) : null;
      inject(DestroyRef).onDestroy(() => {
        win.removeEventListener('resize', onResize);
        this.observer?.disconnect();
      });
    }
  }

  private measure(force = false): void {
    const host = this.el.nativeElement;
    const parent = host.parentElement;
    if (!parent) return;
    const active = parent.querySelector(this.arIndicator()) as HTMLElement | null;
    if (!active) {
      if (this.last !== 'none') {
        this.renderer.setStyle(host, 'opacity', '0');
        this.renderer.removeClass(parent, 'has-ind');
        this.last = 'none';
      }
      return;
    }
    this.watch(parent, active);
    const y = this.arIndicatorAxis() === 'y';
    const key = [active.offsetLeft, active.offsetTop, active.offsetWidth, active.offsetHeight, y].join(',');
    if (key === this.last && !force) return;
    this.last = key;
    const s = host.style;
    s.opacity = '';
    s.transform = y ? `translateY(${active.offsetTop}px)` : `translateX(${active.offsetLeft}px)`;
    s.width = `${active.offsetWidth}px`;
    s.height = `${active.offsetHeight}px`;
    if (y) s.left = `${active.offsetLeft}px`;
    else s.top = `${active.offsetTop}px`;
    this.renderer.addClass(parent, 'has-ind');
  }

  private watch(parent: HTMLElement, active: HTMLElement): void {
    if (!this.observer || this.observed === active) return;
    if (this.observed) this.observer.unobserve(this.observed);
    else this.observer.observe(parent);
    this.observer.observe(active);
    this.observed = active;
  }
}

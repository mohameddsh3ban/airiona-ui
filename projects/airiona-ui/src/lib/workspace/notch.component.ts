import { ChangeDetectionStrategy, Component, ElementRef, afterRenderEffect, computed, inject, input, signal, viewChild } from '@angular/core';
import { ArPlatform } from '../core/platform';
import { cx } from '../core/utils';

export type ArNotchCorner = 'tr' | 'tl';

/**
 * SVG path of a card (w×hh, corner radius R) with an inverted-corner bite of nw×nh cut from the top-right
 * (or top-left when `mirror`). `r` rounds the outer lips of the bite, `ri` its inner corner.
 */
export function notchPath(w: number, hh: number, nw: number, nh: number, R: number, r: number, ri: number, mirror: boolean): string {
  const X = (x: number) => Math.round((mirror ? w - x : x) * 100) / 100;
  const sw = (f: number) => (mirror ? 1 - f : f);
  return [
    'M', X(R), 0, 'H', X(w - nw - r), 'A', r, r, 0, 0, sw(1), X(w - nw), r, 'V', nh - ri,
    'A', ri, ri, 0, 0, sw(0), X(w - nw + ri), nh, 'H', X(w - r), 'A', r, r, 0, 0, sw(1), X(w), nh + r,
    'V', hh - R, 'A', R, R, 0, 0, sw(1), X(w - R), hh, 'H', X(R), 'A', R, R, 0, 0, sw(1), X(0), hh - R,
    'V', R, 'A', R, R, 0, 0, sw(1), X(R), 0, 'Z',
  ].join(' ');
}

interface ArNotchShape {
  d: string;
  bg: { backgroundColor: string; backgroundImage: string };
}

/**
 * The inverted-corner cut that holds buttons in a card's top corner. Place it as a direct child of an `ar-w`
 * card (or an element with `.ar-notch-host`): it measures the card, adds `has-notch` to it, and redraws the
 * card's background and shadow as one clipped shape with the bite cut out. Browser-only; on the server the
 * buttons render without the cut.
 *
 * ```html
 * <div class="ar-w ar-w--brand">
 *   <ar-notch corner="tr"><button arIconButton icon="bell" variant="white" label="Notifications"></button></ar-notch>
 * </div>
 * ```
 */
@Component({
  selector: 'ar-notch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    @if (shape()) {
      <span class="ar-notch__shape" aria-hidden="true"><span class="ar-notch__fill" [style]="fillStyle()"></span></span>
    }
    <div #notch [class]="notchClass()"><ng-content /></div>
  `,
})
export class ArNotch {
  private readonly platform = inject(ArPlatform);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly notchRef = viewChild.required<ElementRef<HTMLElement>>('notch');

  /** Which top corner the bite is cut from. */
  readonly corner = input<ArNotchCorner>('tr');

  protected readonly shape = signal<ArNotchShape | null>(null);
  protected readonly notchClass = computed(() => cx('ar-notch', `ar-notch--${this.corner()}`, !!this.shape() && 'is-cut'));
  protected readonly fillStyle = computed(() => {
    const sh = this.shape();
    if (!sh) return {};
    const clip = `path('${sh.d}')`;
    return {
      'clip-path': clip,
      '-webkit-clip-path': clip,
      'background-color': sh.bg.backgroundColor,
      'background-image': sh.bg.backgroundImage,
    };
  });

  constructor() {
    // Runs after render in the browser only; re-runs (with cleanup) when `corner` changes.
    afterRenderEffect((onCleanup) => {
      const corner = this.corner();
      const win = this.platform.window;
      const el = this.notchRef().nativeElement;
      const card = this.host.nativeElement.parentElement;
      if (!win || !card) return;
      // Read the card's paint before `has-notch` makes it transparent.
      const cs = win.getComputedStyle(card);
      const bg = { backgroundColor: cs.backgroundColor, backgroundImage: cs.backgroundImage };
      const R = parseFloat(cs.borderTopLeftRadius) || 32;
      card.classList.add('has-notch');
      const measure = () => {
        const w = card.offsetWidth;
        const hh = card.offsetHeight;
        const nw = el.offsetWidth;
        const nh = el.offsetHeight;
        if (!w || !nw || !nh) return;
        const d = notchPath(w, hh, nw, nh, R, 16, Math.min(26, nh / 2), corner === 'tl');
        this.shape.update((prev) => (prev && prev.d === d ? prev : { d, bg }));
      };
      measure();
      const ro = typeof win.ResizeObserver !== 'undefined' ? new win.ResizeObserver(measure) : null;
      if (ro) {
        ro.observe(card);
        ro.observe(el);
      } else {
        win.addEventListener('resize', measure);
      }
      onCleanup(() => {
        if (ro) ro.disconnect();
        else win.removeEventListener('resize', measure);
        card.classList.remove('has-notch');
      });
    });
  }
}

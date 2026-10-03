import { ChangeDetectionStrategy, Component, DestroyRef, booleanAttribute, computed, effect, inject, input, numberAttribute, signal } from '@angular/core';
import { ArPlatform } from './platform';
import { fmtNumber } from './utils';

/**
 * Counts the number inside a string up from zero, keeping prefix, suffix, decimals and commas.
 * Screen readers get the final value only.
 *
 * ```html
 * <ar-count-up value="$84,210" />
 * ```
 */
@Component({
  selector: 'ar-count-up',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ar-count' },
  template: `<span class="ar-sr">{{ text() }}</span><span aria-hidden="true">{{ shown() }}</span>`,
})
export class ArCountUp {
  private readonly platform = inject(ArPlatform);
  readonly value = input<string | number | null | undefined>('');
  /** Milliseconds, default 900 (duration-emphasis). */
  readonly duration = input(900, { transform: numberAttribute });
  readonly animate = input(true, { transform: booleanAttribute });

  protected readonly text = computed(() => (this.value() ?? '') + '');
  private readonly frame = signal<string | null>(null);
  protected readonly shown = computed(() => {
    const s = this.text();
    const f = this.frame();
    const m = /(\d[\d,]*)(\.\d+)?/.exec(s);
    return f === null || !m ? s : s.slice(0, m.index) + f + s.slice(m.index + m[0].length);
  });

  constructor() {
    let raf = 0;
    const win = this.platform.window;
    effect((onCleanup) => {
      const s = this.text();
      const m = /(\d[\d,]*)(\.\d+)?/.exec(s);
      if (!win || !m || !this.animate() || this.platform.reduceMotion()) {
        this.frame.set(null);
        return;
      }
      const target = parseFloat((m[1] + (m[2] || '')).replace(/,/g, ''));
      const dec = m[2] ? m[2].length - 1 : 0;
      const commas = m[1].indexOf(',') >= 0 || target >= 10000;
      const dur = this.duration();
      let t0: number | null = null;
      const tick = (now: number) => {
        if (t0 === null) t0 = now;
        const p = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        this.frame.set(p < 1 ? fmtNumber(target * e, dec, commas) : null);
        if (p < 1) raf = win.requestAnimationFrame(tick);
      };
      this.frame.set(fmtNumber(0, dec, commas));
      raf = win.requestAnimationFrame(tick);
      onCleanup(() => win.cancelAnimationFrame(raf));
    });
    inject(DestroyRef).onDestroy(() => win?.cancelAnimationFrame(raf));
  }
}

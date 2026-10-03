import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, Signal, effect, inject, signal } from '@angular/core';
import { AIRIONA_CONFIG } from './config';

/** Browser-only helpers. Everything here is a no-op during server rendering. */
@Injectable({ providedIn: 'root' })
export class ArPlatform {
  private readonly config = inject(AIRIONA_CONFIG);
  private readonly doc = inject(DOCUMENT);
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  get window(): (Window & typeof globalThis) | null {
    return this.isBrowser ? (this.doc.defaultView as Window & typeof globalThis) : null;
  }

  /** True when motion should be skipped (config 'reduce' or the OS setting). */
  reduceMotion(): boolean {
    if (this.config.motion === 'reduce') return true;
    try {
      return !!this.window?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  }

  /** A light tick on toggles and selections. Only fires inside a real user gesture, where browsers allow it. */
  haptic(ms = 8): void {
    const nav = this.window?.navigator as (Navigator & { userActivation?: { isActive: boolean } }) | undefined;
    if (!this.config.haptics || !nav?.vibrate) return;
    if (nav.userActivation && !nav.userActivation.isActive) return;
    try {
      nav.vibrate(ms);
    } catch {
      /* not supported */
    }
  }
}

/**
 * Keeps a closing element mounted long enough to play its exit animation.
 * Use in a field initialiser: `protected readonly presence = arPresence(this.open, 200);`
 * Then render while `presence.mounted()` and add `is-leaving` while `presence.leaving()`.
 */
export function arPresence(open: Signal<boolean>, ms: number): { mounted: Signal<boolean>; leaving: Signal<boolean> } {
  const platform = inject(ArPlatform);
  const mounted = signal(open());
  const leaving = signal(false);
  let timer: ReturnType<typeof setTimeout> | undefined;
  effect(() => {
    const isOpen = open();
    clearTimeout(timer);
    if (isOpen) {
      mounted.set(true);
      leaving.set(false);
      return;
    }
    if (!mounted()) return;
    leaving.set(true);
    timer = setTimeout(
      () => {
        mounted.set(false);
        leaving.set(false);
      },
      platform.reduceMotion() ? 0 : ms,
    );
  });
  inject(DestroyRef).onDestroy(() => clearTimeout(timer));
  return { mounted: mounted.asReadonly(), leaving: leaving.asReadonly() };
}

/**
 * Closes a popover on an outside pointer-down or Escape. `inside` returns the elements that count as inside.
 * Call in a field initialiser; it attaches listeners only while `open()` is true.
 */
export function arDismiss(open: Signal<boolean>, inside: () => Array<Element | null | undefined>, close: () => void): void {
  const platform = inject(ArPlatform);
  const doc = inject(DOCUMENT);
  effect((onCleanup) => {
    if (!open() || !platform.isBrowser) return;
    const onDown = (ev: Event) => {
      const t = ev.target as Node;
      if (inside().some((el) => el && el.contains(t))) return;
      close();
    };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        ev.stopPropagation();
        close();
      }
    };
    doc.addEventListener('mousedown', onDown);
    doc.addEventListener('keydown', onKey);
    onCleanup(() => {
      doc.removeEventListener('mousedown', onDown);
      doc.removeEventListener('keydown', onKey);
    });
  });
}

/**
 * Fixed-position style for a popover anchored to `anchor`, flipping above near the bottom edge and staying on screen.
 * Recomputes on scroll and resize while open. Returns `{ visibility: 'hidden' }` until placed.
 */
export function arPopPosition(
  open: Signal<boolean>,
  anchor: () => HTMLElement | null | undefined,
  pop: () => HTMLElement | null | undefined,
  align: () => 'start' | 'end' = () => 'start',
  minWidth = 0,
): Signal<Record<string, string>> {
  const platform = inject(ArPlatform);
  const style = signal<Record<string, string>>({ visibility: 'hidden' });
  effect((onCleanup) => {
    const win = platform.window;
    if (!open() || !win) {
      style.set({ visibility: 'hidden' });
      return;
    }
    const place = () => {
      const a = anchor();
      if (!a) return;
      const r = a.getBoundingClientRect();
      const vw = win.innerWidth;
      const vh = win.innerHeight;
      const mw = Math.max(r.width, minWidth);
      const s: Record<string, string> = { position: 'fixed', 'min-width': `${mw}px` };
      if (vh - r.bottom < 300 && r.top > vh - r.bottom) s['bottom'] = `${vh - r.top + 8}px`;
      else s['top'] = `${r.bottom + 8}px`;
      const pw = Math.max(mw, pop()?.offsetWidth ?? 0, 220);
      if (align() === 'end' && r.right - pw >= 8) s['right'] = `${Math.max(8, vw - r.right)}px`;
      else s['left'] = `${Math.max(8, Math.min(r.left, vw - pw - 8))}px`;
      style.set(s);
    };
    place();
    const raf = win.requestAnimationFrame(place);
    win.addEventListener('resize', place);
    win.addEventListener('scroll', place, true);
    onCleanup(() => {
      win.cancelAnimationFrame(raf);
      win.removeEventListener('resize', place);
      win.removeEventListener('scroll', place, true);
    });
  });
  return style.asReadonly();
}

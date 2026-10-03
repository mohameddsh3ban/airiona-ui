import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  EnvironmentProviders,
  InjectionToken,
  PLATFORM_ID,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import type { ArIconSet } from './icon.registry';

export interface AirionaConfig {
  /** Prefix for relative image paths given to `image` inputs (e.g. '/assets/airiona/'). Absolute URLs pass through. */
  assetsUrl: string;
  /** 8ms vibration on mobile toggles, tab changes and selections, where the device allows it. */
  haptics: boolean;
  /** 'system' follows the OS reduced-motion setting; 'reduce' turns motion off everywhere. */
  motion: 'system' | 'reduce';
  /** Soft light that follows the mouse across cards. */
  spotlight: boolean;
  /** Extra icon sets, e.g. `AR_ALL_ICONS` from `@airiona/ui/icons`, or your own `{ outline, solid }` paths. */
  icons: ArIconSet[];
  /**
   * Token overrides applied as CSS variables on <html> at startup, e.g. `{ 'blue-500': '#1f6bff', 'radius-xl': '28px' }`.
   * Names are token names without `--` (see AR_TOKENS). For server rendering, prefer overriding the same variables in CSS.
   */
  theme: Record<string, string>;
}

export const AR_DEFAULT_CONFIG: AirionaConfig = {
  assetsUrl: '',
  haptics: true,
  motion: 'system',
  spotlight: true,
  icons: [],
  theme: {},
};

export const AIRIONA_CONFIG = new InjectionToken<AirionaConfig>('AIRIONA_CONFIG', {
  providedIn: 'root',
  factory: () => AR_DEFAULT_CONFIG,
});

/** Cards that carry the cursor spotlight (CSS reads --mx / --my). */
const SPOT =
  '.ar-w, .ar-stat, .ar-stay, .ar-dest, .ar-ticket, .ar-table, .ar-cal, .ar-search, .ar-toast, .m-ticket, .m-feature, .m-agenda, .m-ministat, .m-minidest';

function initAiriona(): void {
  const config = inject(AIRIONA_CONFIG);
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
  const doc = inject(DOCUMENT);
  doc.documentElement.classList.toggle('ar-motion-reduce', config.motion === 'reduce');
  for (const [name, value] of Object.entries(config.theme)) doc.documentElement.style.setProperty(`--${name.replace(/^--/, '')}`, value);
  const win = doc.defaultView as (Window & { __arSpot?: boolean }) | null;
  if (config.spotlight && win && !win.__arSpot) {
    win.__arSpot = true;
    doc.addEventListener(
      'pointermove',
      (e: PointerEvent) => {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        const el = (e.target as Element | null)?.closest?.(SPOT) as HTMLElement | null;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      },
      { passive: true },
    );
  }
}

/**
 * Sets up Airiona once, in `app.config.ts`:
 *
 * ```ts
 * providers: [provideAiriona({ icons: [AR_ALL_ICONS], assetsUrl: '/assets/airiona/' })]
 * ```
 */
export function provideAiriona(config: Partial<AirionaConfig> = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: AIRIONA_CONFIG, useValue: { ...AR_DEFAULT_CONFIG, ...config } },
    provideEnvironmentInitializer(initAiriona),
  ]);
}

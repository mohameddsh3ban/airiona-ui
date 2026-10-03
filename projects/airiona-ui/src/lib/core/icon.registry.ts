import { Injectable, inject } from '@angular/core';
import { AIRIONA_CONFIG } from './config';
import { AR_CORE_ICONS, AR_ICON_ALIASES } from './icons.core';

/** Heroicons-format path data: 24×24 viewBox. Outline paths prefixed "~" skip round caps; solid paths prefixed "!" use evenodd. */
export interface ArIconSet {
  outline?: Record<string, string[]>;
  solid?: Record<string, string[]>;
}

export interface ArResolvedIcon {
  paths: string[];
  solid: boolean;
}

/** Holds every icon the app can draw. Core icons are always present; add more with provideAiriona({ icons }) or register(). */
@Injectable({ providedIn: 'root' })
export class ArIconRegistry {
  private readonly outline = new Map<string, string[]>();
  private readonly solid = new Map<string, string[]>();

  constructor() {
    this.register(AR_CORE_ICONS);
    for (const set of inject(AIRIONA_CONFIG).icons) this.register(set);
  }

  register(set: ArIconSet): void {
    for (const [k, v] of Object.entries(set.outline ?? {})) this.outline.set(k, v);
    for (const [k, v] of Object.entries(set.solid ?? {})) this.solid.set(k, v);
  }

  resolve(name: string, variant: 'outline' | 'solid' = 'outline'): ArResolvedIcon {
    const key = AR_ICON_ALIASES[name] ?? name;
    if (variant === 'solid') {
      const s = this.solid.get(key);
      if (s) return { paths: s, solid: true };
    }
    const o = this.outline.get(key) ?? this.outline.get('question-mark-circle');
    return { paths: o ?? [], solid: false };
  }

  has(name: string): boolean {
    const key = AR_ICON_ALIASES[name] ?? name;
    return this.outline.has(key) || this.solid.has(key);
  }

  names(variant: 'outline' | 'solid' = 'outline'): string[] {
    return [...(variant === 'solid' ? this.solid : this.outline).keys()].sort();
  }
}

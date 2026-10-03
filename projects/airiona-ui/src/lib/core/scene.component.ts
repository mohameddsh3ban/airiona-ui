import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { AIRIONA_CONFIG } from './config';
import { uid } from './utils';

export type ArSceneVariant = 'sky' | 'alpine' | 'coast' | 'dusk' | 'forest';

const SCENE_SKY: Record<ArSceneVariant, [string, string]> = {
  sky: ['#8fb9e6', '#d9e8f6'],
  alpine: ['#2f5662', '#8db0b2'],
  coast: ['#a9cdee', '#f3e1cc'],
  dusk: ['#2a1c3e', '#f08a5d'],
  forest: ['#3a4a40', '#8e9a8a'],
};
/** A dark tint sampled from each scene, for StayCard's fade. */
export const AR_SCENE_TINT: Record<ArSceneVariant, string> = {
  sky: '#3d6d9e',
  alpine: '#17323a',
  coast: '#123a5c',
  dusk: '#33192b',
  forest: '#1d2a1f',
};

/** Drawn photography stand-in, shown while real photos load or when none exists. */
@Component({
  selector: 'ar-scene',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <svg class="ar-scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" [attr.aria-label]="label() || 'Photo placeholder'">
      <defs>
        <linearGradient [attr.id]="id + 'g'" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" [attr.stop-color]="sky()[0]" /><stop offset="1" [attr.stop-color]="sky()[1]" />
        </linearGradient>
        <filter [attr.id]="id + 'b'" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10" /></filter>
      </defs>
      <rect width="400" height="300" [attr.fill]="'url(#' + id + 'g)'" />
      @switch (variant()) {
        @case ('alpine') {
          <path d="M0 190 L70 150 L120 168 L190 96 L250 150 L300 128 L400 180 L400 300 L0 300Z" fill="#284650" />
          <path d="M190 96 L170 120 L182 118 L190 128 L200 116 L214 122Z" fill="#e8f0f0" />
          <path d="M0 230 L90 196 L160 214 L240 186 L330 210 L400 196 L400 300 L0 300Z" fill="#1b343c" />
          <rect x="0" y="238" width="400" height="62" fill="#132a31" />
          <circle cx="320" cy="40" r="1.6" fill="#ffffff" opacity="0.8" />
        }
        @case ('coast') {
          <circle cx="290" cy="150" r="26" fill="#fff3dd" />
          <rect x="0" y="170" width="400" height="130" fill="#2e74ad" />
          <rect x="0" y="214" width="400" height="86" fill="#1d5a8c" />
          <rect x="250" y="176" width="80" height="3" rx="1.5" fill="#ffffff" opacity="0.6" />
          <rect x="268" y="188" width="46" height="2" rx="1" fill="#ffffff" opacity="0.45" />
          <path d="M0 120 L40 112 L86 140 L120 150 L150 176 L170 300 L0 300Z" fill="#3a3f3c" />
        }
        @case ('dusk') {
          <path d="M0 300 L0 200 L30 200 L30 170 L58 170 L58 210 L90 210 L90 150 L112 150 L112 196 L150 196 L150 178 L196 178 L196 220 L240 220 L240 160 L262 140 L284 160 L284 206 L330 206 L330 184 L370 184 L370 214 L400 214 L400 300Z" fill="#1e1424" />
          <path d="M0 250 L400 236 L400 300 L0 300Z" fill="#2b1a28" />
          <path d="M150 262 L400 250 L400 272 L170 284Z" fill="#4fb3d9" />
          <rect x="96" y="160" width="4" height="4" fill="#ffcf8a" />
          <rect x="252" y="168" width="4" height="4" fill="#ffcf8a" />
          <rect x="340" y="192" width="4" height="4" fill="#ffcf8a" />
        }
        @case ('forest') {
          @for (t of trees; track $index) {
            <path [attr.d]="t.d" [attr.fill]="t.fill" />
          }
          <path d="M150 236 L200 186 L250 236 L250 270 L150 270Z" fill="#16191a" />
          <path d="M166 236 L200 202 L234 236 L234 262 L166 262Z" fill="#f2b862" />
          <rect x="0" y="268" width="400" height="32" fill="#18241b" />
        }
        @default {
          <ellipse cx="70" cy="250" rx="140" ry="52" fill="#ffffff" opacity="0.95" [attr.filter]="blur()" />
          <ellipse cx="250" cy="262" rx="170" ry="58" fill="#ffffff" [attr.filter]="blur()" />
          <ellipse cx="380" cy="240" rx="120" ry="46" fill="#f3f7fc" [attr.filter]="blur()" />
          <ellipse cx="180" cy="300" rx="260" ry="50" fill="#ffffff" />
          <path d="M400 18 L300 120 L40 210 L46 222 L310 150 L356 162 L320 132 L400 70Z" fill="#e9eff6" opacity="0.95" />
          <path d="M400 70 L320 132 L356 162 L400 150Z" fill="#b9c9da" />
          <circle cx="110" cy="60" r="40" fill="#ffffff" opacity="0.55" [attr.filter]="blur()" />
        }
      }
    </svg>
  `,
})
export class ArScene {
  readonly variant = input<ArSceneVariant>('sky');
  readonly label = input<string>();
  protected readonly id = uid('ar-sc');
  protected readonly sky = computed(() => SCENE_SKY[this.variant()] ?? SCENE_SKY.sky);
  protected readonly blur = computed(() => `url(#${this.id}b)`);
  protected readonly trees = Array.from({ length: 12 }, (_, i) => {
    const x = i * 36 - 8;
    const top = 70 + ((i * 37) % 60);
    return { d: `M${x} 300 L${x + 18} ${top} L${x + 36} 300Z`, fill: i % 2 ? '#22342a' : '#2b4134' };
  });
}

/** Resolves an image path against `assetsUrl` from provideAiriona(). */
export function arAssetUrl(): (src: string | null | undefined) => string | null {
  const base = inject(AIRIONA_CONFIG).assetsUrl;
  return (src) => {
    if (!src) return null;
    if (!base || /^(?:[a-z]+:|\/\/|\/|data:|blob:)/i.test(src)) return src;
    return base.replace(/\/?$/, '/') + src;
  };
}

/** A photo when one is given, otherwise the matching drawn Scene. */
@Component({
  selector: 'ar-media',
  imports: [ArScene],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    @if (src()) {
      <img [src]="src()" [alt]="alt() || ''" loading="lazy" />
    } @else {
      <ar-scene [variant]="scene()" [label]="alt()" />
    }
  `,
})
export class ArMedia {
  private readonly asset = arAssetUrl();
  readonly image = input<string | null>();
  readonly scene = input<ArSceneVariant>('sky');
  readonly alt = input<string>();
  protected readonly src = computed(() => this.asset(this.image()));
}

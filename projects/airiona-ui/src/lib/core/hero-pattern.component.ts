import { ChangeDetectionStrategy, Component, input } from '@angular/core';

const MAP_DOTS: Array<{ cx: number; cy: number }> = (() => {
  const dots: Array<{ cx: number; cy: number }> = [];
  for (let y = 0; y < 22; y++)
    for (let x = 0; x < 48; x++) {
      const nx = x / 48;
      const ny = y / 22;
      const land =
        (nx > 0.08 && nx < 0.3 && ny > 0.15 && ny < 0.7 && !(nx > 0.2 && ny > 0.5)) ||
        (nx > 0.22 && nx < 0.33 && ny > 0.55 && ny < 0.95) ||
        (nx > 0.42 && nx < 0.56 && ny > 0.1 && ny < 0.45) ||
        (nx > 0.45 && nx < 0.58 && ny > 0.45 && ny < 0.85) ||
        (nx > 0.56 && nx < 0.9 && ny > 0.1 && ny < 0.6) ||
        (nx > 0.78 && nx < 0.92 && ny > 0.68 && ny < 0.88);
      if (land && (x * 7 + y * 13) % 5 !== 0) dots.push({ cx: x * 8 + 4, cy: y * 8 + 4 });
    }
  return dots;
})();
const WAVES = Array.from(
  { length: 22 },
  (_, i) => `M-20 ${40 + i * 5} C 90 ${10 + i * 7}, 170 ${150 - i * 3}, 260 ${60 + i * 4} S 400 ${20 + i * 6}, 420 ${90 + i * 2}`,
);

/** Dotted world map or flowing waves, for dark mobile headers and feature cards. */
@Component({
  selector: 'ar-hero-pattern',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    @if (pattern() === 'map') {
      <svg class="m-hero__pattern is-map" viewBox="0 0 384 176" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        @for (d of dots; track $index) {
          <circle [attr.cx]="d.cx" [attr.cy]="d.cy" r="1.7" />
        }
      </svg>
    } @else {
      <svg class="m-hero__pattern is-waves" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">
        @for (d of waves; track $index) {
          <path [attr.d]="d" fill="none" />
        }
      </svg>
    }
  `,
})
export class ArHeroPattern {
  readonly pattern = input<'map' | 'waves'>('waves');
  protected readonly dots = MAP_DOTS;
  protected readonly waves = WAVES;
}

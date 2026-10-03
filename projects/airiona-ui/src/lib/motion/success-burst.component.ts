import { ChangeDetectionStrategy, Component, input } from '@angular/core';

const PARTS = Array.from({ length: 14 }, (_, i) => ({
  a: `${i * (360 / 14)}deg`,
  d: `${i % 2 ? 58 : 76}px`,
  s: i % 3 === 0 ? 1 : 0.6,
}));

/**
 * The big stop: disc pops, the tick draws, a ring and 14 particles burst, then title and text rise.
 * Once per flow (booking confirmed, payment done). Change `replayKey` to play it again.
 *
 * ```html
 * <ar-success-burst title="Booking confirmed">EK 312 · Dubai to Tokyo · Thu, 15 Oct.</ar-success-burst>
 * ```
 */
@Component({
  selector: 'ar-success-burst',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.title]': 'null', style: 'display: contents' },
  template: `
    @for (k of [replayKey()]; track k) {
      <div class="ar-burst" [class.ar-burst--sm]="size() === 'sm'" role="status">
        <div class="ar-burst__mark">
          <span class="ar-burst__ring" aria-hidden="true"></span>
          <span class="ar-burst__parts" aria-hidden="true">
            @for (p of parts; track $index) {
              <i [style.--a]="p.a" [style.--d]="p.d" [style.--s]="p.s"></i>
            }
          </span>
          <svg viewBox="0 0 52 52" class="ar-burst__svg" aria-hidden="true">
            <circle cx="26" cy="26" r="24" class="ar-burst__circle" pathLength="1" />
            <path d="M15 27 l7.5 7.5 L37.5 19" class="ar-burst__check" pathLength="1" />
          </svg>
        </div>
        @if (title()) {
          <b class="ar-burst__title">{{ title() }}</b>
        }
        <p class="ar-burst__text"><ng-content /></p>
      </div>
    }
  `,
})
export class ArSuccessBurst {
  readonly title = input<string>();
  readonly size = input<'md' | 'sm'>('md');
  /** Change to replay the celebration. */
  readonly replayKey = input<string | number>(0);
  protected readonly parts = PARTS;
}

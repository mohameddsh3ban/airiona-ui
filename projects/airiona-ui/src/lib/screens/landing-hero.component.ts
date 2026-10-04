import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, booleanAttribute, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { ArPlatform } from '../core/platform';
import { arAssetUrl } from '../core/scene.component';

export interface ArLandingStat {
  value: string;
  label: string;
}

/**
 * The opening hero of a landing or home page: full-bleed photo, a looping video once the page has settled (wide
 * screens, motion allowed, paused while off screen), scrim, eyebrow pill, display headline, lede, actions and a row
 * of proof figures. With `docked`, the default slot straddles the bottom edge (a search card). Phones get the photo
 * only, cropped at `focus`.
 *
 * ```html
 * <ar-landing-hero image="assets/photos/aviation/hero-sky.webp" video="assets/video/hero-sky.mp4" focus="78% 50%"
 *   eyebrow="Private aviation" title="Fly on your own schedule." [stats]="stats" docked>
 *   <a arActions arButton variant="primary" href="/book">Book a flight</a>
 *   <ar-booking-search … />
 * </ar-landing-hero>
 * ```
 */
@Component({
  selector: 'ar-landing-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', '[style.--ar-landing-focus]': 'focus()', '[attr.title]': 'null' },
  template: `
    <div class="ar-landing__frame">
      <div class="ar-landing__media" aria-hidden="true">
        @if (image()) {
          <img class="ar-landing__poster" [src]="imageSrc()" alt="" />
        }
        @if (isWide() && videoSrc()) {
          <video #video class="ar-landing__video" [class.is-ready]="ready()" [muted]="true" loop playsinline preload="none" tabindex="-1" disablepictureinpicture (playing)="ready.set(true)"></video>
        }
      </div>
      <span class="ar-landing__scrim" aria-hidden="true"></span>
      <span class="ar-landing__grain" aria-hidden="true"></span>
      <div class="ar-landing__content">
        @if (eyebrow()) {
          <p class="ar-landing__eyebrow">{{ eyebrow() }}</p>
        }
        @switch (headingLevel()) {
          @case (2) { <h2 class="ar-landing__title">{{ title() }}</h2> }
          @case (3) { <h3 class="ar-landing__title">{{ title() }}</h3> }
          @default { <h1 class="ar-landing__title">{{ title() }}</h1> }
        }
        @if (lede()) {
          <p class="ar-landing__lede">{{ lede() }}</p>
        }
        <div class="ar-landing__actions"><ng-content select="[arActions]" /></div>
        @if (stats().length) {
          <dl class="ar-landing__stats">
            @for (s of stats(); track $index) {
              <div class="ar-landing__stat"><dt>{{ s.label }}</dt><dd>{{ s.value }}</dd></div>
            }
          </dl>
        }
      </div>
    </div>
    @if (docked()) {
      <div class="ar-landing__dock"><ng-content /></div>
    }
  `,
})
export class ArLandingHero {
  private readonly platform = inject(ArPlatform);
  private readonly asset = arAssetUrl();

  readonly title = input.required<string>();
  readonly eyebrow = input<string>();
  readonly lede = input<string>();
  /** Backdrop photo; also the poster the video fades in over. */
  readonly image = input<string | null>(null);
  /** Looping muted video; plays on wide screens (>=1024px) once the page has settled. */
  readonly video = input<string | null>(null);
  /** object-position for the photo, so the subject stays in a narrow phone crop (for example "78% 50%"). */
  readonly focus = input<string | null>(null);
  readonly stats = input<ArLandingStat[]>([]);
  /** Heading level of the title: 1 (default) for the page's own hero, 2 or 3 inside a page that has its h1. */
  readonly headingLevel = input<1 | 2 | 3>(1);
  /** The default slot straddles the bottom edge. */
  readonly docked = input(false, { transform: booleanAttribute });

  protected readonly isWide = signal(false);
  protected readonly ready = signal(false);
  protected readonly imageSrc = computed(() => this.asset(this.image()));
  protected readonly videoSrc = computed(() => this.asset(this.video()));
  protected readonly hostClass = computed(() => (this.docked() ? 'ar ar-landing ar-landing--docked' : 'ar ar-landing'));
  private readonly videoEl = viewChild<ElementRef<HTMLVideoElement>>('video');

  constructor() {
    const win = this.platform.window;
    if (win?.matchMedia) {
      const q = win.matchMedia('(min-width: 1024px)');
      const on = () => this.isWide.set(q.matches);
      on();
      q.addEventListener('change', on);
      inject(DestroyRef).onDestroy(() => q.removeEventListener('change', on));
    }
    // The video never competes with the first paint: it starts after load and pauses while scrolled away.
    effect((onCleanup) => {
      const v = this.videoEl()?.nativeElement;
      const src = this.videoSrc();
      if (!v || !src || !win || this.platform.reduceMotion()) return;
      let timer = 0;
      let io: IntersectionObserver | null = null;
      const play = () => { v.play()?.catch(() => undefined); };
      const start = () => {
        v.src = src;
        play();
        if (typeof IntersectionObserver !== 'undefined') {
          io = new IntersectionObserver((es) => (es[0]?.isIntersecting ? play() : v.pause()));
          io.observe(v);
        }
      };
      const later = () => { timer = win.setTimeout(start, 1200); };
      if (win.document.readyState === 'complete') later(); else win.addEventListener('load', later, { once: true });
      onCleanup(() => { win.clearTimeout(timer); win.removeEventListener('load', later); io?.disconnect(); });
    });
  }
}

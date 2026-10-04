import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, booleanAttribute, computed, effect, inject, input, numberAttribute, signal, viewChild } from '@angular/core';
import { ArWordmark } from '../core/primitives';
import { ArPlatform } from '../core/platform';
import { arAssetUrl } from '../core/scene.component';

export interface ArAuthHighlight {
  title: string;
  text: string;
}

/**
 * Split-screen sign-in and sign-up. The form column on one side, a cinematic media panel on the other: poster
 * frame, a looping video once the page has settled (wide screens, motion allowed), scrim, grain, headline and
 * highlight cards that rotate when each progress tick finishes (paused while the pointer is on the panel or
 * focus is in the form). Below 1024px the panel becomes a slim image strip above the form. `side="right"` puts
 * the form on the right for sign-up, so moving between the two screens flips the card.
 *
 * ```html
 * <ar-auth-shell poster="assets/photos/aviation/auth-wing.webp" video="assets/video/auth-wing.mp4"
 *   headline="Your aircraft, your schedule." [highlights]="highlights">
 *   <button arActions arButton variant="ghost" size="sm">Help</button>
 *   <form>…</form>
 * </ar-auth-shell>
 * ```
 */
@Component({
  selector: 'ar-auth-shell',
  imports: [ArWordmark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', '[attr.title]': 'null' },
  template: `
    <main class="ar-auth__col" (focusin)="focus.set(true)" (focusout)="focus.set(false)">
      <header class="ar-auth__top">
        <ng-content select="[arBrand]"><ar-wordmark /></ng-content>
        <div class="ar-auth__actions"><ng-content select="[arActions]" /></div>
      </header>
      <div class="ar-auth__strip" aria-hidden="true">
        @if (!isWide()) {
          <img [src]="stripSrc()" alt="" />
        }
        @if (headline()) {
          <p class="ar-auth__strip-title">{{ headline() }}</p>
        }
      </div>
      <div class="ar-auth__body">
        <div class="ar-auth__form"><ng-content /></div>
      </div>
      <footer class="ar-auth__foot"><ng-content select="[arFoot]" /><span>{{ legal() }}</span></footer>
    </main>
    <aside class="ar-auth__media" [attr.aria-label]="mediaLabel()" (pointerenter)="hover.set(true)" (pointerleave)="hover.set(false)" (pointermove)="parallax($event)">
      <div class="ar-auth__frame">
        <div class="ar-auth__layer">
          @if (isWide()) {
            <img class="ar-auth__poster" [src]="posterSrc()" alt="" aria-hidden="true" />
            @if (videoSrc()) {
              <video #video class="ar-auth__video" [class.is-ready]="ready()" [muted]="true" loop playsinline preload="none" aria-hidden="true" tabindex="-1" disablepictureinpicture (playing)="ready.set(true)"></video>
            }
          }
        </div>
        <span class="ar-auth__scrim" aria-hidden="true"></span>
        <span class="ar-auth__vignette" aria-hidden="true"></span>
        <span class="ar-auth__grain" aria-hidden="true"></span>
        <div class="ar-auth__copy">
          @if (headline()) {
            <p class="ar-auth__headline">{{ headline() }}</p>
          }
          @if (highlights().length) {
            <div class="ar-auth__cards">
              @for (h of highlights(); track $index; let i = $index) {
                <div class="ar-auth__card" [class.is-active]="i === active()" [attr.aria-hidden]="i === active() ? null : 'true'"><b>{{ h.title }}</b><span>{{ h.text }}</span></div>
              }
            </div>
          }
          @if (highlights().length > 1) {
            <div class="ar-auth__ticks" [class.is-paused]="paused()" role="group" aria-label="Highlights" [style.--ar-auth-interval]="interval() + 'ms'">
              @for (h of highlights(); track $index; let i = $index) {
                <button
                  type="button"
                  class="ar-auth__tick"
                  [class.is-active]="i === active()"
                  [class.is-done]="i < active()"
                  [attr.aria-label]="'Show highlight ' + (i + 1) + ' of ' + highlights().length + ': ' + h.title"
                  [attr.aria-current]="i === active() ? 'true' : null"
                  (click)="active.set(i)"
                ><i (animationend)="i === active() && next()"></i></button>
              }
            </div>
          }
        </div>
      </div>
    </aside>
  `,
})
export class ArAuthShell {
  private readonly platform = inject(ArPlatform);
  private readonly asset = arAssetUrl();

  /** Still frame for the media panel (also the phone strip unless `stripImage` is set). */
  readonly poster = input.required<string>();
  /** Looping muted video for the media panel; plays on wide screens once the page has settled. */
  readonly video = input<string | null>(null);
  /** Smaller crop for the phone strip. */
  readonly stripImage = input<string | null>(null);
  readonly headline = input<string>();
  readonly highlights = input<ArAuthHighlight[]>([]);
  /** Form column side on wide screens: left (sign-in) or right (sign-up). */
  readonly side = input<'left' | 'right'>('left');
  /** Wider form column for long forms. */
  readonly wide = input(false, { transform: booleanAttribute });
  readonly legal = input('© Airiona');
  /** Milliseconds each highlight stays up. */
  readonly interval = input(5600, { transform: numberAttribute });
  readonly mediaLabel = input('About Airiona');

  /** Wide screen (>=1024px): the media panel shows; below it the strip does. */
  protected readonly isWide = signal(true);
  protected readonly active = signal(0);
  protected readonly hover = signal(false);
  protected readonly focus = signal(false);
  protected readonly ready = signal(false);
  protected readonly paused = computed(() => this.hover() || this.focus());
  protected readonly posterSrc = computed(() => this.asset(this.poster()));
  protected readonly stripSrc = computed(() => this.asset(this.stripImage() || this.poster()));
  protected readonly videoSrc = computed(() => this.asset(this.video()));
  protected readonly hostClass = computed(() =>
    ['ar ar-auth', this.side() === 'right' ? 'ar-auth--flip' : '', this.wide() ? 'ar-auth--wide' : ''].filter(Boolean).join(' '),
  );
  private readonly videoEl = viewChild<ElementRef<HTMLVideoElement>>('video');

  constructor() {
    const win = this.platform.window;
    this.isWide.set(win?.matchMedia ? win.matchMedia('(min-width: 1024px)').matches : true);
    if (win?.matchMedia) {
      const q = win.matchMedia('(min-width: 1024px)');
      const on = () => this.isWide.set(q.matches);
      q.addEventListener('change', on);
      inject(DestroyRef).onDestroy(() => q.removeEventListener('change', on));
    }
    // The video never competes with the first paint: it starts after load, once the page has settled.
    effect((onCleanup) => {
      const v = this.videoEl()?.nativeElement;
      const src = this.videoSrc();
      if (!v || !src || !win || this.platform.reduceMotion()) return;
      let timer = 0;
      const start = () => { v.src = src; v.play()?.catch(() => undefined); };
      const later = () => { timer = win.setTimeout(start, 1200); };
      if (win.document.readyState === 'complete') later(); else win.addEventListener('load', later, { once: true });
      onCleanup(() => { win.clearTimeout(timer); win.removeEventListener('load', later); });
    });
  }

  protected next(): void {
    const n = this.highlights().length;
    if (n > 1) this.active.update((i) => (i + 1) % n);
  }

  protected parallax(e: PointerEvent): void {
    if (this.platform.reduceMotion()) return;
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--ar-px', `${(((e.clientX - r.left) / r.width - 0.5) * -20).toFixed(1)}px`);
    el.style.setProperty('--ar-py', `${(((e.clientY - r.top) / r.height - 0.5) * -20).toFixed(1)}px`);
  }
}

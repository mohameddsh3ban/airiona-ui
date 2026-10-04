import { ChangeDetectionStrategy, Component, ElementRef, booleanAttribute, computed, effect, inject, input, output, signal, viewChild } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArAvatarStack, ArWordmark, type ArPerson } from '../core/primitives';
import { ArPlatform } from '../core/platform';
import { arAssetUrl } from '../core/scene.component';

export interface ArSplitBadge {
  title: string;
  text?: string;
  /** Short figure in the blue disc, e.g. "28K+". */
  value?: string;
  people?: ArPerson[];
}

let ringSeq = 0;

/**
 * The landing page's opening. Copy on one side (eyebrow with a dashed flight trail, a two-part display headline,
 * lede, actions); on the other a photo in an organic shape that turns into a looping video once the page has
 * settled (after load, paused off screen, never under reduced motion or data saver), a glass badge with faces and
 * a figure, and a "watch the story" ring button. With `docked`, the default slot straddles the bottom edge.
 * Below 768px it becomes an app home screen: the photo runs full-bleed behind the copy, with the brand and the
 * `[arTop]` slot (sign in) over it under the status bar.
 *
 * ```html
 * <ar-split-hero eyebrow="Fly. Land. Explore." title="The sky" accent="is yours." image="…" video="…"
 *   [badge]="badge" storyLabel="Watch the story" (story)="openStory()" docked>
 *   <button arActions arButton variant="primary" size="lg">Book a flight</button>
 *   <ar-booking-search />
 * </ar-split-hero>
 * ```
 */
@Component({
  selector: 'ar-split-hero',
  imports: [ArIcon, ArAvatarStack, ArWordmark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', '[style.--ar-split-focus]': 'focus()', '[style.--ar-split-focus-phone]': 'phoneFocus()', '[attr.title]': 'null' },
  template: `
    <div class="ar-split__grid">
      <div class="ar-split__copy">
        @if (eyebrow()) {
          <p class="ar-split__eyebrow">
            <span>{{ eyebrow() }}</span>
            <span class="ar-split__trail" aria-hidden="true"><svg viewBox="0 0 72 22"><path d="M2 18 C 22 22, 46 20, 66 6" /></svg><ar-icon name="paper-airplane" variant="solid" [size]="16" /></span>
          </p>
        }
        @switch (headingLevel()) {
          @case (2) { <h2 class="ar-split__title"><span>{{ title() }}</span>@if (accent()) {{{ ' ' }}<span class="ar-split__accent">{{ accent() }}</span>}</h2> }
          @case (3) { <h3 class="ar-split__title"><span>{{ title() }}</span>@if (accent()) {{{ ' ' }}<span class="ar-split__accent">{{ accent() }}</span>}</h3> }
          @default { <h1 class="ar-split__title"><span>{{ title() }}</span>@if (accent()) {{{ ' ' }}<span class="ar-split__accent">{{ accent() }}</span>}</h1> }
        }
        @if (lede()) {
          <p class="ar-split__lede">{{ lede() }}</p>
        }
        <div class="ar-split__actions"><ng-content select="[arActions]" /></div>
      </div>
      <div class="ar-split__media">
        <div class="ar-split__top"><ar-wordmark /><div class="ar-split__top-actions"><ng-content select="[arTop]" /></div></div>
        <div class="ar-split__shape" aria-hidden="true">
          @if (image()) {
            <img class="ar-split__poster" [src]="imageSrc()" alt="" />
          }
          @if (videoSrc()) {
            <video #video class="ar-split__video" [class.is-ready]="ready()" [muted]="true" loop playsinline preload="none" tabindex="-1" disablepictureinpicture (playing)="ready.set(true)"></video>
          }
        </div>
        @if (badge(); as b) {
          <div class="ar-split__badge">
            <div class="ar-split__badge-top">
              <ar-avatar-stack [people]="b.people || []" [max]="3" />
              @if (b.value) {
                <span class="ar-split__badge-value">{{ b.value }}</span>
              }
            </div>
            <b>{{ b.title }}</b>
            @if (b.text) {
              <span>{{ b.text }}</span>
            }
          </div>
        }
        @if (storyLabel()) {
          <button type="button" class="ar-split__story" [attr.aria-label]="storyLabel()" (click)="story.emit()">
            <svg class="ar-split__ring" viewBox="0 0 120 120" aria-hidden="true">
              <defs><path [attr.id]="ringId" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs>
              <text><textPath [attr.href]="'#' + ringId" textLength="272" lengthAdjust="spacing">{{ ringText() }}</textPath></text>
            </svg>
            <span class="ar-split__play"><ar-icon name="play" variant="solid" [size]="22" /></span>
          </button>
        }
      </div>
    </div>
    @if (docked()) {
      <div class="ar-split__dock"><ng-content /></div>
    }
  `,
})
export class ArSplitHero {
  private readonly platform = inject(ArPlatform);
  private readonly asset = arAssetUrl();

  /** First line of the headline. */
  readonly title = input.required<string>();
  /** Second line, in Ion Blue with a hand-drawn underline. */
  readonly accent = input<string>();
  readonly eyebrow = input<string>();
  readonly lede = input<string>();
  /** Photo; also the poster frame the video fades in over. Export it from the video's first frame. */
  readonly image = input<string | null>(null);
  /** Looping muted video that replaces the photo once the page has settled. */
  readonly video = input<string | null>(null);
  /** object-position for the photo and video, e.g. "60% 50%". */
  readonly focus = input<string | null>(null);
  /** object-position on phones, where the photo runs full-bleed in portrait, e.g. "30% 50%". */
  readonly phoneFocus = input<string | null>(null);
  readonly badge = input<ArSplitBadge | null>(null);
  /** Label of the ring button ("Watch the story"); the button shows only when set. */
  readonly storyLabel = input<string>();
  /** Heading level of the title: 1 (default) for the page's own hero. */
  readonly headingLevel = input<1 | 2 | 3>(1);
  /** The default slot straddles the bottom edge. */
  readonly docked = input(false, { transform: booleanAttribute });

  /** The ring button was pressed (open the story video). */
  readonly story = output<void>();

  protected readonly ringId = `ar-split-ring-${++ringSeq}`;
  protected readonly ready = signal(false);
  protected readonly imageSrc = computed(() => this.asset(this.image()));
  protected readonly videoSrc = computed(() => this.asset(this.video()));
  protected readonly ringText = computed(() => {
    const label = (this.storyLabel() || '').toUpperCase();
    return `${label} • ${label} • `;
  });
  protected readonly hostClass = computed(() => (this.docked() ? 'ar ar-split ar-split--docked' : 'ar ar-split'));
  private readonly videoEl = viewChild<ElementRef<HTMLVideoElement>>('video');

  constructor() {
    const win = this.platform.window;
    // The video never competes with the first paint: it starts after load and pauses while scrolled away.
    effect((onCleanup) => {
      const v = this.videoEl()?.nativeElement;
      const src = this.videoSrc();
      if (!v || !src || !win || this.platform.reduceMotion()) return;
      const conn = (win.navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      if (conn?.saveData) return;
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

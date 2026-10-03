import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, TemplateRef, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { ArButton } from '../actions/button.component';
import { ArIcon } from '../core/icon.component';
import { ArPlatform } from '../core/platform';
import { ArScene, ArSceneVariant, arAssetUrl } from '../core/scene.component';

export interface ArOnboardingStep {
  /** Illustration path (resolved against `assetsUrl`). */
  image?: string;
  /** Custom art instead of an image. */
  art?: TemplateRef<unknown>;
  /** Drawn fallback when there is neither image nor art (default 'sky'). */
  scene?: ArSceneVariant;
  alt?: string;
  eyebrow?: string;
  title: string;
  text: string;
  /** Label of the final button on the last step. */
  cta?: string;
}

/** Default welcome copy for the five steps (React `OnboardingFlow.copy`). Merge your images in. */
export const AR_ONBOARDING_COPY: readonly ArOnboardingStep[] = [
  { eyebrow: 'Welcome', title: 'Your next trip starts here', text: 'Flights and stays in one calm app. Book the sky, then the stay.' },
  { eyebrow: 'Discover', title: 'Find places worth the flight', text: 'Browse cabins, villas and city lofts in 80 countries, with real prices for your dates.' },
  { eyebrow: 'Stay', title: 'Pick your dates, see the price', text: 'Nightly prices sit under every date, and booked-out days are marked before you choose.' },
  { eyebrow: 'Pay', title: 'Pay once, protected', text: 'One secure checkout for flight and stay, with free cancellation shown before you pay.' },
  { eyebrow: 'Go', title: 'Your whole trip in your pocket', text: 'Boarding passes, check-in codes and host messages, ready offline when you land.', cta: 'Get started' },
];

export type ArOnboardingDoneReason = 'done' | 'skip';

const RING = 188.5;

/**
 * The swipeable welcome: step counter and Skip, a scroll-snap track of art slides with copy, progress dots,
 * and a round next button whose ring fills as you go. The last step shows a Get started button.
 * Fills its positioned parent (`position: absolute; inset: 0`), e.g. a phone screen.
 *
 * ```html
 * <ar-onboarding-flow [steps]="steps" (done)="finish($event)" />
 * ```
 * ```ts
 * steps = AR_ONBOARDING_COPY.map((c, i) => ({ ...c, image: `onboarding/onboarding-${i + 1}.webp` }));
 * ```
 */
@Component({
  selector: 'ar-onboarding-flow',
  imports: [NgTemplateOutlet, ArButton, ArIcon, ArScene],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <section class="m-onb" aria-roledescription="carousel" [attr.aria-label]="label()">
      <div class="m-onb__top">
        <span class="m-onb__step">{{ index() + 1 }} / {{ steps().length }}</span>
        @if (last()) {
          <span></span>
        } @else {
          <button type="button" class="m-onb__skip m-tap" (click)="skip()">{{ skipLabel() }}</button>
        }
      </div>
      <div #track class="m-onb__track" (scroll)="onScroll()">
        @for (step of steps(); track $index; let i = $index) {
          <div
            class="m-onb__slide"
            [class.is-active]="i === index()"
            role="group"
            aria-roledescription="slide"
            [attr.aria-label]="i + 1 + ' of ' + steps().length"
            [attr.aria-hidden]="i === index() ? null : 'true'"
          >
            <div class="m-onb__art">
              @if (step.image) {
                <img [src]="asset(step.image)" [alt]="step.alt || ''" draggable="false" />
              } @else if (step.art) {
                <ng-container [ngTemplateOutlet]="step.art" />
              } @else {
                <ar-scene [variant]="step.scene || 'sky'" />
              }
            </div>
            <div class="m-onb__copy">
              @if (step.eyebrow) {
                <span class="m-onb__eyebrow">{{ step.eyebrow }}</span>
              }
              <h2 class="m-onb__title">{{ step.title }}</h2>
              <p class="m-onb__text">{{ step.text }}</p>
            </div>
          </div>
        }
      </div>
      <div class="m-onb__foot">
        <div class="m-onb__dots" role="tablist" aria-label="Steps">
          @for (step of steps(); track $index; let i = $index) {
            <button type="button" role="tab" [attr.aria-selected]="i === index() ? 'true' : 'false'" [attr.aria-label]="'Step ' + (i + 1)" (click)="go(i)"></button>
          }
        </div>
        @if (last()) {
          <button arButton variant="primary" size="lg" arrow="arrow-right" (click)="finish()">{{ current()?.cta || doneLabel() }}</button>
        } @else {
          <button type="button" class="m-onb__next m-tap" [attr.aria-label]="'Next: step ' + (index() + 2)" (click)="go(index() + 1)">
            <svg viewBox="0 0 64 64" class="m-onb__ring" aria-hidden="true">
              <circle cx="32" cy="32" r="30" class="m-onb__ring-track" />
              <circle cx="32" cy="32" r="30" class="m-onb__ring-bar" [style.stroke-dasharray]="ring" [style.stroke-dashoffset]="ringOffset()" />
            </svg>
            <span><ar-icon name="arrow-right" [size]="22" [strokeWidth]="2.2" /></span>
          </button>
        }
      </div>
    </section>
  `,
})
export class ArOnboardingFlow {
  /** Default copy for the five steps; same as `AR_ONBOARDING_COPY`. */
  static readonly copy = AR_ONBOARDING_COPY;

  private readonly platform = inject(ArPlatform);
  protected readonly asset = arAssetUrl();
  private readonly track = viewChild<ElementRef<HTMLElement>>('track');

  readonly steps = input<readonly ArOnboardingStep[]>([]);
  readonly skipLabel = input('Skip');
  /** Final button label when the last step has no `cta`. */
  readonly doneLabel = input('Get started');
  /** Accessible name of the carousel. */
  readonly label = input('Welcome to Airiona');
  /** 'done' from the last step's button, 'skip' when Skip is tapped (the flow then jumps to the last step). */
  readonly done = output<ArOnboardingDoneReason>();

  protected readonly index = signal(0);
  protected readonly ring = RING;
  protected readonly last = computed(() => this.index() === this.steps().length - 1);
  protected readonly current = computed<ArOnboardingStep | undefined>(() => this.steps()[this.index()]);
  protected readonly ringOffset = computed(() => RING * (1 - (this.index() + 1) / Math.max(1, this.steps().length)));

  /** Scrolls to step `i` (clamped). */
  go(i: number): void {
    const el = this.track()?.nativeElement;
    if (!el || !this.platform.isBrowser) return;
    const n = Math.max(0, Math.min(this.steps().length - 1, i));
    el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' });
    this.index.set(n);
    this.platform.haptic();
  }

  protected onScroll(): void {
    const el = this.track()?.nativeElement;
    if (!el) return;
    const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
    if (i !== this.index()) this.index.set(i);
  }

  protected skip(): void {
    this.done.emit('skip');
    this.go(this.steps().length - 1);
  }

  protected finish(): void {
    this.platform.haptic(12);
    this.done.emit('done');
  }
}

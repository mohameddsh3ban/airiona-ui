import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  TemplateRef,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ArPlatform } from '../core/platform';

/** One screen inside `<ar-screen-stack>`: `<ng-template arScreen="detail">…</ng-template>`. */
@Directive({ selector: 'ng-template[arScreen]' })
export class ArScreen {
  readonly arScreen = input.required<string>();
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

interface Leaving {
  key: string;
  dir: 'push' | 'pop';
}

/**
 * Native push and pop between mobile screens: the new screen slides in from the right while the old one
 * parallaxes 28% left and dims; pop plays the reverse (380ms, sheet curve). The leaving screen is inert.
 *
 * ```html
 * <ar-screen-stack [screen]="screen()" [direction]="dir()">
 *   <ng-template arScreen="list">…</ng-template>
 *   <ng-template arScreen="detail">…</ng-template>
 * </ar-screen-stack>
 * ```
 */
@Component({
  selector: 'ar-screen-stack',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'm-stackview' },
  template: `
    @if (leaving(); as l) {
      <div [class]="'m-stackview__layer is-leaving is-' + l.dir" aria-hidden="true" inert>
        <ng-container *ngTemplateOutlet="templateFor(l.key)" />
      </div>
    }
    @for (k of [screen()]; track k) {
      <div [class]="currentClass()">
        <ng-container *ngTemplateOutlet="templateFor(k)" />
      </div>
    }
  `,
})
export class ArScreenStack {
  private readonly platform = inject(ArPlatform);
  private readonly screens = contentChildren(ArScreen);

  /** Key of the visible screen (matches an `arScreen` template). */
  readonly screen = input.required<string>();
  /** Set before changing `screen`: 'push' when drilling in, 'pop' when going back. */
  readonly direction = input<'push' | 'pop'>('push');

  protected readonly leaving = signal<Leaving | null>(null);
  protected readonly currentClass = computed(() => {
    const l = this.leaving();
    return l ? `m-stackview__layer is-entering is-${l.dir}` : 'm-stackview__layer';
  });

  constructor() {
    let prev: string | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    effect(() => {
      const cur = this.screen();
      if (prev !== null && prev !== cur) {
        const dir = untracked(this.direction);
        this.leaving.set({ key: prev, dir });
        clearTimeout(timer);
        timer = setTimeout(() => this.leaving.set(null), this.platform.reduceMotion() ? 0 : 400);
      }
      prev = cur;
    });
    inject(DestroyRef).onDestroy(() => clearTimeout(timer));
  }

  protected templateFor(key: string): TemplateRef<unknown> | null {
    return this.screens().find((s) => s.arScreen() === key)?.template ?? null;
  }
}

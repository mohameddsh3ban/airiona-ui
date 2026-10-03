import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ArRouteVariant = 'fade-through' | 'shared-x' | 'shared-y' | 'scale';

/**
 * Animates its content in whenever `routeKey` changes. Wrap the router outlet (or any view switch):
 *
 * ```ts
 * private readonly router = inject(Router);
 * protected readonly url = toSignal(this.router.events.pipe(filter(e => e instanceof NavigationEnd), map(() => this.router.url)), { initialValue: this.router.url });
 * ```
 * ```html
 * <ar-route-transition [routeKey]="url()"><router-outlet /></ar-route-transition>
 * ```
 * fade-through for top-level destinations, shared-x for ordered steps (direction 'back' plays from the left),
 * shared-y for detail pages, scale for full-screen viewers.
 */
@Component({
  selector: 'ar-route-transition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    @for (k of [routeKey()]; track k) {
      <div [class]="cls()"><ng-content /></div>
    }
  `,
})
export class ArRouteTransition {
  readonly routeKey = input<string | number | null | undefined>('');
  readonly variant = input<ArRouteVariant>('fade-through');
  readonly direction = input<'forward' | 'back'>('forward');
  protected readonly cls = computed(() => `ar-route ar-route--${this.variant()} is-${this.direction()}`);
}

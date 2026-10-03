import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ArButton, ArIcon, ArRouteTransition, ArRouteVariant, ArSegmentedControl, ArSkeleton, ArSuccessBurst } from '@airiona/ui';
import { DemoDef } from './demo';

@Component({
  imports: [ArSuccessBurst, ArButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-col" style="gap: 12px; align-items: center">
      <ar-success-burst [replayKey]="run()" title="Booking confirmed">Scandinavian Forest Cabin · 15–19 Oct. Reference K7QX2M is in your inbox.</ar-success-burst>
      <button arButton variant="secondary" size="sm" iconStart="arrow-path" (click)="run.set(run() + 1)">Replay</button>
    </div>
  `,
})
class SuccessBurstDemo {
  protected readonly run = signal(0);
}

@Component({
  imports: [ArSkeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row" style="gap: 16px; align-items: flex-start; flex-wrap: wrap">
      <div style="flex: 1 1 240px; max-width: 300px"><ar-skeleton variant="card" [lines]="3" label="Loading stay" /></div>
      <div style="flex: 1 1 280px">
        <ar-skeleton variant="row" [lines]="2" />
        <ar-skeleton variant="row" [lines]="2" />
        <ar-skeleton variant="text" [lines]="3" />
      </div>
    </div>
  `,
})
class SkeletonDemo {}

const BODY: Record<string, [string, string, string]> = {
  stays: ['Stays', '128 places in Lisbon', 'home-modern'],
  flights: ['Flights', 'DXB → HND · 14 options', 'paper-airplane'],
  trips: ['Trips', '2 upcoming, 1 needs check-in', 'briefcase'],
};
const ORDER = ['stays', 'flights', 'trips'];

@Component({
  imports: [ArRouteTransition, ArSegmentedControl, ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-col" style="gap: 16px">
      <div class="ar-row" style="gap: 12px; flex-wrap: wrap">
        <ar-segmented-control label="Route" [value]="route()" (valueChange)="go($event)" [options]="routes" />
        <ar-segmented-control label="Variant" tone="surface" size="sm" [(value)]="variant" [options]="variants" />
      </div>
      <div style="overflow: hidden; border-radius: 28px">
        <ar-route-transition [routeKey]="route() + variant()" [variant]="$any(variant())" [direction]="dir()">
          <div class="ar-w ar-w--sky" style="min-height: 180px">
            <div class="ar-w__row">
              <div class="ar-w__titles"><span class="ar-w__eyebrow">Route</span><h3 class="ar-w__title">{{ body()[0] }}</h3></div>
              <span class="ar-w__badge"><ar-icon [name]="body()[2]" [size]="20" /></span>
            </div>
            <p style="margin: 0; color: var(--ink-muted)">{{ body()[1] }}</p>
          </div>
        </ar-route-transition>
      </div>
    </div>
  `,
})
class RouteTransitionDemo {
  protected readonly route = signal('stays');
  protected readonly variant = signal<string | null>('fade-through');
  protected readonly dir = signal<'forward' | 'back'>('forward');
  protected readonly routes = [{ value: 'stays', label: 'Stays' }, { value: 'flights', label: 'Flights' }, { value: 'trips', label: 'Trips' }];
  protected readonly variants: ArRouteVariant[] = ['fade-through', 'shared-x', 'shared-y', 'scale'];
  protected readonly body = computed(() => BODY[this.route()]);
  protected go(v: string | null): void {
    const next = v ?? 'stays';
    this.dir.set(ORDER.indexOf(next) >= ORDER.indexOf(this.route()) ? 'forward' : 'back');
    this.route.set(next);
  }
}

export const MOTION_DEMOS: DemoDef[] = [
  { name: 'SuccessBurst', group: 'Motion', component: SuccessBurstDemo, height: 300 },
  { name: 'Skeleton', group: 'Motion', component: SkeletonDemo, height: 318 },
  { name: 'RouteTransition', group: 'Motion', component: RouteTransitionDemo, height: 360 },
];

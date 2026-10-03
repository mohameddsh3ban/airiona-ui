import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ArAvatar,
  ArAvatarStack,
  ArBadge,
  ArButton,
  ArCountUp,
  ArIcon,
  ArIconButton,
  ArRing,
  ArScene,
  ArSegmentedControl,
  ArTextField,
} from '@airiona/ui';
import { AR_ALL_ICONS } from '@airiona/ui/icons';
import { DemoDef } from './demo';

@Component({
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-col" style="gap: 16px">
      <div class="ar-row" style="gap: 10px; color: var(--ink)">
        @for (n of names; track n) {
          <span [title]="n" style="display:inline-grid;place-items:center;width:44px;height:44px;border-radius:12px;background:var(--surface)"><ar-icon [name]="n" [size]="22" /></span>
        }
      </div>
      <div class="ar-row" style="gap: 10px; color: var(--ink)">
        @for (n of solid; track n) {
          <span [title]="n + ' (solid)'" style="display:inline-grid;place-items:center;width:44px;height:44px;border-radius:12px;background:var(--blue-50);color:var(--blue-600)"><ar-icon [name]="n" variant="solid" [size]="22" /></span>
        }
        <span style="width:1px;height:28px;background:var(--line);margin:0 6px"></span>
        @for (n of extras; track n) {
          <span [title]="n + ' (Airiona addition)'" style="display:inline-grid;place-items:center;width:44px;height:44px;border-radius:12px;background:var(--surface);box-shadow:inset 0 0 0 1.5px var(--blue-200)"><ar-icon [name]="n" [size]="22" /></span>
        }
      </div>
      <span class="body-sm" style="color: var(--ink-muted)">{{ outlineCount }} Heroicons outline · {{ solidCount }} solid · {{ extras.length }} Airiona travel additions (blue outline)</span>
    </div>
  `,
})
class IconDemo {
  protected readonly names = ['magnifying-glass', 'paper-airplane', 'calendar-days', 'map-pin', 'globe-alt', 'home-modern', 'building-office-2', 'ticket', 'briefcase', 'credit-card', 'wallet', 'users', 'user-circle', 'heart', 'star', 'bell', 'chat-bubble-left-right', 'arrows-right-left', 'adjustments-horizontal', 'funnel', 'arrow-up-on-square', 'arrow-up-right', 'check-circle', 'exclamation-triangle', 'information-circle', 'x-mark', 'plus', 'minus', 'clock', 'wifi', 'shield-check', 'sparkles'];
  protected readonly solid = ['star', 'heart', 'check-circle', 'exclamation-triangle', 'information-circle', 'bell'];
  protected readonly extras = ['plane', 'bed', 'bath', 'utensils', 'car'];
  protected readonly outlineCount = Object.keys(AR_ALL_ICONS.outline ?? {}).filter((k) => !this.extras.includes(k)).length;
  protected readonly solidCount = Object.keys(AR_ALL_ICONS.solid ?? {}).length;
}

@Component({
  imports: [ArScene],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px">
      @for (v of variants; track v) {
        <div style="display:flex;flex-direction:column;gap:6px">
          <div style="aspect-ratio:4/3;border-radius:18px;overflow:hidden"><ar-scene [variant]="v" /></div>
          <span class="ar-mono" style="font-size:12px;color:var(--ink-subtle)">{{ v }}</span>
        </div>
      }
    </div>
  `,
})
class SceneDemo {
  protected readonly variants = ['sky', 'alpine', 'coast', 'dusk', 'forest'] as const;
}

@Component({
  imports: [ArButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-col" style="gap: 18px">
      <div class="ar-row">
        <button arButton variant="primary">Check availability</button>
        <button arButton variant="brand" arrow>Join Airiona Plus</button>
        <button arButton variant="secondary" iconStart="adjustments-horizontal">Filters</button>
        <button arButton variant="soft">Export</button>
        <button arButton variant="ghost" iconEnd="chevron-down">Default view</button>
      </div>
      <div class="ar-row">
        <button arButton size="lg" arrow>Book now</button>
        <button arButton size="sm">Sign in</button>
        <button arButton variant="brand" [loading]="true">Paying…</button>
        <button arButton disabled>Sold out</button>
      </div>
      <div class="ar-row" style="padding: 14px; border-radius: 20px; background: var(--blue-500)">
        <button arButton variant="white">Reserve</button>
        <button arButton variant="glass" arrow>View deal</button>
      </div>
    </div>
  `,
})
class ButtonDemo {}

@Component({
  imports: [ArIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row">
      <button arIconButton icon="bell" label="Notifications" badge></button>
      <button arIconButton icon="cog-6-tooth" label="Settings" variant="soft"></button>
      <button arIconButton icon="chevron-left" label="Back" variant="outline"></button>
      <button arIconButton icon="arrow-up-right" label="Open" variant="ink"></button>
      <button arIconButton icon="magnifying-glass" label="Search" variant="brand" size="lg"></button>
      <div class="ar-row" style="padding: 12px; border-radius: 999px; background: linear-gradient(135deg, var(--blue-300), var(--sky-200))">
        <button arIconButton icon="arrow-up-on-square" label="Share" variant="white"></button>
        <button arIconButton icon="heart" label="Save" variant="glass" [attr.aria-pressed]="saved()" (click)="saved.set(!saved())"></button>
      </div>
    </div>
  `,
})
class IconButtonDemo {
  protected readonly saved = signal(true);
}

@Component({
  imports: [ArSegmentedControl, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-col" style="gap: 16px; align-items: flex-start">
      <ar-segmented-control label="Section" [options]="['Overview', 'Bookings', 'Payouts', 'Calendar']" />
      <ar-segmented-control label="Trip" tone="brand" size="sm" [(value)]="trip" [options]="tripOptions" />
      <ar-segmented-control label="Dashboard" tone="brand" variant="pills" [formControl]="view" [options]="viewOptions" />
    </div>
  `,
})
class SegmentedDemo {
  protected readonly trip = signal<string | null>('round');
  protected readonly tripOptions = [{ value: 'one', label: 'One way' }, { value: 'round', label: 'Round trip' }, { value: 'multi', label: 'Multi-city' }];
  protected readonly view = new FormControl('d');
  protected readonly viewOptions = [{ value: 'd', label: 'Dashboard' }, { value: 'a', label: 'Analytics' }, { value: 'i', label: 'Invoices', count: 3 }];
}

@Component({
  imports: [ArTextField, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;padding:20px;border-radius:24px;background:var(--surface)">
      <ar-text-field label="Email" placeholder="you@example.com" iconStart="information-circle" type="email" [formControl]="email" />
      <ar-text-field label="Password" type="password" value="airiona-2026" />
      <ar-text-field label="Passport number" placeholder="As printed on your passport" hint="Needed for international flights." [(ngModel)]="passport" />
      <ar-text-field label="Card number" iconStart="credit-card" value="4242 4242 4242" error="Card number is incomplete. Check the last 4 digits." />
      <ar-text-field label="Promo code" variant="sunken" placeholder="SKY2026" />
      <ar-text-field label="Where to?" variant="sunken" iconStart="magnifying-glass" placeholder="City, airport or hotel" />
    </div>
  `,
})
class TextFieldDemo {
  protected readonly email = new FormControl('maya.haddad@mail.com');
  protected passport = '';
}

@Component({
  imports: [ArBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-col" style="gap: 12px">
      <div class="ar-row">
        <ar-badge tone="success" dot>Confirmed</ar-badge>
        <ar-badge tone="warning" dot>Payment pending</ar-badge>
        <ar-badge tone="danger" dot>Cancelled</ar-badge>
        <ar-badge tone="brand" dot>Checked in</ar-badge>
        <ar-badge tone="neutral" dot>Draft</ar-badge>
      </div>
      <div class="ar-row">
        <ar-badge tone="ink" icon="star">Top rated</ar-badge>
        <ar-badge tone="brand">+15% for members</ar-badge>
        <ar-badge tone="outline">Refundable</ar-badge>
        <ar-badge tone="warning" size="sm">2 seats left</ar-badge>
        <span style="padding: 8px; border-radius: 14px; background: var(--blue-900)"><ar-badge tone="glass">Luxury stay</ar-badge></span>
      </div>
    </div>
  `,
})
class BadgeDemo {}

@Component({
  imports: [ArAvatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row" style="gap: 16px">
      <ar-avatar name="Maya Haddad" size="lg" />
      <ar-avatar name="Omar Saleh" />
      <ar-avatar name="Lina Park" />
      <ar-avatar name="Daniel Ruiz" size="sm" />
      <ar-avatar name="Aiko Tan" size="xs" />
    </div>
  `,
})
class AvatarDemo {}

@Component({
  imports: [ArAvatarStack],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row" style="gap: 32px">
      <ar-avatar-stack [people]="['Maya Haddad', 'Omar Saleh', 'Lina Park']" [extra]="12"><span><b>10k+</b> travellers rated this 4.8</span></ar-avatar-stack>
      <ar-avatar-stack [people]="['Aiko Tan', 'Daniel Ruiz', 'Sara Ali', 'Jon Berg', 'Nour Aziz', 'Eli Cohen']" [max]="4" />
    </div>
  `,
})
class AvatarStackDemo {}

@Component({
  imports: [ArRing, ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row" style="gap: 20px">
      <ar-ring [value]="0.64" [size]="64"><b>64</b><span>km</span></ar-ring>
      <ar-ring [value]="0.3" [size]="48"><b>30%</b></ar-ring>
      <div class="ar-w ar-w--dark" style="padding: 12px"><ar-ring [value]="0.8" [size]="56"><ar-icon name="bolt" [size]="20" /></ar-ring></div>
    </div>
  `,
})
class RingDemo {}

@Component({
  imports: [ArCountUp, ArButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-col" style="gap: 14px">
      @for (k of [run()]; track k) {
        <div class="ar-row" style="gap: 12px; flex-wrap: wrap; align-items: stretch">
          @for (c of cells; track c[1]) {
            <div class="ar-stat" style="flex: 1 1 160px">
              <div class="ar-stat__label">{{ c[1] }}</div>
              <div class="ar-stat__value"><ar-count-up [value]="c[0]" /></div>
            </div>
          }
        </div>
      }
      <div><button arButton variant="secondary" size="sm" iconStart="arrow-path" (click)="run.set(run() + 1)">Replay</button></div>
    </div>
  `,
})
class CountUpDemo {
  protected readonly run = signal(0);
  protected readonly cells = [['$84,210', 'Revenue, October'], ['1,350', 'Nights booked'], ['87%', 'Occupancy'], ['4.92', 'Guest rating']];
}

export const CORE_DEMOS: DemoDef[] = [
  { name: 'Icon', group: 'Primitives', component: IconDemo, height: 220 },
  { name: 'Scene', group: 'Primitives', component: SceneDemo, height: 200 },
  { name: 'Button', group: 'Actions', component: ButtonDemo, height: 256 },
  { name: 'IconButton', group: 'Actions', component: IconButtonDemo, height: 120 },
  { name: 'SegmentedControl', group: 'Actions', component: SegmentedDemo, height: 230 },
  { name: 'TextField', group: 'Forms', component: TextFieldDemo, height: 330 },
  { name: 'Badge', group: 'Status', component: BadgeDemo, height: 128 },
  { name: 'Avatar', group: 'Identity', component: AvatarDemo, height: 104 },
  { name: 'AvatarStack', group: 'Identity', component: AvatarStackDemo, height: 90 },
  { name: 'Ring', group: 'Widgets', component: RingDemo, height: 128 },
  { name: 'CountUp', group: 'Motion', component: CountUpDemo, height: 216 },
];

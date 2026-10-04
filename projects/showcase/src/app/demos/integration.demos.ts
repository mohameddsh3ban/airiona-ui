import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ArAppBar,
  ArAuthShell,
  ArButton,
  ArCheckbox,
  ArTextField,
  ArInfoStatRow,
  ArLandingHero,
  ArBookingSearch,
  ArMeetingsStrip,
  ArPhoneFrame,
  ArPilotDashboard,
  ArPlaceCard,
  ArPlaceHero,
  ArProfileProjectCard,
  ArScreen,
  ArScreenStack,
  ArSparkBars,
} from '@airiona/ui';
import { DemoDef, IMG } from './demo';

@Component({
  imports: [ArProfileProjectCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="max-width: 420px">
      <ar-profile-project-card [person]="{ name: 'Lina Park', role: 'Revenue manager' }" project="Nordic Pine Lodge" metaLabel="Segment" meta="Boutique cabins"
        [progress]="0.34" progressLabel="Onboarding progress" unread [reports]="reports" [(report)]="report" />
    </div>
  `,
})
class ProfileProjectCardDemo {
  protected readonly report = signal<string | null>(null);
  protected readonly reports = [{ value: 'occ', label: 'Occupancy report' }, { value: 'rev', label: 'Revenue report' }, { value: 'rev2', label: 'Reviews digest' }];
}

@Component({
  imports: [ArMeetingsStrip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="max-width: 420px">
      <ar-meetings-strip title="Upcoming meetings" summary="3 calls · Thu, 11" [months]="months" [(month)]="month" [(value)]="day" [days]="days" />
    </div>
  `,
})
class MeetingsStripDemo {
  protected readonly month = signal<string | null>('sep');
  protected readonly day = signal<string | number | null>('11');
  protected readonly months = [{ value: 'sep', label: 'September' }, { value: 'oct', label: 'October' }];
  protected readonly days = [{ date: '8', weekday: 'Mon' }, { date: '9', weekday: 'Tue', count: 1 }, { date: '10', weekday: 'Wed' }, { date: '11', weekday: 'Thu', count: 3 }, { date: '12', weekday: 'Fri' }, { date: '13', weekday: 'Sat' }];
}

@Component({
  imports: [ArPilotDashboard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ar-pilot-dashboard [promptImage]="img.aiOrb" />`,
})
class PilotDashboardDemo {
  protected readonly img = IMG;
}

@Component({
  imports: [ArPhoneFrame, ArScreenStack, ArScreen, ArAppBar, ArPlaceCard, ArPlaceHero, ArInfoStatRow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; justify-content: center">
      <ar-phone-frame [statusTone]="screen() === 'detail' ? 'light' : 'dark'">
        <ar-screen-stack [screen]="screen()" [direction]="dir()">
          <ng-template arScreen="list">
            <div class="m-screen">
              <ar-app-bar large eyebrow="Thu, 15 Oct" title="Explore" />
              <div class="m-pad" style="display: flex; flex-direction: column; gap: 14px; padding-bottom: 40px">
                <ar-place-card [image]="img.forestCabin" title="Nordic Pine Lodge" region="Bavaria" location="Nuremberg, Germany" rating="4.8" (press)="go('detail', 'push')" />
                <ar-place-card [image]="img.alpineLodge" title="Swiss Alps Retreat" region="Valais" location="Zermatt, Switzerland" rating="4.9" (press)="go('detail', 'push')" />
              </div>
            </div>
          </ng-template>
          <ng-template arScreen="detail">
            <div class="m-screen">
              <ar-place-hero [image]="img.forestCabin" title="Nordic Pine Lodge" location="Nuremberg, Germany" price="$412" priceLabel="per night" (back)="go('list', 'pop')" />
              <div class="m-pad" style="padding-top: 16px">
                <ar-info-stat-row [items]="[{ icon: 'star', label: '4.8' }, { icon: 'users', label: '4 guests' }, { icon: 'clock', label: '2h drive' }]" />
              </div>
            </div>
          </ng-template>
        </ar-screen-stack>
      </ar-phone-frame>
    </div>
  `,
})
class ScreenStackDemo {
  protected readonly img = IMG;
  protected readonly screen = signal('list');
  protected readonly dir = signal<'push' | 'pop'>('push');
  protected go(key: string, dir: 'push' | 'pop'): void {
    this.dir.set(dir);
    this.screen.set(key);
  }
}

@Component({
  imports: [ArSparkBars],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-w ar-w--dark" style="flex-direction: row; gap: 24px; width: fit-content">
      <ar-spark-bars [values]="[2, 3, 2, 5, 9, 6, 4, 2, 3, 2]" />
      <ar-spark-bars [values]="[5, 4, 6, 3, 2, 4, 8, 3, 2, 4]" />
    </div>
  `,
})
class SparkBarsDemo {}

@Component({
  imports: [ArAuthShell, ArButton, ArCheckbox, ArTextField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ar-auth-shell poster="photos/aviation/auth-wing.webp" video="video/auth-wing.mp4" stripImage="photos/aviation/auth-wing-strip.webp"
      headline="Your aircraft, your schedule." [highlights]="highlights">
      <button arActions arButton variant="ghost" size="sm" iconStart="question-mark-circle">Help</button>
      <a arFoot class="ar-auth-link" href="#">Privacy</a>
      <div class="ar-auth-head"><h1>Welcome back</h1><p>Sign in to book flights and manage your hangar space.</p></div>
      <ar-text-field label="Email" type="email" iconStart="envelope" placeholder="name@example.com" autocomplete="email" />
      <ar-text-field label="Password" type="password" iconStart="lock-closed" autocomplete="current-password" />
      <div class="ar-auth-row"><ar-checkbox label="Keep me signed in" /><a class="ar-auth-link" href="#">Forgot password?</a></div>
      <button arButton variant="primary" size="lg" block>Sign in</button>
      <p class="ar-auth-divider">or</p>
      <button arButton variant="secondary" size="lg" block iconStart="device-phone-mobile">Continue with passkey</button>
      <p class="ar-auth-switch">New to Airiona? <a class="ar-auth-link" href="#">Create an account</a></p>
    </ar-auth-shell>
  `,
})
class AuthShellDemo {
  protected readonly highlights = [
    { title: 'All-in prices', text: 'Crew, fuel, airport fees and VAT in one number before you request.' },
    { title: 'Confirmed in minutes', text: 'Operators answer a request within the 15-minute price hold.' },
    { title: 'Hangars on the same account', text: 'Book space at 140 airports for the aircraft you fly or own.' },
  ];
}

@Component({
  imports: [ArLandingHero, ArBookingSearch, ArButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ar-landing-hero image="photos/aviation/hero-sky.webp" video="video/hero-sky.mp4" focus="78% 50%"
      eyebrow="Private aviation" title="Fly on your own schedule."
      lede="Charter a jet, buy an aircraft or lease hangar space, with all-in prices and operators who answer in minutes."
      [stats]="stats" docked>
      <button arActions arButton variant="primary" size="lg" iconStart="paper-airplane">Book a flight</button>
      <button arActions arButton variant="secondary" size="lg">Browse aircraft</button>
      <ar-booking-search />
    </ar-landing-hero>
  `,
})
class LandingHeroDemo {
  protected readonly stats = [
    { value: '1,240', label: 'Aircraft listed' },
    { value: '140', label: 'Airports with hangars' },
    { value: '15 min', label: 'Average reply' },
  ];
}

export const INTEGRATION_DEMOS: DemoDef[] = [
  { name: 'ProfileProjectCard', group: 'Workspace', component: ProfileProjectCardDemo, height: 376 },
  { name: 'MeetingsStrip', group: 'Workspace', component: MeetingsStripDemo, height: 330 },
  { name: 'SparkBars', group: 'Dashboard', component: SparkBarsDemo, height: 112 },
  { name: 'PilotDashboard', group: 'Screens', component: PilotDashboardDemo, height: 1587, stage: 'padding: 12px;' },
  { name: 'ScreenStack', group: 'Motion', component: ScreenStackDemo, height: 880 },
  { name: 'AuthShell', group: 'Screens', component: AuthShellDemo, height: 860, stage: 'padding:0;' },
  { name: 'LandingHero', group: 'Screens', component: LandingHeroDemo, height: 700, stage: 'padding:24px 24px 32px;' },
];

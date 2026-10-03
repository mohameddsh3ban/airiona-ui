import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ArAppBar,
  ArInfoStatRow,
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

export const INTEGRATION_DEMOS: DemoDef[] = [
  { name: 'ProfileProjectCard', group: 'Workspace', component: ProfileProjectCardDemo, height: 376 },
  { name: 'MeetingsStrip', group: 'Workspace', component: MeetingsStripDemo, height: 330 },
  { name: 'SparkBars', group: 'Dashboard', component: SparkBarsDemo, height: 112 },
  { name: 'PilotDashboard', group: 'Screens', component: PilotDashboardDemo, height: 1587, stage: 'padding: 12px;' },
  { name: 'ScreenStack', group: 'Motion', component: ScreenStackDemo, height: 880 },
];

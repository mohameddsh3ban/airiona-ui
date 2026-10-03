import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ArActionSheet,
  ArAppBar,
  ArAvatar,
  ArBottomSheet,
  ArButton,
  ArChipScroller,
  ArCountUp,
  ArFab,
  ArFeatureCard,
  ArFieldTile,
  ArFlightSearchSheet,
  ArGreetingBar,
  ArHeroHeader,
  ArHeroPattern,
  ArIcon,
  ArIconButton,
  ArMobileSegmented,
  ArPhoneFrame,
  ArRouteHeader,
  ArSearchField,
  ArSectionHeader,
  ArSheetAction,
  ArSnapCarousel,
  ArSnapItem,
  ArStatusBar,
  ArStickyActionBar,
  ArSwipeAction,
  ArSwipeRow,
  ArTabBar,
  ArTabItem,
} from '@airiona/ui';
import { DemoDef, IMG } from './demo';

/* Previews wrap mobile parts in M(inner, height, extra) = <div class="m-demo {extra}" style="height: {height | auto}">. */

const NAV: ArTabItem[] = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'trips', label: 'Trips', icon: 'ticket' },
  { value: 'saved', label: 'Saved', icon: 'heart' },
  { value: 'me', label: 'Profile', icon: 'user' },
];

@Component({
  imports: [ArPhoneFrame, ArAppBar, ArTabBar, ArHeroPattern, ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; justify-content: center">
      <ar-phone-frame>
        <div class="m-screen">
          <ar-app-bar large eyebrow="Thu, 15 Oct" title="Today" />
          <!-- Timeline (another batch) as its rendered markup -->
          <ol class="m-timeline">
            <li class="m-timeline__item is-featured is-done">
              <span class="m-timeline__node" aria-hidden="true"></span>
              <div class="m-timeline__card m-tap">
                <ar-hero-pattern pattern="waves" />
                <div class="m-timeline__top"><b>Flight to Tokyo</b><span>08:45</span></div>
                <p>EK 312 · Gate B18</p>
                <div class="m-timeline__foot">
                  <span></span>
                  <span class="m-timeline__check" aria-label="Done"><ar-icon name="check" [size]="16" [strokeWidth]="2.4" /></span>
                </div>
              </div>
            </li>
            <li class="m-timeline__item">
              <span class="m-timeline__node" aria-hidden="true"></span>
              <div class="m-timeline__card m-tap">
                <div class="m-timeline__top"><b>Hotel check-in</b><span>14:00</span></div>
                <p>Code arrives at noon</p>
              </div>
            </li>
          </ol>
        </div>
        <ar-tab-bar [items]="nav" />
      </ar-phone-frame>
    </div>
  `,
})
class PhoneFrameDemo {
  protected readonly nav = NAV;
}

@Component({
  imports: [ArStatusBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row" style="gap: 16px">
      <div class="m-demo" style="height: 60px"><ar-status-bar /></div>
      <div class="m-demo is-dark" style="height: 60px"><ar-status-bar tone="light" /></div>
    </div>
  `,
})
class StatusBarDemo {}

@Component({
  imports: [ArAppBar, ArIconButton, ArAvatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-col" style="gap: 16px">
      <div class="m-demo is-padded" style="height: auto">
        <ar-app-bar title="Boarding pass" showBack>
          <button arActions arIconButton icon="arrow-up-on-square" label="Share" variant="soft"></button>
        </ar-app-bar>
      </div>
      <div class="m-demo is-padded" style="height: auto">
        <ar-app-bar large eyebrow="October 15, 2026" title="Today">
          <ar-avatar arActions name="Maya Haddad" size="lg" />
        </ar-app-bar>
      </div>
      <div class="m-demo is-padded" style="height: auto">
        <ar-app-bar large title="Trips" accent titleSuffix="Planner" />
      </div>
    </div>
  `,
})
class AppBarDemo {}

@Component({
  imports: [ArTabBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-col" style="gap: 16px">
      <div class="m-demo" style="height: 96px"><ar-tab-bar variant="dot" [items]="nav" /></div>
      <div class="m-demo" style="height: 110px"><ar-tab-bar variant="fab" [items]="nav" /></div>
      <div class="m-demo is-canvas" style="height: 110px"><ar-tab-bar variant="pill" [items]="nav" /></div>
    </div>
  `,
})
class TabBarDemo {
  protected readonly nav = NAV;
}

@Component({
  imports: [ArBottomSheet, ArButton, ArIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: 500px">
      <div style="padding: 20px"><button arButton variant="primary" (click)="open.set(true)">Open sheet</button></div>
      <ar-bottom-sheet contained [(open)]="open" title="Choose your dates">
        <button arLeading arIconButton icon="x-mark" label="Close" variant="soft" (click)="open.set(false)"></button>
        <button arTrailing arIconButton icon="pencil-square" label="Edit" variant="soft"></button>
        <!-- WeekStrip (another batch) as its rendered markup -->
        <div class="m-week" role="radiogroup" aria-label="Choose a day">
          @for (d of days; track d.date) {
            <button type="button" role="radio" [attr.aria-checked]="d.date === day() ? 'true' : 'false'" class="m-week__day m-tap" (click)="day.set(d.date)">
              <b>{{ d.date }}</b><span>{{ d.weekday }}</span>
              @if (d.dot) {
                <i aria-label="Has plans"></i>
              }
            </button>
          }
        </div>
        <button arFooter arButton variant="primary" size="lg" block>Continue · 4 nights</button>
      </ar-bottom-sheet>
    </div>
  `,
})
class BottomSheetDemo {
  protected readonly open = signal(true);
  protected readonly day = signal('15');
  protected readonly days = [
    { date: '12', weekday: 'Mon' },
    { date: '13', weekday: 'Tue' },
    { date: '14', weekday: 'Wed' },
    { date: '15', weekday: 'Thu', dot: true },
    { date: '16', weekday: 'Fri' },
    { date: '17', weekday: 'Sat' },
  ];
}

@Component({
  imports: [ArActionSheet, ArButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: 400px">
      <div style="padding: 20px"><button arButton variant="secondary" (click)="open.set(true)">Show actions</button></div>
      <ar-action-sheet contained [(open)]="open" title="Booking K7QX2M" [actions]="actions" />
    </div>
  `,
})
class ActionSheetDemo {
  protected readonly open = signal(true);
  protected readonly actions: ArSheetAction[] = [
    { label: 'Share itinerary', icon: 'arrow-up-on-square' },
    { label: 'Change dates', icon: 'calendar-days' },
    { label: 'Message host', icon: 'chat-bubble-oval-left' },
    { label: 'Cancel booking', icon: 'x-mark', tone: 'danger' },
  ];
}

@Component({
  imports: [ArFab],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row" style="gap: 20px">
      <button arFab ariaLabel="New booking"></button>
      <button arFab tone="brand" icon="magnifying-glass" ariaLabel="Search"></button>
      <button arFab label="Add booking"></button>
    </div>
  `,
})
class FabDemo {}

@Component({
  imports: [ArStickyActionBar, ArButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: 130px">
      <ar-sticky-action-bar>
        <ng-container arSummary><b class="m-title-2">$264</b><span class="m-footnote" style="color: var(--ink-muted)">per night</span></ng-container>
        <button arButton variant="primary" size="lg" iconEnd="paper-airplane">Book now</button>
      </ar-sticky-action-bar>
    </div>
  `,
})
class StickyActionBarDemo {}

@Component({
  imports: [ArHeroHeader, ArIconButton, ArSearchField, ArSectionHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo is-flush" style="height: auto">
      <div>
        <ar-hero-header [image]="img.globe" overlap eyebrow="Good morning" title="Maya Haddad">
          <button arTrailing arIconButton icon="bell" label="Notifications" variant="white" badge></button>
          <ar-search-field placeholder="Where to next?" showFilter />
        </ar-hero-header>
        <div style="padding: 18px 20px 22px"><ar-section-header title="Popular places" action="View all" /></div>
      </div>
    </div>
  `,
})
class HeroHeaderDemo {
  protected readonly img = IMG;
}

@Component({
  imports: [ArGreetingBar, ArIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-col" style="gap: 16px">
      <div class="m-demo is-padded" style="height: auto">
        <ar-greeting-bar title="Hello, Maya!" subtitle="It's time to explore">
          <button arActions arIconButton icon="magnifying-glass" label="Search" variant="surface"></button>
          <button arActions arIconButton icon="bell" label="Notifications" variant="surface" badge></button>
        </ar-greeting-bar>
      </div>
      <div class="m-demo is-padded" style="height: auto">
        <ar-greeting-bar title="Hi, Maya" subtitle="A journey worth taking" name="Maya Haddad" />
      </div>
    </div>
  `,
})
class GreetingBarDemo {}

@Component({
  imports: [ArSearchField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-col" style="gap: 16px">
      <div class="m-demo is-padded" style="height: auto"><ar-search-field placeholder="Search stays" showFilter /></div>
      <div class="m-demo is-padded" style="height: auto"><ar-search-field variant="outline" placeholder="Search places" showFilter /></div>
    </div>
  `,
})
class SearchFieldDemo {}

@Component({
  imports: [ArSectionHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div class="m-stack" style="padding: 20px">
        <ar-section-header title="Popular places" action="View all" />
        <ar-section-header title="Upcoming bookings" action="See all" chevron />
      </div>
    </div>
  `,
})
class SectionHeaderDemo {}

@Component({
  imports: [ArChipScroller],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-col" style="gap: 16px">
      <div class="m-demo" style="height: auto">
        <div style="padding: 12px 20px 0"><ar-chip-scroller label="Sort places" [options]="['Most viewed', 'Nearby', 'Latest', 'Top rated']" /></div>
      </div>
      <div class="m-demo" style="height: auto">
        <div style="padding: 12px 20px 0">
          <ar-chip-scroller tone="brand" showFilter label="Filter flights" [options]="['Airlines', 'Airports', 'Stops', 'Amenities']" />
        </div>
      </div>
    </div>
  `,
})
class ChipScrollerDemo {}

@Component({
  imports: [ArSnapCarousel, ArSnapItem, ArCountUp, ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 16px 20px 0">
        <ar-snap-carousel itemWidth="70%" label="Stats">
          <!-- MiniStatCard (another batch) as its rendered markup -->
          @for (s of stats; track s.title) {
            <div *arSnapItem class="m-ministat">
              <b class="m-ministat__title">{{ s.title }}</b><span class="m-ministat__sub">{{ s.subtitle }}</span>
              <div class="m-ministat__row">
                <b class="m-ministat__value"><ar-count-up [value]="s.value" /></b>
                <span [class]="'m-ministat__delta ' + (s.delta.startsWith('-') ? 'is-down' : 'is-up')">
                  <ar-icon [name]="s.delta.startsWith('-') ? 'arrow-trending-down' : 'arrow-trending-up'" [size]="14" [strokeWidth]="2" />{{ s.delta }}
                </span>
              </div>
            </div>
          }
        </ar-snap-carousel>
      </div>
    </div>
  `,
})
class SnapCarouselDemo {
  protected readonly stats = [
    { title: 'Trips done', subtitle: 'Over the last year', value: '9', delta: '-3.48%' },
    { title: 'Nights booked', subtitle: 'Over the last year', value: '42', delta: '+12%' },
    { title: 'Cancelled', subtitle: 'Over the last year', value: '1', delta: '-50%' },
  ];
}

@Component({
  imports: [ArSwipeRow, ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div class="m-stack" style="padding: 20px">
        <!-- ChecklistRow (another batch) as its rendered markup -->
        <ar-swipe-row [actions]="first">
          <label [class]="a() ? 'm-check m-tap is-done' : 'm-check m-tap'">
            <input type="checkbox" [checked]="a()" (change)="a.set($any($event.target).checked)" />
            <span class="m-check__box" aria-hidden="true"><ar-icon name="check" [size]="16" [strokeWidth]="2.6" /></span>
            <span class="m-check__text">Swipe this row left<small>Reveals Snooze and Delete</small></span>
            <i class="m-check__dot" aria-hidden="true"></i>
          </label>
        </ar-swipe-row>
        <ar-swipe-row [actions]="second">
          <label [class]="b() ? 'm-check m-tap is-done' : 'm-check m-tap'">
            <input type="checkbox" [checked]="b()" (change)="b.set($any($event.target).checked)" />
            <span class="m-check__box" aria-hidden="true"><ar-icon name="check" [size]="16" [strokeWidth]="2.6" /></span>
            <span class="m-check__text">One action works too</span>
            <i class="m-check__dot" aria-hidden="true"></i>
          </label>
        </ar-swipe-row>
      </div>
    </div>
  `,
})
class SwipeRowDemo {
  protected readonly a = signal(false);
  protected readonly b = signal(true);
  protected readonly first: ArSwipeAction[] = [
    { label: 'Snooze', icon: 'clock', tone: 'neutral' },
    { label: 'Delete', icon: 'trash', tone: 'danger' },
  ];
  protected readonly second: ArSwipeAction[] = [{ label: 'Archive', icon: 'archive-box', tone: 'brand' }];
}

@Component({
  imports: [ArMobileSegmented],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-col" style="gap: 16px">
      <div class="m-demo" style="height: auto">
        <div style="padding: 20px"><ar-mobile-segmented label="Trip type" [options]="trip" /></div>
      </div>
      <div class="m-demo" style="height: auto">
        <div style="padding: 20px"><ar-mobile-segmented tone="ink" label="Sections" [options]="['Overview', 'Activity', 'Details']" /></div>
      </div>
    </div>
  `,
})
class MobileSegmentedDemo {
  protected readonly trip = [
    { value: 'round', label: 'Round trip', icon: 'arrows-right-left' },
    { value: 'one', label: 'One way', icon: 'arrow-right' },
  ];
}

@Component({
  imports: [ArFieldTile],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px">
        <div style="grid-column: 1 / -1"><button arFieldTile label="From" value="Dubai · DXB" trailingIcon="plane"></button></div>
        <button arFieldTile label="Departure" icon="calendar-days" value="27 Aug, 2026"></button>
        <button arFieldTile label="Class" icon="star" value="Economy" chevron></button>
        <button arFieldTile label="Passengers" icon="user" placeholder="Add travellers"></button>
      </div>
    </div>
  `,
})
class FieldTileDemo {}

@Component({
  imports: [ArSnapCarousel, ArSnapItem, ArFeatureCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 16px 20px 0">
        <ar-snap-carousel itemWidth="64%" label="Properties">
          <ar-feature-card *arSnapItem icon="home-modern" title="Nordic Pine Lodge" text="Refresh photos and update the winter rates." openable />
          <ar-feature-card *arSnapItem tone="light" icon="building-office-2" title="Minato Penthouse" text="Reply to two reviews from last week." openable />
        </ar-snap-carousel>
      </div>
    </div>
  `,
})
class FeatureCardDemo {}

@Component({
  imports: [ArFlightSearchSheet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo is-canvas" style="height: auto">
      <div style="padding: 16px"><ar-flight-search-sheet /></div>
    </div>
  `,
})
class FlightSearchSheetDemo {}

@Component({
  imports: [ArRouteHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo is-flush" style="height: auto">
      <ar-route-header
        [image]="img.globe"
        title="Select flight"
        [from]="{ code: 'DXB', city: 'Dubai' }"
        [to]="{ code: 'LHR', city: 'London' }"
        meta="27 Aug – 27 Sep · 1 traveller"
      />
    </div>
  `,
})
class RouteHeaderDemo {
  protected readonly img = IMG;
}

export const E_DEMOS: DemoDef[] = [
  { name: 'PhoneFrame', group: 'Mobile navigation', component: PhoneFrameDemo, height: 880, stage: 'padding:20px 0;' },
  { name: 'StatusBar', group: 'Mobile navigation', component: StatusBarDemo, height: 120 },
  { name: 'AppBar', group: 'Mobile navigation', component: AppBarDemo, height: 444 },
  { name: 'TabBar', group: 'Mobile navigation', component: TabBarDemo, height: 396 },
  { name: 'BottomSheet', group: 'Mobile navigation', component: BottomSheetDemo, height: 549 },
  { name: 'ActionSheet', group: 'Mobile navigation', component: ActionSheetDemo, height: 448 },
  { name: 'Fab', group: 'Mobile navigation', component: FabDemo, height: 120 },
  { name: 'StickyActionBar', group: 'Mobile navigation', component: StickyActionBarDemo, height: 178 },
  { name: 'HeroHeader', group: 'Mobile navigation', component: HeroHeaderDemo, height: 380 },
  { name: 'GreetingBar', group: 'Mobile navigation', component: GreetingBarDemo, height: 240 },
  { name: 'SearchField', group: 'Mobile inputs', component: SearchFieldDemo, height: 248 },
  { name: 'SectionHeader', group: 'Mobile inputs', component: SectionHeaderDemo, height: 152 },
  { name: 'ChipScroller', group: 'Mobile inputs', component: ChipScrollerDemo, height: 208 },
  { name: 'SnapCarousel', group: 'Mobile inputs', component: SnapCarouselDemo, height: 300 },
  { name: 'SwipeRow', group: 'Mobile inputs', component: SwipeRowDemo, height: 230 },
  { name: 'MobileSegmented', group: 'Mobile inputs', component: MobileSegmentedDemo, height: 256 },
  { name: 'FieldTile', group: 'Mobile inputs', component: FieldTileDemo, height: 302 },
  { name: 'FeatureCard', group: 'Mobile content', component: FeatureCardDemo, height: 302 },
  { name: 'FlightSearchSheet', group: 'Mobile content', component: FlightSearchSheetDemo, height: 540 },
  { name: 'RouteHeader', group: 'Mobile content', component: RouteHeaderDemo, height: 330 },
];

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  AR_ONBOARDING_COPY,
  ArActivityFeed,
  ArActivityItem,
  ArBadge,
  ArCategoryTile,
  ArChecklistRow,
  ArDetailItem,
  ArDetailList,
  ArDetailValue,
  ArExpandableText,
  ArIcon,
  ArIllustrationCallout,
  ArLetterRow,
  ArMemberPicker,
  ArMiniDestination,
  ArOnboardingFlow,
  ArOnboardingStep,
  ArProfileHeader,
  ArProfileStat,
  ArTimeline,
  ArTimelineItem,
  ArWeekDay,
  ArWeekStrip,
} from '@airiona/ui';
import { DemoDef, IMG } from './demo';

// Every preview body sits in the 390px mobile canvas: <div class="m-demo {extra}" style="height: auto">.

@Component({
  imports: [ArChecklistRow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div class="m-stack" style="padding: 20px">
        <ar-checklist-row text="Restock welcome baskets" [(value)]="restocked" />
        <ar-checklist-row text="Send check-in code to guest" meta="Due 12:00" dotTone="warning" />
        <ar-checklist-row text="Approve cleaning report" dotTone="brand" />
      </div>
    </div>
  `,
})
class ChecklistRowDemo {
  protected readonly restocked = signal(true);
}

@Component({
  imports: [ArWeekStrip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 20px"><ar-week-strip [days]="days" [(value)]="day" /></div>
    </div>
  `,
})
class WeekStripDemo {
  protected readonly day = signal<string | null>('15');
  protected readonly days: ArWeekDay[] = [
    { date: '12', weekday: 'Mon' },
    { date: '13', weekday: 'Tue' },
    { date: '14', weekday: 'Wed' },
    { date: '15', weekday: 'Thu', dot: true },
    { date: '16', weekday: 'Fri' },
    { date: '17', weekday: 'Sat' },
    { date: '18', weekday: 'Sun' },
  ];
}

@Component({
  imports: [ArMemberPicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 20px"><ar-member-picker [people]="people" /></div>
    </div>
  `,
})
class MemberPickerDemo {
  protected readonly people = ['Lina Park', 'Omar Saleh', 'Aiko Tan', 'Jon Berg'];
}

// SnapCarousel belongs to another batch; its DOM is reproduced here as plain markup.
@Component({
  imports: [ArCategoryTile],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 16px 20px 0">
        <div class="m-carousel" style="--item: 42%; --gap: 14px" role="list" aria-label="Categories">
          <div class="m-carousel__item" role="listitem"><button arCategoryTile icon="home-modern" title="Stays" subtitle="3 upcoming" [progress]="0.6" active></button></div>
          <div class="m-carousel__item" role="listitem"><button arCategoryTile icon="paper-airplane" title="Flights" subtitle="2 upcoming" [progress]="0.35"></button></div>
          <div class="m-carousel__item" role="listitem"><button arCategoryTile icon="truck" title="Transfers" subtitle="1 upcoming" [progress]="0.2"></button></div>
        </div>
      </div>
    </div>
  `,
})
class CategoryTileDemo {}

@Component({
  imports: [ArTimeline],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 20px"><ar-timeline [items]="items" /></div>
    </div>
  `,
})
class TimelineDemo {
  protected readonly items: ArTimelineItem[] = [
    { featured: true, title: 'Flight to Tokyo', time: '08:45', text: 'EK 312 · Gate B18 · Seat 4A', people: ['Maya Haddad', 'Omar Saleh', 'Lina Park'], done: true },
    { title: 'Hotel check-in', time: '14:00', text: 'Code arrives at noon' },
    { title: 'Dinner reservation', time: '19:30', text: 'Table for 3, Roppongi' },
  ];
}

@Component({
  imports: [ArExpandableText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 20px">
        <ar-expandable-text [lines]="3">A black timber cabin with floor-to-ceiling glass, set deep in the Bavarian forest. Wake to birdsong, light the wood stove, and walk straight from the deck onto the trails. Fast Wi-Fi, a full kitchen and a sauna for two.</ar-expandable-text>
      </div>
    </div>
  `,
})
class ExpandableTextDemo {}

@Component({
  imports: [ArMiniDestination],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo is-canvas" style="height: auto">
      <div style="padding: 16px 20px 0">
        <div class="m-carousel" style="--item: 58%; --gap: 14px" role="list" aria-label="Destinations">
          <div class="m-carousel__item" role="listitem">
            <ar-mini-destination [image]="img.lisbonRooftops" title="Lisbon" price="$480" duration="7h 30m" dates="12 Mar – 22 Mar" badge="-10%" />
          </div>
          <div class="m-carousel__item" role="listitem">
            <ar-mini-destination [image]="img.tokyoPenthouse" title="Tokyo" price="$950" duration="9h 40m" dates="27 Apr – 22 May" />
          </div>
        </div>
      </div>
    </div>
  `,
})
class MiniDestinationDemo {
  protected readonly img = IMG;
}

@Component({
  imports: [ArIllustrationCallout],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 20px">
        <ar-illustration-callout [image]="image" linkLabel="House rules">Check-in from 15:00. Your code arrives by message at noon on arrival day.</ar-illustration-callout>
      </div>
    </div>
  `,
})
class IllustrationCalloutDemo {
  protected readonly image = IMG.onboarding[2];
}

@Component({
  imports: [ArActivityFeed],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo is-canvas" style="height: auto">
      <div style="padding: 20px"><ar-activity-feed [items]="items" /></div>
    </div>
  `,
})
class ActivityFeedDemo {
  protected readonly items: ArActivityItem[] = [
    { title: 'Host sent the check-in code', time: 'Just now' },
    { title: 'You added photos of the deck', time: 'Yesterday', attachments: ['forest', 'alpine'] },
    { title: 'Payment confirmed · $1,056', time: '2 Oct' },
  ];
}

@Component({
  imports: [ArDetailList, ArDetailValue, ArBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 8px 20px">
        <ar-detail-list [items]="items">
          <ng-template arDetailValue="Reference"><span class="ar-mono">K7QX2M</span></ng-template>
          <ng-template arDetailValue="Status"><ar-badge tone="success" dot size="sm">Confirmed</ar-badge></ng-template>
        </ar-detail-list>
      </div>
    </div>
  `,
})
class DetailListDemo {
  protected readonly items: ArDetailItem[] = [
    { label: 'Dates', value: '15–19 Oct' },
    { label: 'Guests', value: '2 adults' },
    { label: 'Reference' },
    { label: 'Status' },
  ];
}

@Component({
  imports: [ArLetterRow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 8px 20px">
        <ar-letter-row mark="C" title="Completed stays" subtitle="Cabins and villas" meta="3 days ago" />
        <ar-letter-row mark="In" title="In progress" subtitle="Tokyo trip" meta="12:50 PM" />
        <ar-letter-row mark="Td" title="To do" subtitle="Book transfer" meta="2 days ago" />
      </div>
    </div>
  `,
})
class LetterRowDemo {}

@Component({
  imports: [ArProfileHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 20px"><ar-profile-header name="Lina Park" subtitle="Your host · replies in 10 min" [stats]="stats" /></div>
    </div>
  `,
})
class ProfileHeaderDemo {
  protected readonly stats: ArProfileStat[] = [
    { value: '4.9', label: 'Rating' },
    { value: '214', label: 'Reviews' },
    { value: '6 yrs', label: 'Hosting' },
  ];
}

// PhoneFrame (with its StatusBar) belongs to another batch; its DOM is reproduced here as plain markup.
@Component({
  imports: [ArOnboardingFlow, ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; justify-content: center">
      <div class="ar m-phone">
        <div class="m-phone__screen">
          <span class="m-phone__island" aria-hidden="true"></span>
          <div class="m-status" aria-hidden="true">
            <b>9:41</b>
            <span class="m-status__icons">
              <svg width="18" height="12" viewBox="0 0 18 12">
                @for (b of bars; track $index) {
                  <rect [attr.x]="b.x" [attr.y]="b.y" width="3.2" [attr.height]="b.h" rx="1" fill="currentColor" />
                }
              </svg>
              <ar-icon name="wifi" [size]="16" [strokeWidth]="2.2" />
              <svg width="27" height="13" viewBox="0 0 27 13">
                <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity="0.4" />
                <rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor" />
                <rect x="24.5" y="4" width="1.6" height="5" rx="0.8" fill="currentColor" opacity="0.5" />
              </svg>
            </span>
          </div>
          <ar-onboarding-flow [steps]="steps" />
          <span class="m-phone__home" aria-hidden="true"></span>
        </div>
      </div>
    </div>
  `,
})
class OnboardingFlowDemo {
  protected readonly bars = [3, 6, 9, 12].map((h, i) => ({ x: i * 4.6, y: 12 - h, h }));
  protected readonly steps: ArOnboardingStep[] = AR_ONBOARDING_COPY.map((c, i) => ({ image: IMG.onboarding[i], ...c }));
}

export const G_DEMOS: DemoDef[] = [
  { name: 'ChecklistRow', group: 'Mobile inputs', component: ChecklistRowDemo, height: 304 },
  { name: 'WeekStrip', group: 'Mobile inputs', component: WeekStripDemo, height: 182 },
  { name: 'MemberPicker', group: 'Mobile inputs', component: MemberPickerDemo, height: 140 },
  { name: 'CategoryTile', group: 'Mobile content', component: CategoryTileDemo, height: 235 },
  { name: 'Timeline', group: 'Mobile content', component: TimelineDemo, height: 420 },
  { name: 'ExpandableText', group: 'Mobile content', component: ExpandableTextDemo, height: 200 },
  { name: 'MiniDestination', group: 'Mobile content', component: MiniDestinationDemo, height: 266 },
  { name: 'IllustrationCallout', group: 'Mobile content', component: IllustrationCalloutDemo, height: 200 },
  { name: 'ActivityFeed', group: 'Mobile content', component: ActivityFeedDemo, height: 394 },
  { name: 'DetailList', group: 'Mobile content', component: DetailListDemo, height: 261 },
  { name: 'LetterRow', group: 'Mobile content', component: LetterRowDemo, height: 262 },
  { name: 'ProfileHeader', group: 'Mobile content', component: ProfileHeaderDemo, height: 350 },
  { name: 'OnboardingFlow', group: 'Mobile onboarding', component: OnboardingFlowDemo, height: 880, stage: 'padding: 20px 0;' },
];

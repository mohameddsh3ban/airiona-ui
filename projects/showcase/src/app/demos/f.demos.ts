import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ArAgendaCard,
  ArBoardingPass,
  ArCalendarCard,
  ArInfoStatRow,
  ArMiniStatCard,
  ArPeoplePicker,
  ArPlaceCard,
  ArPlaceHero,
  ArPlanList,
  ArQRCode,
  ArTicketCard,
  ArTripRow,
} from '@airiona/ui';
import { DemoDef, IMG } from './demo';

@Component({
  imports: [ArCalendarCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 16px"><ar-calendar-card [year]="2026" [month]="5" [today]="9" [marks]="[2, 5, 14, 20, 24]" /></div>
    </div>
  `,
})
class CalendarCardDemo {}

@Component({
  imports: [ArPeoplePicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 20px"><ar-people-picker [people]="people" /></div>
    </div>
  `,
})
class PeoplePickerDemo {
  protected readonly people = [{ name: 'Omar Saleh' }, { name: 'Maya Haddad' }, { name: 'Lina Park' }];
}

@Component({
  imports: [ArAgendaCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div class="m-stack" style="padding: 20px">
        <ar-agenda-card variant="done" title="Host welcome call" subtitle="Arrival details with your host" />
        <ar-agenda-card
          time="12:00 – 13:00"
          title="Airport transfer"
          subtitle="Driver meets you at gate B"
          [people]="['Omar Saleh', 'Lina Park']"
          [chips]="['Today', '1h']"
          openable
        />
      </div>
    </div>
  `,
})
class AgendaCardDemo {}

@Component({
  imports: [ArPlanList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 20px"><ar-plan-list [items]="items" /></div>
    </div>
  `,
})
class PlanListDemo {
  protected readonly items = [
    { title: 'Land at Haneda, terminal 3', time: '2:00 – 2:30 PM', featured: true, image: IMG.tokyoPenthouse },
    { title: 'Transfer to Minato Penthouse', time: '2:30 – 3:45 PM' },
    { title: 'Check-in and rest', time: '3:45 – 5:00 PM' },
  ];
}

@Component({
  imports: [ArMiniStatCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
        <ar-mini-stat-card title="Trips done" subtitle="Over the last year" value="9" delta="-3.48%" />
        <ar-mini-stat-card title="Nights" subtitle="This year" value="42" delta="+12%" />
      </div>
    </div>
  `,
})
class MiniStatCardDemo {}

@Component({
  imports: [ArTripRow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 8px 20px">
        <ar-trip-row date="August 12, 2026" logo="EK" [from]="{ time: '07:00', city: 'Dubai' }" [to]="{ time: '11:35', city: 'London' }" duration="7h 35min" />
        <ar-trip-row date="September 5, 2026" logo="AF" [from]="{ time: '18:00', city: 'Paris' }" [to]="{ time: '19:40', city: 'Oslo' }" duration="1h 40min" />
      </div>
    </div>
  `,
})
class TripRowDemo {}

@Component({
  imports: [ArTicketCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="width: 360px; max-width: 100%">
      <ar-ticket-card
        badge="Best"
        [from]="{ time: '07:00', code: 'DXB', city: 'Dubai' }"
        [to]="{ time: '11:35', code: 'LHR', city: 'London' }"
        duration="7h 35m"
        cabin="Economy"
        price="$649"
        airline="Emirates"
      />
    </div>
  `,
})
class TicketCardDemo {}

@Component({
  imports: [ArBoardingPass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; justify-content: center; padding: 8px 0">
      <div style="width: 360px; max-width: 100%">
        <ar-boarding-pass
          [artImage]="jet"
          carrier="Airiona"
          cabin="Business"
          date="Thu, 15 Oct"
          time="Boards 08:10"
          [from]="{ code: 'DXB', city: 'Dubai', time: '08:45' }"
          [to]="{ code: 'HND', city: 'Tokyo', time: '23:10' }"
          duration="9h 25m"
          flight="EK 312"
          seat="4A"
          passenger="Maya Haddad"
          zone="2"
          seq="042"
          [details]="details"
        />
      </div>
    </div>
  `,
})
class BoardingPassDemo {
  protected readonly jet = IMG.jet3d;
  protected readonly details = [
    { label: 'Flight', value: 'EK 312' },
    { label: 'Gate', value: 'B18' },
    { label: 'Seat', value: '4A' },
    { label: 'Boarding', value: '08:10' },
    { label: 'Terminal', value: '3' },
    { label: 'Class', value: 'Business' },
  ];
}

@Component({
  imports: [ArQRCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row" style="gap: 24px; align-items: center; flex-wrap: wrap">
      <div style="width: 160px; padding: 10px; border-radius: 22px; background: #fff; box-shadow: var(--shadow-card); color: var(--midnight)">
        <ar-qr-code value="AIRIONA|EK 312|DXB|HND|4A|Maya Haddad" label="Boarding pass code" />
      </div>
      <div style="width: 120px; padding: 10px; border-radius: 20px; background: var(--midnight); color: #fff">
        <ar-qr-code value="https://airiona.com/trips/K7QX2M" color="#ffffff" background="transparent" label="Trip link" />
      </div>
      <div style="width: 96px; color: var(--blue-700)">
        <ar-qr-code value="K7QX2M" label="Booking reference" />
      </div>
    </div>
  `,
})
class QRCodeDemo {}

/** The React preview wraps the cards in SnapCarousel (another batch); this is its markup, inlined. */
@Component({
  imports: [ArPlaceCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 16px 20px 0">
        <div class="m-carousel" style="--item: 72%; --gap: 14px" role="list" aria-label="Places">
          <div class="m-carousel__item" role="listitem">
            <ar-place-card [image]="img.forestCabin" title="Nordic Pine Lodge" region="Bavaria" location="Nuremberg, Germany" rating="4.8" />
          </div>
          <div class="m-carousel__item" role="listitem">
            <ar-place-card [image]="img.alpineLodge" title="Swiss Alps Retreat" region="Valais" location="Zermatt" rating="4.9" [saved]="true" />
          </div>
        </div>
      </div>
    </div>
  `,
})
class PlaceCardDemo {
  protected readonly img = IMG;
}

@Component({
  imports: [ArPlaceHero],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 20px">
        <ar-place-hero [image]="img" title="Nordic Pine Lodge" location="Nuremberg, Germany" price="$264" (back)="noop()" />
      </div>
    </div>
  `,
})
class PlaceHeroDemo {
  protected readonly img = IMG.forestCabin;
  protected noop(): void {
    /* the preview's onBack does nothing */
  }
}

@Component({
  imports: [ArInfoStatRow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-demo" style="height: auto">
      <div style="padding: 20px"><ar-info-stat-row [items]="items" /></div>
    </div>
  `,
})
class InfoStatRowDemo {
  protected readonly items = [
    { icon: 'clock', label: '2h drive' },
    { icon: 'sun', label: '16°C' },
    { icon: 'star', label: '4.8' },
  ];
}

export const F_DEMOS: DemoDef[] = [
  { name: 'CalendarCard', group: 'Mobile inputs', component: CalendarCardDemo, height: 460 },
  { name: 'PeoplePicker', group: 'Mobile inputs', component: PeoplePickerDemo, height: 150 },
  { name: 'AgendaCard', group: 'Mobile content', component: AgendaCardDemo, height: 370 },
  { name: 'PlanList', group: 'Mobile content', component: PlanListDemo, height: 384 },
  { name: 'MiniStatCard', group: 'Mobile content', component: MiniStatCardDemo, height: 242 },
  { name: 'TripRow', group: 'Mobile content', component: TripRowDemo, height: 309 },
  { name: 'TicketCard', group: 'Mobile content', component: TicketCardDemo, height: 300 },
  { name: 'BoardingPass', group: 'Mobile content', component: BoardingPassDemo, height: 720 },
  { name: 'QRCode', group: 'Mobile content', component: QRCodeDemo, height: 260 },
  { name: 'PlaceCard', group: 'Mobile content', component: PlaceCardDemo, height: 403 },
  { name: 'PlaceHero', group: 'Mobile content', component: PlaceHeroDemo, height: 418 },
  { name: 'InfoStatRow', group: 'Mobile content', component: InfoStatRowDemo, height: 100 },
];

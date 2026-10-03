import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  ArAmenity,
  ArAmenityList,
  ArBookingBar,
  ArBookingSearch,
  ArBookingSteps,
  ArCalendar,
  ArCheckbox,
  ArChip,
  ArDayRange,
  ArDestinationCard,
  ArFlightTicket,
  ArNavSection,
  ArQuantityStepper,
  ArRating,
  ArSideNav,
  ArStatBars,
  ArStatCard,
  ArStayCard,
  ArSwitch,
  ArToast,
  ArTopNav,
  ArTopNavLink,
} from '@airiona/ui';
import { DemoDef, IMG } from './demo';

@Component({
  imports: [ArChip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row">
      <button arChip icon="building-office-2" [selected]="true">Hotels</button>
      <button arChip icon="home">Cabins</button>
      <button arChip icon="wifi" [count]="128">Fast Wi-Fi</button>
      <button arChip>Free cancellation</button>
      <button arChip>Pool</button>
    </div>
  `,
})
class ChipDemo {}

@Component({
  imports: [ArCheckbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row" style="gap: 28px">
      <ar-checkbox label="Remember me" [value]="true" />
      <ar-checkbox label="Add travel insurance" />
      <ar-checkbox label="Window seat (sold out)" disabled />
    </div>
  `,
})
class CheckboxDemo {}

@Component({
  imports: [ArSwitch, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-col" style="gap: 18px; padding: 20px; border-radius: 24px; background: var(--surface); max-width: 420px">
      <ar-switch label="Price alerts" description="Email me when this route drops below $480." [(value)]="alerts" />
      <ar-switch label="Instant book" description="Guests can book without waiting for approval." [formControl]="instant" />
    </div>
  `,
})
class SwitchDemo {
  protected readonly alerts = signal(true);
  protected readonly instant = new FormControl(false);
}

@Component({
  imports: [ArQuantityStepper],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="padding: 6px 20px; border-radius: 24px; background: var(--surface); max-width: 400px">
      <ar-quantity-stepper label="Adults" description="Ages 13 or above" [value]="2" [min]="1" />
      <ar-quantity-stepper label="Children" description="Ages 2–12" [value]="1" />
      <ar-quantity-stepper label="Infants" description="Under 2, on lap" [max]="2" />
    </div>
  `,
})
class QuantityStepperDemo {}

@Component({
  imports: [ArCalendar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ar-calendar
      [year]="2026"
      [month]="9"
      [today]="3"
      [(range)]="range"
      [unavailable]="unavailable"
      [lowPrices]="lowPrices"
      [prices]="prices"
    />
  `,
})
class CalendarDemo {
  protected readonly range = signal<ArDayRange | null>([15, 19]);
  protected readonly unavailable = [6, 7, 8, 22, 23];
  protected readonly lowPrices = [12, 27, 28];
  protected readonly prices: Record<number, string> = {
    1: '$142', 2: '$138', 3: '$150', 4: '$170', 5: '$166', 9: '$128', 10: '$132', 11: '$136', 12: '$98', 13: '$128', 14: '$140',
    15: '$156', 16: '$160', 17: '$188', 18: '$194', 19: '$150', 20: '$138', 21: '$136', 24: '$180', 25: '$176', 26: '$128',
    27: '$102', 28: '$99', 29: '$128', 30: '$134', 31: '$190',
  };
}

@Component({
  imports: [ArBookingSearch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ar-booking-search activeField="dep" />`,
})
class BookingSearchDemo {}

@Component({
  imports: [ArRating],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row" style="gap: 28px">
      <ar-rating [value]="4.8" count="2,104" />
      <ar-rating [value]="4.2" [size]="14" />
      <ar-rating [value]="4.9" compact />
    </div>
  `,
})
class RatingDemo {}

@Component({
  imports: [ArToast],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-col" style="gap: 12px">
      <ar-toast tone="success" title="Booking confirmed" time="now" action="View itinerary" dismissible>Scandinavian Forest Cabin · 15–19 Oct. Reference K7QX2M.</ar-toast>
      <ar-toast tone="info" title="Gate change" time="2m" dismissible>SQ 923 now boards from gate B14 at 08:15.</ar-toast>
      <ar-toast tone="danger" title="Payment declined" action="Try another card">Your bank declined the charge of $1,284. No money was taken.</ar-toast>
    </div>
  `,
})
class ToastDemo {}

@Component({
  imports: [ArBookingSteps],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="padding: 24px 16px; border-radius: 24px; background: var(--surface)"><ar-booking-steps [current]="2" /></div>
  `,
})
class BookingStepsDemo {}

@Component({
  imports: [ArFlightTicket],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ar-flight-ticket
      [image]="img"
      [from]="{ code: 'DXB', city: 'Dubai', time: '08:45' }"
      [to]="{ code: 'HND', city: 'Tokyo', time: '23:10' }"
      flight="EK 312"
      duration="9h 25m · Non-stop"
      airline="Emirates"
      cabin="Business"
    />
  `,
})
class FlightTicketDemo {
  protected readonly img = IMG.jetClouds;
}

@Component({
  imports: [ArStayCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row" style="gap: 20px; align-items: stretch; flex-wrap: nowrap">
      <ar-stay-card
        [image]="img.alpineLodge" tint="#16313b" [photos]="3" title="Swiss Alps Retreat" price="$710" unit="/night"
        description="A quiet alpine lodge with a heated pool and views over snow-capped peaks." [tags]="['Luxury stay', '2-night min']"
      />
      <ar-stay-card
        [image]="img.cliffVilla" tint="#14304a" [photos]="4" title="Cliff House Lisbon" price="$480" unit="/night"
        description="Glass-walled villa above the Atlantic, ten minutes from Cascais." [tags]="['Top rated', 'Sea view']" [saved]="true"
      />
      <ar-stay-card
        [image]="img.tokyoPenthouse" tint="#1b1642" [photos]="3" title="Tokyo Penthouse" price="$950" unit="/night"
        description="Rooftop pool and skyline views in the heart of Minato." [tags]="['Cityscape', 'Weekend stay']"
      />
    </div>
  `,
})
class StayCardDemo {
  protected readonly img = IMG;
}

@Component({
  imports: [ArDestinationCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row" style="gap: 20px; flex-wrap: nowrap; align-items: flex-start">
      <ar-destination-card [image]="img.whiteHotel" title="Hotel Tropical Daisy" [rating]="4.7" meta="1.2 km from centre" />
      <ar-destination-card [image]="img.forestCabin" title="Nordic Pine Lodge" [rating]="4.9" meta="Nuremberg, Germany" [saved]="true" />
    </div>
  `,
})
class DestinationCardDemo {
  protected readonly img = IMG;
}

@Component({
  imports: [ArBookingBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-col" style="gap: 20px">
      <div style="border-radius: 24px; overflow: hidden; box-shadow: var(--shadow-card)">
        <ar-booking-bar price="€128" unit="/ night" dates="20–25 May · 2 guests" />
      </div>
      <ar-booking-bar
        floating
        was="$1,420"
        price="$1,284"
        unit="total"
        dates="Incl. taxes and fees"
        cta="Continue to payment"
        ctaVariant="brand"
        arrow="arrow-right"
      />
    </div>
  `,
})
class BookingBarDemo {}

@Component({
  imports: [ArAmenityList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="padding: 16px; border-radius: 24px; background: var(--surface)"><ar-amenity-list [items]="items" /></div>
  `,
})
class AmenityListDemo {
  protected readonly items: ArAmenity[] = [
    { icon: 'users', label: '4 guests' },
    { icon: 'bed', label: '2 bedrooms' },
    { icon: 'bath', label: '1 bathroom' },
    { icon: 'utensils', label: 'Kitchen' },
    { icon: 'wifi', label: 'Wi-Fi' },
    { icon: 'car', label: 'Parking' },
  ];
}

@Component({
  imports: [ArStatCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px">
      <ar-stat-card icon="wallet" label="Revenue this week" value="$84,210" delta="+12.4%" caption="vs last week" openable [bars]="revenue" />
      <ar-stat-card tone="ink" icon="ticket" label="Bookings today" value="1,284" delta="+8%" caption="on 1,189 yesterday" openable [bars]="bookings" />
      <ar-stat-card tone="brand" icon="building-office-2" label="Occupancy" value="87%" delta="-3%" caption="across 42 properties" [bars]="occupancy" />
    </div>
  `,
})
class StatCardDemo {
  protected readonly revenue: ArStatBars = { values: [42, 58, 36, 74, 61, 88, 52], highlight: 5, flag: '$18.2k', axis: ['M', 'T', 'W', 'T', 'F', 'S', 'S'] };
  protected readonly bookings: ArStatBars = { values: [30, 44, 52, 40, 64, 70, 58], highlight: 5, flag: '312', axis: ['8', '10', '12', '14', '16', '18', '20'] };
  protected readonly occupancy: ArStatBars = {
    values: [72, 81, 90, 84, 78, 92, 87],
    highlight: 6,
    flag: '87%',
    axis: ['W36', 'W37', 'W38', 'W39', 'W40', 'W41', 'W42'],
  };
}

@Component({
  imports: [ArSideNav],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="padding: 16px; border-radius: 28px; background: var(--surface); max-width: 280px">
      <ar-side-nav [sections]="sections" [(value)]="page" />
    </div>
  `,
})
class SideNavDemo {
  protected readonly page = signal<string | null>('overview');
  protected readonly sections: ArNavSection[] = [
    {
      title: 'Home',
      items: [
        { value: 'overview', icon: 'squares-2x2', label: 'Overview' },
        { value: 'bookings', icon: 'ticket', label: 'Bookings', count: 12 },
        { value: 'calendar', icon: 'calendar', label: 'Calendar' },
        { value: 'guests', icon: 'users', label: 'Guests' },
      ],
    },
    {
      title: 'Business',
      items: [
        { value: 'listings', icon: 'building-office-2', label: 'Listings' },
        { value: 'payouts', icon: 'wallet', label: 'Payouts' },
        { value: 'reports', icon: 'chart-bar', label: 'Reports' },
      ],
    },
  ];
}

@Component({
  imports: [ArTopNav],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ar-top-nav [links]="links" [user]="{ name: 'Maya Haddad', email: 'maya.haddad@mail.com' }" />`,
})
class TopNavDemo {
  protected readonly links: ArTopNavLink[] = [
    { value: 'f', label: 'Flights' },
    { value: 'h', label: 'Hotels' },
    { value: 's', label: 'Stays' },
    { value: 'c', label: 'Car rental' },
  ];
}

export const A_DEMOS: DemoDef[] = [
  { name: 'Chip', group: 'Actions', component: ChipDemo, height: 100 },
  { name: 'Checkbox', group: 'Forms', component: CheckboxDemo, height: 90 },
  { name: 'Switch', group: 'Forms', component: SwitchDemo, height: 178 },
  { name: 'QuantityStepper', group: 'Forms', component: QuantityStepperDemo, height: 260 },
  { name: 'Calendar', group: 'Forms', component: CalendarDemo, height: 520, stage: 'display:flex;justify-content:center;' },
  { name: 'BookingSearch', group: 'Forms', component: BookingSearchDemo, height: 276, stage: 'padding:32px 24px;' },
  { name: 'Rating', group: 'Status', component: RatingDemo, height: 90 },
  { name: 'Toast', group: 'Status', component: ToastDemo, height: 364, stage: 'max-width:460px;' },
  { name: 'BookingSteps', group: 'Status', component: BookingStepsDemo, height: 152 },
  { name: 'FlightTicket', group: 'Booking', component: FlightTicketDemo, height: 470, stage: 'display:flex;justify-content:center;' },
  { name: 'StayCard', group: 'Booking', component: StayCardDemo, height: 520, stage: 'overflow-x:auto;' },
  { name: 'DestinationCard', group: 'Booking', component: DestinationCardDemo, height: 422, stage: 'overflow-x:auto;' },
  { name: 'BookingBar', group: 'Booking', component: BookingBarDemo, height: 237 },
  { name: 'AmenityList', group: 'Booking', component: AmenityListDemo, height: 172 },
  { name: 'StatCard', group: 'Dashboard', component: StatCardDemo, height: 378 },
  { name: 'SideNav', group: 'Navigation', component: SideNavDemo, height: 500 },
  { name: 'TopNav', group: 'Navigation', component: TopNavDemo, height: 120 },
];

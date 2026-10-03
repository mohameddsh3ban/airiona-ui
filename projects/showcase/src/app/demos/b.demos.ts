import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ArAvatar,
  ArBadge,
  ArBadgeTone,
  ArBulk,
  ArButton,
  ArCell,
  ArDataTable,
  ArDatePicker,
  ArDatePreset,
  ArDateValue,
  ArDialog,
  ArIcon,
  ArIconButton,
  ArMenu,
  ArMenuItem,
  ArSelect,
  ArSelectOption,
  ArTab,
  ArTabPanel,
  ArTableColumn,
  ArTableRow,
  ArTableSort,
  ArTabs,
  ArTooltip,
} from '@airiona/ui';
import { DemoDef } from './demo';

@Component({
  imports: [ArDialog, ArButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ar-dialog
      inline
      tone="danger"
      title="Cancel this booking?"
      description="Scandinavian Forest Cabin · 15–19 Oct · 2 guests. You are inside the free cancellation window."
      [(open)]="open"
    >
      <div class="ar-plate">
        <div class="ar-plate__row">Paid on 2 Oct<b>$640</b></div>
        <div class="ar-plate__row">Cleaning fee (non-refundable)<b>−$128</b></div>
        <div class="ar-plate__row ar-plate__row--total">Refund to Visa ··4242<b>$512</b></div>
      </div>
      <button arButton arFooter variant="secondary">Keep booking</button>
      <button arButton arFooter variant="danger">Cancel and refund $512</button>
    </ar-dialog>
  `,
})
class DialogDemo {
  protected readonly open = signal(true);
}

@Component({
  imports: [ArSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;padding:20px;border-radius:24px;background:var(--surface);align-items:start">
      <ar-select label="Cabin class" [open]="true" value="business" [options]="cabins" />
      <ar-select label="Departure airport" searchable searchPlaceholder="City or airport code" placeholder="Choose an airport" [options]="airports" />
      <div class="ar-col" style="gap: 18px">
        <ar-select label="Currency" variant="sunken" value="usd" [options]="currencies" />
        <ar-select label="Bed type" placeholder="Choose a bed" error="Choose a bed type to continue." [options]="beds" />
      </div>
    </div>
  `,
})
class SelectDemo {
  protected readonly cabins: ArSelectOption[] = [
    { value: 'economy', label: 'Economy', description: '23 kg checked bag', icon: 'briefcase', meta: '$642' },
    { value: 'premium', label: 'Premium economy', description: 'Extra legroom, priority boarding', icon: 'users', meta: '$918' },
    { value: 'business', label: 'Business', description: 'Lie-flat seat, lounge access', icon: 'star', meta: '$2,140' },
    { value: 'first', label: 'First', description: 'Sold out on this flight', icon: 'ticket', disabled: true },
  ];
  protected readonly airports: ArSelectOption[] = [
    { value: 'DXB', label: 'Dubai International', meta: 'DXB' },
    { value: 'AUH', label: 'Abu Dhabi', meta: 'AUH' },
    { value: 'DOH', label: 'Doha Hamad', meta: 'DOH' },
    { value: 'RUH', label: 'Riyadh King Khalid', meta: 'RUH' },
    { value: 'CAI', label: 'Cairo International', meta: 'CAI' },
    { value: 'IST', label: 'Istanbul', meta: 'IST' },
  ];
  protected readonly currencies: ArSelectOption[] = [
    { value: 'usd', label: 'US dollar', meta: 'USD' },
    { value: 'eur', label: 'Euro', meta: 'EUR' },
    { value: 'aed', label: 'UAE dirham', meta: 'AED' },
  ];
  protected readonly beds = ['King', 'Twin', 'Sofa bed'];
}

@Component({
  imports: [ArMenu, ArButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row" style="gap: 24px; align-items: flex-start">
      <ar-menu [open]="true" label="Booking actions" heading="Booking K7QX2M" [items]="items" />
      <div style="margin-left: 220px">
        <ar-menu align="start" [items]="exports">
          <button arButton arTrigger variant="secondary" iconEnd="chevron-down" size="sm">Export</button>
        </ar-menu>
      </div>
    </div>
  `,
})
class MenuDemo {
  protected readonly items: ArMenuItem[] = [
    { label: 'View itinerary', icon: 'ticket' },
    { label: 'Change dates', icon: 'calendar' },
    { label: 'Message guest', icon: 'bell', shortcut: 'M' },
    { divider: true },
    { label: 'Download invoice', icon: 'credit-card' },
    { label: 'Cancel booking', icon: 'x-mark', tone: 'danger' },
  ];
  protected readonly exports: ArMenuItem[] = [
    { label: 'CSV', icon: 'chart-bar' },
    { label: 'PDF report', icon: 'credit-card' },
  ];
}

const STATUS: Record<string, [ArBadgeTone, string]> = {
  confirmed: ['success', 'Confirmed'],
  pending: ['warning', 'Payment pending'],
  cancelled: ['danger', 'Cancelled'],
  'checked-in': ['brand', 'Checked in'],
};

@Component({
  imports: [ArDataTable, ArCell, ArBulk, ArSelect, ArButton, ArAvatar, ArBadge, ArMenu],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ar-data-table
      title="Bookings"
      [rows]="rows"
      [columns]="columns"
      selectable
      searchable
      searchPlaceholder="Search reference or guest"
      [pageSize]="5"
      [(sort)]="sort"
    >
      <ar-select arActions size="sm" value="all" align="end" [options]="properties" />
      <button arButton arActions variant="primary" size="sm" iconStart="plus">New booking</button>
      <ng-template arBulk let-sel>
        <button arButton variant="white" size="sm" iconStart="credit-card">Export {{ sel.length }}</button>
        <button arButton variant="brand" size="sm" iconStart="bell">Message guests</button>
      </ng-template>
      <ng-template arCell="guest" let-row>
        <div class="ar-cell-person">
          <ar-avatar [name]="row.guest" size="sm" />
          <div><b>{{ row.guest }}</b><small>{{ row.email }}</small></div>
        </div>
      </ng-template>
      <ng-template arCell="stay" let-row>
        <div>
          <div style="font-weight: 500">{{ row.stay }}</div>
          <small style="color: var(--ink-subtle); font-size: 13px">{{ row.dates }} · {{ row.nights }} nights</small>
        </div>
      </ng-template>
      <ng-template arCell="status" let-row>
        <ar-badge [tone]="status[row.status][0]" dot>{{ status[row.status][1] }}</ar-badge>
      </ng-template>
      <ng-template arCell="amount" let-row>
        <b style="font-weight: 600">{{ money(row.amount) }}</b>
      </ng-template>
      <ng-template arCell="menu" let-row>
        <ar-menu [label]="'Actions for ' + row.id" [items]="rowMenu" />
      </ng-template>
    </ar-data-table>
  `,
})
class DataTableDemo {
  protected readonly status = STATUS;
  protected readonly sort = signal<ArTableSort | null>({ key: 'amount', dir: 'desc' });
  protected readonly rows: ArTableRow[] = [
    { id: 'K7QX2M', guest: 'Maya Haddad', email: 'maya.haddad@mail.com', stay: 'Scandinavian Forest Cabin', dates: '15–19 Oct', nights: 4, status: 'confirmed', amount: 640 },
    { id: 'P2LM8D', guest: 'Omar Saleh', email: 'omar.s@mail.com', stay: 'Swiss Alps Retreat', dates: '18–20 Oct', nights: 2, status: 'pending', amount: 1420 },
    { id: 'Z9QT4R', guest: 'Lina Park', email: 'lina.park@mail.com', stay: 'Tokyo Penthouse', dates: '21–25 Oct', nights: 4, status: 'confirmed', amount: 3800 },
    { id: 'B4NV1K', guest: 'Daniel Ruiz', email: 'druiz@mail.com', stay: 'Cliff House Lisbon', dates: '9–12 Oct', nights: 3, status: 'cancelled', amount: 1440 },
    { id: 'H3WS7P', guest: 'Aiko Tan', email: 'aiko.tan@mail.com', stay: 'Hotel Tropical Daisy', dates: '1–6 Nov', nights: 5, status: 'checked-in', amount: 990 },
    { id: 'M8KD2Q', guest: 'Sara Ali', email: 'sara.ali@mail.com', stay: 'Nordic Pine Lodge', dates: '3–5 Nov', nights: 2, status: 'confirmed', amount: 412 },
    { id: 'T6RC9L', guest: 'Jon Berg', email: 'jon.berg@mail.com', stay: 'Swiss Alps Retreat', dates: '7–14 Nov', nights: 7, status: 'pending', amount: 4970 },
  ];
  protected readonly columns: ArTableColumn[] = [
    { key: 'id', header: 'Reference', mono: true, sortable: true },
    { key: 'guest', header: 'Guest', sortable: true, searchValue: (r) => `${r['guest']} ${r['email']}` },
    { key: 'stay', header: 'Stay', sortable: true },
    { key: 'status', header: 'Status', sortable: true },
    { key: 'amount', header: 'Amount', align: 'right', numeric: true, sortable: true, defaultDir: 'desc' },
    { key: 'menu', header: 'Actions', srHeader: true, width: 56 },
  ];
  protected readonly properties: ArSelectOption[] = [
    { value: 'all', label: 'All properties' },
    { value: 'cabin', label: 'Cabins' },
    { value: 'hotel', label: 'Hotels' },
  ];
  protected readonly rowMenu: ArMenuItem[] = [
    { label: 'View booking', icon: 'ticket' },
    { label: 'Message guest', icon: 'bell' },
    { divider: true },
    { label: 'Cancel booking', icon: 'x-mark', tone: 'danger' },
  ];
  protected money(n: number): string {
    return '$' + n.toLocaleString('en-US');
  }
}

@Component({
  imports: [ArTabs, ArTabPanel, ArButton, ArBadge, ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-col" style="gap: 28px">
      <div style="padding: 8px 24px 24px; border-radius: 24px; background: var(--surface)">
        <ar-tabs label="Listing sections" value="overview" [tabs]="listing">
          <button arButton arExtra variant="ghost" size="sm" iconStart="arrow-up-on-square">Share</button>
          <ng-template arTabPanel="overview">
            <p class="body" style="margin: 0; color: var(--ink-muted); max-width: 560px">
              A black timber cabin with floor-to-ceiling glass, a wood stove and a deck over the forest floor. 25 minutes from Nuremberg.
            </p>
          </ng-template>
          <ng-template arTabPanel="rooms">
            <ul class="ar-amen" style="list-style: none; margin: 0; padding: 0">
              @for (it of amenities; track it.label) {
                <li class="ar-amen__item"><span class="ar-amen__icon"><ar-icon [name]="it.icon" [size]="22" [strokeWidth]="1.5" /></span>{{ it.label }}</li>
              }
            </ul>
          </ng-template>
          <ng-template arTabPanel="reviews">
            <span class="ar-rating" aria-label="Rated 4.8 out of 5 from 214 reviews">
              <span class="ar-rating__stars" aria-hidden="true">
                @for (s of stars; track s) {
                  <ar-icon name="star" variant="solid" [size]="16" />
                }
              </span>
              <span aria-hidden="true">4.8</span>
              <span class="ar-rating__count" aria-hidden="true">(214)</span>
            </span>
          </ng-template>
        </ar-tabs>
      </div>
      <ar-tabs variant="card" label="Trip type" value="flights" [tabs]="trips">
        <ng-template arTabPanel="flights">
          <div class="ar-row">
            <ar-badge tone="brand" dot>3 trips upcoming</ar-badge>
            <span class="body-sm" style="color: var(--ink-muted)">Next: EK 312 to Tokyo on Thu, 15 Oct</span>
          </div>
        </ng-template>
        <ng-template arTabPanel="stays"><span class="body-sm">Scandinavian Forest Cabin · 15–19 Oct</span></ng-template>
        <ng-template arTabPanel="cars"><span class="body-sm">No car rentals yet.</span></ng-template>
      </ar-tabs>
    </div>
  `,
})
class TabsDemo {
  protected readonly listing: ArTab[] = [
    { value: 'overview', label: 'Overview' },
    { value: 'rooms', label: 'Rooms', count: 2 },
    { value: 'reviews', label: 'Reviews', count: 214 },
    { value: 'policies', label: 'Policies', disabled: true, content: '' },
  ];
  protected readonly trips: ArTab[] = [
    { value: 'flights', label: 'Flights', icon: 'paper-airplane' },
    { value: 'stays', label: 'Stays', icon: 'home-modern' },
    { value: 'cars', label: 'Cars', icon: 'truck' },
  ];
  protected readonly amenities = [
    { icon: 'bed', label: '2 bedrooms' },
    { icon: 'bath', label: '1 bathroom' },
    { icon: 'users', label: '4 guests' },
  ];
  protected readonly stars = [1, 2, 3, 4, 5];
}

@Component({
  imports: [ArTooltip, ArIconButton, ArBadge, ArButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row" style="gap: 28px; padding: 64px 0 24px; justify-content: center">
      <ar-tooltip content="Save to your trips" [open]="true">
        <button arIconButton icon="heart" label="Save"></button>
      </ar-tooltip>
      <ar-tooltip content="Swap origin and destination" kbd="S" placement="bottom">
        <button arIconButton icon="arrows-right-left" label="Swap" variant="soft"></button>
      </ar-tooltip>
      <ar-tooltip title="Free cancellation" content="Full refund until 13 Oct, 12:00 local time." tone="light" placement="right">
        <ar-badge tone="outline" icon="information-circle">Refundable</ar-badge>
      </ar-tooltip>
      <ar-tooltip content="Prices include taxes and fees">
        <button arButton variant="secondary" size="sm" iconStart="receipt-percent">Price breakdown</button>
      </ar-tooltip>
    </div>
  `,
})
class TooltipDemo {}

const PRICE_DAYS = [
  '2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15', '2026-10-16', '2026-10-17', '2026-10-18', '2026-10-19', '2026-10-20',
  '2026-10-21', '2026-10-24', '2026-10-25', '2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31',
  '2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08',
];
const PRICE_VALUES = [128, 98, 140, 156, 160, 188, 194, 150, 138, 136, 180, 176, 128, 102, 99, 128, 134, 190, 172, 128, 118, 112, 120, 158, 196, 176];

@Component({
  imports: [ArDatePicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px;padding:20px;border-radius:24px;background:var(--surface);align-items:start">
      <ar-date-picker
        mode="range"
        variant="tiles"
        [open]="true"
        today="2026-10-03"
        min="2026-10-03"
        [(value)]="stay"
        [unavailable]="unavailable"
        [prices]="prices"
        [lowPrices]="lowPrices"
        [presets]="presets"
      />
      <div class="ar-col" style="gap: 18px">
        <ar-date-picker label="Departure" today="2026-10-03" min="2026-10-03" value="2026-10-15" />
        <ar-date-picker label="Date of birth" placeholder="Choose a date" max="2026-10-03" today="2026-10-03" hint="As printed on your passport." />
      </div>
    </div>
  `,
})
class DatePickerDemo {
  protected readonly stay = signal<ArDateValue>(['2026-10-15', '2026-10-19']);
  protected readonly unavailable = ['2026-10-06', '2026-10-07', '2026-10-08', '2026-10-22', '2026-10-23'];
  protected readonly prices: Record<string, string> = Object.fromEntries(PRICE_DAYS.map((d, i) => [d, '$' + PRICE_VALUES[i]]));
  protected readonly lowPrices = ['2026-10-13', '2026-10-27', '2026-10-28'];
  protected readonly presets: ArDatePreset[] = [
    { label: 'This weekend', value: ['2026-10-09', '2026-10-11'] },
    { label: 'Next week', value: ['2026-10-12', '2026-10-19'] },
    { label: 'Late Oct', value: ['2026-10-26', '2026-10-31'] },
  ];
}

export const B_DEMOS: DemoDef[] = [
  { name: 'Dialog', group: 'Overlays', component: DialogDemo, height: 470, stage: 'padding:0;min-height:100%;' },
  { name: 'Select', group: 'Forms', component: SelectDemo, height: 430 },
  { name: 'Menu', group: 'Overlays', component: MenuDemo, height: 339 },
  { name: 'DataTable', group: 'Data', component: DataTableDemo, height: 757 },
  { name: 'Tabs', group: 'Navigation', component: TabsDemo, height: 400 },
  { name: 'Tooltip', group: 'Overlays', component: TooltipDemo, height: 220 },
  { name: 'DatePicker', group: 'Forms', component: DatePickerDemo, height: 630 },
];

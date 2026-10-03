import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { ArButton } from '../actions/button.component';
import { ArIconButton } from '../actions/icon-button.component';
import { ArIcon } from '../core/icon.component';
import { ArBalanceChart } from '../dashboard/balance-chart.component';
import { ArChannelCard, ArChannelChartData } from '../dashboard/channel-card.component';
import { ArHoldingGroup, ArHoldingsPanel } from '../dashboard/holdings-panel.component';
import { ArPageHeader } from '../dashboard/page-header.component';
import { ArPromptCard } from '../dashboard/prompt-card.component';
import { ArTopNav, ArTopNavLink } from '../navigation/top-nav.component';
import { ArTooltip } from '../overlays/tooltip.component';

export interface ArPilotChannel {
  name: string;
  icon?: string;
  amount: string;
  delta?: string;
  updated?: string;
  chart: ArChannelChartData;
}

export const AR_PILOT_NAV: ArTopNavLink[] = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'bookings', label: 'Bookings', icon: 'ticket' },
  { value: 'revenue', label: 'Revenue', icon: 'chart-pie' },
  { value: 'properties', label: 'Properties', icon: 'building-office-2' },
  { value: 'insights', label: 'Insights', icon: 'light-bulb' },
  { value: 'payouts', label: 'Payouts', icon: 'banknotes' },
];

export const AR_PILOT_CHANNELS: ArPilotChannel[] = [
  { name: 'Direct', icon: 'globe-alt', amount: '$42,850', delta: '+5.9%', updated: '56 sec ago', chart: { type: 'line', data: [30, 34, 31, 36, 33, 58, 44, 46, 41, 45, 40, 44], marker: 11, label: '$25,000', date: 'Fri, Dec 31' } },
  { name: 'Mobile app', icon: 'device-phone-mobile', amount: '$56,200', delta: '+5.9%', updated: '56 sec ago', chart: { type: 'bars', data: [2, 3, 2, 4, 5, 3, 6, 4, 3, 2, 8, 4, 10, 3, 4, 7, 5, 3, 2, 3, 2], highlight: 12, label: '$16,240', date: 'Fri, Dec 31' } },
  { name: 'Partners', icon: 'building-storefront', amount: '$82,250', delta: '+3.9%', updated: '42 sec ago', chart: { type: 'meter', value: 0.14, label: '$20,160', date: 'Fri, Dec 31' } },
  { name: 'Corporate', icon: 'briefcase', amount: '$120,250', delta: '+4.9%', updated: '42 sec ago', chart: { type: 'step', data: [10, 10, 11, 12, 20, 30, 34, 34, 34, 34], marker: 7, label: '$20,160', date: '16 Dec' } },
];

const HOLDINGS: ArHoldingGroup[] = [
  { title: 'Total value', items: [{ name: 'Forest Cabin', sub: 'Nuremberg', symbol: 'F', tone: 'sky', value: '$19.8k' }, { name: 'Tokyo Penthouse', sub: 'Minato', icon: 'building-office-2', tone: 'brand', value: '$14.4k' }] },
  { title: 'Occupancy trend', items: [{ name: 'Forest Cabin', sub: 'Nuremberg', symbol: 'F', tone: 'sky', spark: [2, 3, 2, 5, 9, 6, 4, 2, 3, 2], change: '+6.5%' }, { name: 'Tokyo Penthouse', sub: 'Minato', icon: 'building-office-2', tone: 'brand', spark: [2, 2, 4, 3, 9, 5, 3, 2, 2, 3], change: '+6.5%' }] },
];

/**
 * The operator dashboard reference layout, composed from TopNav, PageHeader, ChannelCard, PromptCard,
 * BalanceChart and HoldingsPanel. Use it as a starting screen or as a recipe to copy.
 *
 * ```html
 * <ar-pilot-dashboard promptImage="art/ai-orb.webp" [(section)]="section" />
 * ```
 */
@Component({
  selector: 'ar-pilot-dashboard',
  imports: [ArTopNav, ArPageHeader, ArChannelCard, ArPromptCard, ArBalanceChart, ArHoldingsPanel, ArButton, ArIconButton, ArIcon, ArTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ar ar-pilot' },
  template: `
    <ar-top-nav variant="underline" [links]="nav()" [(value)]="section" [user]="{ name: userName() }">
      <span arBrand class="ar-pilot__logo" aria-label="Airiona"><ar-icon name="paper-airplane" variant="solid" [size]="18" /></span>
      <ng-container arActions>
        <button arButton variant="primary" size="sm" iconStart="gift">Get $25</button>
        <button arButton variant="secondary" size="sm" iconStart="plus">Account</button>
        <ar-tooltip content="3 new notifications" placement="bottom"><button arIconButton icon="bell" label="Notifications" badge size="sm"></button></ar-tooltip>
      </ng-container>
    </ar-top-nav>
    <ar-page-header title="Revenue" [tabs]="tabs" [(tab)]="view">
      <ng-container arActions>
        <button arButton variant="secondary" iconStart="document-arrow-down">Export report</button>
        <button arButton variant="secondary" iconStart="plus">Add</button>
      </ng-container>
    </ar-page-header>
    <div class="ar-pilot__channels">
      @for (c of channels(); track c.name) {
        <ar-channel-card [name]="c.name" [icon]="c.icon" [amount]="c.amount" [delta]="c.delta" [updated]="c.updated" [chart]="c.chart" />
      }
    </div>
    <div class="ar-pilot__row">
      <ar-prompt-card [image]="promptImage()" question="How did my bookings perform over the last 3 months?" [sources]="sources" />
      <ar-balance-chart label="Total revenue" value="$325,000.69" [yLabels]="['$60k', '$45k', '$30k', '$15k', '$0']" [bars]="bars" [selection]="[3, 8]"
        [tooltip]="{ value: '$42,250.69', date: 'Jan 25, 2026' }" [ranges]="['1W', '1M', '3M', '6M', 'YTD', '1Y']" />
      <ar-holdings-panel title="Top properties" linkLabel="See all properties" [groups]="holdings" />
    </div>
  `,
})
export class ArPilotDashboard {
  readonly nav = input<ArTopNavLink[]>(AR_PILOT_NAV);
  readonly channels = input<ArPilotChannel[]>(AR_PILOT_CHANNELS);
  /** 3D art for the prompt card (Art group: ai-orb). */
  readonly promptImage = input<string | null>();
  readonly userName = input('Maya Haddad');
  readonly section = model<string | null>('revenue');
  readonly view = model<string | null>('overview');

  protected readonly tabs = [{ value: 'overview', label: 'Overview' }, { value: 'property', label: 'By property' }];
  protected readonly sources = [{ icon: 'globe-alt', label: 'Direct' }, { icon: 'device-phone-mobile', label: 'Mobile app' }, { icon: 'building-storefront', label: 'Partners' }];
  protected readonly bars = [40, 52, 46, 70, 58, 74, 62, 80, 55, 72, 68, 44];
  protected readonly holdings = HOLDINGS;
}

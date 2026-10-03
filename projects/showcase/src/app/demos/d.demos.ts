import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ArAssistantCard,
  ArBalanceChart,
  ArButton,
  ArChannelCard,
  ArChannelChartData,
  ArChargingTile,
  ArDateChip,
  ArEfficiencyChart,
  ArGanttTask,
  ArHoldingGroup,
  ArHoldingsPanel,
  ArIconButton,
  ArNotch,
  ArPageHeader,
  ArPromptCard,
  ArPromptSource,
  ArRideTile,
  ArRoadmapGantt,
  ArTotalTimeTile,
  ArTripStat,
  ArTripSummaryTile,
} from '@airiona/ui';
import { DemoDef, IMG } from './demo';

@Component({
  imports: [ArRideTile],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="width: 220px">
      <ar-ride-tile [image]="img" provider="Transfer" eta="2" title="Meet at the pickup point" vehicle="Mercedes-Benz E" plate="S00121" />
    </div>
  `,
})
class RideTileDemo {
  protected readonly img = IMG.car3d;
}

@Component({
  imports: [ArChargingTile],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div style="width: 220px"><ar-charging-tile [percent]="68" timeLeft="37 min left" /></div>`,
})
class ChargingTileDemo {}

@Component({
  imports: [ArTripSummaryTile],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="max-width: 320px">
      <ar-trip-summary-tile [image]="img" title="Electric scooter" date="12 Aug 2026" [stats]="stats" />
    </div>
  `,
})
class TripSummaryTileDemo {
  protected readonly img = IMG.scooter3d;
  protected readonly stats: ArTripStat[] = [
    { label: 'Distance', value: '3.2', unit: 'km' },
    { label: 'Avg. speed', value: '18.4', unit: 'km/h' },
    { label: 'Energy', value: '134', unit: 'Wh' },
  ];
}

@Component({
  imports: [ArRoadmapGantt],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="max-width: 520px">
      <ar-roadmap-gantt title="Property launch" [days]="days" [today]="3" [tasks]="tasks" />
    </div>
  `,
})
class RoadmapGanttDemo {
  protected readonly days = ['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15', 'Fri 16'];
  protected readonly tasks: ArGanttTask[] = [
    { label: 'Photos', start: 0, end: 2, progress: 1, tone: 'done', people: ['Lina Park', 'Omar Saleh'] },
    { label: 'Pricing', start: 1.5, end: 5, progress: 0.59, tone: 'muted', people: ['Aiko Tan'] },
    { label: 'Listing copy', start: 0, end: 5, progress: 0.75, tone: 'brand', people: ['Maya Haddad', 'Jon Berg', 'Sara Ali'] },
  ];
}

@Component({
  imports: [ArDateChip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row">
      <ar-date-chip day="19" weekday="Tue" month="January" />
      <ar-date-chip day="3" weekday="Sat" month="October" />
    </div>
  `,
})
class DateChipDemo {}

@Component({
  imports: [ArEfficiencyChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div style="width: 260px"><ar-efficiency-chart title="Occupancy" period="January" delta="+40%" /></div>`,
})
class EfficiencyChartDemo {}

@Component({
  imports: [ArTotalTimeTile],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div style="width: 240px"><ar-total-time-tile icon="moon" label="Total nights booked" value="645" unit="nights" /></div>`,
})
class TotalTimeTileDemo {}

@Component({
  imports: [ArAssistantCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div style="width: 260px"><ar-assistant-card [image]="img" /></div>`,
})
class AssistantCardDemo {
  protected readonly img = IMG.aiOrb;
}

@Component({
  imports: [ArNotch, ArIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row" style="gap: 16px">
      <div class="ar-w ar-w--brand" style="width: 240px; height: 160px">
        <ar-notch corner="tr"><button arIconButton icon="bell" variant="white" label="Notifications"></button></ar-notch>
        <b style="margin-top: auto; font: 600 20px/24px var(--font-display)">Top-right notch</b>
      </div>
      <div class="ar-w ar-w--dark" style="width: 240px; height: 160px">
        <ar-notch corner="tl"><button arIconButton icon="arrow-up-right" variant="brand" label="Open"></button></ar-notch>
        <b style="margin-top: auto; font: 600 20px/24px var(--font-display)">Top-left notch</b>
      </div>
    </div>
  `,
})
class NotchDemo {}

@Component({
  imports: [ArChannelCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 14px">
      <ar-channel-card name="Direct" icon="globe-alt" amount="$42,850" delta="+5.9%" updated="56 sec ago" [chart]="line" />
      <ar-channel-card name="Mobile app" icon="device-phone-mobile" amount="$56,200" delta="+5.9%" updated="56 sec ago" [chart]="bars" />
      <ar-channel-card name="Partners" icon="building-storefront" amount="$82,250" delta="+3.9%" updated="42 sec ago" [chart]="meter" />
      <ar-channel-card name="Corporate" icon="briefcase" amount="$120,250" delta="+4.9%" updated="42 sec ago" [chart]="step" />
    </div>
  `,
})
class ChannelCardDemo {
  protected readonly line: ArChannelChartData = { type: 'line', data: [30, 34, 31, 36, 33, 58, 44, 46, 41, 45, 40, 44], marker: 11, label: '$25,000', date: 'Fri, Dec 31' };
  protected readonly bars: ArChannelChartData = { type: 'bars', data: [2, 3, 2, 4, 5, 3, 6, 4, 3, 2, 8, 4, 10, 3, 4, 7, 5, 3, 2, 3, 2], highlight: 12, label: '$16,240', date: 'Fri, Dec 31' };
  protected readonly meter: ArChannelChartData = { type: 'meter', value: 0.14, label: '$20,160', date: 'Fri, Dec 31' };
  protected readonly step: ArChannelChartData = { type: 'step', data: [10, 10, 11, 12, 20, 30, 34, 34, 34, 34], marker: 7, label: '$20,160', date: '16 Dec' };
}

@Component({
  imports: [ArPromptCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="width: 280px">
      <ar-prompt-card [image]="img" question="How did my bookings perform over the last 3 months?" [sources]="sources" />
    </div>
  `,
})
class PromptCardDemo {
  protected readonly img = IMG.aiOrb;
  protected readonly sources: ArPromptSource[] = [
    { icon: 'globe-alt', label: 'Direct' },
    { icon: 'device-phone-mobile', label: 'Mobile app' },
    { icon: 'building-storefront', label: 'Partners' },
  ];
}

@Component({
  imports: [ArBalanceChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ar-balance-chart label="Total revenue" value="$325,000.69" [yLabels]="yLabels" [bars]="bars" [selection]="[3, 8]"
      [tooltip]="{ value: '$42,250.69', date: 'Jan 25, 2026' }" [(range)]="range" />
  `,
})
class BalanceChartDemo {
  protected readonly range = signal<string | null>(null);
  protected readonly yLabels = ['$60k', '$45k', '$30k', '$15k', '$0'];
  protected readonly bars = [40, 52, 46, 70, 58, 74, 62, 80, 55, 72, 68, 44];
}

@Component({
  imports: [ArHoldingsPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="max-width: 340px">
      <ar-holdings-panel title="Top properties" linkLabel="See all properties" [groups]="groups" (link)="$event.preventDefault()" />
    </div>
  `,
})
class HoldingsPanelDemo {
  protected readonly groups: ArHoldingGroup[] = [
    {
      title: 'Total value',
      items: [
        { name: 'Forest Cabin', sub: 'Nuremberg', symbol: 'F', tone: 'sky', value: '$19.8k' },
        { name: 'Tokyo Penthouse', sub: 'Minato', icon: 'building-office-2', tone: 'brand', value: '$14.4k' },
      ],
    },
    {
      title: 'Occupancy trend',
      items: [
        { name: 'Forest Cabin', sub: 'Nuremberg', symbol: 'F', tone: 'sky', spark: [2, 3, 2, 5, 9, 6, 4, 2, 3, 2], change: '+6.5%' },
        { name: 'Tokyo Penthouse', sub: 'Minato', icon: 'building-office-2', tone: 'brand', spark: [2, 2, 4, 3, 9, 5, 3, 2, 2, 3], change: '+6.5%' },
      ],
    },
  ];
}

@Component({
  imports: [ArPageHeader, ArButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ar-page-header title="Revenue" [tabs]="tabs" [(tab)]="tab">
      <button arButton arActions variant="secondary" iconStart="document-arrow-down">Export report</button>
      <button arButton arActions variant="secondary" iconStart="plus">Add</button>
    </ar-page-header>
  `,
})
class PageHeaderDemo {
  protected readonly tab = signal<string | null>('overview');
  protected readonly tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'property', label: 'By property' },
  ];
}

export const D_DEMOS: DemoDef[] = [
  { name: 'RideTile', group: 'Widgets', component: RideTileDemo, height: 270 },
  { name: 'ChargingTile', group: 'Widgets', component: ChargingTileDemo, height: 216 },
  { name: 'TripSummaryTile', group: 'Widgets', component: TripSummaryTileDemo, height: 219 },
  { name: 'RoadmapGantt', group: 'Workspace', component: RoadmapGanttDemo, height: 414 },
  { name: 'DateChip', group: 'Workspace', component: DateChipDemo, height: 90 },
  { name: 'EfficiencyChart', group: 'Workspace', component: EfficiencyChartDemo, height: 279 },
  { name: 'TotalTimeTile', group: 'Workspace', component: TotalTimeTileDemo, height: 216 },
  { name: 'AssistantCard', group: 'Workspace', component: AssistantCardDemo, height: 224 },
  { name: 'Notch', group: 'Workspace', component: NotchDemo, height: 208 },
  { name: 'ChannelCard', group: 'Dashboard', component: ChannelCardDemo, height: 518 },
  { name: 'PromptCard', group: 'Dashboard', component: PromptCardDemo, height: 481 },
  { name: 'BalanceChart', group: 'Dashboard', component: BalanceChartDemo, height: 436 },
  { name: 'HoldingsPanel', group: 'Dashboard', component: HoldingsPanelDemo, height: 432 },
  { name: 'PageHeader', group: 'Navigation', component: PageHeaderDemo, height: 110 },
];

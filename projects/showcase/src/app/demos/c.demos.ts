import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ArAbsenceCard,
  ArActivityCalendar,
  ArActivityState,
  ArAnalogClock,
  ArArrivalTile,
  ArBarDatum,
  ArBatteryTile,
  ArGateTile,
  ArGaugeSegment,
  ArHabitTile,
  ArHeatmap,
  ArLeaderboard,
  ArLeaderboardItem,
  ArMediaPlayer,
  ArMetricTile,
  ArPillBarChart,
  ArRatingBreakdown,
  ArRatingSegment,
  ArRecordingTile,
  ArRingStatCard,
  ArSegmentGauge,
  ArStripeDistribution,
  ArStripeGroup,
  ArToggleTile,
  ArVoiceRecorder,
  ArWorldClock,
} from '@airiona/ui';
import { DemoDef } from './demo';

const CANCEL_GROUPS: ArStripeGroup[] = [
  { label: 'Guest request', count: 45, bars: 6 },
  { label: 'Weather', count: 165, bars: 13 },
  { label: 'Other', count: 65, bars: 7 },
];
const HEAT_ROWS = ['1%', '2%', '3%', '4%', '>5%'];
const HEAT_COLS = ['M', 'T', 'W', 'T', 'F'];
const HEAT_VALUES = [
  [4, 2, 3, 4, 3],
  [2, 2, 3, 2, 4],
  [3, 4, 4, 3, 2],
  [2, 2, 2, 0, 1],
  [1, 1, 1, 1, 1],
];

/* ---------- Analytics ---------- */

@Component({
  imports: [ArMetricTile],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px">
      <ar-metric-tile label="Guests today" value="327" caption="New arrivals" delta="+4.7%" icon="user" />
      <ar-metric-tile label="Staff on shift" value="75" caption="Housekeeping" delta="-1.2%" icon="lifebuoy" />
      <ar-metric-tile
        label="Status breakdown"
        value="1,350"
        caption="Bookings"
        icon="user-group"
        [split]="[{ value: '87', label: 'Confirmed', tone: 'success' }, { value: '46', label: 'Pending', tone: 'warning' }]"
      />
    </div>
  `,
})
class MetricTileDemo {}

@Component({
  imports: [ArPillBarChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ar-pill-bar-chart eyebrow="Bookings by stay type" title="Track your stays" unit="bookings" openable [highlight]="4" [data]="data" />`,
})
class PillBarChartDemo {
  protected readonly data: ArBarDatum[] = [
    { label: 'Cabins', value: 5 },
    { label: 'Villas', value: 8 },
    { label: 'Hotels', value: 11 },
    { label: 'Lofts', value: 9 },
    { label: 'Suites', value: 12 },
    { label: 'Hostels', value: 7 },
    { label: 'Camps', value: 10 },
  ];
}

@Component({
  imports: [ArSegmentGauge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ar-segment-gauge eyebrow="Booking mix" title="Rate status" openable total="800" totalLabel="Total bookings" [segments]="segments" />`,
})
class SegmentGaugeDemo {
  protected readonly segments: ArGaugeSegment[] = [
    { label: 'Flexible', value: 80, display: '80%' },
    { label: 'Non-refundable', value: 11.5, display: '11.5%' },
    { label: 'Corporate', value: 8.5, display: '8.5%' },
  ];
}

@Component({
  imports: [ArRatingBreakdown],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="max-width: 380px">
      <ar-rating-breakdown
        eyebrow="Guest review results"
        title="Metrics rating"
        openable
        score="7.8"
        scoreLabel="Average rating"
        [segments]="segments"
        note="Highlight stays needing improvement with tips from top hosts."
      />
    </div>
  `,
})
class RatingBreakdownDemo {
  protected readonly segments: ArRatingSegment[] = [
    { label: 'Excellent', value: 38 },
    { label: 'Good', value: 25 },
    { label: 'Fair', value: 18 },
    { label: 'Improved', value: 8 },
  ];
}

@Component({
  imports: [ArLeaderboard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="max-width: 380px">
      <ar-leaderboard eyebrow="Top host score" title="Top 5 rating" openable [items]="items" />
    </div>
  `,
})
class LeaderboardDemo {
  protected readonly items: ArLeaderboardItem[] = [
    { name: 'Alice Johnson', role: 'Forest Cabin host', score: '8.5', label: 'Excellent', ring: 'blue-300' },
    { name: 'Elisabeth Kim Tjow', role: 'Guest relations', roleTone: 'success', score: '7.8', label: 'Good', ring: 'sky-200' },
    { name: 'Mark Lee', role: 'Concierge', roleTone: 'blue-700', score: '7.8', label: 'Good', ring: 'blue-500' },
    { name: 'Theodorus Ronald', role: 'Penthouse host', score: '7.2', label: 'Good', ring: 'blue-500' },
    { name: 'Bessie Cooper', role: 'Villa host', roleTone: 'warning', score: '7.2', label: 'Good', ring: 'blue-300' },
  ];
}

@Component({
  imports: [ArStripeDistribution],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-w" style="max-width: 560px">
      <ar-stripe-distribution unit="cancellations" [groups]="groups" />
    </div>
  `,
})
class StripeDistributionDemo {
  protected readonly groups = CANCEL_GROUPS;
}

@Component({
  imports: [ArHeatmap],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-w" style="max-width: 360px">
      <ar-heatmap label="Cancellation rate by weekday" [rows]="rows" [cols]="cols" [highlight]="[3, 3]" [values]="values" />
    </div>
  `,
})
class HeatmapDemo {
  protected readonly rows = HEAT_ROWS;
  protected readonly cols = HEAT_COLS;
  protected readonly values = HEAT_VALUES;
}

@Component({
  imports: [ArAbsenceCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ar-absence-card
      eyebrow="Identify cancellation causes"
      title="Cancellations"
      info="Monitor the share, total and trend of cancelled stays."
      unit="stays"
      [groups]="groups"
      [heatRows]="rows"
      [heatCols]="cols"
      [heatHighlight]="[3, 3]"
      heatLabel="Cancellation rate by weekday"
      [heat]="values"
    />
  `,
})
class AbsenceCardDemo {
  protected readonly groups = CANCEL_GROUPS;
  protected readonly rows = HEAT_ROWS;
  protected readonly cols = HEAT_COLS;
  protected readonly values = HEAT_VALUES;
}

/* ---------- Widgets ---------- */

@Component({
  imports: [ArToggleTile],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row" style="gap: 16px; align-items: stretch">
      <div style="width: 200px"><ar-toggle-tile title="Wi-Fi" status="On · Airiona_Guest" icon="wifi" /></div>
      <div style="width: 200px"><ar-toggle-tile title="Do not disturb" status="Until 08:00" offStatus="Off" icon="moon" [(value)]="dnd" /></div>
    </div>
  `,
})
class ToggleTileDemo {
  protected readonly dnd = signal(false);
}

@Component({
  imports: [ArArrivalTile],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="width: 220px">
      <ar-arrival-tile eta="53min" [from]="{ code: 'DXB', city: 'Dubai', time: '14:30' }" [to]="{ code: 'IST', city: 'Istanbul', time: '16:30' }" [progress]="0.6" />
    </div>
  `,
})
class ArrivalTileDemo {}

@Component({
  imports: [ArRingStatCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px">
      <ar-ring-stat-card
        value="2.8"
        unit="km"
        [ring]="{ value: 0.64, label: '64', unit: 'km' }"
        [stats]="[{ label: 'Duration', value: '08:21' }, { label: 'Avg. speed', value: '18.4 km/h' }, { label: 'Calories', value: '134 kcal' }]"
      />
      <ar-ring-stat-card
        tone="dark"
        icon="arrow-turn-left-up"
        value="300"
        unit="m"
        [ring]="{ value: 0.64, label: '64', unit: 'km' }"
        [stats]="[{ label: 'ETA', value: '10:21' }, { label: 'Time left', value: '18 min' }, { label: 'Distance left', value: '6.4 km' }]"
      />
    </div>
  `,
})
class RingStatCardDemo {}

@Component({
  imports: [ArHabitTile],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="width: 200px">
      <ar-habit-tile eyebrow="Habits" title="Daily check-in" caption="10m left" [progress]="0.72" icon="pencil-square" />
    </div>
  `,
})
class HabitTileDemo {}

@Component({
  imports: [ArGateTile],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="width: 200px">
      <ar-gate-tile code="B18" title="Gate open" caption="Boarding closes in 26 min" />
    </div>
  `,
})
class GateTileDemo {}

@Component({
  imports: [ArVoiceRecorder],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="width: 220px">
      <ar-voice-recorder title="Voice note" date="12.08.26" time="01:12:25" [position]="0.62" />
    </div>
  `,
})
class VoiceRecorderDemo {}

@Component({
  imports: [ArBatteryTile],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="width: 200px">
      <ar-battery-tile [percent]="57" caption="~ 5 hours left" label="Key card battery" />
    </div>
  `,
})
class BatteryTileDemo {}

@Component({
  imports: [ArMediaPlayer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="max-width: 320px">
      <ar-media-player title="Lounge at dusk" artist="Airiona Sessions" scene="dusk" elapsed="0:18" remaining="-2:24" [progress]="0.3" />
    </div>
  `,
})
class MediaPlayerDemo {}

@Component({
  imports: [ArAnalogClock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row" style="gap: 16px">
      <div style="width: 200px"><ar-analog-clock time="07:02:46" /></div>
      <div style="width: 200px"><ar-analog-clock [live]="true" /></div>
    </div>
  `,
})
class AnalogClockDemo {}

@Component({
  imports: [ArRecordingTile],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="width: 200px">
      <ar-recording-tile title="Lobby camera" status="Recording" elapsed="00:34:20" />
    </div>
  `,
})
class RecordingTileDemo {}

@Component({
  imports: [ArActivityCalendar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="max-width: 380px">
      <ar-activity-calendar title="Daily activity" [year]="2026" [month]="10" [days]="days" />
    </div>
  `,
})
class ActivityCalendarDemo {
  protected readonly days: Record<number, ArActivityState> = { 2: 'goal', 3: 'partial', 4: 'partial', 5: 'goal', 6: 'goal', 7: 'goal', 8: 'today' };
}

@Component({
  imports: [ArWorldClock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ar-row" style="gap: 16px; align-items: stretch">
      <div style="width: 200px">
        <ar-world-clock city="Shibuya, Tokyo" zone="GMT +9 · Aug 12" period="PM" time="10:25" diff="+4H" [dayProgress]="0.66" />
      </div>
      <div style="width: 200px">
        <ar-world-clock tone="dark" city="Lisbon" zone="GMT +1 · Aug 12" period="AM" time="02:25" diff="-4H" [dayProgress]="0.42" />
      </div>
    </div>
  `,
})
class WorldClockDemo {}

export const C_DEMOS: DemoDef[] = [
  { name: 'MetricTile', group: 'Analytics', component: MetricTileDemo, height: 268 },
  { name: 'PillBarChart', group: 'Analytics', component: PillBarChartDemo, height: 392 },
  { name: 'SegmentGauge', group: 'Analytics', component: SegmentGaugeDemo, height: 384 },
  { name: 'RatingBreakdown', group: 'Analytics', component: RatingBreakdownDemo, height: 352 },
  { name: 'Leaderboard', group: 'Analytics', component: LeaderboardDemo, height: 439 },
  { name: 'StripeDistribution', group: 'Analytics', component: StripeDistributionDemo, height: 230 },
  { name: 'Heatmap', group: 'Analytics', component: HeatmapDemo, height: 343 },
  { name: 'AbsenceCard', group: 'Analytics', component: AbsenceCardDemo, height: 334 },
  { name: 'ToggleTile', group: 'Widgets', component: ToggleTileDemo, height: 228 },
  { name: 'ArrivalTile', group: 'Widgets', component: ArrivalTileDemo, height: 216 },
  { name: 'RingStatCard', group: 'Widgets', component: RingStatCardDemo, height: 221 },
  { name: 'HabitTile', group: 'Widgets', component: HabitTileDemo, height: 216 },
  { name: 'GateTile', group: 'Widgets', component: GateTileDemo, height: 216 },
  { name: 'VoiceRecorder', group: 'Widgets', component: VoiceRecorderDemo, height: 248 },
  { name: 'BatteryTile', group: 'Widgets', component: BatteryTileDemo, height: 240 },
  { name: 'MediaPlayer', group: 'Widgets', component: MediaPlayerDemo, height: 238 },
  { name: 'AnalogClock', group: 'Widgets', component: AnalogClockDemo, height: 248 },
  { name: 'RecordingTile', group: 'Widgets', component: RecordingTileDemo, height: 224 },
  { name: 'ActivityCalendar', group: 'Widgets', component: ActivityCalendarDemo, height: 499 },
  { name: 'WorldClock', group: 'Widgets', component: WorldClockDemo, height: 218 },
];

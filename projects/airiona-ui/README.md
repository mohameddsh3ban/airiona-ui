# @airiona/ui

The Airiona design system for **Angular 20, 21 and 22**: standalone, signal-based, `OnPush` components that render the exact markup of the Airiona reference, plus tokens, 648 Heroicons and the full motion layer.

- Standalone components, no NgModules. Import only what you use.
- Signals throughout: `input()`, `model()`, `output()`. Works **zoneless** and with zone.js.
- Every form control is a `ControlValueAccessor`: `[(ngModel)]`, `formControlName` and `[(value)]` all work.
- SSR-safe: no `window`/`document` access outside the browser.
- One global stylesheet. No per-component CSS to configure, so it composes with Tailwind or your own styles.

## Install

```bash
ng add @airiona/ui
```

Until the package is on your registry, install the tarball built by `npm run build:lib && npm pack ./dist/airiona-ui`:

```bash
ng add ./airiona-ui-1.6.0.tgz
```

Pass `--icons=core` to skip the full Heroicons set (the components then use only the ~70 icons they need).

`ng add` does two things, which you can also do by hand:

1. Adds the stylesheet to `angular.json` → `projects.<app>.architect.build.options.styles`:
   ```json
   "styles": ["node_modules/@airiona/ui/styles/airiona.css", "src/styles.css"]
   ```
2. Adds the provider to `app.config.ts`:
   ```ts
   import { provideAiriona } from '@airiona/ui';
   import { AR_ALL_ICONS } from '@airiona/ui/icons';

   export const appConfig: ApplicationConfig = {
     providers: [provideAiriona({ icons: [AR_ALL_ICONS] })],
   };
   ```

Fonts (Bricolage Grotesque, Geist, Geist Mono) load from Google Fonts through the stylesheet. To self-host them, declare the same `@font-face` families in your own stylesheet; the Google Fonts request can then be blocked or removed.

## Configure

```ts
provideAiriona({
  icons: [AR_ALL_ICONS],          // or omit to keep only the ~70 icons the components use
  assetsUrl: '/assets/airiona/',  // prefix for relative `image` inputs
  theme: { 'blue-500': '#1f6bff' },// token overrides, applied as CSS variables
  motion: 'system',               // 'reduce' turns all motion off
  haptics: true,                  // 8ms vibration on mobile toggles (where allowed)
  spotlight: true,                // soft light following the mouse over cards
});
```

| Option | Default | What it does |
| --- | --- | --- |
| `icons` | `[]` | Extra icon sets. `AR_ALL_ICONS` adds every Heroicon; pass `{ outline: { name: [paths] } }` for your own. |
| `assetsUrl` | `''` | Prepended to relative image paths (`photos/cabin.webp`). Absolute URLs pass through. |
| `theme` | `{}` | Token overrides set on `<html>` at startup. For SSR, override the same CSS variables in your stylesheet instead. |
| `motion` | `'system'` | `'system'` follows `prefers-reduced-motion`; `'reduce'` disables motion everywhere. |
| `haptics` | `true` | Light vibration on mobile selections, only inside a user gesture. |
| `spotlight` | `true` | Cursor spotlight on cards (mouse only). |

## Theming

Every colour, radius, space, shadow, duration and curve is a CSS variable from `tokens.css`. Override any of them globally or per area:

```css
:root { --blue-500: #1f6bff; --radius-xl: 28px; }
.partner-portal { --action: #0b1440; }
```

The same values are available in TypeScript for charts and canvas work: `AR_TOKENS.color['blue-500']`, `AR_TOKENS.duration['duration-base']`, `arVar('blue-500')`.

## Use

```ts
import { ArButton, ArTextField, ArSegmentedControl } from '@airiona/ui';

@Component({
  imports: [ArButton, ArTextField, ArSegmentedControl, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="search()">
      <ar-segmented-control label="Trip" [options]="['One way', 'Round trip']" formControlName="trip" />
      <ar-text-field label="From" iconStart="paper-airplane" formControlName="from" />
      <button arButton type="submit" arrow [loading]="searching()">Search flights</button>
    </form>
  `,
})
```

Conventions:

- **Native elements stay native.** Buttons are attributes on `<button>`/`<a>`: `<button arButton>`, `<a arButton routerLink="/trips">`, `<button arIconButton icon="bell" label="Notifications">`.
- **Two-way state is `model()`.** `[(value)]`, `[(open)]`, `[(selected)]`; the matching `(valueChange)` output fires on user changes.
- **Rich slots use attributes.** `<ar-dialog><p>Body</p><button arButton arFooter>Done</button></ar-dialog>`.
- **Custom cells and panels use templates.** `<ng-template arCell="guest" let-row>…</ng-template>`.
- **Outputs never shadow DOM events.** `(press)`, `(closed)`, `(action)`, `(back)`.

## Motion

Motion is CSS-driven and token-based, so it costs nothing in JS. Exit animations (dialogs, sheets), the sliding indicators, count-ups and screen push/pop are handled inside the components. Use `ArScreenStack` for mobile push/pop and `ArRouteTransition` around `<router-outlet>` for page transitions:

```ts
private readonly router = inject(Router);
protected readonly url = toSignal(
  this.router.events.pipe(filter((e) => e instanceof NavigationEnd), map(() => this.router.url)),
  { initialValue: this.router.url },
);
```
```html
<ar-route-transition [routeKey]="url()"><router-outlet /></ar-route-transition>
```

Variants: `fade-through` (top-level destinations), `shared-x` (ordered steps; `direction="back"` plays from the left), `shared-y` (detail pages), `scale` (full-screen viewers). With `motion: 'reduce'` or the OS setting, everything settles instantly and still works.

## Server rendering and zoneless

Components touch `window` and `document` only in the browser, so they render on the server and hydrate with `provideClientHydration()` (tested: prerendered booking page, 31 components hydrated, 0 skipped, no mismatches). They update through signals only, so zoneless apps (the Angular 21+ default) work out of the box; zone.js apps work too.

## Components

140 components and directives, all exported from `@airiona/ui`. Run the showcase (`npx ng serve showcase` in the source workspace) to see each one live with its inputs.

| Group | Class and selector |
| --- | --- |
| Core | `ArAvatarStack` `ar-avatar-stack`, `ArAvatar` `ar-avatar`, `ArBadge` `ar-badge`, `ArCardHead` `ar-card-head`, `ArCountUp` `ar-count-up`, `ArHeroPattern` `ar-hero-pattern`, `ArIcon` `ar-icon`, `ArIndicator` `[arIndicator]`, `ArMedia` `ar-media`, `ArRing` `ar-ring`, `ArScene` `ar-scene`, `ArWordmark` `ar-wordmark` |
| Actions | `ArButton` `button[arButton], a[arButton]`, `ArChip` `button[arChip]`, `ArIconButton` `button[arIconButton]`, `ArSegmentedControl` `ar-segmented-control` |
| Forms | `ArBookingSearch` `ar-booking-search`, `ArCalendar` `ar-calendar`, `ArCheckbox` `ar-checkbox`, `ArDatePicker` `ar-date-picker`, `ArQuantityStepper` `ar-quantity-stepper`, `ArSelect` `ar-select`, `ArSwitch` `ar-switch`, `ArTextField` `ar-text-field`, `ArTile` `button[arTile]` |
| Overlays | `ArDialog` `ar-dialog`, `ArMenu` `ar-menu`, `ArTooltipDirective` `[arTooltip]`, `ArTooltip` `ar-tooltip` |
| Status | `ArBookingSteps` `ar-booking-steps`, `ArRating` `ar-rating`, `ArToast` `ar-toast` |
| Booking | `ArAmenityList` `ar-amenity-list`, `ArBookingBar` `ar-booking-bar`, `ArDestinationCard` `ar-destination-card`, `ArFlightTicket` `ar-flight-ticket`, `ArStayCard` `ar-stay-card` |
| Data | `ArBulk` `ng-template[arBulk]`, `ArCell` `ng-template[arCell]`, `ArDataTable` `ar-data-table` |
| Navigation | `ArSideNav` `ar-side-nav`, `ArTabPanel` `ng-template[arTabPanel]`, `ArTabs` `ar-tabs`, `ArTopNav` `ar-top-nav` |
| Dashboard | `ArBalanceChart` `ar-balance-chart`, `ArChannelCard` `ar-channel-card`, `ArChannelChart` `ar-channel-chart`, `ArHoldingsPanel` `ar-holdings-panel`, `ArPageHeader` `ar-page-header`, `ArPromptCard` `ar-prompt-card`, `ArSparkBars` `ar-spark-bars`, `ArStatCard` `ar-stat-card` |
| Analytics | `ArAbsenceCard` `ar-absence-card`, `ArHeatmap` `ar-heatmap`, `ArLeaderboard` `ar-leaderboard`, `ArMetricTile` `ar-metric-tile`, `ArPillBarChart` `ar-pill-bar-chart`, `ArRatingBreakdown` `ar-rating-breakdown`, `ArSegmentGauge` `ar-segment-gauge`, `ArStripeDistribution` `ar-stripe-distribution` |
| Widgets | `ArActivityCalendar` `ar-activity-calendar`, `ArAnalogClock` `ar-analog-clock`, `ArArrivalTile` `ar-arrival-tile`, `ArBatteryTile` `ar-battery-tile`, `ArChargingTile` `ar-charging-tile`, `ArGateTile` `ar-gate-tile`, `ArHabitTile` `ar-habit-tile`, `ArMediaPlayer` `ar-media-player`, `ArRecordingTile` `ar-recording-tile`, `ArRideTile` `svg[arCarArt]`, `ArRingStatCard` `ar-ring-stat-card`, `ArToggleTile` `ar-toggle-tile`, `ArTripSummaryTile` `svg[arScooterArt]`, `ArVoiceRecorder` `ar-voice-recorder`, `ArWorldClock` `ar-world-clock` |
| Workspace | `ArAssistantCard` `ar-assistant-card`, `ArAssistantOrb` `svg[arAssistantOrb]`, `ArDateChip` `ar-date-chip`, `ArEfficiencyChart` `ar-efficiency-chart`, `ArMeetingsStrip` `ar-meetings-strip`, `ArNotch` `ar-notch`, `ArProfileProjectCard` `ar-profile-project-card`, `ArRoadmapGantt` `ar-roadmap-gantt`, `ArTotalTimeTile` `ar-total-time-tile` |
| Mobile | `ArActionSheet` `ar-action-sheet`, `ArActivityFeed` `ar-activity-feed`, `ArAgendaCard` `ar-agenda-card`, `ArAppBar` `ar-app-bar`, `ArBoardingPassArt` `[arArt]`, `ArBoardingPass` `ar-boarding-pass`, `ArBottomSheet` `ar-bottom-sheet`, `ArCalendarCard` `ar-calendar-card`, `ArCategoryTile` `button[arCategoryTile]`, `ArChecklistRow` `ar-checklist-row`, `ArChipScroller` `ar-chip-scroller`, `ArDetailList` `ar-detail-list`, `ArDetailValue` `ng-template[arDetailValue]`, `ArExpandableText` `ar-expandable-text`, `ArFab` `button[arFab]`, `ArFeatureCard` `ar-feature-card`, `ArFieldTile` `button[arFieldTile]`, `ArFlightSearchSheet` `ar-flight-search-sheet`, `ArGreetingBar` `ar-greeting-bar`, `ArHeroHeader` `ar-hero-header`, `ArIllustrationCallout` `ar-illustration-callout`, `ArInfoStatRow` `ar-info-stat-row`, `ArLetterRow` `ar-letter-row`, `ArMemberPicker` `ar-member-picker`, `ArMiniDestination` `ar-mini-destination`, `ArMiniStatCard` `ar-mini-stat-card`, `ArMobileSegmented` `ar-mobile-segmented`, `ArOnboardingFlow` `ar-onboarding-flow`, `ArPeoplePicker` `ar-people-picker`, `ArPhoneFrame` `ar-phone-frame`, `ArPlaceCard` `ar-place-card`, `ArPlaceHero` `ar-place-hero`, `ArPlanList` `ar-plan-list`, `ArProfileHeader` `ar-profile-header`, `ArQRCode` `ar-qr-code`, `ArRouteHeader` `ar-route-header`, `ArSearchField` `ar-search-field`, `ArSectionHeader` `ar-section-header`, `ArSnapCarousel` `ar-snap-carousel`, `ArSnapItem` `[arSnapItem]`, `ArStatusBar` `ar-status-bar`, `ArStickyActionBar` `ar-sticky-action-bar`, `ArSwipeRow` `ar-swipe-row`, `ArTabBar` `ar-tab-bar`, `ArTicketCard` `ar-ticket-card`, `ArTimeline` `ar-timeline`, `ArTripRow` `ar-trip-row`, `ArWeekStrip` `ar-week-strip` |
| Motion | `ArRouteTransition` `ar-route-transition`, `ArScreenStack` `ar-screen-stack`, `ArScreen` `ng-template[arScreen]`, `ArSkeleton` `ar-skeleton`, `ArSuccessBurst` `ar-success-burst` |
| Screens | `ArPilotDashboard` `ar-pilot-dashboard` |

Types for inputs (`ArOption`, `ArTableColumn`, `ArTopNavLink`, …) are exported next to each component.

## Compatibility

Built with Angular 20 in partial-compilation mode, so the same package runs in Angular 20, 21 and 22 apps (peer range `^20 || ^21 || ^22`). Tested in fresh CLI apps: Angular 20.3 with zone.js, Angular 22.2 zoneless, and Angular 22.2 with SSR and prerendering. Requires `@angular/forms` for the form controls.

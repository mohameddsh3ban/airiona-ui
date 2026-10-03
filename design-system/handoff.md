# Engineering handoff

How to bring Airiona into the app. Browse every component live in the library: https://claude.ai/artifact/Gc24Jou6HcUrcbkUThAVP2. The reference implementation lives in this system: `components/bundle.css` (all styles, class prefix `ar-`), `components/bundle.js` (React 18 components on `window.Airiona`) and `components/index.d.ts` (props). Treat them as the spec. Port them into the app's own component library rather than shipping the bundle as is.

## 1. Tokens first

Every value in `tokens.json` becomes a CSS custom property with the token's name: `--blue-500`, `--surface-sunken`, `--radius-lg`, `--space-6`, `--shadow-card`, `--duration-base`, `--z-sticky`, plus `--font-display`, `--font-sans`, `--font-mono`. The generated `tokens.css` in this system is the exact output. Components read only these variables; no hex values in component code.

Load the fonts once, in the document head:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Geist:wght@400..700&family=Geist+Mono:wght@400..600&display=swap">
```

If the app uses Tailwind v4, map the variables in the theme so utilities and tokens stay one source:

```css
@import "tailwindcss";
@import "./tokens.css";

@theme inline {
  --color-canvas: var(--canvas);
  --color-surface: var(--surface);
  --color-surface-sunken: var(--surface-sunken);
  --color-line: var(--line);
  --color-ink: var(--ink);
  --color-ink-muted: var(--ink-muted);
  --color-ink-subtle: var(--ink-subtle);
  --color-brand: var(--blue-500);
  --color-brand-text: var(--blue-600);
  --color-action: var(--action);
  --color-midnight: var(--midnight);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-danger: var(--danger);
  --font-display: var(--font-display);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-xl: var(--radius-xl);
  --shadow-card: var(--shadow-card);
  --shadow-float: var(--shadow-float);
}
```

Install the icon library once:

```bash
npm install @heroicons/react
```

## 2. Build order

Build in this order; each layer only uses the ones before it.

| Phase | Components | Done when |
|---|---|---|
| 1. Foundations | tokens.css, fonts, `Icon` (`@heroicons/react` 24 outline + solid, plus the 5 Airiona travel SVGs), focus ring | A page on `canvas` with `body` text renders in Geist; Tab shows the blue ring. |
| 2. Actions | `Button`, `IconButton`, `SegmentedControl`, `Chip` | Every variant and size from the previews matches; disabled and loading work. |
| 3. Forms | `TextField`, `Checkbox`, `Switch`, `QuantityStepper` | Labels are linked, errors announce, password toggle works. |
| 4. Status & identity | `Badge`, `Rating`, `Toast`, `BookingSteps`, `Avatar`, `AvatarStack` | Status badges always show a word. |
| 5. Booking | `Calendar`, `BookingSearch`, `FlightTicket`, `StayCard`, `DestinationCard`, `BookingBar`, `AmenityList` | A range can be picked by mouse and keyboard; unavailable days cannot. |
| 6. Overlays & pickers | `Select`, `Menu`, `Tooltip`, `Dialog`, `DatePicker`, `Tabs` | Popovers open above dialogs and never clip; Escape closes; focus returns to the trigger; Dialog traps Tab; DatePicker works from the keyboard; Tabs move with arrow keys. |
| 7. Data | `DataTable` | Sort, search, select, bulk bar, row menu and pagination work on 500 rows without jank. |
| 8. Shell | `TopNav`, `SideNav`, `StatCard`, `PageHeader` | Dashboard and booking flows assemble from parts with no one-off styles. |
| 9. Widgets & analytics | the `.ar-w` shell first, then `Ring`, `Notch`, charts (`PillBarChart`, `SegmentGauge`, `Heatmap`, `BalanceChart`), then the tiles | Each tile matches its preview at 1280 and 375px; the notch has no visible seam on `canvas` and on `surface-sunken`. |
| 10. Pilot dashboard | `PilotDashboard` from `ChannelCard`, `PromptCard`, `BalanceChart`, `HoldingsPanel` | Side by side with the reference at 1240px, the grid, gaps and card order match exactly. |
| 11. Mobile shell | Mobile tokens (Touch family, Mobile type), `.m-tap`, `AppBar`, `TabBar` (3 variants), `BottomSheet`, `ActionSheet`, `StickyActionBar` | On a real phone: targets ≥ 44px, inputs never zoom, the sheet drags and flicks closed, tabs fire a haptic tick where supported. |
| 12. Mobile content | `SearchField`, `ChipScroller`, `SnapCarousel`, `SwipeRow`, booking cards, `BoardingPass` | Every mobile screen in the library rebuilt pixel for pixel at 390 × 844; swipe rows never steal vertical scroll. |
| 13. Onboarding | `OnboardingFlow` with the five images from the Onboarding asset group | Swipe, dots and next stay in sync; Skip lands on the last step; shown once, replayable. |
| 15. Repairs (1.6) | `Notch` as a clipped shape, `QRCode`, `BoardingPass`, chart lines revealed by clip, popover clamping, 3D art props | Notched cards show their own shadow on any background; the boarding-pass QR scans with a phone camera; every line chart ends exactly on its marker; menus near the screen edge stay on screen. |
| 14. Motion | Duration and easing tokens, the motion layer in bundle.css, `CountUp`, `SuccessBurst`, `Skeleton`, `RouteTransition`, `ScreenStack`, presence exits for `Dialog` and `BottomSheet` | Each component's README Motion table plays as written; indicators slide; dialogs and sheets exit before unmounting; with reduced motion on, nothing moves and nothing breaks. |

## Mobile apps

Build the phone apps native-feeling, not as the responsive website.

- **React Native / Expo:** map tokens 1:1 to a theme object. `.m-tap` becomes `Pressable` with a 0.97 scale and `expo-haptics` `selectionAsync()`. `BottomSheet` becomes `@gorhom/bottom-sheet` with the 34px radius and a single snap at content height. `SwipeRow` becomes `react-native-gesture-handler` `Swipeable`. Icons come from the Heroicons SVGs via `react-native-svg`.
- **Mobile web / PWA:** use the bundle's `m-` classes directly. Add `viewport-fit=cover`, pad with `env(safe-area-inset-*)`, set `touch-action: manipulation`, and keep inputs at 16px.
- **Layout:** 20px gutters, sections 22px apart, a 120px bottom pad above the tab bar. Hide the tab bar on detail, checkout and boarding-pass screens; show `StickyActionBar` there instead.
- **Images:** the listing photos are 720 × 900 WebP at about 100 KB. Serve 1x and 2x, lazy-load below the fold, and use the Scene placeholders only while loading.

## Motion

The motion layer is plain CSS on the `ar-` and `m-` classes plus five small components. Port it as follows.

- **Tokens.** `duration-*` and `ease-*` are CSS variables in tokens.css. Use them in every `transition` and `animation`; never type a raw millisecond value in a component.
- **Web (React).** Keep the CSS transitions for hover, press and indicators. For mount and unmount use Framer Motion `AnimatePresence` (dialogs, sheets, toasts, route changes) with the same values: `duration: 0.32, ease: [0.05, 0.7, 0.1, 1]` to enter, `duration: 0.2, ease: [0.3, 0, 0.8, 0.15]` to exit. Sliding indicators: `layoutId` on the indicator element. The View Transitions API can replace `RouteTransition` where supported.
- **Count-up and charts.** Run once on mount with `requestAnimationFrame` (see `CountUp`); give chart paths `pathLength="1"` and animate `stroke-dashoffset` 1 → 0.
- **iOS and Android (React Native).** Reanimated `withTiming(value, { duration, easing: Easing.bezier(...) })` with the token curves; `withSpring({ damping: 18, stiffness: 220 })` where the spec says spring. React Navigation native stack for `ScreenStack`, `@gorhom/bottom-sheet` for sheets, `expo-haptics` `selectionAsync()` on toggles and tab changes.
- **Stagger.** 40ms between siblings, capped at 12 (the 13th item and later arrive with the 12th).
- **Reduced motion.** Read `prefers-reduced-motion` (web) or `AccessibilityInfo.isReduceMotionEnabled()` (native) and skip to the end state.
- **Review.** Before a screen ships: hover answers in ≤120ms; one indicator per selection; exits shorter than entrances; one `SuccessBurst` per flow; the screen still makes sense with motion off.

## 3. Screen recipes

- **Sign in:** split card on `canvas`, `radius-xl`. Left half is a `midnight` panel with photography and a `display-lg` line in white. Right half: `h1` "Log in", `TextField` email and password, `Checkbox` "Remember me", a `blue-600` "Forgot password?" link, `Button primary lg block` "Log in".
- **Search (home):** `TopNav`, an `overline` eyebrow, `display-xl` headline, then `BookingSearch` overlapping the hero image by half its height. Below: a carousel of `StayCard`, a grid of `DestinationCard`.
- **Results:** `Chip` filter row, sort `SegmentedControl`, a list of `FlightTicket` with `hideMedia` (2-up on desktop), price on each with `Button primary sm` "Select".
- **Listing detail:** full-bleed photo with `IconButton white` back, share and save; a `surface` sheet with `radius-xl` top corners overlapping the photo by 24px; `h2` title + `Rating compact`; `AmenityList`; description in `body-lg`; `Calendar` (two months on desktop); `BookingBar` docked (mobile) or floating (desktop).
- **Checkout:** `BookingSteps` at top, form cards on the left, a summary card on the right with a `FlightTicket` and the price breakdown in an inset plate, `BookingBar floating` with `brand` "Continue to payment". Errors as `Toast danger`.
- **Mobile screens (library → Mobile screens):** Onboarding, Home (GreetingBar, MiniStatCard carousel, TripRows, pill TabBar), Explore (outline SearchField, ChipScroller, PlaceCard carousel, dot TabBar), Place detail (PlaceHero, MobileSegmented, InfoStatRow, ExpandableText, StickyActionBar opening a dates BottomSheet), Flight search (map HeroHeader with an overlapping FlightSearchSheet, MiniDestination carousel), Results (RouteHeader, brand ChipScroller, TicketCards), Boarding pass, Trip day (large AppBar, WeekStrip, Timeline, fab TabBar), Planner (CalendarCard, AgendaCards, BottomSheet with PeoplePicker and PlanList), Host workspace (waves HeroHeader, FeatureCards, SwipeRow checklists, fab TabBar with ActionSheet), Create booking (FieldTiles, MemberPicker, MobileSegmented, sticky CTA), Booking detail (Overview/Activity, IllustrationCallout, DetailList, ActivityFeed, ProfileHeader).
- **Pilot dashboard (the reference layout):** build exactly as `PilotDashboard`. Underline `TopNav` with icon links and an ink underline; `PageHeader` (title, Overview/secondary pill tab, secondary actions); a 4-column row of `ChannelCard` using the four chart types in order line, bars, meter, step; then a 3-column row of `PromptCard`, `BalanceChart`, `HoldingsPanel` at 0.82fr / 1.5fr / 1.04fr. Gaps: 14px between cards, 22px between rows, 28px gutter. Under 1180px: channels 2-up, chart full width on top. Under 720px: one column.
- **Widget boards:** the library's Analytics, Widgets and Workspace boards show every v1.3 component in the arrangement of its reference board. Copy those grid templates for home-screen and kiosk layouts.
- **Operator dashboard:** `SideNav` in a `surface` column, `SegmentedControl pills brand` for the date range, a row of 3 `StatCard`s (one `ink`, one `brand`), then a `DataTable` of bookings with a `Menu` per row; cancelling opens a `danger` `Dialog`.

## 4. Layout

- Max content width 1280px. Desktop gutter `space-8`, tablet `space-6`, mobile `space-4`.
- Card grids use `gap: var(--space-6)`. Never use margins between siblings; use flex or grid `gap`.
- Breakpoints: 640, 768, 1024, 1280.
- Fixed bars (`BookingBar` on mobile, `TopNav`) add `env(safe-area-inset-*)` to their padding.

## 5. Acceptance checks per component

- Matches the preview at 1280px and 375px with no horizontal page scroll.
- Keyboard: reachable by Tab, operable by Enter/Space (arrow keys for `SegmentedControl` and `Calendar`), visible focus ring.
- Screen reader: icon buttons have names, toggles expose state, status changes in `Toast` are announced.
- Text contrast 4.5:1 or better on its ground (all token pairs in the brand book already meet it).
- No hard-coded colours, radii or shadows: grep the component for `#` and `px` shadows before merging.

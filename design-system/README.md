Airiona is an online booking system for flights and stays. The interface should feel like the moment above the clouds: calm, bright, and exact. Cards float on a cool grey stage, the primary action is midnight ink, and Ion Blue appears only where something is chosen, live, or worth celebrating.

Light theme only. Two layers share one palette, icon set and type: the web system below, and a mobile-native kit for the phone apps, where most people book.

## Principles

1. **Calm stage, confident objects.** Put everything on `canvas` and make each card a clear object: `surface`, `radius-lg` or `radius-xl`, `shadow-card`. Never put a card inside a card; nest an inset plate (`surface-sunken`, `radius-md`, 1px `line`) instead.
2. **Ink acts, blue chooses.** The primary call to action is `action` (midnight ink) with `on-action` text. `blue-500` marks selection and state: the active tab, the selected dates, the switch that is on, the highlighted bar. A screen has at most one blue button.
3. **The trip is the hero.** Airport codes, prices and dates get the display face at large sizes. Chrome stays small and quiet.
4. **Photography breathes.** Images run full-bleed to the card radius. Text over images sits on `glass` plates or on a tint fade, never directly on the photo.
5. **The hatch means "not this one".** The diagonal hatch (`.ar-hatch`) marks unavailable dates and non-highlighted chart bars. It never decorates.

## Content fundamentals

- **Voice:** a well-travelled friend who works at the airline. Direct, specific, unhurried. Second person ("your stay"), the product never says "I".
- **Casing:** sentence case everywhere: buttons, titles, tabs. Uppercase only in `overline` eyebrows and three-letter airport codes.
- **Specifics over adjectives.** "9h 25m · Non-stop" beats "Fast flight". "Free cancellation until 13 Oct" beats "Flexible".
- **Buttons are verbs that say what happens:** "Book now", "Check availability", "Pay $1,284", "Reserve". Never "Submit", "OK" or "Click here".
- **Money:** currency symbol first, no decimals unless cents are real ("$1,284", "€128 / night"). Always say whether taxes are included on the final step.
- **Dates:** "Thu, 15 Oct" in fields, "15–19 Oct" for ranges, 24-hour times on tickets ("08:45").
- **Errors** say what went wrong and how to fix it, and with money always say whether it was taken: "Your bank declined the charge of $1,284. No money was taken."
- No emoji in UI copy. No exclamation marks except in a confirmation headline.

## Colour

- `canvas` is the page. `surface` is every card. `surface-sunken` is everything recessed inside a card (tiles, plates, tracks). `surface-raised` + `shadow-float` for anything floating above cards.
- Text: `ink` for primary, `ink-muted` for secondary lines, `ink-subtle` for meta. All three meet 4.5:1 on `surface`, `surface-sunken` and `canvas`.
- Brand: `blue-500` fills with `on-brand` text (5.2:1). For blue text on white use `blue-600` (7:1). Text on `blue-50` and `blue-100` is `blue-700`.
- `midnight` is the night-flight panel for login heroes and promo cards; text on it is white.
- Status colours (`success`, `warning`, `danger`) always come with their `*-tint` ground and a word or icon. Never signal status by colour alone.
- `rating` is for star fills only.
- Lines: `line` for dividers, `line-strong` for field and tile borders at rest, `line-control` for small unlabelled controls (3:1).
- `glass` (72% white + 16px blur) is the only way to put UI over photography. `glass-dark` when the text over the photo is white.

## Typography

Three Google Fonts families: **Bricolage Grotesque** (display), **Geist** (text), **Geist Mono** (data).

- Display styles (`display-xl` to `display-md`, `figure-xl`, `figure-md`) and headings (`h1` to `h3`) use Bricolage Grotesque at weight 600 with negative tracking. Use them for headlines, airport codes, prices and stat figures.
- Running UI text is Geist: `body` (15px) by default, `body-lg` for listing descriptions, `body-sm` for second lines, `label` for buttons and nav, `caption` for tile labels.
- `overline` is always uppercase with 0.14em tracking.
- Geist Mono (`data`, `data-sm`) is for codes people read character by character: booking references, flight numbers, seats, gates, nightly prices in the calendar.
- Numbers that line up use `font-variant-numeric: tabular-nums` (the `.ar-num` utility).
- Keep running text under 65 characters per line.

## Space, radius, elevation

- Spacing is a 4px scale: `space-2` between pills, `space-3` inside chips and tiles, `space-4` default gap and mobile gutter, `space-6` card padding and grid gap, `space-8` hero-card padding and desktop gutter, `space-16` between marketing sections.
- Radius grows with size and nests: an inner radius is the outer radius minus the padding between them. `radius-xl` (32) for hero cards, `radius-lg` (24) for cards, `radius-md` (18) for plates inside them, `radius-sm` (12) for fields and day cells, `radius-pill` for every button, chip, badge and nav.
- Elevation: `shadow-card` for cards on canvas, `shadow-float` for hero cards and floating layers, `shadow-glass` for glass, `shadow-brand` only on the blue search disc and blue buttons on hover. Never stack two shadows on one element.

## Motion

Motion confirms what happened; it never performs. Every component has a motion spec (hover, press, enter, state change, tokens) at the end of its README, and the library's Micro-interactions page tracks all of them in one table.

- **Tokens.** Durations: `duration-instant` 80ms (press), `duration-fast` 120ms (hover, colour), `duration-base` 200ms (indicators, toggles), `duration-slow` 320ms (cards, dialogs, toasts), `duration-sheet` 380ms (sheets, mobile push and pop), `duration-page` 420ms (routes), `duration-emphasis` 900ms (charts drawing, numbers counting), `duration-celebrate` 1200ms (the big stop), `duration-stagger` 40ms (between siblings). Curves: `ease-standard`, `ease-enter`, `ease-exit`, `ease-spring`, `ease-sheet`, `ease-linear`.
- **Answer in 100ms.** Hover and press respond within `duration-instant` or `duration-fast`. Buttons lift 1px and scale to 0.97 when pressed; icon buttons scale to 0.94; cards lift 3–4px and a soft spotlight follows the mouse.
- **One object, one motion.** Segmented controls, nav pills, tab bars, range pickers and tabs slide a single indicator to the new option; they never cross-fade.
- **Arrive soft, leave quick.** Entrances use `ease-enter` at 320–420ms with a 40ms stagger capped at 12 items; exits use `ease-exit` at about two thirds of that. Dialogs and sheets play their exit before unmounting.
- **Data comes alive once.** Lines draw, bars grow from their axis, rings fill and headline numbers count up (`CountUp`) when a chart mounts, not on every re-render.
- **Celebrate once.** `SuccessBurst` plays at the end of a booking or a payment, once per flow.
- **Routes and screens.** `RouteTransition` (fade-through, shared-x, shared-y, scale) for web pages; `ScreenStack` for native push and pop on mobile. Tabs swap instantly; only their indicator moves.
- **Loading.** `Skeleton` after 300ms of waiting, then the content enters in one piece.
- **Stillness.** Under `prefers-reduced-motion` every animation and transition settles at once; state changes still apply.

## Focus and accessibility

- Every interactive element shows a solid 2px `blue-500` outline at 2px offset on keyboard focus (5.2:1 on `surface`). Fields use a 1.5px blue border plus a 4px `blue-100` halo.
- Icon-only buttons always have a `label`. Toggle buttons expose `aria-pressed`.
- Minimum target 36px; 44px on touch-first screens.
- Booking status is always a word plus colour; unavailable dates are hatched and struck through.

## Iconography

- **Heroicons v2.2** (MIT, Tailwind Labs, https://github.com/tailwindlabs/heroicons) is the icon library. Use the 24px **outline** set at its native 1.5 stroke everywhere; use the 24px **solid** set only for filled rating stars, a saved heart, and status marks in toasts and banners.
- In code, import from `@heroicons/react/24/outline` and `@heroicons/react/24/solid` (e.g. `MagnifyingGlassIcon`, `StarIcon`). The `Icon` component takes the kebab-case name from heroicons.com and draws the same paths.
- Airiona additions: `plane`, `bed`, `bath`, `utensils`, `car`. Heroicons has no equivalent, so these are drawn on the same 24px grid at 1.5 stroke and ship as local SVG components.
- Sizes: 14 in badges and tile labels, 16 in small buttons, 18 in fields and icon buttons, 20 default, 22–24 in amenity tiles and empty states. In Tailwind: `size-4`, `size-5`, `size-6`.
- Icons inherit `currentColor`. Never mix in another icon family, and never use emoji as icons.

## Imagery

- Wide, calm, naturally lit travel photography with plenty of sky: wings over clouds, coastlines, cabins in forests, skylines at dusk.
- Images fill to the card radius. Text over them sits on `glass`, `glass-dark`, or a tint fade (`StayCard`).
- `Scene` draws placeholders in five moods (sky, alpine, coast, dusk, forest) until real photography is wired in.

## Logo

No logo has been supplied yet. The `Wordmark` sets "airiona." in Bricolage Grotesque 700 with the full stop in `blue-500`. Replace it when the real mark exists.

## Components

Actions: `Button`, `IconButton`, `SegmentedControl`, `Chip`.
Forms: `TextField`, `Select`, `DatePicker`, `Checkbox`, `Switch`, `QuantityStepper`, `Calendar`, `BookingSearch`.
Overlays: `Dialog`, `Menu`, `Tooltip`.
Data: `DataTable`.
Status: `Badge`, `Rating`, `Toast`, `BookingSteps`.
Identity: `Avatar`, `AvatarStack`.
Booking: `FlightTicket`, `StayCard`, `DestinationCard`, `BookingBar`, `AmenityList`.
Dashboard: `StatCard`, `ChannelCard`, `PromptCard`, `BalanceChart`, `HoldingsPanel`, `SparkBars`.
Analytics: `MetricTile`, `PillBarChart`, `SegmentGauge`, `RatingBreakdown`, `Leaderboard`, `StripeDistribution`, `Heatmap`, `AbsenceCard`.
Widgets: `ToggleTile`, `ArrivalTile`, `RingStatCard`, `HabitTile`, `GateTile`, `VoiceRecorder`, `BatteryTile`, `MediaPlayer`, `AnalogClock`, `RecordingTile`, `ActivityCalendar`, `WorldClock`, `RideTile`, `ChargingTile`, `TripSummaryTile`, `Ring`.
Workspace: `ProfileProjectCard`, `MeetingsStrip`, `RoadmapGantt`, `DateChip`, `EfficiencyChart`, `TotalTimeTile`, `AssistantCard`, `Notch`.
Screens: `PilotDashboard` (the reference layout for the operator dashboard).
Mobile navigation: `PhoneFrame`, `StatusBar`, `AppBar`, `TabBar`, `BottomSheet`, `ActionSheet`, `Fab`, `StickyActionBar`, `HeroHeader`, `GreetingBar`.
Mobile inputs: `SearchField`, `SectionHeader`, `ChipScroller`, `SnapCarousel`, `SwipeRow`, `MobileSegmented`, `FieldTile`, `ChecklistRow`, `WeekStrip`, `CalendarCard`, `PeoplePicker`, `MemberPicker`.
Mobile content: `FeatureCard`, `CategoryTile`, `Timeline`, `AgendaCard`, `PlanList`, `MiniStatCard`, `TripRow`, `FlightSearchSheet`, `RouteHeader`, `TicketCard`, `BoardingPass`, `PlaceCard`, `PlaceHero`, `InfoStatRow`, `ExpandableText`, `MiniDestination`, `IllustrationCallout`, `ActivityFeed`, `DetailList`, `LetterRow`, `ProfileHeader`.
Mobile onboarding: `OnboardingFlow`.
Navigation: `TopNav` (pill and underline variants), `SideNav`, `Tabs`, `PageHeader`.
Foundations: `Icon`, `Scene`.
Motion: `CountUp`, `SuccessBurst`, `Skeleton`, `RouteTransition`, `ScreenStack`.

Each component has a guideline page with the props it needs and when to use it. Read the Engineering handoff section before implementing.

The browsable library, with live playgrounds, props tables, code and five example screens, is at https://claude.ai/artifact/Gc24Jou6HcUrcbkUThAVP2.

## Mobile

Most Airiona bookings happen on a phone, so the apps are mobile-native, not shrunken web pages. The mobile kit (classes `m-`) reuses every colour, icon and font, and changes how things are sized, placed and touched.

- **Thumb first.** Primary actions sit in the bottom third: `TabBar`, `StickyActionBar`, `Fab`, `BottomSheet`. The top holds the title and back.
- **Targets.** Nothing pressable is smaller than `tap-min` (44px). Primary controls are `tap-comfort` (56px): search, field tiles, sticky CTA, FAB.
- **Gutters and safe areas.** `gutter-mobile` (20px) left and right. Reserve `status-bar` at the top and `home-indicator` at the bottom (`env(safe-area-inset-*)` in the app). The docked `TabBar` is `tabbar-height` (84px) including the home area.
- **Type.** Use the Mobile type styles: `m-large-title` 34px on a tab's root screen, `m-title` for greetings, `m-title-2` for sections, `m-headline` 17px for bar titles and buttons, `m-body` 16px for text and every input (16px or more stops iOS zooming into fields).
- **Navigation.** Three tab bars: `dot` by default, `fab` when creating is the main job (host and planner), `pill` floating over the traveller home. Pushed screens use the compact `AppBar` with back; root screens use the large title.
- **Sheets, not pages.** Dates, guests, filters and plans open in a `BottomSheet` (34px top corners, `duration-sheet` 380ms with the sheet easing). Drag down past 110px, or flick, to dismiss. Short command lists use `ActionSheet`.
- **Gestures.** `SwipeRow` reveals up to three actions on a left swipe; horizontal intent locks after 6px so vertical scroll is never hijacked. Carousels snap and show a 20–30% peek of the next card.
- **Feel.** Every tappable element carries `.m-tap`: it scales to 97% while pressed and has no grey tap flash. Toggles, tabs and selections fire an 8ms haptic tick where supported.
- **Headers.** Dark screens start with a `HeroHeader` (midnight, dotted world map or waves) whose search or search card overlaps the bottom edge; results use `RouteHeader` with the arc between airports.

## Onboarding

- Five steps in `OnboardingFlow`: Welcome, Discover, Stay, Pay, Go. Each has one 3D illustration, an eyebrow, a title that states the benefit, and one sentence of at most 16 words.
- **Art direction:** soft 3D render, glossy Ion Blue (#2B5CFF) and sky (#C8DDF4) glass, pearl white, small midnight (#070B2A) accents, on the plain `mist` ground (#EDF0F5), with no text and no people, at 4:5. The screen background is `mist`, so the art has no visible edge. The five images are in the Onboarding asset group.
- Show once on first launch; Skip goes to the last step, not out of the flow. Replay from Settings.

## 3D art

- One art direction everywhere: the onboarding renders set it, and the Art asset group extends it into the product. A glass AI orb (PromptCard, AssistantCard), a frosted globe behind RouteHeader and HeroHeader, a pearl jet that glides across the BoardingPass, a sedan in RideTile and a scooter in TripSummaryTile.
- Components take the art as an `image` URL and fall back to a drawn placeholder when it is missing.
- Art floats (6s, 8px) after it lands; it never spins, bounces or loops faster than that.

## Photography

- Seven photographs in the Photography asset group set the bar for listing imagery: a forest cabin, an alpine lodge, a cliff villa, a Tokyo penthouse, Lisbon rooftops, a jet above clouds and a white hotel. All are calm and naturally lit with plenty of sky, have no people and no logos, and are 720 × 900 WebP.
- Over photos, text sits on `glass` or `glass-dark` plates, or on a tint fade (`StayCard` takes a dark `tint` sampled from the photo).

## Dashboards and widgets

- **The pilot dashboard is the layout reference.** Underline top nav with icons, a 40px page title with an ink pill tab, four `ChannelCard`s in equal columns, then `PromptCard` / `BalanceChart` / `HoldingsPanel` at 0.82fr / 1.5fr / 1.04fr. 14px between cards, 22px between rows, 28px gutter.
- **Widget tiles** (`.ar-w`) share one shell: `radius-xl`, 20px padding, `shadow-card`. Tones: `light` (surface), `dark` (`midnight`, white text, `blue-400` accents), `brand` (`blue-500`), `sky` (`sky-200`). Keep a grid of tiles at 168px minimum height so rows align.
- **One accent per tile.** Ion Blue carries progress, selection and highlights. On midnight it lightens to `blue-400` / `blue-300`. `danger` red appears only for recording and stop controls, and for a negative offset.
- **Charts use the hatch and the blue scale.** Highlighted bar or point in `blue-500` with an ink tooltip; everything else quiet (`blue-50` tracks, `surface-sunken` bars). Three-part breakdowns use `blue-500`, `blue-300`, `action`, which differ in lightness.
- **The notch** cuts a concave corner out of a card to hold its round buttons. It is painted with the colour behind the card (`notchBg`), so it only works on a flat ground.
- **Illustrations** (`FlowerArt` in `PromptCard`, the orb in `AssistantCard`, the car in `RideTile`) are drawn in the blue scale with soft highlights. Replace them with photography only where the reference used a real photo.

## Overlays, pickers and data

- Popovers (`Select`, `Menu`) are fixed to the viewport, sit at `z-toast` so they open above dialogs, and flip upward near the bottom edge so tables and dialogs never clip them.
- `Dialog` uses `surface-raised`, `radius-xl`, `shadow-float` over `scrim` with a 6px blur. One dialog at a time. On phones it becomes a bottom sheet.
- Destructive actions use `Button variant="danger"` (`danger` fill, white text, 5.3:1) and always confirm in a `Dialog` whose button names the consequence and the amount.
- `Tooltip` is `action` with `on-action` text, or `surface-raised` for the light tone. It names icons and adds one fact; it never holds links or buttons.
- `DatePicker` reuses the calendar day cell: `blue-500` for check-in and check-out, `blue-50` for the nights between, the hatch for booked-out days.
- `Tabs` put a 3px `blue-500` bar under the active tab on a `line` hairline.
- `DataTable` rows are 64px on `surface` with `line` separators; the header is `surface-sunken`; selected rows are `blue-50`; the bulk bar is `action`.

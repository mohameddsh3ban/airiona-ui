# Choosing components

Start from what the element does (`suggest "<what it does>"`), read the candidates (`describe`), then use these decisions. Record the winner's `why` and the rejected alternative.

## Page frame

| Need | Phone (base) | Desktop (lg) |
|---|---|---|
| App navigation, 3–5 destinations | `TabBar` (sticky bottom section) | `TopNav`; operator tools `SideNav` |
| Screen title on a tab's root | `AppBar large` (its title is the page h1; `headingLevel: 2` when the page has another h1) | `PageHeader` (operator) or an `h1` |
| Screen title with back | `AppBar` (compact, `showBack`) | `TopNav` + `h1`, back as a link |
| Home greeting | `GreetingBar` or `HeroHeader` with search overlapping | same, wider |
| Detail page top (stay, place) | `PlaceHero` | `PlaceHero` in the main column, booking card in `aside` |
| Flight results top | `RouteHeader` | `RouteHeader` or `BookingSearch` bar |
| Section title with "View all" | `SectionHeader` | `SectionHeader` |

## Search and filters

| Need | Use | Not |
|---|---|---|
| Flight search on phone | `FlightSearchSheet` | `BookingSearch` (desktop bar) |
| Flight search on desktop | `BookingSearch` | |
| Keyword search | `SearchField` | `TextField` |
| Category or quick filter row | `ChipScroller` (single choice) or `Chip`s (multi) | `Tabs` |
| Full filter set | `BottomSheet` on phone, a side panel on desktop | `Dialog` |
| Sort | `Select` (desktop) / `ActionSheet` (phone) | |
| 2–3 view modes | `MobileSegmented` (phone), `SegmentedControl` (desktop): for a form field give the field `"component": ["MobileSegmented", "SegmentedControl"]` and place both, each hidden at the other width | `Tabs` (those are for content panels) |

## Choosing one value

2–3 always-visible options: `MobileSegmented`/`SegmentedControl`. 4–12: `Select`. Many short ones in a row: `ChipScroller`. A person from the booking: `PeoplePicker`. A day of this week: `WeekStrip`. A date: `DatePicker`. A count: `QuantityStepper`.

## Listings and cards

| Content | Use |
|---|---|
| Stay hero card (one featured) | `StayCard` |
| Stays in a scrolling list on phone | `PlaceCard` in `layout: "scroll-x"` or `SnapCarousel` |
| Destinations, deals | `DestinationCard` (large), `MiniDestination` (compact grid) |
| Flight result | `TicketCard` (phone), `FlightTicket` (rich card) |
| Upcoming trips | `TripRow` list |
| Booked flight | `BoardingPass` (with `QRCode`) |
| Facts of a booking | `DetailList` |
| Three quick facts | `InfoStatRow` |
| What a stay includes | `AmenityList` |
| Long description | `ExpandableText` |
| Reviews | `Rating`, `RatingBreakdown` |
| Day plan | `Timeline`, `AgendaCard` |
| Activity / history | `ActivityFeed`, `LetterRow` |
| Records with search, sort, bulk actions (operator) | `DataTable` (desktop); on phones a list of `LetterRow`/`TripRow` with `SwipeRow` actions |

## Actions

- One primary action per screen: `Button variant="primary"` (midnight ink). Blue (`brand`) only for brand moments.
- On phones the primary action of a long page lives in `StickyActionBar` (one button, optional price summary) or `BookingBar` (price + action on listings and checkout).
- Icon-only actions: `IconButton` with `label` (it becomes the accessible name).
- Overflow commands: `Menu` (desktop), `ActionSheet` (phone).
- Create on a list screen: `Fab`.

## Overlays and feedback

| Need | Use |
|---|---|
| One decision (cancel booking?) | `Dialog` (becomes a bottom sheet on phones) |
| A task needing room (filters, travellers) | `BottomSheet` |
| A list of commands | `ActionSheet` (phone), `Menu` (desktop) |
| Name an icon, one fact | `Tooltip` |
| Something happened | `Toast` |
| End of a booking | `SuccessBurst` in a `Dialog` |
| Steps of checkout | `BookingSteps` |
| Status words | `Badge` |

## Dashboards (operator side)

KPIs: `StatCard`, `MetricTile`; trends: `BalanceChart`, `PillBarChart`, `ChannelCard`; tables: `DataTable`; people: `Leaderboard`, `AvatarStack`. The `PilotDashboard` screen is the reference composition.

## When nothing fits

Use `"component": "GAP"` and add `{ element, need, nearest, proposal }` to `gaps`. Common gaps today: brand logos (Google, Apple, Facebook sign-in buttons; Heroicons has no brand marks), maps, payment provider UI, site footers. Do not stretch a component into a role it was not built for.

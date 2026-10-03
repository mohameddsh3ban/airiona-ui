# Flight home

> Generated from `docs/pages/flight-home/page.spec.json` by `node tools/page/airiona.mjs render flight-home`. Edit the spec, not this file.

| | |
|---|---|
| Audience | A traveller planning a trip on their phone, often on mobile data, who lands here from a search engine or the app's Home tab and wants to search flights in under a minute; the deals and hotel rows are for people still browsing. |
| Primary action | Search flights for a route and dates |
| Source | screenshot · `docs/pages/flight-home/source.jpg` |
| Route | `/flight-home` (playground: `#/flight-home`) |
| Framework | angular |

The source is a desktop travel-agency landing page: a top nav (wordmark, Flights/Hotel/Trains/Buses/Cabs, Sign In), a hero with an eyebrow, a two-line display headline and a 3D plane, a flight search bar (One Way / Round Trip / Multi City, From, To with a swap disc, Departure, Return, a round search button), then three content sections each with a centred heading and a one-line lede: Top flight deals (one wide promo card with a cabin photo, code DTOUR2023, title, text and a Learn More button, plus two photo tiles 'Hotel bookings' and 'Book domestic' with an arrow disc), Most popular airlines (a horizontal carousel of photo cards named Turkish Airlines, Emirates, Qatar Airways with peeking neighbours), and Book your hotel (three photo cards: Moxy NYC Downtown, Hotel Tropical Daisy with four stars, '1.22 km from City Centre' and a Book Now button, Hotel Tropical Daisy). It shows no phone layout, no empty/loading/error states and no validation; those are designed here. The brand is a placeholder ('Travel agency.'); this conversion uses Airiona.

## Screens

| 390 px (phone) | 768 px (tablet) | 1280 px (desktop) |
|---|---|---|
| ![390](shots/390.png) | ![768](shots/768.png) | ![1280](shots/1280.png) |

Page checks (`shoot`): 0 errors, 0 warnings. Spec check (`lint`) is at the end of this document.

## Layout, mobile first

| Section | Purpose | 390 | 768 | 1280 | Sticky | Notes |
|---|---|---|---|---|---|---|
| **Airiona** `topbar` | Brand and Sign in on phones; the five-link pill nav does not fit 390px | stack | ↑ | ↑ |  | hidden at lg |
| **Site navigation** `nav` | The source's top nav: wordmark, Flights/Hotels/Trains/Buses/Cabs, Sign in (desktop only) | stack | ↑ | ↑ |  | hidden at base |
| **Convenient online flight booking** `hero` | The source's hero: eyebrow, display headline and the 3D plane; sets the page's h1 | stack | ↑ | ↑ |  |  |
| **Search flights** `search` | The reason the page exists: route, dates and trip type, then search | stack | grid-2 | grid-4 |  |  |
| **Top flight deals** `deals` | Promotions: one featured deal and two quick links to hotels and domestic flights | stack | ↑ | grid-3 |  |  |
| **Most popular airlines** `airlines` | Browse by airline: the carriers people book most, with the cheapest fare from the home airport | scroll-x | ↑ | grid-3 |  |  |
| **Book your hotel** `hotels` | Featured stays near the traveller's home city | stack | grid-2 | grid-3 |  |  |

## Components

### Airiona

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `appBar` | AppBar `ar-app-bar` | `title`=Airiona<br>`large`=true<br>`eyebrow`=Ready for take-off<br>`headingLevel`=2 |  | Root screen of the Flights tab: large title with the source's eyebrow line above it<br>Not TopNav: wordmark + five links + Sign in overflow a phone; it returns at 1280<br>Not GreetingBar: a greeting for a signed-in home; this page serves signed-out visitors too |  |
| `appBarSignIn` [arActions] | Button `button[arButton], a[arButton]` | `variant`=secondary<br>`size`=sm |  | The source's Sign In pill, kept in the bar's actions slot so it stays in reach at the top right |  |

### Site navigation

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `topNav` | TopNav `ar-top-nav` | `links`=[{"value":"flights","label":"Flights"},{"value":"hotels","la<br>`value`=flights |  | Matches the source: wordmark left, a pill group of sections in the middle, action on the right; Flights is the active pill<br>Not SideNav: an operator sidebar, not a public site header<br>Not Tabs: Tabs switch panels in place; these links go to other pages |  |
| `navSignIn` [arActions] | Button `button[arButton], a[arButton]` | `variant`=primary<br>`size`=sm |  | TopNav's own guidance for signed-out visitors: Button primary sm 'Sign in' in the actions slot (otherwise it shows search and notification buttons) |  |

### Convenient online flight booking

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `heroHeader` | HeroHeader `ar-hero-header` | `eyebrow`=Ready for take-off<br>`title`=Convenient online flight booking<br>`image`=assets/art/jet-3d.webp<br>`headingLevel`=1 |  | A midnight header with art and a display title is the system's version of the source's headline-over-plane hero; it also carries the page's single h1<br>Not RouteHeader: shows a route arc for results, not a landing headline<br>Not PlaceHero: a photo with price caption for one place<br>Not html h1: loses the art panel the source leans on |  |
| `heroLede` [arBelowTitle] | `<p>` |  |  |  |  |

### Search flights

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `tripType` (field `tripType`) | MobileSegmented `ar-mobile-segmented` | `label`=Trip type<br>`tone`=brand<br>`options`=[{"value":"one","label":"One way"},{"value":"round","label": |  | Three always-visible options with a sliding thumb, full width on phones; brand tone is the system's rule for trip type in search<br>Not SegmentedControl: desktop pill group; MobileSegmented is full-width and thumb-sized on phones<br>Not Select: hides three options behind a tap |  |
| `tripTypeDesktop` (field `tripType`) | SegmentedControl `ar-segmented-control` | `label`=Trip type<br>`tone`=brand<br>`options`=[{"value":"one","label":"One way"},{"value":"round","label": |  | On desktop the trip type is a compact pill group above the search row, like the source; same form control as the phone switch<br>Not MobileSegmented: full-width phone control stretched across 1200px |  |
| `from` (field `from`) | Select `ar-select` | `label`=From<br>`placeholder`=City or airport<br>`searchable`=true<br>`searchPlaceholder`=Type a city or code<br>`iconStart`=paper-airplane<br>`emptyText`=No airport matches that | `options` ← `airports` | One of 8–50 airports with a filter field; code shown in mono beside the city, as the system asks<br>Not TextField: free text cannot be matched to an airport without a picker<br>Not FieldTile: opens a sheet; the Select already filters inline |  |
| `to` (field `to`) | Select `ar-select` | `label`=To<br>`placeholder`=City or airport<br>`searchable`=true<br>`searchPlaceholder`=Type a city or code<br>`iconStart`=map-pin<br>`emptyText`=No airport matches that | `options` ← `airports` | Same control as From so the two line up |  |
| `dates` (field `dates`) | DatePicker `ar-date-picker` | `label`=Travel dates<br>`mode`=range<br>`variant`=tiles<br>`startLabel`=Departure<br>`endLabel`=Return<br>`min`=2026-10-03<br>`today`=2026-10-03<br>`unit`=day<br>`inclusive`=true |  | Departure and Return as two tiles in one control, exactly the source's pair; range picking across months with the result stated in words<br>Not Calendar: an inline month takes the whole phone screen<br>Not TextField: typed dates are error-prone |  |
| `searchSubmit` | Button `button[arButton], a[arButton]` | `variant`=primary<br>`size`=lg<br>`block`=true<br>`iconStart`=magnifying-glass |  | The one primary action: midnight ink, full width on phones; the source's round search disc becomes a labelled button so it has a visible verb; at 1280 it takes the fourth column so the row reads From, To, Dates, Search like the source bar<br>Not IconButton brand: an icon-only disc is a 44px target with no visible label; the brand disc belongs to BookingSearch only |  |

### Top flight deals

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `dealFeatured` | FeatureCard `ar-feature-card` | `icon`=paper-airplane<br>`openable`=true | `title` ← `deals[0].title`<br>`text` ← `deals[0].text`<br>`tone` ← `deals[0].tone` | A dark card with a title, two lines and an open button is the source's promo card minus its photo; the promo code goes in the text until FeatureCard gets an image<br>Not StayCard: a priced stay with a Reserve button<br>Not DestinationCard: rating and Book now, wrong meaning for a promotion | loading: Skeleton 248px<br>error: section hidden |
| `dealHotels` | **GAP** |  |  | Photo tile with a label and an open arrow |  |
| `dealDomestic` | **GAP** |  |  | Photo tile with a label and an open arrow |  |

### Most popular airlines

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `airline` | MiniDestination `ar-mini-destination` |  | `title` ← `item.title`<br>`image` ← `item.image`<br>`price` ← `item.price`<br>`duration` ← `item.duration`<br>`dates` ← `item.dates`<br>`badge` ← `item.badge` | A compact photo card with a name and three small facts; the carousel peeks the next card like the source<br>Not PlaceCard: region/location/rating are for places<br>Not SnapCarousel: the section's scroll-x layout already snaps and bleeds; no need for a second scroller | loading: Skeleton card<br>error: section hidden |

### Book your hotel

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `hotel` | DestinationCard `ar-destination-card` |  | `title` ← `item.name`<br>`rating` ← `item.rating`<br>`meta` ← `item.distance`<br>`image` ← `item.image`<br>`saved` ← `item.saved` | A photo card with name, star rating, a distance line and a small Book now button is exactly the source's hotel card<br>Not StayCard: hero card for one featured stay with a price and tags<br>Not PlaceCard: no Book now button | loading: Skeleton card<br>empty: IllustrationCallout<br>error: Toast with Retry |

## Forms and validation

### search

Submit: **Search flights** → GET /api/flights/search?from&to&depart&return&trip (the app navigates to the results route with the same query). Success: navigate. Failure: Network or 5xx: danger Toast 'Could not search right now. Check your connection and try again.' with Retry; the form stays filled. 422 (no route): message under the To field 'We don't fly this route yet.'.

Errors show after a field is left or on submit; submit focuses the first invalid field.

| Field | Control | Default | Rules | Messages | Keyboard / autofill |
|---|---|---|---|---|---|
| **Trip type** `tripType` | MobileSegmented,SegmentedControl | round | required | required: “Choose one way, round trip or multi-city.” |  |
| **From** `from` | Select |  | required | required: “Choose the airport you are flying from.” |  |
| **To** `to` | Select |  | required | required: “Choose where you want to fly to.” |  |
| **Travel dates** `dates` | DatePicker |  | required, dateRange, futureDate | required: “Choose your departure and return dates.”<br>dateRange: “Pick a return date after your departure.”<br>futureDate: “Departure must be today or later.” |  |

## Data

- **airports**: `Airport[]` from GET /api/airports?popular=1 (the 12 most-booked airports; the Select is searchable so the full list can stream in later). Loading: Both airport selects render disabled with a Skeleton line for the placeholder; the rest of the form stays usable. Empty: n/a (the list is static and bundled as a fallback). Error: Fall back to the bundled list; no message, the fallback is complete enough to search.
- **deals**: `Deal[]` from GET /api/promotions?placement=home-deals (first item is the featured deal). Loading: One Skeleton block the height of the FeatureCard (248px) and two tile-sized blocks. Empty: The whole Top flight deals section is hidden. Error: Section hidden; no toast (promotions are not what the person came for).
- **airlines**: `Airline[]` from GET /api/airlines/popular?from=<home airport> (sorted by bookings in the last 30 days, max 8). Loading: Three Skeleton cards in the carousel at the card height. Empty: Section hidden. Error: Section hidden; no toast.
- **hotels**: `Hotel[]` from GET /api/stays/featured?city=<home city>&limit=3. Loading: Three Skeleton cards in the final grid. Empty: IllustrationCallout: 'No featured stays near you yet' with a 'Browse all stays' link. Error: Toast (danger) 'Could not load stays' with Retry; keep the last loaded cards.

```ts
interface Airport {
  value: string;
  label: string;
  meta: string;
}
interface Deal {
  code: string;
  title: string;
  text: string;
  tone: 'dark' | 'light';
}
interface Airline {
  title: string;
  image: string;
  price: string;
  duration: string;
  dates: string;
  badge: string?;
}
interface Hotel {
  name: string;
  rating: number;
  distance: string;
  image: string;
  saved: boolean;
}
```

Sample data: `projects/playground/src/app/pages/flight-home/flight-home.data.ts`.

## Motion

| Where | Use | Why |
|---|---|---|
| Arriving from the app's other tabs and leaving to the results page | RouteTransition (fade-through) | Top-level change of context; the results page is a sibling destination, not a step |

Everything settles instantly under `prefers-reduced-motion` or `provideAiriona({ motion: 'reduce' })`.

## Accessibility

- One h1: the HeroHeader title. AppBar large renders its title as h2 (headingLevel 2) and the content sections use h2 titles.
- The search Button has a visible verb label ('Search flights') and the magnifying glass is decorative.
- The two airport Selects announce their filter field; the empty text 'No airport matches that' is read when nothing matches.
- The airline carousel is a scrollable region: cards are buttons with the airline name as accessible name (MiniDestination (press)).
- DestinationCard's Book now buttons must name the hotel for screen readers (the component labels them 'Book now <title>' or the app adds aria-label); verify on handoff.
- After a failed search, focus moves to the first invalid field (page-form.ts) and the toast is announced.

## Gaps

| Element | Need | Nearest today | Proposal |
|---|---|---|---|
| dealHotels | A photo tile with a short label on a frosted plate and a round open-arrow button (the source's Hotel bookings / Book domestic tiles) | MiniDestination (photo + title, but price/duration/dates rows) or CategoryTile (icon, name, count, progress bar, no photo) | Add a PromoTile component: photo, one label, optional eyebrow, round open arrow (IconButton ink), 4:3 on phones and square in grids |
| dealDomestic | Same photo tile as dealHotels | MiniDestination / CategoryTile | Same PromoTile component |
| dealFeatured | FeatureCard with a photo panel and an eyebrow (promo code) for the source's wide deal card | FeatureCard (used; conveys title, text and open button without the photo) | Add image and eyebrow inputs to FeatureCard, photo on the left from 768px |

## Notes

- Phone order: brand bar, hero, search form, deals, airlines, hotels. The form sits directly under the hero (one screen down) so it is the first thing a thumb reaches; no sticky bottom bar because it would duplicate the form's own Search button and cover the cards (answers the lint warning about sticky.base bottom).
- The source's five nav links are hidden on phones (the AppBar carries brand and Sign in); in the product app the Flights tab bar is the app shell's, not this page's.
- Trip type defaults to round trip like the source. One way should hide the Return tile and switch the DatePicker to mode single: cross-field behaviour for the app (a valueChanges subscription), not expressible in the spec.
- The airline cards show a 'from' fare, destination count and season because MiniDestination renders three fact rows; these are assumptions (the source shows only the airline name and photo). All three airline photos use jet-clouds.webp because the asset set has one aircraft photo.
- The featured deal is a FeatureCard without the cabin photo; the promo code DTOUR2026 lives in the text. See gaps.
- Dates: the DatePicker value is an ISO [start, end] range; dateRange and futureDate validate it. Prices under days are not shown on the landing page (no route chosen yet).
- Airports: eight bundled airports are the fallback; the Select is searchable so a larger list can be loaded.
- The hero lede sentence is this conversion's addition: the source has none, the HeroHeader has an arBelowTitle slot and the page reads better with one line under a display title.
- Desktop search row: the trip type is a SegmentedControl above the row at 1280 (the phone keeps MobileSegmented); both place the same form field.

## Spec check

✅ No errors

- ⚠️ sections: a page with a form usually keeps its primary action reachable on phones: a section with sticky.base "bottom" (StickyActionBar)

## Build it

```bash
node tools/page/airiona.mjs check flight-home   # lint, handoff, scaffold, build, screenshots
npx ng serve playground                    # then open http://localhost:4200/#/flight-home
```

Generated code: `projects/playground/src/app/pages/flight-home/`. Copy that folder into the product app with `shared/page-form.ts` and `shared/validators.ts`, then replace the sample data with the real sources listed above.

# Aircraft

> Generated from `docs/pages/aircraft-detail/page.spec.json` by `node tools/page/airiona.mjs render aircraft-detail`. Edit the spec, not this file.

| | |
|---|---|
| Audience | A buyer, broker or flight department checking one aircraft in detail on a phone, deciding whether to ask for records. |
| Primary action | Contact the seller |
| Source | brief · `product brief: Airiona aircraft and hangar marketplaces` |
| Route | `/aircraft-detail` (playground: `#/aircraft-detail`) |
| Framework | angular |

The detail page behind one aircraft listing card: photo, key facts, description, specification, amenities and a contact form that stays in reach on phones.

## Screens

| 390 px (phone) | 768 px (tablet) | 1280 px (desktop) |
|---|---|---|
| ![390](shots/390.png) | ![768](shots/768.png) | ![1280](shots/1280.png) |

App view (the page in app mode inside the phone frame, `#/native/aircraft-detail`):

<img src="shots/native.png" width="260" alt="aircraft-detail as a phone app">

Page checks (`shoot`): 0 errors, 0 warnings. Spec check (`lint`) is at the end of this document.

## Layout, mobile first

| Section | Purpose | 390 | 768 | 1280 | Sticky | Notes |
|---|---|---|---|---|---|---|
| **Site navigation** `nav` | Desktop navigation: the product destinations and the signed-in account | stack | ↑ | ↑ |  | hidden at base |
| **Gulfstream G550** `hero` | The listing photo with the name, base and price | stack | ↑ | ↑ |  |  |
| **Key facts** `facts` | The four numbers buyers check first | stack | ↑ | ↑ |  |  |
| **About** `about` | The seller description, clamped on phones | stack | ↑ | ↑ |  |  |
| **Specification** `specs` | Every figure a buyer or broker compares | stack | grid-2 | ↑ |  |  |
| **On board** `amenities` | What comes with it | stack | ↑ | ↑ |  |  |
| **Contact the seller** `contact` | Reach the seller or host; beside the details on desktop | stack | grid-2 | stack (aside) |  |  |
| **Send** `cta` | Price and the one action, always in reach on phones | stack | ↑ | ↑ | base: bottom | hidden at lg |

## Components

### Site navigation

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `topNav` | TopNav `ar-top-nav` | `links`=[{"value":"book","label":"Book"},{"value":"trips","label":"M<br>`value`=aircraft<br>`user`={"name":"Omar Saleh","email":"omar@example.com"} |  | The product's four destinations with the signed-in account; replaces the phone tab bar at 1280 |  |
| `navAction` [arActions] | Button `button[arButton], a[arButton]` | `variant`=secondary<br>`size`=sm<br>`iconStart`=plus |  | The sell door stays in the header |  |

### Gulfstream G550

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `pageTitle` | `<h1>` |  |  |  |  |
| `placeHero` | PlaceHero `ar-place-hero` | `title`=Gulfstream G550<br>`location`=Dubai World Central · DWC<br>`price`=$24.5M<br>`priceLabel`=Asking price<br>`image`=assets/photos/aviation/jet-heavy.webp |  | Full-width photo with glass back and bookmark buttons and a plate with the name, place and price: the system detail header<br>Not LandingHero: a page-opening marketing hero, not a listing photo |  |

### Key facts

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `factRow` | InfoStatRow `ar-info-stat-row` | `items`=[{"icon":"clock","label":"4,210 hrs"},{"icon":"user-group"," |  | Icon and short label in one row, scannable at a glance |  |

### About

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `aboutText` | ExpandableText `ar-expandable-text` | `lines`=4 |  | Long seller copy clamped to four lines with Read more |  |

### Specification

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `specList` | DetailList `ar-detail-list` | `items`=[{"label":"Serial number","value":"5530"},{"label":"Registra |  | Label and value rows, the system way to list facts |  |
| `photo` | `<figure>` |  |  |  |  |
| `photoImg` | `<img>` |  |  |  |  |
| `photoCaption` | `<figcaption>` |  |  |  |  |

### On board

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `amenityList` | AmenityList `ar-amenity-list` | `items`=[{"icon":"wifi","label":"Ka-band Wi-Fi"},{"icon":"moon","lab |  | Icon tiles summing up the facilities, 4–6 items |  |

### Contact the seller

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `fullName` (field `fullName`) | TextField `ar-text-field` |  |  | Who is asking |  |
| `email` (field `email`) | TextField `ar-text-field` |  |  | Where the records link goes |  |
| `phone` (field `phone`) | TextField `ar-text-field` |  |  | Brokers call serious buyers |  |
| `intent` (field `intent`) | MobileSegmented `ar-mobile-segmented` |  |  | Buy, lease or charter changes who answers |  |
| `message` (field `message`) | TextField `ar-text-field` |  |  | Optional question for the seller |  |
| `financing` (field `financing`) | Checkbox `ar-checkbox` |  |  | Optional; routes the lead to a financing partner as well |  |
| `desktopSubmit` | Button `button[arButton], a[arButton]` | `variant`=primary<br>`size`=lg<br>`block`=true<br>`iconEnd`=arrow-right |  | At 1280 the form sits in the side column with its own button; the sticky bar is a phone and tablet pattern |  |

### Send

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `ctaBar` | StickyActionBar `ar-sticky-action-bar` |  |  | The system's bottom CTA: price summary plus one button |  |
| `ctaTotal` [arSummary] | `<strong>` |  |  |  |  |
| `ctaNote` [arSummary] | `<span>` |  |  |  |  |
| `ctaButton` | Button `button[arButton], a[arButton]` | `variant`=primary<br>`size`=lg<br>`iconEnd`=arrow-right |  | The one primary action |  |

## Forms and validation

### enquiry

Submit: **Contact seller** → POST /api/aircraft/g550/enquiries { fullName, email, phone, intent, message, financing }. Success: burst (“The broker has your message”). Failure: Network or 5xx: danger Toast with Retry, the form stays filled; 429: Toast asking to wait a minute.

Errors show after a field is left or on submit; submit focuses the first invalid field.

| Field | Control | Default | Rules | Messages | Keyboard / autofill |
|---|---|---|---|---|---|
| **Full name** `fullName` | TextField |  | required, maxLength(80) | required: “Enter your name.”<br>maxLength: “Names are at most 80 characters.” | autocomplete=name |
| **Email** `email` | TextField |  | required, email | required: “Enter your email.”<br>email: “Enter an email like name@example.com.” | type=email, autocomplete=email, inputMode=email |
| **Phone** `phone` | TextField |  | required, phone | required: “Enter a phone number.”<br>phone: “Enter a number with its country code, like +971 50 123 4567.” | type=tel, autocomplete=tel, inputMode=tel |
| **I want to** `intent` | MobileSegmented | buy | required | required: “Choose what you want to do.” |  |
| **Message (optional)** `message` | TextField |  | maxLength(500) | maxLength: “Keep it under 500 characters.” | autocomplete=off |
| **I would like financing options** `financing` | Checkbox | false |  |  |  |

## Motion

| Where | Use | Why |
|---|---|---|
| Arriving from the listing card | RouteTransition (shared-axis-x) | Forward navigation from the list; back returns along the same axis |

Everything settles instantly under `prefers-reduced-motion` or `provideAiriona({ motion: 'reduce' })`.

## Accessibility

- One h1: "Gulfstream G550", visually hidden because the PlaceHero plate shows the name; sections use h2.
- The photo has alt text describing what it shows; the PlaceHero photo is named by the listing title.
- The sticky bar submits the contact form; on an empty submit focus moves to the first invalid field.
- The intent switch is a labelled group of three options; arrow keys move between them.

## Notes

- Records are behind buyer verification; the form only starts the conversation.
- The second photo is the cabin; the gallery (5 photos) opens from the PlaceHero in the product app.

## Spec check

✅ No errors


## Build it

```bash
node tools/page/airiona.mjs check aircraft-detail   # lint, handoff, scaffold, build, screenshots
npx ng serve playground                    # then open http://localhost:4200/#/aircraft-detail
```

Generated code: `projects/playground/src/app/pages/aircraft-detail/`. Copy that folder into the product app with `shared/page-form.ts` and `shared/validators.ts`, then replace the sample data with the real sources listed above.

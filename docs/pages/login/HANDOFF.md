# Log in

> Generated from `docs/pages/login/page.spec.json` by `node tools/page/airiona.mjs render login`. Edit the spec, not this file.

| | |
|---|---|
| Audience | A returning traveller signing in on their phone to manage a trip, sometimes on hotel or airport Wi-Fi, often with saved passwords |
| Primary action | Sign in with email and password |
| Source | screenshot · `docs/pages/login/source.jpg` |
| Route | `/login` (playground: `#/login`) |
| Framework | angular |

The source is a desktop sign-in page: a pill top nav, a two-panel card (blue fabric art with a headline on the left, the form on the right) and a dark footer. It shows no phone layout, no error states and no pending state; those are designed here. The brand in the source is a placeholder (Glintz); this conversion uses Airiona.

## Screens

| 390 px (phone) | 768 px (tablet) | 1280 px (desktop) |
|---|---|---|
| ![390](shots/390.png) | ![768](shots/768.png) | ![1280](shots/1280.png) |

Page checks (`shoot`): 0 errors, 0 warnings. Spec check (`lint`) is at the end of this document.

## Layout, mobile first

| Section | Purpose | 390 | 768 | 1280 | Sticky | Notes |
|---|---|---|---|---|---|---|
| **Airiona** `topbar` | Brand and a way back to the public site on phones | stack | ↑ | ↑ |  | hidden at lg |
| **Site navigation** `nav` | The source's pill navigation: brand plus Home, Services, Features, Team | stack | ↑ | ↑ |  | hidden at base |
| **Log in** `signIn` | The form: the reason the page exists, so it comes first on phones | stack | ↑ | ↑ (aside) |  |  |
| **Manage your trips in one place** `promo` | The source's left art panel: brand art and a one-line promise | stack | ↑ | ↑ |  | hidden at base |
| **Contact and legal** `footer` | Contact line, legal links and copyright from the source footer | stack | split | ↑ |  |  |

## Components

### Airiona

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `appBar` | AppBar `ar-app-bar` | `title`=Airiona |  | Phone screens get a compact top bar; the source's four-link pill nav does not fit 390px<br>Not TopNav: four links plus brand overflow a phone; it returns at 1280 |  |

### Site navigation

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `topNav` | TopNav `ar-top-nav` | `links`=[{"value":"home","label":"Home"},{"value":"services","label" |  | Matches the source's centred pill of links with the brand on the left<br>Not SideNav: an app sidebar for a public sign-in page |  |
| `navSignup` [arActions] | Button `button[arButton], a[arButton]` | `variant`=secondary<br>`size`=sm |  | Fills TopNav's actions slot; without it TopNav shows its default search and notification buttons, which a signed-out page cannot use |  |

### Log in

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `heading` | `<h1>` |  |  |  |  |
| `lede` | `<p>` |  |  |  |  |
| `email` (field `email`) | TextField `ar-text-field` | `label`=Email<br>`type`=email<br>`autocomplete`=email<br>`inputMode`=email<br>`iconStart`=envelope<br>`placeholder`=name@example.com |  | Labelled field with an icon, hint and error built in; type email brings up the @ keyboard<br>Not FieldTile: opens a picker, not the keyboard |  |
| `password` (field `password`) | TextField `ar-text-field` | `label`=Password<br>`type`=password<br>`autocomplete`=current-password<br>`iconStart`=lock-closed |  | Same field family as email; with type password it brings its own Show password button, and current-password lets password managers fill it |  |
| `remember` (field `remember`) | Checkbox `ar-checkbox` | `label`=Remember me |  | Independent yes/no choice inside a form<br>Not Switch: switches apply immediately; this is part of the submission |  |
| `forgot` | `<a>` |  |  |  |  |
| `submit` | Button `button[arButton], a[arButton]` | `variant`=primary<br>`size`=lg<br>`block`=true |  | The one primary action: midnight ink pill, full width on every size like the source |  |
| `or` | `<p>` |  |  |  |  |
| `social` | **GAP** |  |  | Brand sign-in buttons |  |
| `signup` | `<p>` |  |  |  |  |
| `signupLink` | `<a>` |  |  |  |  |

### Manage your trips in one place

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `hero` | HeroHeader `ar-hero-header` | `eyebrow`=Airiona<br>`title`=Manage your trips in one place<br>`image`=assets/art/globe.webp<br>`headingLevel`=2 |  | Midnight panel with art and a headline, the system's version of the source's blue fabric panel<br>Not StayCard: a priced stay card, wrong meaning<br>Not FeatureCard: smaller card with an open button |  |
| `heroText` [arBelowTitle] | `<p>` |  |  |  |  |

### Contact and legal

| Element | Component | Inputs | Data | Why this one | States |
|---|---|---|---|---|---|
| `pitch` | `<p>` |  |  |  |  |
| `contact` | `<p>` |  |  |  |  |
| `legal` | `<p>` |  |  |  |  |

## Forms and validation

### login

Submit: **Log in** → POST /api/auth/session { email, password, remember }. Success: navigate. Failure: 401: danger Toast ‘That email and password don't match.’ and clear only the password; 429: Toast ‘Too many tries. Wait a minute and try again.’ with the button disabled for the wait.

Errors show after a field is left or on submit; submit focuses the first invalid field.

| Field | Control | Default | Rules | Messages | Keyboard / autofill |
|---|---|---|---|---|---|
| **Email** `email` | TextField |  | required, email, maxLength(254) | required: “Enter the email you signed up with.”<br>email: “Enter an email like name@example.com.”<br>maxLength: “Emails are at most 254 characters.” | type=email, autocomplete=email, inputMode=email |
| **Password** `password` | TextField |  | required, minLength(8) | required: “Enter your password.”<br>minLength: “Passwords are at least 8 characters.” | type=password, autocomplete=current-password |
| **Remember me** `remember` | Checkbox | false |  |  |  |

## Motion

| Where | Use | Why |
|---|---|---|
| Arriving from the public site and leaving after sign-in | RouteTransition (fade-through) | Top-level change of context |

Everything settles instantly under `prefers-reduced-motion` or `provideAiriona({ motion: 'reduce' })`.

## Accessibility

- One h1 (‘Log in’); the promo hero renders its title as h2 (headingLevel 2).
- After a failed sign-in, focus returns to the password field and the toast is announced (role=status).
- Do not block paste in the password field.

## Gaps

| Element | Need | Nearest today | Proposal |
|---|---|---|---|
| social | Facebook, Apple and Google sign-in buttons with brand marks | IconButton (no brand glyphs in Heroicons) | Add a SocialSignIn component with official brand marks and provider-required wording (‘Continue with Google’), full-width on phones |

## Notes

- Phone order: form first, art hidden (it adds height without helping sign-in); the art returns from 768.
- The source's 'Forget password?' is corrected to 'Forgot password?'.
- No sticky bottom bar: the whole form fits above the fold at 390 × 844, so the button is already in reach.
- The source's nav has nothing on the right; TopNav needs something in its actions slot (otherwise it shows search and notifications), so it carries a Sign up button.

## Spec check

✅ No errors

- ⚠️ sections: a page with a form usually keeps its primary action reachable on phones: a section with sticky.base "bottom" (StickyActionBar)

## Build it

```bash
node tools/page/airiona.mjs check login   # lint, handoff, scaffold, build, screenshots
npx ng serve playground                    # then open http://localhost:4200/#/login
```

Generated code: `projects/playground/src/app/pages/login/`. Copy that folder into the product app with `shared/page-form.ts` and `shared/validators.ts`, then replace the sample data with the real sources listed above.

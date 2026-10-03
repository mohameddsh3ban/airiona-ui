// Writes components/<Comp>/preview.html and README.md for the Airiona system.
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "airiona-ds", "project", "components");

const C = {};
const { motionMd } = require("./motion-spec.cjs");
function comp(name, group, height, body, readme, stageStyle) {
  C[name] = { group, height, body, readme, stageStyle: stageStyle || "" };
}

/* ---------- Foundations ---------- */
comp("Icon", "Foundations", 300, `
h('div', { className: 'ar-col', style: { gap: 16 } },
  h('div', { className: 'ar-row', style: { gap: 10, color: 'var(--ink)' } },
    ['magnifying-glass','paper-airplane','calendar-days','map-pin','globe-alt','home-modern','building-office-2','ticket','briefcase','credit-card','wallet','users','user-circle','heart','star','bell','chat-bubble-left-right','arrows-right-left','adjustments-horizontal','funnel','arrow-up-on-square','arrow-up-right','check-circle','exclamation-triangle','information-circle','x-mark','plus','minus','clock','wifi','shield-check','sparkles'].map(n => h('span', { key: n, title: n, style: { display: 'inline-grid', placeItems: 'center', width: 44, height: 44, borderRadius: 12, background: 'var(--surface)' } }, h(A.Icon, { name: n, size: 22 })))),
  h('div', { className: 'ar-row', style: { gap: 10, color: 'var(--ink)' } },
    ['star','heart','check-circle','exclamation-triangle','information-circle','bell'].map(n => h('span', { key: n, title: n + ' (solid)', style: { display: 'inline-grid', placeItems: 'center', width: 44, height: 44, borderRadius: 12, background: 'var(--blue-50)', color: 'var(--blue-600)' } }, h(A.Icon, { name: n, variant: 'solid', size: 22 }))),
    h('span', { style: { width: 1, height: 28, background: 'var(--line)', margin: '0 6px' } }),
    A.Icon.additions.map(n => h('span', { key: n, title: n + ' (Airiona addition)', style: { display: 'inline-grid', placeItems: 'center', width: 44, height: 44, borderRadius: 12, background: 'var(--surface)', boxShadow: 'inset 0 0 0 1.5px var(--blue-200)' } }, h(A.Icon, { name: n, size: 22 })))),
  h('span', { className: 'body-sm', style: { color: 'var(--ink-muted)' } }, A.Icon.heroicons.length + ' Heroicons outline · ' + A.Icon.solidNames.length + ' solid · ' + A.Icon.additions.length + ' Airiona travel additions (blue outline)'))
`, `# Icon

Heroicons v2.2 (MIT, Tailwind Labs): the full 24px outline set at 1.5 stroke and the full solid set, plus five travel glyphs Heroicons does not have.

**Consumer provides:** \`name\` (any Heroicons name, kebab-case, as on heroicons.com), optional \`variant\` (\`outline\` default | \`solid\`), \`size\` (default 20), \`strokeWidth\` (default 1.5; leave it), \`label\` (only when the icon stands alone and carries meaning).

- In production, import Heroicons directly: \`import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"\` and \`"@heroicons/react/24/solid"\`. \`Icon.reactName("magnifying-glass")\` returns the export name.
- Outline is the default everywhere. Solid only for: filled rating stars, a saved heart, and status marks inside toasts and banners (\`check-circle\`, \`exclamation-triangle\`, \`information-circle\`).
- Airiona additions, drawn on the same grid and stroke because Heroicons has no equivalent: \`plane\`, \`bed\`, \`bath\`, \`utensils\`, \`car\`. Ship them as local SVG components next to Heroicons.
- Icons inherit \`currentColor\`. Colour them by setting \`color\` on the parent.
- Sizes: 14 in badges and tile labels, 16 in small buttons, 18 in fields and icon buttons, 20 default, 22–24 in amenity tiles and empty states.
- v1.0 short names still resolve (\`search\` → \`magnifying-glass\`, \`x\` → \`x-mark\`, \`settings\` → \`cog-6-tooth\`, \`more\` → \`ellipsis-horizontal\`…). Use the Heroicons names in new code.
- Never mix in another icon family, and never use emoji as icons.
`);

comp("Scene", "Foundations", 200, `
h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 } },
  ['sky','alpine','coast','dusk','forest'].map(v => h('div', { key: v, style: { display: 'flex', flexDirection: 'column', gap: 6 } },
    h('div', { style: { aspectRatio: '4/3', borderRadius: 18, overflow: 'hidden' } }, h(A.Scene, { variant: v })),
    h('span', { className: 'ar-mono', style: { fontSize: 12, color: 'var(--ink-subtle)' } }, v))))
`, `# Scene

A drawn landscape that stands in for photography while real images are not wired up yet. Five variants: \`sky\`, \`alpine\`, \`coast\`, \`dusk\`, \`forest\`.

**Consumer provides:** \`variant\`, optional \`label\`.

- Every media slot in the system (\`FlightTicket\`, \`StayCard\`, \`DestinationCard\`) takes an \`image\` URL first and falls back to a Scene. Ship real photography in production.
- Each variant has a matching dark \`tint\` (\`Scene.tint(variant)\`) used by \`StayCard\` to fade the photo into its text area. When you pass a real photo, pass a \`tint\` sampled from the photo's darkest third.
- Photography direction: wide, calm, natural light, plenty of sky. No people looking at camera, no heavy filters, no text baked in.
`);

/* ---------- Actions ---------- */
comp("Button", "Actions", 256, `
h('div', { className: 'ar-col', style: { gap: 18 } },
  h('div', { className: 'ar-row' },
    h(A.Button, { variant: 'primary' }, 'Check availability'),
    h(A.Button, { variant: 'brand', arrow: true }, 'Join Airiona Plus'),
    h(A.Button, { variant: 'secondary', iconStart: 'adjustments-horizontal' }, 'Filters'),
    h(A.Button, { variant: 'soft' }, 'Export'),
    h(A.Button, { variant: 'ghost', iconEnd: 'chevron-down' }, 'Default view')),
  h('div', { className: 'ar-row' },
    h(A.Button, { variant: 'primary', size: 'lg', arrow: true }, 'Book now'),
    h(A.Button, { variant: 'primary', size: 'sm' }, 'Sign in'),
    h(A.Button, { variant: 'brand', loading: true }, 'Paying…'),
    h(A.Button, { variant: 'primary', disabled: true }, 'Sold out')),
  h('div', { className: 'ar-row', style: { padding: 14, borderRadius: 20, background: 'var(--blue-500)' } },
    h(A.Button, { variant: 'white' }, 'Reserve'),
    h(A.Button, { variant: 'glass', arrow: true }, 'View deal')))
`, `# Button

Pill buttons in three sizes. The primary action is midnight ink, not blue: blue is reserved for brand moments and selection.

**Consumer provides:** \`children\` (label), \`variant\`, \`size\`, optional \`iconStart\`, \`iconEnd\`, \`arrow\`, \`loading\`, \`block\`, \`href\` (renders an \`<a>\`), and any native button props.

| variant | use |
|---|---|
| \`primary\` | The one main action per view: Book now, Check availability, Pay. |
| \`brand\` | Promotional or membership actions, and the final Pay step. At most one per screen. |
| \`secondary\` | Neutral actions next to a primary: Filters, Share itinerary. |
| \`soft\` | Toolbar actions inside cards: Export, Download. |
| \`ghost\` | Menus and inline view switches. |
| \`white\` / \`glass\` | Only on photography or the midnight panel. |

- \`arrow\` adds the signature arrow disc. Use it for actions that open a new place (a deal, a listing, a class), not for form submits.
- Sizes: \`sm\` 36px in dense cards and nav, \`md\` 44px default, \`lg\` 56px for booking bars and stay cards.
- Labels are verbs that say what happens: "Reserve", "Pay $1,284". Never "Submit" or "Click here".
- While a payment is in flight, use \`loading\` and change the label ("Paying…"); the button disables itself.
`);

comp("IconButton", "Actions", 120, `
h('div', { className: 'ar-row' },
  h(A.IconButton, { icon: 'bell', label: 'Notifications', badge: true }),
  h(A.IconButton, { icon: 'cog-6-tooth', label: 'Settings', variant: 'soft' }),
  h(A.IconButton, { icon: 'chevron-left', label: 'Back', variant: 'outline' }),
  h(A.IconButton, { icon: 'arrow-up-right', label: 'Open', variant: 'ink' }),
  h(A.IconButton, { icon: 'magnifying-glass', label: 'Search', variant: 'brand', size: 'lg' }),
  h('div', { className: 'ar-row', style: { padding: 12, borderRadius: 999, background: 'linear-gradient(135deg, var(--blue-300), var(--sky-200))' } },
    h(A.IconButton, { icon: 'arrow-up-on-square', label: 'Share', variant: 'white' }),
    h(A.IconButton, { icon: 'heart', label: 'Save', variant: 'glass', 'aria-pressed': 'true' })))
`, `# IconButton

A circular button that holds one icon. Always round.

**Consumer provides:** \`icon\`, \`label\` (required: becomes \`aria-label\` and tooltip), \`variant\`, \`size\`, optional \`badge\` (unread dot), \`aria-pressed\` for toggles.

- \`surface\` on canvas, \`soft\` inside cards, \`outline\` for steppers and calendar arrows, \`ink\` for the "open" arrow on dark-accent cards, \`brand\` only for the search disc.
- \`white\` and \`glass\` only over photography (back, share, save on listing photos).
- A pressed save button (\`aria-pressed="true"\`) fills the heart in \`danger\`.
- Minimum 36px. Never place two \`brand\` icon buttons in one view.
`);

comp("SegmentedControl", "Actions", 198, `
h('div', { className: 'ar-col', style: { gap: 16, alignItems: 'flex-start' } },
  h(A.SegmentedControl, { label: 'Section', options: ['Overview', 'Bookings', 'Payouts', 'Calendar'] }),
  h(A.SegmentedControl, { label: 'Trip', tone: 'brand', size: 'sm', defaultValue: 'round', options: [{ value: 'one', label: 'One way' }, { value: 'round', label: 'Round trip' }, { value: 'multi', label: 'Multi-city' }] }),
  h(A.SegmentedControl, { label: 'Dashboard', tone: 'brand', variant: 'pills', options: [{ value: 'd', label: 'Dashboard' }, { value: 'a', label: 'Analytics' }, { value: 'i', label: 'Invoices', count: 3 }] }))
`, `# SegmentedControl

A pill group for switching between peer views or modes. Covers tabs, trip type and dashboard sections.

**Consumer provides:** \`options\` (strings or \`{value, label, icon?, count?}\`), \`value\` + \`onChange\` (or \`defaultValue\`), \`tone\` (\`ink\` | \`brand\` | \`surface\`), \`variant\` (\`track\` | \`pills\`), \`size\`, \`label\`.

- \`track\` on a sunken track is the default for in-card tabs. \`pills\` with brand tone is the app-level section switcher in the top bar.
- 2 to 5 options. More than 5: use a select or a scrolling chip row.
- Labels are one or two words. Counts are for things that need attention (unpaid invoices), not totals.
`);

comp("Chip", "Actions", 100, `
h('div', { className: 'ar-row' },
  h(A.Chip, { defaultSelected: true, icon: 'building-office-2' }, 'Hotels'),
  h(A.Chip, { icon: 'home' }, 'Cabins'),
  h(A.Chip, { icon: 'wifi', count: 128 }, 'Fast Wi-Fi'),
  h(A.Chip, null, 'Free cancellation'),
  h(A.Chip, null, 'Pool'))
`, `# Chip

A toggle pill for filters and quick choices. Selected chips turn ink.

**Consumer provides:** \`children\`, \`selected\` + \`onChange\` (or \`defaultSelected\`), optional \`icon\`, \`count\` (results that match).

- Use in horizontally scrolling rows above results. Multiple can be selected.
- For mutually exclusive choices use \`SegmentedControl\` instead.
- Read-only labels on cards (Luxury stay, 2-day stay) are tags inside \`StayCard\` or a \`Badge\`, not chips.
`);

/* ---------- Forms ---------- */
comp("TextField", "Forms", 330, `
h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, padding: 20, borderRadius: 24, background: 'var(--surface)' } },
  h(A.TextField, { label: 'Email', placeholder: 'you@example.com', iconStart: 'information-circle', type: 'email', defaultValue: 'maya.haddad@mail.com' }),
  h(A.TextField, { label: 'Password', type: 'password', defaultValue: 'airiona-2026' }),
  h(A.TextField, { label: 'Passport number', placeholder: 'As printed on your passport', hint: 'Needed for international flights.' }),
  h(A.TextField, { label: 'Card number', iconStart: 'credit-card', defaultValue: '4242 4242 4242', error: 'Card number is incomplete. Check the last 4 digits.' }),
  h(A.TextField, { label: 'Promo code', variant: 'sunken', placeholder: 'SKY2026' }),
  h(A.TextField, { label: 'Where to?', variant: 'sunken', iconStart: 'magnifying-glass', placeholder: 'City, airport or hotel' }))
`, `# TextField

A labelled single-line input with optional icon, hint and error. Height 52px.

**Consumer provides:** \`label\` (always), \`placeholder\`, \`hint\`, \`error\` (message string), \`iconStart\`, \`variant\` (\`outline\` default, \`sunken\` inside cards), \`type\`, and native input props.

- The label sits above the field and never disappears. Placeholders show an example, not the label.
- \`type="password"\` adds the show/hide toggle automatically.
- Error messages say what is wrong and how to fix it: "Card number is incomplete. Check the last 4 digits." Never "Invalid input".
- Use \`sunken\` when the field sits on a white card next to other sunken tiles; use the outline on canvas or in auth forms.
- Group related fields in a 2-column grid on desktop, 1 column under 640px.
`);

comp("Checkbox", "Forms", 90, `
h('div', { className: 'ar-row', style: { gap: 28 } },
  h(A.Checkbox, { label: 'Remember me', defaultChecked: true }),
  h(A.Checkbox, { label: 'Add travel insurance' }),
  h(A.Checkbox, { label: 'Window seat (sold out)', disabled: true }))
`, `# Checkbox

A 20px square check for independent yes/no choices in forms.

**Consumer provides:** \`label\`, \`checked\`/\`defaultChecked\`, \`onChange\`, \`disabled\`, native input props.

- Checked state is ink with a white tick. Labels are clickable.
- Use for opt-ins and add-ons inside a form that is submitted later. For settings that apply immediately, use \`Switch\`.
`);

comp("Switch", "Forms", 178, `
h('div', { className: 'ar-col', style: { gap: 18, padding: 20, borderRadius: 24, background: 'var(--surface)', maxWidth: 420 } },
  h(A.Switch, { label: 'Price alerts', description: 'Email me when this route drops below $480.', defaultChecked: true }),
  h(A.Switch, { label: 'Instant book', description: 'Guests can book without waiting for approval.' }))
`, `# Switch

An on/off control for settings that take effect immediately.

**Consumer provides:** \`label\`, optional \`description\`, \`checked\`/\`defaultChecked\`, \`onChange\`.

- On = Ion Blue track. Label states the setting, description states the consequence.
- Never use a switch inside a form that needs a Save button. Use \`Checkbox\` there.
`);

comp("QuantityStepper", "Forms", 260, `
h('div', { style: { padding: '6px 20px', borderRadius: 24, background: 'var(--surface)', maxWidth: 400 } },
  h(A.QuantityStepper, { label: 'Adults', description: 'Ages 13 or above', defaultValue: 2, min: 1 }),
  h(A.QuantityStepper, { label: 'Children', description: 'Ages 2–12', defaultValue: 1 }),
  h(A.QuantityStepper, { label: 'Infants', description: 'Under 2, on lap', max: 2 }))
`, `# QuantityStepper

A labelled minus/value/plus row for counting guests, rooms and bags.

**Consumer provides:** \`label\`, \`description\`, \`value\` + \`onChange\` (or \`defaultValue\`), \`min\`, \`max\`.

- Stack steppers in a popover from the Travellers tile; rows are separated by \`line\`.
- Buttons disable at the bounds; never hide them.
- The description gives the rule that decides the category (age range), not marketing copy.
`);

comp("Calendar", "Forms", 520, `
h(A.Calendar, { year: 2026, month: 9, today: 3, defaultRange: [15, 19], unavailable: [6, 7, 8, 22, 23], lowPrices: [12, 27, 28],
  prices: { 1:'$142', 2:'$138', 3:'$150', 4:'$170', 5:'$166', 9:'$128', 10:'$132', 11:'$136', 12:'$98', 13:'$128', 14:'$140', 15:'$156', 16:'$160', 17:'$188', 18:'$194', 19:'$150', 20:'$138', 21:'$136', 24:'$180', 25:'$176', 26:'$128', 27:'$102', 28:'$99', 29:'$128', 30:'$134', 31:'$190' } })
`, `# Calendar

A month grid for picking a date range, with nightly price under each day and booked-out days hatched.

**Consumer provides:** \`year\`, \`month\` (0–11), \`range\` + \`onRangeChange\` (or \`defaultRange\`) as \`[startDay, endDay]\`, \`unavailable\` (day numbers), \`prices\` (\`{day: "$128"}\`), \`lowPrices\` (days to mark in success), \`today\`, \`legend\`.

- First click sets check-in, second sets check-out. A range that would cross an unavailable day restarts at the clicked day.
- Booked-out days use the signature hatch and a strike-through, so they read without colour.
- Weeks start on Monday. Use the locale's first day in production.
- Show two months side by side on desktop (two Calendars in a flex row), one on mobile.
- Prices use the mono face so digits line up. Keep them to 4 characters ("$128", "€99").
`, "display:flex;justify-content:center;");

comp("BookingSearch", "Forms", 276, `
h(A.BookingSearch, { activeField: 'dep' })
`, `# BookingSearch

The flight search bar: trip type, From ⇄ To with a swap disc, dates, travellers and the brand search disc.

**Consumer provides:** \`from\` and \`to\` (\`{city, code}\`), \`trip\`, \`depart\`, \`ret\`, \`travellers\` (display strings), \`activeField\`, \`onSearch\`, \`extra\` (node at the top right, e.g. a "Flights · Hotels" switch).

- Each field is a tile (sunken, 64px, label above value). Tapping a tile opens its popover: airport list, \`Calendar\`, or \`QuantityStepper\` rows. The active tile gets the blue focus halo.
- Airport codes sit next to the city in mono, never alone.
- Choosing One way removes the Return tile.
- Tiles wrap: on phones the route spans the full width and dates sit two-up below it.
- This is the only place the brand search disc appears.
`, "padding:32px 24px;");

/* ---------- Status ---------- */
comp("Badge", "Status", 110, `
h('div', { className: 'ar-col', style: { gap: 12 } },
  h('div', { className: 'ar-row' },
    h(A.Badge, { tone: 'success', dot: true }, 'Confirmed'),
    h(A.Badge, { tone: 'warning', dot: true }, 'Payment pending'),
    h(A.Badge, { tone: 'danger', dot: true }, 'Cancelled'),
    h(A.Badge, { tone: 'brand', dot: true }, 'Checked in'),
    h(A.Badge, { tone: 'neutral', dot: true }, 'Draft')),
  h('div', { className: 'ar-row' },
    h(A.Badge, { tone: 'ink', icon: 'star' }, 'Top rated'),
    h(A.Badge, { tone: 'brand' }, '+15% for members'),
    h(A.Badge, { tone: 'outline' }, 'Refundable'),
    h(A.Badge, { tone: 'warning', size: 'sm' }, '2 seats left'),
    h('span', { style: { padding: 8, borderRadius: 14, background: 'var(--blue-900)' } }, h(A.Badge, { tone: 'glass' }, 'Luxury stay'))))
`, `# Badge

A small pill for status and short facts.

**Consumer provides:** \`children\` (one to three words), \`tone\`, optional \`dot\`, \`icon\`, \`size\`.

- Booking status always uses a dot plus a word: Confirmed (success), Payment pending (warning), Cancelled (danger), Checked in (brand), Draft (neutral). Never colour alone.
- \`brand\` for offers and member perks, \`ink\` for a single standout fact (Top rated), \`outline\` for policy facts (Refundable).
- \`glass\` only over photography or dark panels.
- Sentence case. No trailing punctuation.
`);

comp("Rating", "Status", 90, `
h('div', { className: 'ar-row', style: { gap: 28 } },
  h(A.Rating, { value: 4.8, count: '2,104' }),
  h(A.Rating, { value: 4.2, size: 14 }),
  h(A.Rating, { value: 4.9, compact: true }))
`, `# Rating

Star score with the number and, when known, the review count.

**Consumer provides:** \`value\` (0–5), optional \`count\` (preformatted string), \`size\`, \`compact\` (one star + number).

- Use \`compact\` in cards and list rows, full stars on the listing page.
- Always show the number; stars alone are not enough.
- Star fill uses \`rating\`; the number uses \`ink\`.
`);

comp("Toast", "Status", 364, `
h('div', { className: 'ar-col', style: { gap: 12 } },
  h(A.Toast, { tone: 'success', title: 'Booking confirmed', time: 'now', action: 'View itinerary', onClose: () => {} }, 'Scandinavian Forest Cabin · 15–19 Oct. Reference K7QX2M.'),
  h(A.Toast, { tone: 'info', title: 'Gate change', time: '2m', onClose: () => {} }, 'SQ 923 now boards from gate B14 at 08:15.'),
  h(A.Toast, { tone: 'danger', title: 'Payment declined', action: 'Try another card' }, 'Your bank declined the charge of $1,284. No money was taken.'))
`, `# Toast

A short notice that floats above the page after something happens.

**Consumer provides:** \`title\`, \`children\` (one sentence), \`tone\` (\`info\` | \`success\` | \`warning\` | \`danger\`), optional \`time\`, \`action\` + \`onAction\`, \`onClose\`.

- Bottom-right on desktop, top-centre on mobile, stacked newest on top, max 3.
- Success and info dismiss after 6s. Danger stays until dismissed and uses \`role="alert"\`.
- The title is the outcome ("Booking confirmed"); the body gives the specifics people need (dates, reference, amount).
- Money errors always say whether money was taken.
`, "max-width:460px;");

comp("BookingSteps", "Status", 152, `
h('div', { style: { padding: '24px 16px', borderRadius: 24, background: 'var(--surface)' } }, h(A.BookingSteps, { current: 2 }))
`, `# BookingSteps

The checkout progress line: Search, Select, Travellers, Payment, Confirmed.

**Consumer provides:** \`steps\` (labels), \`current\` (0-based index).

- Done steps are ink with a tick, the current step is Ion Blue with a soft halo, upcoming steps are outlined numbers.
- Sits at the top of every checkout screen, under the top nav. Done steps can link back.
- Keep labels to one word so five steps fit at 360px.
`);

/* ---------- Identity ---------- */
comp("Avatar", "Identity", 100, `
h('div', { className: 'ar-row', style: { gap: 16 } },
  h(A.Avatar, { name: 'Maya Haddad', size: 'lg' }),
  h(A.Avatar, { name: 'Omar Saleh' }),
  h(A.Avatar, { name: 'Lina Park' }),
  h(A.Avatar, { name: 'Daniel Ruiz', size: 'sm' }),
  h(A.Avatar, { name: 'Aiko Tan', size: 'xs' }))
`, `# Avatar

A round photo or initials for a person.

**Consumer provides:** \`name\` (always, for initials and the accessible name), optional \`src\`, \`size\` (\`xs\` 24 · \`sm\` 32 · \`md\` 40 · \`lg\` 56).

- Initials take one of five fills picked from the name, so the same person always gets the same colour.
- Hosts and guests show their photo when one exists.
`);

comp("AvatarStack", "Identity", 90, `
h('div', { className: 'ar-row', style: { gap: 32 } },
  h(A.AvatarStack, { people: ['Maya Haddad', 'Omar Saleh', 'Lina Park'], extra: 12, caption: h('span', null, h('b', null, '10k+'), ' travellers rated this 4.8') }),
  h(A.AvatarStack, { people: ['Aiko Tan', 'Daniel Ruiz', 'Sara Ali', 'Jon Berg', 'Nour Aziz', 'Eli Cohen'], max: 4 }))
`, `# AvatarStack

Overlapping avatars with an overflow count and an optional caption.

**Consumer provides:** \`people\` (names or \`{name, src}\`), \`max\` (default 4), \`extra\` (people not in the list), \`caption\` (node), \`size\`.

- Use for social proof on landing pages and for trip companions on bookings.
- Captions put the number in bold: "**10k+** travellers rated this 4.8".
`);

/* ---------- Booking ---------- */
comp("FlightTicket", "Booking", 470, `
h(A.FlightTicket, { image: '/_blob/60ab115bcfb8fabb579160935393c8d5', from: { code: 'DXB', city: 'Dubai', time: '08:45' }, to: { code: 'HND', city: 'Tokyo', time: '23:10' }, flight: 'EK 312', duration: '9h 25m · Non-stop', airline: 'Emirates', cabin: 'Business' })
`, `# FlightTicket

The flight card: photo on top, a white panel with origin, route line and destination, and an inset plate of three facts.

**Consumer provides:** \`from\` and \`to\` (\`{code, city, time}\`), \`flight\`, \`duration\`, \`airline\`, \`cabin\` (or \`details\` as \`[{label, value}]\`, exactly 3), optional \`image\`, \`scene\`, \`hideMedia\`.

- Airport codes are the hero: display face, 40px. Cities under them in muted text; times above.
- The route line is dashed with the plane disc in ink at the centre. For connections, put "1 stop · IST" in \`duration\`.
- Use \`hideMedia\` in lists of search results; keep the photo on itinerary and boarding-pass views.
- Max width 440px. In results lists, place it in a 2-column grid on desktop.
`, "display:flex;justify-content:center;");

comp("StayCard", "Booking", 520, `
h('div', { className: 'ar-row', style: { gap: 20, alignItems: 'stretch', flexWrap: 'nowrap' } },
  h(A.StayCard, { image: '/_blob/1c176c3ae32bd7ae8058e90b750cd5aa', tint: '#16313b', photos: 3, title: 'Swiss Alps Retreat', price: '$710', unit: '/night', description: 'A quiet alpine lodge with a heated pool and views over snow-capped peaks.', tags: ['Luxury stay', '2-night min'] }),
  h(A.StayCard, { image: '/_blob/53f2e978dcf6a1ae2733c292918acefd', tint: '#14304a', photos: 4, title: 'Cliff House Lisbon', price: '$480', unit: '/night', description: 'Glass-walled villa above the Atlantic, ten minutes from Cascais.', tags: ['Top rated', 'Sea view'], saved: true }),
  h(A.StayCard, { image: '/_blob/9aea358001db8b3d275a3771f097288f', tint: '#1b1642', photos: 3, title: 'Tokyo Penthouse', price: '$950', unit: '/night', description: 'Rooftop pool and skyline views in the heart of Minato.', tags: ['Cityscape', 'Weekend stay'] }))
`, `# StayCard

The hero card for a place to stay: full-bleed photo that fades into a deep tint, title and price, two tags and a white Reserve button.

**Consumer provides:** \`title\`, \`price\` (formatted), \`unit\`, \`description\` (max 3 lines, clamps), \`tags\` (max 2), \`image\` + \`tint\` (or \`scene\`), \`photos\` (count for dots), \`saved\`, \`onReserve\`, \`cta\`.

- \`tint\` must be dark enough for white text: take the darkest third of the photo and darken it until white text reaches 4.5:1.
- Use in carousels and 3-up grids on canvas. Width 260–320px.
- Price is per night with the unit in small type. Taxes go on the listing page, not here.
- One primary action only. Save lives in the glass heart.
`, "overflow-x:auto;");

comp("DestinationCard", "Booking", 422, `
h('div', { className: 'ar-row', style: { gap: 20, flexWrap: 'nowrap', alignItems: 'flex-start' } },
  h(A.DestinationCard, { image: '/_blob/2945e954a94bd514a00ca3e10f6d0efa', title: 'Hotel Tropical Daisy', rating: 4.7, meta: '1.2 km from centre' }),
  h(A.DestinationCard, { image: '/_blob/01ee3ef20e666d0eb3e5a01099a50262', title: 'Nordic Pine Lodge', rating: 4.9, meta: 'Nuremberg, Germany', saved: true }))
`, `# DestinationCard

A photo card with a frosted glass plate: name, rating, a location line and a small Book now button.

**Consumer provides:** \`title\`, \`rating\`, \`meta\` (distance or place), \`image\` (or \`scene\`), \`saved\`, \`onBook\`, \`cta\`.

- Use for browsing grids (hotels near you, popular destinations). For the featured row use \`StayCard\`.
- The glass plate needs a busy photo behind it to read as glass; on flat images it still meets contrast because the glass is 72% white.
- The photo scales 4% on hover; nothing else moves.
`, "overflow-x:auto;");

comp("BookingBar", "Booking", 237, `
h('div', { className: 'ar-col', style: { gap: 20 } },
  h('div', { style: { borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow-card)' } }, h(A.BookingBar, { price: '€128', unit: '/ night', dates: '20–25 May · 2 guests' })),
  h(A.BookingBar, { floating: true, was: '$1,420', price: '$1,284', unit: 'total', dates: 'Incl. taxes and fees', cta: 'Continue to payment', ctaVariant: 'brand', arrow: 'arrow-right' }))
`, `# BookingBar

The sticky price-and-action bar at the bottom of a listing or checkout.

**Consumer provides:** \`price\`, \`unit\`, \`dates\` (or a fees note), optional \`was\` (struck price), \`cta\`, \`ctaVariant\`, \`arrow\`, \`floating\`, \`onAction\`.

- Mobile: docked to the bottom with \`z-sticky\`, full width, plus the safe-area inset. Desktop: \`floating\` inside the right column.
- The dates line is underlined because it opens the date picker.
- Show the total with taxes on the last step of checkout and say so ("Incl. taxes and fees").
`);

comp("AmenityList", "Booking", 172, `
h('div', { style: { padding: 16, borderRadius: 24, background: 'var(--surface)' } },
  h(A.AmenityList, { items: [{ icon: 'users', label: '4 guests' }, { icon: 'bed', label: '2 bedrooms' }, { icon: 'bath', label: '1 bathroom' }, { icon: 'utensils', label: 'Kitchen' }, { icon: 'wifi', label: 'Wi-Fi' }, { icon: 'car', label: 'Parking' }] }))
`, `# AmenityList

A row of icon tiles that sums up a stay: guests, rooms, key facilities.

**Consumer provides:** \`items\` (\`[{icon, label}]\`), optional \`plain\` (no tile behind icons).

- Show 4–6 items on cards and listing headers; the full list goes in a sheet.
- Labels start with the number when there is one ("2 bedrooms").
`);

/* ---------- Dashboard ---------- */
comp("StatCard", "Dashboard", 378, `
h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 } },
  h(A.StatCard, { icon: 'wallet', label: 'Revenue this week', value: '$84,210', delta: '+12.4%', caption: 'vs last week', onOpen: () => {},
    bars: { values: [42, 58, 36, 74, 61, 88, 52], highlight: 5, flag: '$18.2k', axis: ['M','T','W','T','F','S','S'] } }),
  h(A.StatCard, { tone: 'ink', icon: 'ticket', label: 'Bookings today', value: '1,284', delta: '+8%', caption: 'on 1,189 yesterday', onOpen: () => {},
    bars: { values: [30, 44, 52, 40, 64, 70, 58], highlight: 5, flag: '312', axis: ['8','10','12','14','16','18','20'] } }),
  h(A.StatCard, { tone: 'brand', icon: 'building-office-2', label: 'Occupancy', value: '87%', delta: '-3%', caption: 'across 42 properties',
    bars: { values: [72, 81, 90, 84, 78, 92, 87], highlight: 6, flag: '87%', axis: ['W36','W37','W38','W39','W40','W41','W42'] } }))
`, `# StatCard

A dashboard tile: label with icon, a headline figure, a delta and an optional hatched bar chart.

**Consumer provides:** \`label\`, \`value\` (formatted), \`icon\`, \`delta\` (string starting with + or -), \`caption\`, \`tone\` (\`surface\` | \`ink\` | \`brand\`), \`onOpen\`, \`bars\` (\`{values, highlight, flag, axis, inkIndex}\`).

- Bars are hatched by default; the highlighted bar is solid Ion Blue with a value flag. One highlight per chart.
- Per row of stat cards: at most one \`ink\` and one \`brand\` tile; the rest \`surface\`.
- Deltas carry an arrow icon as well as colour. The caption says what the delta is compared to.
- Figures use the display face with tabular numerals.
`);

/* ---------- Navigation ---------- */
comp("SideNav", "Navigation", 500, `
h('div', { style: { padding: 16, borderRadius: 28, background: 'var(--surface)', maxWidth: 280 } },
  h(A.SideNav, { defaultValue: 'overview', sections: [
    { title: 'Home', items: [{ value: 'overview', icon: 'squares-2x2', label: 'Overview' }, { value: 'bookings', icon: 'ticket', label: 'Bookings', count: 12 }, { value: 'calendar', icon: 'calendar', label: 'Calendar' }, { value: 'guests', icon: 'users', label: 'Guests' }] },
    { title: 'Business', items: [{ value: 'listings', icon: 'building-office-2', label: 'Listings' }, { value: 'payouts', icon: 'wallet', label: 'Payouts' }, { value: 'reports', icon: 'chart-bar', label: 'Reports' }] }] }))
`, `# SideNav

The vertical app navigation for the operator dashboard.

**Consumer provides:** \`sections\` (\`[{title, items:[{value, icon, label, count?}]}]\`), \`value\` + \`onChange\` (or \`defaultValue\`), \`label\`.

- The active item is an ink pill. Counts are Ion Blue and only for things waiting on the user.
- Group titles are overlines. Two or three groups, max 6 items each.
- Under 1024px it collapses into a sheet opened from a menu IconButton.
`);

comp("TopNav", "Navigation", 120, `
h(A.TopNav, { links: [{ value: 'f', label: 'Flights' }, { value: 'h', label: 'Hotels' }, { value: 's', label: 'Stays' }, { value: 'c', label: 'Car rental' }], user: { name: 'Maya Haddad', email: 'maya.haddad@mail.com' } })
`, `# TopNav

The top bar: wordmark, a pill group of primary sections, actions and the signed-in user.

**Consumer provides:** \`links\` (\`[{value, label}]\`), \`value\` + \`onChange\`, \`user\` (\`{name, email?, avatar?}\`), optional \`actions\` (nodes), \`brand\` (node replacing the wordmark).

- Sticky at \`z-sticky\` on canvas. The active section is Ion Blue.
- Signed out: replace the user block with \`Button variant="primary" size="sm"\` "Sign in".
- Under 768px the links move into a horizontally scrolling row under the wordmark.
`);

/* ---------- Overlays & data (v1.1) ---------- */
comp("Dialog", "Overlays", 470, `
h(A.Dialog, { inline: true, tone: 'danger', title: 'Cancel this booking?', description: 'Scandinavian Forest Cabin · 15–19 Oct · 2 guests. You are inside the free cancellation window.',
  footer: [h(A.Button, { key: 'k', variant: 'secondary' }, 'Keep booking'), h(A.Button, { key: 'c', variant: 'danger' }, 'Cancel and refund $512')] },
  h('div', { className: 'ar-plate' },
    h('div', { className: 'ar-plate__row' }, 'Paid on 2 Oct', h('b', null, '$640')),
    h('div', { className: 'ar-plate__row' }, 'Cleaning fee (non-refundable)', h('b', null, '−$128')),
    h('div', { className: 'ar-plate__row ar-plate__row--total' }, 'Refund to Visa ··4242', h('b', null, '$512'))))
`, `# Dialog

A modal panel that asks for one decision or one short task, over a blurred scrim. On phones it becomes a bottom sheet.

**Consumer provides:** \`open\`, \`onClose\`, \`title\`, \`description\`, \`children\` (body), \`footer\` (buttons, primary last), optional \`tone\` (\`default\` | \`danger\` | \`success\` | \`brand\`), \`icon\` (or \`false\`), \`size\` (\`sm\` 420 · \`md\` 520 · \`lg\` 720), \`media\` (a \`Scene\` or image on top), \`dismissible\` (default true), \`inline\` (render in place, for docs).

- Renders into \`document.body\`, locks page scroll, traps Tab, closes on Escape and scrim click, and returns focus to the element that opened it. Put \`data-autofocus\` on the field that should take focus first.
- Title is a question or an outcome ("Cancel this booking?", "Booking confirmed"). The description states the specifics.
- The confirm button names the consequence with the amount: "Cancel and refund $512", never "OK" or "Yes".
- Money dialogs show the breakdown in an inset plate (\`.ar-plate\`, \`.ar-plate__row\`, \`.ar-plate__row--total\`).
- \`danger\` tone uses \`role="alertdialog"\` and the danger icon. One dialog at a time; never stack them.
- Use a full page, not a dialog, for anything longer than one screen (checkout, profile edit).
`, "padding:0;min-height:100%;");

comp("Select", "Forms", 430, `
h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, padding: 20, borderRadius: 24, background: 'var(--surface)', alignItems: 'start' } },
  h(A.Select, { label: 'Cabin class', defaultOpen: true, defaultValue: 'business', options: [
    { value: 'economy', label: 'Economy', description: '23 kg checked bag', icon: 'briefcase', meta: '$642' },
    { value: 'premium', label: 'Premium economy', description: 'Extra legroom, priority boarding', icon: 'users', meta: '$918' },
    { value: 'business', label: 'Business', description: 'Lie-flat seat, lounge access', icon: 'star', meta: '$2,140' },
    { value: 'first', label: 'First', description: 'Sold out on this flight', icon: 'ticket', disabled: true }] }),
  h(A.Select, { label: 'Departure airport', searchable: true, searchPlaceholder: 'City or airport code', placeholder: 'Choose an airport', options: [
    { value: 'DXB', label: 'Dubai International', meta: 'DXB' }, { value: 'AUH', label: 'Abu Dhabi', meta: 'AUH' }, { value: 'DOH', label: 'Doha Hamad', meta: 'DOH' },
    { value: 'RUH', label: 'Riyadh King Khalid', meta: 'RUH' }, { value: 'CAI', label: 'Cairo International', meta: 'CAI' }, { value: 'IST', label: 'Istanbul', meta: 'IST' }] }),
  h('div', { className: 'ar-col', style: { gap: 18 } },
    h(A.Select, { label: 'Currency', variant: 'sunken', defaultValue: 'usd', options: [{ value: 'usd', label: 'US dollar', meta: 'USD' }, { value: 'eur', label: 'Euro', meta: 'EUR' }, { value: 'aed', label: 'UAE dirham', meta: 'AED' }] }),
    h(A.Select, { label: 'Bed type', placeholder: 'Choose a bed', error: 'Choose a bed type to continue.', options: ['King', 'Twin', 'Sofa bed'] })))
`, `# Select

A dropdown for choosing one value from a list: cabin class, airport, currency, sort order.

**Consumer provides:** \`options\` (strings or \`{value, label, description?, icon?, meta?, disabled?}\`), \`value\` + \`onChange\` (or \`defaultValue\`), \`label\`, \`placeholder\`, \`hint\`, \`error\`, optional \`searchable\` (adds a filter field), \`variant\` (\`outline\` | \`sunken\`), \`size\` (\`md\` 52px | \`sm\` 40px pill, for toolbars), \`align\` (\`end\` opens right-aligned), \`iconStart\`, \`disabled\`.

- Trigger matches \`TextField\` exactly, so selects and fields line up in one form grid.
- Keyboard: Enter, Space or ↓ opens; ↑ ↓ Home End move; Enter picks; Escape and Tab close. Typing goes into the filter when \`searchable\`.
- Use \`description\` to say what makes an option different ("Lie-flat seat, lounge access") and \`meta\` for a price or code in mono.
- Turn on \`searchable\` above 8 options. Above about 50, use an async combobox instead.
- Disabled options stay in the list with the reason in their description ("Sold out on this flight").
- For actions (Edit, Cancel), use \`Menu\`, not Select.
`);

comp("Menu", "Overlays", 339, `
h('div', { className: 'ar-row', style: { gap: 24, alignItems: 'flex-start' } },
  h(A.Menu, { defaultOpen: true, label: 'Booking actions', heading: 'Booking K7QX2M', items: [
    { label: 'View itinerary', icon: 'ticket' }, { label: 'Change dates', icon: 'calendar' }, { label: 'Message guest', icon: 'bell', shortcut: 'M' },
    { divider: true }, { label: 'Download invoice', icon: 'credit-card' }, { label: 'Cancel booking', icon: 'x-mark', tone: 'danger' }] }),
  h('div', { style: { marginLeft: 220 } },
    h(A.Menu, { align: 'start', trigger: h(A.Button, { variant: 'secondary', iconEnd: 'chevron-down', size: 'sm' }, 'Export'), items: [{ label: 'CSV', icon: 'chart-bar' }, { label: 'PDF report', icon: 'credit-card' }] })))
`, `# Menu

An action dropdown: a list of commands under a "more" button or any trigger.

**Consumer provides:** \`items\` (\`[{label, icon?, onSelect?, tone?: 'danger', shortcut?, disabled?}]\` or \`{divider: true}\`), optional \`trigger\` (an element; defaults to a ghost "more" IconButton), \`label\`, \`heading\`, \`align\` (\`end\` default, \`start\`), \`defaultOpen\`.

- Keyboard: Enter, Space or ↓ on the trigger opens and focuses the first item; ↑ ↓ move; Escape closes and returns focus.
- Order: most common first, destructive last after a divider, in \`danger\` tone.
- Destructive items open a \`Dialog\` to confirm; they never act straight from the menu.
- Labels are verbs ("Change dates", "Download invoice"). Max 7 items.
`);

comp("DataTable", "Data", 757, `
(function () {
  var rows = [
    { id: 'K7QX2M', guest: 'Maya Haddad', email: 'maya.haddad@mail.com', stay: 'Scandinavian Forest Cabin', dates: '15–19 Oct', nights: 4, status: 'confirmed', amount: 640 },
    { id: 'P2LM8D', guest: 'Omar Saleh', email: 'omar.s@mail.com', stay: 'Swiss Alps Retreat', dates: '18–20 Oct', nights: 2, status: 'pending', amount: 1420 },
    { id: 'Z9QT4R', guest: 'Lina Park', email: 'lina.park@mail.com', stay: 'Tokyo Penthouse', dates: '21–25 Oct', nights: 4, status: 'confirmed', amount: 3800 },
    { id: 'B4NV1K', guest: 'Daniel Ruiz', email: 'druiz@mail.com', stay: 'Cliff House Lisbon', dates: '9–12 Oct', nights: 3, status: 'cancelled', amount: 1440 },
    { id: 'H3WS7P', guest: 'Aiko Tan', email: 'aiko.tan@mail.com', stay: 'Hotel Tropical Daisy', dates: '1–6 Nov', nights: 5, status: 'checked-in', amount: 990 },
    { id: 'M8KD2Q', guest: 'Sara Ali', email: 'sara.ali@mail.com', stay: 'Nordic Pine Lodge', dates: '3–5 Nov', nights: 2, status: 'confirmed', amount: 412 },
    { id: 'T6RC9L', guest: 'Jon Berg', email: 'jon.berg@mail.com', stay: 'Swiss Alps Retreat', dates: '7–14 Nov', nights: 7, status: 'pending', amount: 4970 }];
  var STATUS = { confirmed: ['success', 'Confirmed'], pending: ['warning', 'Payment pending'], cancelled: ['danger', 'Cancelled'], 'checked-in': ['brand', 'Checked in'] };
  return h(A.DataTable, {
    title: 'Bookings', rows: rows, selectable: true, searchable: true, searchPlaceholder: 'Search reference or guest', pageSize: 5, defaultSort: { key: 'amount', dir: 'desc' },
    actions: [h(A.Select, { key: 's', size: 'sm', defaultValue: 'all', align: 'end', options: [{ value: 'all', label: 'All properties' }, { value: 'cabin', label: 'Cabins' }, { value: 'hotel', label: 'Hotels' }] }), h(A.Button, { key: 'b', variant: 'primary', size: 'sm', iconStart: 'plus' }, 'New booking')],
    bulkActions: function (sel) { return [h(A.Button, { key: 'e', variant: 'white', size: 'sm', iconStart: 'credit-card' }, 'Export ' + sel.length), h(A.Button, { key: 'm', variant: 'brand', size: 'sm', iconStart: 'bell' }, 'Message guests')]; },
    columns: [
      { key: 'id', header: 'Reference', mono: true, sortable: true },
      { key: 'guest', header: 'Guest', sortable: true, searchValue: function (r) { return r.guest + ' ' + r.email; }, render: function (r) { return h('div', { className: 'ar-cell-person' }, h(A.Avatar, { name: r.guest, size: 'sm' }), h('div', null, h('b', null, r.guest), h('small', null, r.email))); } },
      { key: 'stay', header: 'Stay', sortable: true, render: function (r) { return h('div', null, h('div', { style: { fontWeight: 500 } }, r.stay), h('small', { style: { color: 'var(--ink-subtle)', fontSize: 13 } }, r.dates + ' · ' + r.nights + ' nights')); } },
      { key: 'status', header: 'Status', sortable: true, render: function (r) { return h(A.Badge, { tone: STATUS[r.status][0], dot: true }, STATUS[r.status][1]); } },
      { key: 'amount', header: 'Amount', align: 'right', numeric: true, sortable: true, defaultDir: 'desc', render: function (r) { return h('b', { style: { fontWeight: 600 } }, '$' + r.amount.toLocaleString('en-US')); } },
      { key: 'menu', header: h('span', { className: 'ar-sr' }, 'Actions'), width: 56, render: function (r) { return h(A.Menu, { label: 'Actions for ' + r.id, items: [{ label: 'View booking', icon: 'ticket' }, { label: 'Message guest', icon: 'bell' }, { divider: true }, { label: 'Cancel booking', icon: 'x-mark', tone: 'danger' }] }); } }]
  });
})()
`, `# DataTable

A card that lists records with search, sorting, row selection, bulk actions, row menus and pagination. Built for the operator side: bookings, guests, payouts.

**Consumer provides:** \`columns\` (\`[{key, header, render?, accessor?, sortable?, sortValue?, searchValue?, align?, width?, mono?, numeric?, muted?, defaultDir?}]\`), \`rows\`, \`rowKey\` (default \`id\`), optional \`title\`, \`searchable\` + \`searchPlaceholder\`, \`actions\` (toolbar nodes), \`filters\` (chip row), \`selectable\` + \`selected\`/\`onSelectionChange\`, \`bulkActions(selectedKeys)\`, \`pageSize\`, \`defaultSort\` (\`{key, dir}\`), \`onRowClick\`, \`density\` (\`comfortable\` | \`compact\`), \`emptyTitle\`, \`emptyText\`, \`caption\`.

- Rows are 64px (48px compact). Header is sunken, sticky, 12px.
- Put the identifier first in mono (\`mono: true\`), people as avatar + name + email, money right-aligned with \`numeric: true\`, status as a \`Badge\` with dot and word.
- Sorting cycles ascending, descending, off. Set \`sortValue\` when the rendered cell differs from the raw value.
- Selecting rows swaps the toolbar for an ink bulk bar with the count and \`bulkActions\`.
- Row actions sit in a \`Menu\` in the last column; destructive ones confirm with a \`Dialog\`.
- The table scrolls sideways inside its card on narrow screens; the page never does. Under 640px, prefer a card list for guests.
- Empty search result says what was searched and what to try instead.
`);

/* ---------- v1.2: Tabs, Tooltip, DatePicker ---------- */
comp("Tabs", "Navigation", 400, `
h('div', { className: 'ar-col', style: { gap: 28 } },
  h('div', { style: { padding: '8px 24px 24px', borderRadius: 24, background: 'var(--surface)' } },
    h(A.Tabs, { label: 'Listing sections', defaultValue: 'overview', extra: h(A.Button, { variant: 'ghost', size: 'sm', iconStart: 'arrow-up-on-square' }, 'Share'), tabs: [
      { value: 'overview', label: 'Overview', content: h('p', { className: 'body', style: { margin: 0, color: 'var(--ink-muted)', maxWidth: 560 } }, 'A black timber cabin with floor-to-ceiling glass, a wood stove and a deck over the forest floor. 25 minutes from Nuremberg.') },
      { value: 'rooms', label: 'Rooms', count: 2, content: h(A.AmenityList, { items: [{ icon: 'bed', label: '2 bedrooms' }, { icon: 'bath', label: '1 bathroom' }, { icon: 'users', label: '4 guests' }] }) },
      { value: 'reviews', label: 'Reviews', count: 214, content: h(A.Rating, { value: 4.8, count: '214' }) },
      { value: 'policies', label: 'Policies', disabled: true, content: null }] })),
  h(A.Tabs, { variant: 'card', label: 'Trip type', defaultValue: 'flights', tabs: [
    { value: 'flights', label: 'Flights', icon: 'paper-airplane', content: h('div', { className: 'ar-row' }, h(A.Badge, { tone: 'brand', dot: true }, '3 trips upcoming'), h('span', { className: 'body-sm', style: { color: 'var(--ink-muted)' } }, 'Next: EK 312 to Tokyo on Thu, 15 Oct')) },
    { value: 'stays', label: 'Stays', icon: 'home-modern', content: h('span', { className: 'body-sm' }, 'Scandinavian Forest Cabin · 15–19 Oct') },
    { value: 'cars', label: 'Cars', icon: 'truck', content: h('span', { className: 'body-sm' }, 'No car rentals yet.') }] }))
`, `# Tabs

Switches between panels of related content in the same place: listing sections, trip types, booking details.

**Consumer provides:** \`tabs\` (\`[{value, label, icon?, count?, disabled?, content}]\`), \`value\` + \`onChange\` (or \`defaultValue\`), \`label\` (accessible name of the tab list), optional \`variant\` (\`line\` | \`card\`), \`size\` (\`md\` 48px | \`sm\` 40px), \`fitted\` (tabs share the width), \`extra\` (node at the right end of the bar).

- \`line\` is the default: a hairline under the list and a 3px Ion Blue bar that slides to the active tab. Use it inside cards and pages.
- \`card\` turns the active tab into a white folder tab that opens into the panel. Use it on \`canvas\` when the panel is the main object on screen.
- Keyboard: ← → move and select, Home and End jump to the ends, Tab moves into the panel. Only the active tab is in the Tab order.
- Use Tabs when each option has its own panel. To filter or switch a view in place without panels, use \`SegmentedControl\`.
- Labels are one or two words. Counts are totals people care about (214 reviews), not decoration.
- Disabled tabs stay visible when the reason is obvious from context; otherwise leave them out.
`);

comp("Tooltip", "Overlays", 220, `
h('div', { className: 'ar-row', style: { gap: 28, padding: '64px 0 24px', justifyContent: 'center' } },
  h(A.Tooltip, { content: 'Save to your trips', defaultOpen: true }, h(A.IconButton, { icon: 'heart', label: 'Save' })),
  h(A.Tooltip, { content: 'Swap origin and destination', shortcut: 'S', placement: 'bottom' }, h(A.IconButton, { icon: 'arrows-right-left', label: 'Swap', variant: 'soft' })),
  h(A.Tooltip, { title: 'Free cancellation', content: 'Full refund until 13 Oct, 12:00 local time.', tone: 'light', placement: 'right' }, h(A.Badge, { tone: 'outline', icon: 'information-circle' }, 'Refundable')),
  h(A.Tooltip, { content: 'Prices include taxes and fees' }, h(A.Button, { variant: 'secondary', size: 'sm', iconStart: 'receipt-percent' }, 'Price breakdown')))
`, `# Tooltip

A short label that appears on hover or keyboard focus to name an icon or add one fact.

**Consumer provides:** \`content\` (one short sentence), \`children\` (exactly one focusable element), optional \`title\`, \`shortcut\`, \`placement\` (\`top\` | \`bottom\` | \`left\` | \`right\`, flips when there is no room), \`tone\` (\`ink\` | \`light\`), \`delay\` (ms, default 350), \`open\` / \`defaultOpen\`.

- Shows after 350ms on hover and immediately on focus; hides on blur, mouse leave and Escape. It is linked to its trigger with \`aria-describedby\`.
- \`ink\` (midnight, white text) for icon names and shortcuts. \`light\` with a \`title\` for a fact that needs two lines, such as a policy.
- Never put anything you must read or click in a tooltip: no links, no buttons, nothing that only exists there. Touch screens never see it.
- Every icon-only button still needs its own \`label\`; the tooltip repeats it visually, it does not replace it.
- Max 260px wide. If it needs more, use inline text or a \`Dialog\`.
`);

comp("DatePicker", "Forms", 630, `
(function () {
  var prices = {};
  ['2026-10-12','2026-10-13','2026-10-14','2026-10-15','2026-10-16','2026-10-17','2026-10-18','2026-10-19','2026-10-20','2026-10-21','2026-10-24','2026-10-25','2026-10-26','2026-10-27','2026-10-28','2026-10-29','2026-10-30','2026-10-31','2026-11-01','2026-11-02','2026-11-03','2026-11-04','2026-11-05','2026-11-06','2026-11-07','2026-11-08'].forEach(function (d, i) { prices[d] = '$' + [128, 98, 140, 156, 160, 188, 194, 150, 138, 136, 180, 176, 128, 102, 99, 128, 134, 190, 172, 128, 118, 112, 120, 158, 196, 176][i]; });
  return h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, padding: 20, borderRadius: 24, background: 'var(--surface)', alignItems: 'start' } },
    h(A.DatePicker, { mode: 'range', variant: 'tiles', defaultOpen: true, today: '2026-10-03', min: '2026-10-03', defaultValue: ['2026-10-15', '2026-10-19'],
      unavailable: ['2026-10-06', '2026-10-07', '2026-10-08', '2026-10-22', '2026-10-23'], prices: prices, lowPrices: ['2026-10-13', '2026-10-27', '2026-10-28'],
      presets: [{ label: 'This weekend', value: ['2026-10-09', '2026-10-11'] }, { label: 'Next week', value: ['2026-10-12', '2026-10-19'] }, { label: 'Late Oct', value: ['2026-10-26', '2026-10-31'] }] }),
    h('div', { className: 'ar-col', style: { gap: 18 } },
      h(A.DatePicker, { label: 'Departure', today: '2026-10-03', min: '2026-10-03', defaultValue: '2026-10-15' }),
      h(A.DatePicker, { label: 'Date of birth', placeholder: 'Choose a date', max: '2026-10-03', today: '2026-10-03', hint: 'As printed on your passport.' })));
})()
`, `# DatePicker

A date field that opens a calendar in a popover. Picks one date, or a check-in and check-out range across months.

**Consumer provides:** \`mode\` (\`single\` | \`range\`), \`value\` + \`onChange\` (ISO \`"2026-10-15"\`, or \`[start, end]\` in range mode) or \`defaultValue\`, \`label\`, optional \`variant\` (\`field\` default | \`tiles\` for range: Check-in and Check-out side by side | \`sunken\`), \`min\`, \`max\`, \`unavailable\` (ISO dates), \`isDateDisabled(iso)\`, \`prices\` (\`{iso: "$128"}\`), \`lowPrices\`, \`presets\` (\`[{label, value}]\`), \`months\` (1 or 2; range defaults to 2, phones always get 1), \`startLabel\`, \`endLabel\`, \`unit\` (default "night"/"nights"), \`inclusive\` (count both ends, for day ranges), \`maxNights\`, \`today\`, \`placeholder\`, \`hint\`, \`error\`, \`align\`.

- Values are ISO date strings in the property's local time. Never pass Date objects with times; check-in is a calendar day, not an instant.
- Range picking: first click sets check-in, second sets check-out. A range that would cross a booked-out day starts again from the clicked day. Hovering shows the stay before you commit.
- The footer always states the result in words ("15–19 Oct · 4 nights") with Clear and Done.
- Booked-out days are hatched and struck through. Prices sit under each day in mono; \`lowPrices\` turn green.
- Keyboard: ← → ↑ ↓ move by day and week, Page Up and Page Down by month, Home and End to the week's ends, Enter picks, Escape closes.
- Use \`tiles\` in booking search and listing pages; use the field for forms (passport expiry, date of birth).
- \`Calendar\` stays for a single month shown inline on a page; DatePicker is the field people tap.
`);

/* ---------- v1.3: Analytics (ref board 2) ---------- */
comp("MetricTile", "Analytics", 268, `
h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 } },
  h(A.MetricTile, { label: 'Guests today', value: '327', caption: 'New arrivals', delta: '+4.7%', icon: 'user' }),
  h(A.MetricTile, { label: 'Staff on shift', value: '75', caption: 'Housekeeping', delta: '-1.2%', icon: 'lifebuoy' }),
  h(A.MetricTile, { label: 'Status breakdown', value: '1,350', caption: 'Bookings', icon: 'user-group', split: [{ value: '87', label: 'Confirmed', tone: 'success' }, { value: '46', label: 'Pending', tone: 'warning' }] }))
`, `# MetricTile

A compact KPI tile: label with a blue icon square, a big figure, a caption and either a delta or two side figures.

**Consumer provides:** \`label\`, \`value\`, \`caption\`, \`icon\`, and either \`delta\` (string starting with + or -) or \`split\` (\`[{value, label, tone}]\`, max 2), optional \`tone\`.

- Delta shows the number in success or danger with a filled arrow disc, so direction never depends on colour alone.
- Use \`split\` for a breakdown that adds context to the main figure (Confirmed / Pending), with status tones.
- Place 3–4 in a row at the top of operator dashboards.
`);

comp("PillBarChart", "Analytics", 392, `
h(A.PillBarChart, { eyebrow: 'Bookings by stay type', title: 'Track your stays', unit: 'bookings', onOpen: null, highlight: 4,
  data: [{ label: 'Cabins', value: 5 }, { label: 'Villas', value: 8 }, { label: 'Hotels', value: 11 }, { label: 'Lofts', value: 9 }, { label: 'Suites', value: 12 }, { label: 'Hostels', value: 7 }, { label: 'Camps', value: 10 }] })
`, `# PillBarChart

Tall rounded bars inside pale pill tracks, one highlighted in Ion Blue with a value tooltip. Hover moves the highlight.

**Consumer provides:** \`data\` (\`[{label, value}]\`, 4–8 items), \`eyebrow\`, \`title\`, \`unit\` (word after the tooltip value), optional \`highlight\` (index), \`max\`, \`onOpen\` (shows the chevron button; pass \`null\` for a button without a handler).

- Bars are ink; only the highlighted bar is blue. Labels sit under each track; long labels truncate.
- Use for comparing categories at a glance. For time series use \`BalanceChart\` or \`EfficiencyChart\`.
`);

comp("SegmentGauge", "Analytics", 384, `
h(A.SegmentGauge, { eyebrow: 'Booking mix', title: 'Rate status', onOpen: null, total: '800', totalLabel: 'Total bookings',
  segments: [{ label: 'Flexible', value: 80, display: '80%' }, { label: 'Non-refundable', value: 11.5, display: '11.5%' }, { label: 'Corporate', value: 8.5, display: '8.5%' }] })
`, `# SegmentGauge

A half-donut of chunky, rounded segments with a gap between each, the total in the middle and a legend underneath.

**Consumer provides:** \`segments\` (\`[{label, value, display?, tone?}]\`, 2–4), \`total\`, \`totalLabel\`, \`eyebrow\`, \`title\`, optional \`onOpen\`.

- Default tones in order: \`blue-500\`, \`blue-300\`, \`action\`, \`line-strong\`. They differ in lightness, so the parts stay apart without colour vision.
- Segments are proportional to \`value\`; \`display\` is the text shown in the legend.
`);

comp("RatingBreakdown", "Analytics", 352, `
h('div', { style: { maxWidth: 380 } }, h(A.RatingBreakdown, { eyebrow: 'Guest review results', title: 'Metrics rating', onOpen: null, score: '7.8', scoreLabel: 'Average rating',
  segments: [{ label: 'Excellent', value: 38 }, { label: 'Good', value: 25 }, { label: 'Fair', value: 18 }, { label: 'Improved', value: 8 }],
  note: 'Highlight stays needing improvement with tips from top hosts.' }))
`, `# RatingBreakdown

An average score with a star, then a stacked bar split into rated bands with the percentage above each part.

**Consumer provides:** \`score\`, \`scoreLabel\`, \`segments\` (\`[{label, value, tone?}]\`, percentages), \`eyebrow\`, \`title\`, optional \`note\`, \`onOpen\`.

- Bar widths follow the values; each part keeps a 28px minimum so its label fits.
- The note gives the action that follows from the numbers.
`);

comp("Leaderboard", "Analytics", 439, `
h('div', { style: { maxWidth: 380 } }, h(A.Leaderboard, { eyebrow: 'Top host score', title: 'Top 5 rating', onOpen: null, items: [
  { name: 'Alice Johnson', role: 'Forest Cabin host', score: '8.5', label: 'Excellent', ring: 'blue-300' },
  { name: 'Elisabeth Kim Tjow', role: 'Guest relations', roleTone: 'success', score: '7.8', label: 'Good', ring: 'sky-200' },
  { name: 'Mark Lee', role: 'Concierge', roleTone: 'blue-700', score: '7.8', label: 'Good', ring: 'blue-500' },
  { name: 'Theodorus Ronald', role: 'Penthouse host', score: '7.2', label: 'Good', ring: 'blue-500' },
  { name: 'Bessie Cooper', role: 'Villa host', roleTone: 'warning', score: '7.2', label: 'Good', ring: 'blue-300' }] }))
`, `# Leaderboard

A ranked list: avatar with a coloured ring, name, role in a tone colour, star score and a word rating.

**Consumer provides:** \`items\` (\`[{name, role, roleTone?, score, label, avatar?, ring?}]\`, 3–5), \`eyebrow\`, \`title\`, optional \`onOpen\`.

- Role colours come from text-safe tokens only (\`blue-600\`, \`blue-700\`, \`success\`, \`warning\`), so every role passes 4.5:1.
- The word rating always accompanies the score.
`);

comp("StripeDistribution", "Analytics", 230, `
h('div', { className: 'ar-w', style: { maxWidth: 560 } }, h(A.StripeDistribution, { unit: 'cancellations', groups: [{ label: 'Guest request', count: 45, bars: 6 }, { label: 'Weather', count: 165, bars: 13 }, { label: 'Other', count: 65, bars: 7 }] }))
`, `# StripeDistribution

A row of thin pill stripes coloured by group, with each group's count above it and a legend below. Shows proportion with texture instead of one solid bar.

**Consumer provides:** \`groups\` (\`[{label, count, bars, tone?}]\`), \`unit\`.

- \`bars\` is the number of stripes per group; keep the total between 20 and 32.
- Used inside \`AbsenceCard\`; works alone inside any card.
`);

comp("Heatmap", "Analytics", 343, `
h('div', { className: 'ar-w', style: { maxWidth: 360 } }, h(A.Heatmap, { label: 'Cancellation rate by weekday', rows: ['1%', '2%', '3%', '4%', '>5%'], cols: ['M', 'T', 'W', 'T', 'F'], highlight: [3, 3],
  values: [[4, 2, 3, 4, 3], [2, 2, 3, 2, 4], [3, 4, 4, 3, 2], [2, 2, 2, 0, 1], [1, 1, 1, 1, 1]] }))
`, `# Heatmap

A grid of rounded cells shaded in five Ion Blue steps, with row and column labels. One cell can be highlighted in ink.

**Consumer provides:** \`rows\`, \`cols\` (labels), \`values\` (matrix of levels 0–4), optional \`highlight\` (\`[row, col]\`), \`label\` (accessible description).

- Levels map to \`surface-sunken\`, \`blue-200\`, \`blue-400\`, \`blue-600\`, \`blue-900\`: a single-hue scale that reads by lightness.
- Cells have a title tooltip with row and column; give the table form of the data elsewhere for screen readers.
`);

comp("AbsenceCard", "Analytics", 334, `
h(A.AbsenceCard, { eyebrow: 'Identify cancellation causes', title: 'Cancellations', info: 'Monitor the share, total and trend of cancelled stays.', unit: 'stays',
  groups: [{ label: 'Guest request', count: 45, bars: 6 }, { label: 'Weather', count: 165, bars: 13 }, { label: 'Other', count: 65, bars: 7 }],
  heatRows: ['1%', '2%', '3%', '4%', '>5%'], heatCols: ['M', 'T', 'W', 'T', 'F'], heatHighlight: [3, 3], heatLabel: 'Cancellation rate by weekday',
  heat: [[4, 2, 3, 4, 3], [2, 2, 3, 2, 4], [3, 4, 4, 3, 2], [2, 2, 2, 0, 1], [1, 1, 1, 1, 1]] })
`, `# AbsenceCard

The combined card from the analytics board: a white inner card with title, info note and \`StripeDistribution\`, beside a \`Heatmap\`, on a sunken tray.

**Consumer provides:** \`eyebrow\`, \`title\`, \`info\`, \`groups\`, \`unit\`, \`heatRows\`, \`heatCols\`, \`heat\`, \`heatHighlight\`, \`heatLabel\`.

- Spans two dashboard columns. Under 720px the heatmap stacks below.
`);

/* ---------- v1.3: Widgets (ref board 3) ---------- */
comp("ToggleTile", "Widgets", 228, `
h('div', { className: 'ar-row', style: { gap: 16, alignItems: 'stretch' } },
  h('div', { style: { width: 200 } }, h(A.ToggleTile, { title: 'Wi-Fi', status: 'On · Airiona_Guest', icon: 'wifi' })),
  h('div', { style: { width: 200 } }, h(A.ToggleTile, { title: 'Do not disturb', status: 'Until 08:00', offStatus: 'Off', icon: 'moon', defaultChecked: false })))
`, `# ToggleTile

A square tile for one setting: icon disc, open arrow, title, status line and a large switch with a soft blue glow when on.

**Consumer provides:** \`title\`, \`status\`, \`offStatus\`, \`icon\`, \`checked\` + \`onChange\` (or \`defaultChecked\`), optional \`onOpen\`.

- The switch applies immediately; the arrow opens the setting's detail.
- Size: 180–220px wide in a widget grid.
`);

comp("ArrivalTile", "Widgets", 216, `
h('div', { style: { width: 220 } }, h(A.ArrivalTile, { eta: '53min', from: { code: 'DXB', city: 'Dubai', time: '14:30' }, to: { code: 'IST', city: 'Istanbul', time: '16:30' }, progress: 0.6 }))
`, `# ArrivalTile

A midnight tile counting down to landing: big ETA, both airports with times, and a glowing progress line along the bottom edge.

**Consumer provides:** \`eta\`, \`from\` and \`to\` (\`{code, city, time}\`), \`progress\` (0–1), optional \`eyebrow\`.

- Pair with \`GateTile\` on the trip screen; use \`FlightTicket\` when the full booking matters.
`);

comp("RingStatCard", "Widgets", 221, `
h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 } },
  h(A.RingStatCard, { value: '2.8', unit: 'km', ring: { value: 0.64, label: '64', unit: 'km' }, stats: [{ label: 'Duration', value: '08:21' }, { label: 'Avg. speed', value: '18.4 km/h' }, { label: 'Calories', value: '134 kcal' }] }),
  h(A.RingStatCard, { tone: 'dark', icon: 'arrow-turn-left-up', value: '300', unit: 'm', ring: { value: 0.64, label: '64', unit: 'km' }, stats: [{ label: 'ETA', value: '10:21' }, { label: 'Time left', value: '18 min' }, { label: 'Distance left', value: '6.4 km' }] }))
`, `# RingStatCard

A headline measurement with its unit, a thin progress ring, and three labelled stats below a hairline. Light for activity summaries, dark for live navigation.

**Consumer provides:** \`value\`, \`unit\`, optional \`icon\` (e.g. a turn arrow), \`ring\` (\`{value 0–1, label, unit}\`), \`stats\` (\`[{label, value}]\`, exactly 3), \`tone\` (\`light\` | \`dark\`).

- Use dark while something is in progress (turn-by-turn to the property), light for a finished summary.
`);

comp("HabitTile", "Widgets", 216, `
h('div', { style: { width: 200 } }, h(A.HabitTile, { eyebrow: 'Habits', title: 'Daily check-in', caption: '10m left', progress: 0.72, icon: 'pencil-square' }))
`, `# HabitTile

A midnight tile for a recurring task: eyebrow, task name, time left in blue, and a progress ring with an icon.

**Consumer provides:** \`title\`, \`caption\`, \`progress\` (0–1), \`icon\`, optional \`eyebrow\`.
`);

comp("GateTile", "Widgets", 216, `
h('div', { style: { width: 200 } }, h(A.GateTile, { code: 'B18', title: 'Gate open', caption: 'Boarding closes in 26 min' }))
`, `# GateTile

A ticket-like tile with punched corner dots and an arrow: gate code in large display type, status and time.

**Consumer provides:** \`code\`, \`title\`, \`caption\`.

- The four corner dots echo a boarding pass. Keep the code to 2–4 characters.
`);

comp("VoiceRecorder", "Widgets", 248, `
h('div', { style: { width: 220 } }, h(A.VoiceRecorder, { title: 'Voice note', date: '12.08.26', time: '01:12:25', position: 0.62 }))
`, `# VoiceRecorder

A midnight tile for a voice note: title, date, settings button, waveform with a red playhead, running time and a red pause button.

**Consumer provides:** \`title\`, \`date\`, \`time\`, \`waveform\` (bar heights), \`position\` (0–1), \`playing\`.

- Red here means recording, the one place \`danger\` is used outside errors.
`);

comp("BatteryTile", "Widgets", 240, `
h('div', { style: { width: 200 } }, h(A.BatteryTile, { percent: 57, caption: '~ 5 hours left', label: 'Key card battery' }))
`, `# BatteryTile

Charge level as a bolt and percentage over five rounded cells that fill from the bottom, with time remaining.

**Consumer provides:** \`percent\`, \`caption\`, optional \`cells\` (default 5), \`label\` (accessible name).
`);

comp("MediaPlayer", "Widgets", 238, `
h('div', { style: { maxWidth: 320 } }, h(A.MediaPlayer, { title: 'Lounge at dusk', artist: 'Airiona Sessions', scene: 'dusk', elapsed: '0:18', remaining: '-2:24', progress: 0.3 }))
`, `# MediaPlayer

A compact player: artwork, title and artist, brand disc, a scrubber with times, and five controls with play/pause in ink.

**Consumer provides:** \`title\`, \`artist\`, \`art\` (node) or \`scene\`, \`elapsed\`, \`remaining\`, \`progress\` (0–1), \`playing\`.

- Heroicons used: arrows-right-left (shuffle), backward, play/pause, forward, queue-list.
`);

comp("AnalogClock", "Widgets", 248, `
h('div', { className: 'ar-row', style: { gap: 16 } }, h('div', { style: { width: 200 } }, h(A.AnalogClock, { time: '07:02:46' })), h('div', { style: { width: 200 } }, h(A.AnalogClock, { live: true })))
`, `# AnalogClock

A clock face with Roman quarter numerals, minute ticks, ink hands, an Ion Blue second hand and a faded digital minute behind.

**Consumer provides:** \`time\` ("HH:MM:SS", static) or nothing for a live clock; \`live={false}\` freezes it.

- Use for the property's local time next to \`WorldClock\`.
`);

comp("RecordingTile", "Widgets", 224, `
h('div', { style: { width: 200 } }, h(A.RecordingTile, { title: 'Lobby camera', status: 'Recording', elapsed: '00:34:20' }))
`, `# RecordingTile

A tile for a live capture: blue icon disc, title, state and elapsed time, with a large red stop button. Pressing it switches to an ink start button.

**Consumer provides:** \`title\`, \`status\`, \`elapsed\`, \`icon\`, \`recording\`.
`);

comp("ActivityCalendar", "Widgets", 499, `
h('div', { style: { maxWidth: 380 } }, h(A.ActivityCalendar, { title: 'Daily activity', year: 2026, month: 10, days: { 2: 'goal', 3: 'partial', 4: 'partial', 5: 'goal', 6: 'goal', 7: 'goal', 8: 'today' } }))
`, `# ActivityCalendar

A midnight month of round day cells: goal met (blue fill), partly met (blue ring), today (red), with a month tag floating over day 1.

**Consumer provides:** \`year\`, \`month\` (0–11), \`days\` (\`{dayNumber: 'goal' | 'partial' | 'today'}\`), \`title\`, \`legend\`, \`showMonthTag\`.

- Use for streaks (daily check-ins, cleaning rounds). For picking dates use \`DatePicker\`.
`);

comp("WorldClock", "Widgets", 218, `
h('div', { className: 'ar-row', style: { gap: 16, alignItems: 'stretch' } },
  h('div', { style: { width: 200 } }, h(A.WorldClock, { city: 'Shibuya, Tokyo', zone: 'GMT +9 · Aug 12', period: 'PM', time: '10:25', diff: '+4H', dayProgress: 0.66 })),
  h('div', { style: { width: 200 } }, h(A.WorldClock, { tone: 'dark', city: 'Lisbon', zone: 'GMT +1 · Aug 12', period: 'AM', time: '02:25', diff: '-4H', dayProgress: 0.42 })))
`, `# WorldClock

A city's local time with a day-progress slider and the offset from you in a pill. Light and dark versions.

**Consumer provides:** \`city\`, \`zone\`, \`period\`, \`time\`, \`diff\` (string with sign), \`dayProgress\` (0–1), \`tone\`.

- Ahead uses \`success\`, behind uses \`danger\`, and the sign is always in the text.
`);

comp("RideTile", "Widgets", 270, `
h('div', { style: { width: 220 } }, h(A.RideTile, { image: '/_blob/f389d5fab664473bcc9fbd2612dfd030', provider: 'Transfer', eta: '2', title: 'Meet at the pickup point', vehicle: 'Mercedes-Benz E', plate: 'S00121' }))
`, `# RideTile

An airport transfer card: provider word, ETA disc, car illustration, meeting instruction, vehicle and plate.

**Consumer provides:** \`provider\`, \`eta\`, \`etaUnit\`, \`title\`, \`vehicle\`, \`plate\`, optional \`art\` (replace the drawn car with a photo).

- The plate uses mono so it can be read character by character.
`);

comp("ChargingTile", "Widgets", 216, `
h('div', { style: { width: 220 } }, h(A.ChargingTile, { percent: 68, timeLeft: '37 min left' }))
`, `# ChargingTile

A midnight tile for an EV charging bay: state, percentage and time left, a 0–50–100 scale and a glowing blue fill bar with a grip line.

**Consumer provides:** \`percent\`, \`timeLeft\`, optional \`status\`.
`);

comp("TripSummaryTile", "Widgets", 219, `
h('div', { style: { maxWidth: 320 } }, h(A.TripSummaryTile, { image: '/_blob/1e0bff333adb6b32d551053f16d61c02', title: 'Electric scooter', date: '12 Aug 2026', stats: [{ label: 'Distance', value: '3.2', unit: 'km' }, { label: 'Avg. speed', value: '18.4', unit: 'km/h' }, { label: 'Energy', value: '134', unit: 'Wh' }] }))
`, `# TripSummaryTile

A finished-ride summary: vehicle art in a tile, title and date, a soft badge, and three stats with small units.

**Consumer provides:** \`title\`, \`date\`, \`stats\` (\`[{label, value, unit}]\`), optional \`art\`, \`badgeIcon\`.
`);

comp("Ring", "Widgets", 100, `
h('div', { className: 'ar-row', style: { gap: 20 } }, h(A.Ring, { value: 0.64, size: 64 }, h('b', null, '64'), h('span', null, 'km')), h(A.Ring, { value: 0.3, size: 48 }, h('b', null, '30%')), h('div', { className: 'ar-w ar-w--dark', style: { padding: 12 } }, h(A.Ring, { value: 0.8, size: 56 }, h(A.Icon, { name: 'bolt', size: 20 }))))
`, `# Ring

A thin circular progress ring with anything centred inside. Ink on light, blue on dark.

**Consumer provides:** \`value\` (0–1), \`size\`, \`stroke\`, \`children\` (label), \`ariaLabel\`.
`);

/* ---------- v1.3: Workspace (ref board 4) ---------- */
comp("ProfileProjectCard", "Workspace", 376, `
h('div', { style: { maxWidth: 420 } }, h(A.ProfileProjectCard, { person: { name: 'Lina Park', role: 'Revenue manager' }, project: 'Nordic Pine Lodge', metaLabel: 'Segment', meta: 'Boutique cabins', progress: 0.34, progressLabel: 'Onboarding progress', unread: true,
  reports: [{ value: 'occ', label: 'Occupancy report' }, { value: 'rev', label: 'Revenue report' }, { value: 'rev2', label: 'Reviews digest' }] }))
`, `# ProfileProjectCard

A brand-blue project card with the owner at the top, a notched top-right corner holding two round buttons, the project name, a progress bar, and a report picker with a send button.

**Consumer provides:** \`person\` (\`{name, role, avatar?}\`), \`project\`, \`metaLabel\`, \`meta\`, \`progress\` (0–1), \`progressLabel\`, \`reports\` (Select options), \`onSend\`, \`unread\`, \`notchBg\` (colour behind the card, default \`canvas\`).

- The notch is a real cut-out, not a border: set \`notchBg\` to whatever the card sits on.
`);

comp("MeetingsStrip", "Workspace", 330, `
h('div', { style: { maxWidth: 420 } }, h(A.MeetingsStrip, { title: 'Upcoming meetings', summary: '3 calls · Thu, 11', month: 'sep', months: [{ value: 'sep', label: 'September' }, { value: 'oct', label: 'October' }], defaultValue: '11',
  days: [{ date: '8', weekday: 'Mon' }, { date: '9', weekday: 'Tue', count: 1 }, { date: '10', weekday: 'Wed' }, { date: '11', weekday: 'Thu', count: 3 }, { date: '12', weekday: 'Fri' }, { date: '13', weekday: 'Sat' }] }))
`, `# MeetingsStrip

A week strip of tall pill days with a month picker, a call summary and a dotted timeline that tracks the selected day.

**Consumer provides:** \`title\`, \`summary\`, \`days\` (\`[{date, weekday, count?}]\`), \`value\` + \`onChange\` (or \`defaultValue\`), \`month\`, \`months\` (Select options).

- Days are radio buttons. A small dot marks days that have meetings.
`);

comp("RoadmapGantt", "Workspace", 414, `
h('div', { style: { maxWidth: 520 } }, h(A.RoadmapGantt, { title: 'Property launch', days: ['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15', 'Fri 16'], today: 3,
  tasks: [{ label: 'Photos', start: 0, end: 2, progress: 1, tone: 'done', people: ['Lina Park', 'Omar Saleh'] }, { label: 'Pricing', start: 1.5, end: 5, progress: 0.59, tone: 'muted', people: ['Aiko Tan'] }, { label: 'Listing copy', start: 0, end: 5, progress: 0.75, tone: 'brand', people: ['Maya Haddad', 'Jon Berg', 'Sara Ali'] }] }))
`, `# RoadmapGantt

A five-day roadmap: pill bars that fill to their progress, hatched remainder, avatars at the end, dashed day lines and an ink "today" marker.

**Consumer provides:** \`title\`, \`days\` (labels), \`today\` (index), \`tasks\` (\`[{label, start, end, progress, tone: 'done' | 'muted' | 'brand', people}]\`; start and end in day units, halves allowed), \`onAdd\`, \`addLabel\`.

- The hatch marks work not done yet, the same meaning as booked-out days: not this one, not yet.
`);

comp("DateChip", "Workspace", 90, `
h('div', { className: 'ar-row' }, h(A.DateChip, { day: '19', weekday: 'Tue', month: 'January' }), h(A.DateChip, { day: '3', weekday: 'Sat', month: 'October' }))
`, `# DateChip

A pill showing today's date: the day number in an ink disc, weekday and month beside it.

**Consumer provides:** \`day\`, \`weekday\`, \`month\`.
`);

comp("EfficiencyChart", "Workspace", 279, `
h('div', { style: { width: 260 } }, h(A.EfficiencyChart, { title: 'Occupancy', period: 'January', delta: '+40%' }))
`, `# EfficiencyChart

A midnight card with a glowing blue area chart, a ringed marker on the key point and a white delta pill above it.

**Consumer provides:** \`title\`, \`period\`, \`delta\`, \`data\` (values), \`highlight\` (index).

- The chart bleeds to the card edges; keep the card at least 220px tall.
`);

comp("TotalTimeTile", "Workspace", 216, `
h('div', { style: { width: 240 } }, h(A.TotalTimeTile, { icon: 'moon', label: 'Total nights booked', value: '645', unit: 'nights' }))
`, `# TotalTimeTile

A sky tile with an icon disc, a label and one big total with its unit.

**Consumer provides:** \`icon\`, \`label\`, \`value\`, \`unit\`, optional \`tone\`.
`);

comp("AssistantCard", "Workspace", 224, `
h('div', { style: { width: 260 } }, h(A.AssistantCard, { image: '/_blob/36329184ecbdb69cee0bf46389393dea' }))
`, `# AssistantCard

An entry card for the AI assistant: a glossy blue orb, a notched top-left corner holding a brand arrow button, and a three-line label with the middle word bold.

**Consumer provides:** \`onOpen\`, \`openLabel\`, optional \`art\` (replace the orb with a portrait), \`lines\` (nodes), \`notchBg\`.
`);

comp("Notch", "Workspace", 208, `
h('div', { className: 'ar-row', style: { gap: 16 } },
  h('div', { className: 'ar-w ar-w--brand', style: { width: 240, height: 160 } }, h(A.Notch, { corner: 'tr' }, h(A.IconButton, { icon: 'bell', variant: 'white', label: 'Notifications' })), h('b', { style: { marginTop: 'auto', font: '600 20px/24px var(--font-display)' } }, 'Top-right notch')),
  h('div', { className: 'ar-w ar-w--dark', style: { width: 240, height: 160 } }, h(A.Notch, { corner: 'tl' }, h(A.IconButton, { icon: 'arrow-up-right', variant: 'brand', label: 'Open' })), h('b', { style: { marginTop: 'auto', font: '600 20px/24px var(--font-display)' } }, 'Top-left notch')))
`, `# Notch

The inverted-corner cut-out from the workspace board: a corner of the card is carved away with concave curves on both sides, and the gap holds round buttons.

**Consumer provides:** \`corner\` (\`tr\` | \`tl\`), \`children\` (one or two IconButtons), \`bg\` (the colour behind the card; default \`canvas\`).

- Place inside any \`.ar-w\` card. The cut is painted with \`bg\`, so it must match what the card sits on.
- Use at most one notch per card, and only where the buttons belong to the whole card.
`);

/* ---------- v1.3: Pilot dashboard parts (ref 1) ---------- */
comp("ChannelCard", "Dashboard", 518, `
h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14 } },
  h(A.ChannelCard, { name: 'Direct', icon: 'globe-alt', amount: '$42,850', delta: '+5.9%', updated: '56 sec ago', chart: { type: 'line', data: [30, 34, 31, 36, 33, 58, 44, 46, 41, 45, 40, 44], marker: 11, label: '$25,000', date: 'Fri, Dec 31' } }),
  h(A.ChannelCard, { name: 'Mobile app', icon: 'device-phone-mobile', amount: '$56,200', delta: '+5.9%', updated: '56 sec ago', chart: { type: 'bars', data: [2, 3, 2, 4, 5, 3, 6, 4, 3, 2, 8, 4, 10, 3, 4, 7, 5, 3, 2, 3, 2], highlight: 12, label: '$16,240', date: 'Fri, Dec 31' } }),
  h(A.ChannelCard, { name: 'Partners', icon: 'building-storefront', amount: '$82,250', delta: '+3.9%', updated: '42 sec ago', chart: { type: 'meter', value: 0.14, label: '$20,160', date: 'Fri, Dec 31' } }),
  h(A.ChannelCard, { name: 'Corporate', icon: 'briefcase', amount: '$120,250', delta: '+4.9%', updated: '42 sec ago', chart: { type: 'step', data: [10, 10, 11, 12, 20, 30, 34, 34, 34, 34], marker: 7, label: '$20,160', date: '16 Dec' } }))
`, `# ChannelCard

The top-row card from the pilot dashboard: channel icon and name, amount with a green delta and an update time, then one of four chart panels.

**Consumer provides:** \`name\`, \`icon\`, \`amount\`, \`delta\`, \`updated\`, \`chart\` with \`type\`:
- \`line\`: midnight panel, blue line, white marker with a fading drop line, value bottom-right. \`{data, marker, label, date}\`
- \`bars\`: sky panel, white bars on a dashed baseline, midnight tooltip. \`{data, highlight, label, date}\`
- \`meter\`: midnight panel, sky fill block and a fading barcode. \`{value 0–1, label, date}\`
- \`step\`: Ion Blue panel, white curve, ringed marker, white value pill with the date under it. \`{data, marker, label, date}\`

- Use all four in one row, one per channel, so each card reads differently at a glance.
`);

comp("PromptCard", "Dashboard", 481, `
h('div', { style: { width: 280 } }, h(A.PromptCard, { image: '/_blob/36329184ecbdb69cee0bf46389393dea', question: 'How did my bookings perform over the last 3 months?', sources: [{ icon: 'globe-alt', label: 'Direct' }, { icon: 'device-phone-mobile', label: 'Mobile app' }, { icon: 'building-storefront', label: 'Partners' }] }))
`, `# PromptCard

"Question of the day": a chip, a 3D glass orb (the same art direction as onboarding) floating over a sky-to-blue panel, the suggested question in white, the data sources it will use, and an ink "Ask AI Assistant" button.

**Consumer provides:** \`question\`, \`sources\` (\`[{icon, label}]\`), \`onAsk\`, optional \`eyebrow\`, \`cta\`, \`art\`.

- The question is set at 19px semibold so white text meets the large-text contrast floor on the blue gradient.
`);

comp("BalanceChart", "Dashboard", 436, `
h(A.BalanceChart, { label: 'Total revenue', value: '$325,000.69', yLabels: ['$60k', '$45k', '$30k', '$15k', '$0'], bars: [40, 52, 46, 70, 58, 74, 62, 80, 55, 72, 68, 44], selection: [3, 8], tooltip: { value: '$42,250.69', date: 'Jan 25, 2026' } })
`, `# BalanceChart

The centre chart of the pilot dashboard: total with bar/line view toggles, fading background bars, a highlighted range with a blue edge and an ink tooltip, and range tabs below.

**Consumer provides:** \`label\`, \`value\`, \`bars\` (values), \`yLabels\`, \`selection\` (\`[fromIndex, toIndex]\`), \`tooltip\` (\`{value, date}\`), \`ranges\`, \`range\` + \`onRange\` (or \`defaultRange\`).
`);

comp("HoldingsPanel", "Dashboard", 432, `
h('div', { style: { maxWidth: 340 } }, h(A.HoldingsPanel, { title: 'Top properties', linkLabel: 'See all properties', groups: [
  { title: 'Total value', items: [{ name: 'Forest Cabin', sub: 'Nuremberg', symbol: 'F', tone: 'sky', value: '$19.8k' }, { name: 'Tokyo Penthouse', sub: 'Minato', icon: 'building-office-2', tone: 'brand', value: '$14.4k' }] },
  { title: 'Occupancy trend', items: [{ name: 'Forest Cabin', sub: 'Nuremberg', symbol: 'F', tone: 'sky', spark: [2, 3, 2, 5, 9, 6, 4, 2, 3, 2], change: '+6.5%' }, { name: 'Tokyo Penthouse', sub: 'Minato', icon: 'building-office-2', tone: 'brand', spark: [2, 2, 4, 3, 9, 5, 3, 2, 2, 3], change: '+6.5%' }] }] }))
`, `# HoldingsPanel

A white card with a title and "see all" link, holding a midnight panel of grouped rows: token disc, name and sub-line, then a value or a sparkbar with a change pill.

**Consumer provides:** \`title\`, \`linkLabel\`, \`href\` or \`onLink\`, \`groups\` (\`[{title, items: [{name, sub, symbol | icon, tone: 'sky' | 'brand', value | (spark + change)}]}]\`).
`);

comp("SparkBars", "Dashboard", 90, `
h('div', { className: 'ar-w ar-w--dark', style: { flexDirection: 'row', gap: 24, width: 'fit-content' } }, h(A.SparkBars, { values: [2, 3, 2, 5, 9, 6, 4, 2, 3, 2] }), h(A.SparkBars, { values: [5, 4, 6, 3, 2, 4, 8, 3, 2, 4] }))
`, `# SparkBars

A 70×24 micro bar chart; the peak bar is solid, the rest are translucent. Built for dark panels.

**Consumer provides:** \`values\`.
`);

comp("PageHeader", "Navigation", 110, `
h(A.PageHeader, { title: 'Revenue', tabs: [{ value: 'overview', label: 'Overview' }, { value: 'property', label: 'By property' }], defaultTab: 'overview',
  actions: [h(A.Button, { key: 'e', variant: 'secondary', iconStart: 'document-arrow-down' }, 'Export report'), h(A.Button, { key: 'a', variant: 'secondary', iconStart: 'plus' }, 'Add')] })
`, `# PageHeader

The page title row of the pilot dashboard: a large title, an ink pill tab beside it, and secondary actions on the right.

**Consumer provides:** \`title\`, \`tabs\` (SegmentedControl options), \`tab\` + \`onTab\` (or \`defaultTab\`), \`actions\` (buttons).
`);

comp("PilotDashboard", "Screens", 900, `
h(A.PilotDashboard, { promptImage: '/_blob/36329184ecbdb69cee0bf46389393dea' })
`, `# PilotDashboard

The reference layout for the operator dashboard, built only from system parts: an underline top nav with icons, the page header, four ChannelCards (line, bars, meter, step), then PromptCard, BalanceChart and HoldingsPanel.

**Consumer provides:** optional \`nav\` and \`channels\` to replace the sample data; everything else is composed from the documented components.

- Layout: channels in 4 equal columns; second row at 0.82fr / 1.5fr / 1.04fr. Under 1180px it becomes 2 columns with the chart on top; under 720px, 1 column.
- Treat this as the source of truth for spacing: 14px between cards, 22px between rows, 28px page gutter.
`, "padding:12px;");

/* ---------- v1.4: Mobile kit ---------- */
const OB = ["e822ed19166127dee560bf1902688d4a", "1a511f9712094c18a8118a4400a13634", "e43ef137c795388bae09a003312c08ce", "94047840dbddef6203bd3bfedd35ed26", "93d937c2686b042bcd1e3656d02aff4d"].map((id) => "/_blob/" + id);
const NAV = "[{ value: 'home', label: 'Home', icon: 'home' }, { value: 'trips', label: 'Trips', icon: 'ticket' }, { value: 'saved', label: 'Saved', icon: 'heart' }, { value: 'me', label: 'Profile', icon: 'user' }]";
// m(): a 390px mobile canvas for previews (class .m-demo in bundle.css)
const M = (inner, h, extra) => `h('div', { className: 'm-demo${extra ? " " + extra : ""}', style: { height: ${typeof h === "number" ? h : "'auto'"} } }, ${inner})`;

comp("PhoneFrame", "Mobile navigation", 880, `
h('div', { style: { display: 'flex', justifyContent: 'center' } }, h(A.PhoneFrame, {}, h('div', { className: 'm-screen' }, h(A.AppBar, { large: true, eyebrow: 'Thu, 15 Oct', title: 'Today' }), h(A.Timeline, { items: [{ featured: true, title: 'Flight to Tokyo', time: '08:45', text: 'EK 312 · Gate B18', done: true }, { title: 'Hotel check-in', time: '14:00', text: 'Code arrives at noon' }] })), h(A.TabBar, { items: ${NAV} })))
`, `# PhoneFrame

A 390 × 820 device frame with status bar, dynamic island and home indicator, used to present mobile screens in docs and reviews.

**Consumer provides:** \`children\` (usually a \`.m-screen\` scroll area plus a TabBar or StickyActionBar), \`statusTone\` (\`dark\` | \`light\` for dark headers), \`dark\`, \`homeTone\`, \`width\`, \`height\`.

- Docs only. In the app, the real device provides the frame; keep \`.m-screen\` and the safe-area spacing.
- \`.m-screen\` is the scroll container: status-bar padding on top, 20px gutters, 120px bottom padding so content clears the tab bar. Modifiers: \`is-flush\` (no gutters), \`is-top\` (no top padding, for dark headers), \`is-canvas\` (grey ground).
`, "padding:20px 0;");

comp("StatusBar", "Mobile navigation", 120, `
h('div', { className: 'ar-row', style: { gap: 16 } }, ${M("h(A.StatusBar, {})", 60)}, ${M("h(A.StatusBar, { tone: 'light' })", 60, "is-dark")})
`, `# StatusBar

The 9:41 time with signal, Wi-Fi and battery glyphs, positioned over the top 50px of the screen.

**Consumer provides:** \`tone\` (\`dark\` text on light screens, \`light\` on dark headers), \`time\`.

- Docs and prototypes only. In the app, reserve \`env(safe-area-inset-top)\` instead.
`);

comp("AppBar", "Mobile navigation", 444, `
h('div', { className: 'ar-col', style: { gap: 16 } },
  ${M("h(A.AppBar, { title: 'Boarding pass', onBack: function () {}, actions: h(A.IconButton, { icon: 'arrow-up-on-square', label: 'Share', variant: 'soft' }) })", "auto", "is-padded")},
  ${M("h(A.AppBar, { large: true, eyebrow: 'October 15, 2026', title: 'Today', actions: h(A.Avatar, { name: 'Maya Haddad', size: 'lg' }) })", "auto", "is-padded")},
  ${M("h(A.AppBar, { large: true, title: 'Trips', accent: true, titleSuffix: 'Planner' })", "auto", "is-padded")})
`, `# AppBar

The top bar of a mobile screen: compact (back, centred title, actions) or large title (34px) for a tab's root screen.

**Consumer provides:** \`title\`, \`large\`, \`onBack\` (shows the back button; \`null\` for one without a handler), \`actions\`, \`eyebrow\`, \`subtitle\`, \`accent\` (blue square after the title), \`titleSuffix\`, \`tone\` (\`light\` | \`dark\`).

- Root screens of each tab use \`large\`; pushed screens use compact with back.
- Keep at most two actions; extra actions go in an ActionSheet.
`);

comp("TabBar", "Mobile navigation", 396, `
h('div', { className: 'ar-col', style: { gap: 16 } },
  ${M(`h(A.TabBar, { variant: 'dot', items: ${NAV} })`, 96)},
  ${M(`h(A.TabBar, { variant: 'fab', items: ${NAV} })`, 110)},
  ${M(`h(A.TabBar, { variant: 'pill', items: ${NAV} })`, 110, "is-canvas")})
`, `# TabBar

Bottom navigation in three styles: \`dot\` (solid icon and a blue dot), \`fab\` (raised centre create button with a ring), \`pill\` (floating midnight capsule; the active tab is a white disc).

**Consumer provides:** \`items\` (\`[{value, label, icon, badge?}]\`, 3–5), \`value\` + \`onChange\` (or \`defaultValue\`), \`variant\`, \`onFab\`, \`fabIcon\`, \`fabLabel\`, \`label\`.

- Docks to the bottom with the home-indicator area included (84px). The pill floats 26px above the bottom edge.
- Labels are accessible names; \`variant="labels"\` shows them under the icons.
- Tab changes fire a light haptic tick.
`);

comp("BottomSheet", "Mobile navigation", 549, `
(function () { function Demo() { var o = React.useState(true); return ${M(`h(React.Fragment, null, h('div', { style: { padding: 20 } }, h(A.Button, { variant: 'primary', onClick: function () { o[1](true); } }, 'Open sheet')),
  h(A.BottomSheet, { contained: true, open: o[0], onClose: function () { o[1](false); }, title: 'Choose your dates', leading: h(A.IconButton, { icon: 'x-mark', label: 'Close', variant: 'soft', onClick: function () { o[1](false); } }), trailing: h(A.IconButton, { icon: 'pencil-square', label: 'Edit', variant: 'soft' }),
    footer: h(A.Button, { variant: 'primary', size: 'lg', block: true }, 'Continue · 4 nights') },
    h(A.WeekStrip, { defaultValue: '15', days: [{ date: '12', weekday: 'Mon' }, { date: '13', weekday: 'Tue' }, { date: '14', weekday: 'Wed' }, { date: '15', weekday: 'Thu', dot: true }, { date: '16', weekday: 'Fri' }, { date: '17', weekday: 'Sat' }] })))`, 500)}; } return h(Demo); })()
`, `# BottomSheet

A panel that slides up from the bottom over a scrim. Drag the handle down to dismiss: more than 110px, or a flick faster than 0.6px/ms over at least 48px, closes it; anything less springs back.

**Consumer provides:** \`open\`, \`onClose\`, \`children\`, optional \`title\`, \`leading\` / \`trailing\` (round buttons in the bar under the handle), \`footer\` (sticky CTA), \`maxHeight\` (default 92%), \`dismissible\` (default true), \`contained\` (position inside a parent, for docs), \`label\`.

- Use for choices that keep people on the page: dates, guests, filters, the plan of a trip.
- Escape and the scrim also close it. Opening focuses the first control.
- Top corners use \`sheet-radius\` (34px). Slide timing is \`duration-sheet\` with the sheet easing.
`);

comp("ActionSheet", "Mobile navigation", 448, `
(function () { function Demo() { var o = React.useState(true); return ${M(`h(React.Fragment, null, h('div', { style: { padding: 20 } }, h(A.Button, { variant: 'secondary', onClick: function () { o[1](true); } }, 'Show actions')),
  h(A.ActionSheet, { contained: true, open: o[0], onClose: function () { o[1](false); }, title: 'Booking K7QX2M', actions: [{ label: 'Share itinerary', icon: 'arrow-up-on-square' }, { label: 'Change dates', icon: 'calendar-days' }, { label: 'Message host', icon: 'chat-bubble-oval-left' }, { label: 'Cancel booking', icon: 'x-mark', tone: 'danger' }] }))`, 400)}; } return h(Demo); })()
`, `# ActionSheet

A list of commands in a bottom sheet, with a separate Cancel button. The mobile counterpart of \`Menu\`.

**Consumer provides:** \`open\`, \`onClose\`, \`title\`, \`actions\` (\`[{label, icon?, tone?: 'danger', onPress}]\`, max 6), \`cancelLabel\`, \`contained\`.

- Destructive actions go last in \`danger\`, and still confirm in a Dialog or sheet if money moves.
`);

comp("Fab", "Mobile navigation", 120, `
h('div', { className: 'ar-row', style: { gap: 20 } }, h(A.Fab, { ariaLabel: 'New booking' }), h(A.Fab, { tone: 'brand', icon: 'magnifying-glass', ariaLabel: 'Search' }), h(A.Fab, { label: 'Add booking' }))
`, `# Fab

A floating action button: round (60px) or extended with a label and a white icon disc.

**Consumer provides:** \`label\` (extended), \`icon\`, \`tone\` (\`ink\` | \`brand\`), \`ariaLabel\` (round), \`onClick\`.

- One per screen, bottom-right above the tab bar, or bottom-centre when there is no tab bar.
`);

comp("StickyActionBar", "Mobile navigation", 178, `
${M(`h(A.StickyActionBar, { summary: h(React.Fragment, null, h('b', { className: 'm-title-2' }, '$264'), h('span', { className: 'm-footnote', style: { color: 'var(--ink-muted)' } }, 'per night')) }, h(A.Button, { variant: 'primary', size: 'lg', iconEnd: 'paper-airplane' }, 'Book now'))`, 130)}
`, `# StickyActionBar

The bottom CTA bar on detail and checkout screens: an optional price summary and one 60px primary button, fading the content behind it.

**Consumer provides:** \`children\` (the button), optional \`summary\`.

- Sits above the home indicator. Hide the tab bar on screens that use it.
`);

comp("HeroHeader", "Mobile navigation", 380, `
${M(`h('div', null, h(A.HeroHeader, { image: '/_blob/ed445217b94fbdcf26d3e82be94a5053', overlap: true, eyebrow: 'Good morning', title: 'Maya Haddad', trailing: h(A.IconButton, { icon: 'bell', label: 'Notifications', variant: 'white', badge: true }) }, h(A.SearchField, { placeholder: 'Where to next?', onFilter: null })), h('div', { style: { padding: '18px 20px 22px' } }, h(A.SectionHeader, { title: 'Popular places', action: 'View all' })))`, "auto", "is-flush")}
`, `# HeroHeader

A midnight header with a dotted world map or flowing wave pattern, rounded bottom corners, and content that overlaps its lower edge (a search field or search card).

**Consumer provides:** \`title\`, \`eyebrow\`, \`trailing\` (avatar or button), \`pattern\` (\`map\` | \`waves\`), \`overlap\` (children straddle the bottom edge), \`children\`, \`art\`, \`belowTitle\`.

- Put the screen in \`.m-screen.is-flush.is-top\` and set the frame's status tone to light.
`);

comp("GreetingBar", "Mobile navigation", 240, `
h('div', { className: 'ar-col', style: { gap: 16 } },
  ${M("h(A.GreetingBar, { title: 'Hello, Maya!', subtitle: \"It's time to explore\", actions: [h(A.IconButton, { key: 's', icon: 'magnifying-glass', label: 'Search', variant: 'surface' }), h(A.IconButton, { key: 'b', icon: 'bell', label: 'Notifications', variant: 'surface', badge: true })] })", "auto", "is-padded")},
  ${M("h(A.GreetingBar, { title: 'Hi, Maya', subtitle: 'A journey worth taking', name: 'Maya Haddad' })", "auto", "is-padded")})
`, `# GreetingBar

The top of a home screen: a greeting, one line of context, and round actions or the avatar.

**Consumer provides:** \`title\`, \`subtitle\`, \`eyebrow\`, \`actions\`, \`name\` + \`avatar\` (avatar on the right), \`avatarFirst\`.
`);

comp("SearchField", "Mobile inputs", 248, `
h('div', { className: 'ar-col', style: { gap: 16 } }, ${M("h(A.SearchField, { placeholder: 'Search stays', onFilter: null })", "auto", "is-padded")}, ${M("h(A.SearchField, { variant: 'outline', placeholder: 'Search places', onFilter: null })", "auto", "is-padded")})
`, `# SearchField

A 60px mobile search pill with the keyboard's search key and an optional filter button: \`filled\` (sunken pill with a round ink filter inside) or \`outline\` (white pill with a divider).

**Consumer provides:** \`placeholder\`, \`value\` + \`onChange\` (or \`defaultValue\`), \`onFilter\` (shows the filter button; \`null\` for one without a handler), \`variant\`, \`label\`, \`filterLabel\`.

- The input is 16px so iOS does not zoom on focus. Tapping the filter opens a BottomSheet.
`);

comp("SectionHeader", "Mobile inputs", 152, `
${M("h('div', { className: 'm-stack', style: { padding: 20 } }, h(A.SectionHeader, { title: 'Popular places', action: 'View all' }), h(A.SectionHeader, { title: 'Upcoming bookings', action: 'See all', chevron: true }))")}
`, `# SectionHeader

A 21px section title with a quiet "View all" action on the right.

**Consumer provides:** \`title\`, \`action\` (label), \`onAction\`, \`chevron\`.
`);

comp("ChipScroller", "Mobile inputs", 208, `
h('div', { className: 'ar-col', style: { gap: 16 } }, ${M("h('div', { style: { padding: '12px 20px 0' } }, h(A.ChipScroller, { label: 'Sort places', options: ['Most viewed', 'Nearby', 'Latest', 'Top rated'] }))")}, ${M("h('div', { style: { padding: '12px 20px 0' } }, h(A.ChipScroller, { tone: 'brand', onFilter: null, label: 'Filter flights', options: ['Airlines', 'Airports', 'Stops', 'Amenities'] }))")})
`, `# ChipScroller

A horizontally scrolling row of single-choice chips that bleeds to the screen edges, with an optional leading filter button.

**Consumer provides:** \`options\`, \`value\` + \`onChange\` (or \`defaultValue\`), \`tone\` (\`ink\` | \`brand\`), \`onFilter\`, \`label\`.

- 46px tall chips. Use brand tone on result screens where the selection filters a list.
`);

comp("SnapCarousel", "Mobile inputs", 300, `
${M("h('div', { style: { padding: '16px 20px 0' } }, h(A.SnapCarousel, { itemWidth: '70%', label: 'Stats' }, h(A.MiniStatCard, { title: 'Trips done', subtitle: 'Over the last year', value: '9', delta: '-3.48%' }), h(A.MiniStatCard, { title: 'Nights booked', subtitle: 'Over the last year', value: '42', delta: '+12%' }), h(A.MiniStatCard, { title: 'Cancelled', subtitle: 'Over the last year', value: '1', delta: '-50%' })))")}
`, `# SnapCarousel

A horizontal list that snaps each card to the gutter and shows a peek of the next one.

**Consumer provides:** \`children\` (cards), \`itemWidth\` (default 78%), \`gap\` (px), \`label\`.

- Keep the peek at 20–30% so people see there is more. Bleeds to the screen edges.
`);

comp("SwipeRow", "Mobile inputs", 230, `
${M("h('div', { className: 'm-stack', style: { padding: 20 } }, h(A.SwipeRow, { actions: [{ label: 'Snooze', icon: 'clock', tone: 'neutral' }, { label: 'Delete', icon: 'trash', tone: 'danger' }] }, h(A.ChecklistRow, { text: 'Swipe this row left', meta: 'Reveals Snooze and Delete' })), h(A.SwipeRow, { actions: [{ label: 'Archive', icon: 'archive-box', tone: 'brand' }] }, h(A.ChecklistRow, { text: 'One action works too', defaultChecked: true })))")}
`, `# SwipeRow

Wraps any row so a left swipe reveals up to three actions. Horizontal intent locks after 6px, so vertical scrolling is never hijacked.

**Consumer provides:** \`children\` (the row), \`actions\` (\`[{label, icon, tone: 'neutral' | 'brand' | 'danger', onPress}]\`).

- Swiping past half the action width opens it; less snaps back. A screen-reader button toggles the actions without swiping.
- Destructive action last, in danger.
`);

comp("MobileSegmented", "Mobile inputs", 256, `
h('div', { className: 'ar-col', style: { gap: 16 } }, ${M("h('div', { style: { padding: 20 } }, h(A.MobileSegmented, { label: 'Trip type', options: [{ value: 'round', label: 'Round trip', icon: 'arrows-right-left' }, { value: 'one', label: 'One way', icon: 'arrow-right' }] }))")}, ${M("h('div', { style: { padding: 20 } }, h(A.MobileSegmented, { tone: 'ink', label: 'Sections', options: ['Overview', 'Activity', 'Details'] }))")})
`, `# MobileSegmented

A full-width switch with a thumb that slides between two or three options.

**Consumer provides:** \`options\` (strings or \`{value, label, icon?}\`), \`value\` + \`onChange\` (or \`defaultValue\`), \`tone\` (\`brand\` | \`ink\`), \`label\`.

- Brand tone for trip type in search; ink for switching sections of a detail screen.
`);

comp("FieldTile", "Mobile inputs", 302, `
${M("h('div', { style: { padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 } }, h('div', { style: { gridColumn: '1 / -1' } }, h(A.FieldTile, { label: 'From', value: 'Dubai · DXB', trailingIcon: 'plane' })), h(A.FieldTile, { label: 'Departure', icon: 'calendar-days', value: '27 Aug, 2026' }), h(A.FieldTile, { label: 'Class', icon: 'star', value: 'Economy', chevron: true }), h(A.FieldTile, { label: 'Passengers', icon: 'user', placeholder: 'Add travellers' }))")}
`, `# FieldTile

A large tappable field: uppercase label, optional icon, value, and a trailing icon or chevron. It opens a picker sheet rather than the keyboard.

**Consumer provides:** \`label\`, \`value\`, \`placeholder\`, \`icon\`, \`trailingIcon\`, \`chevron\`, \`onPress\`.

- Use for dates, airports, travellers and selects. For typed text use \`TextField\`.
`);

comp("ChecklistRow", "Mobile inputs", 304, `
${M("h('div', { className: 'm-stack', style: { padding: 20 } }, h(A.ChecklistRow, { text: 'Restock welcome baskets', defaultChecked: true }), h(A.ChecklistRow, { text: 'Send check-in code to guest', meta: 'Due 12:00', dotTone: 'warning' }), h(A.ChecklistRow, { text: 'Approve cleaning report', dotTone: 'brand' }))")}
`, `# ChecklistRow

A card-style task row with a 28px checkbox, text, optional meta line and a status dot. The whole row is the touch target.

**Consumer provides:** \`text\`, \`meta\`, \`checked\` + \`onChange\` (or \`defaultChecked\`), \`dot\`, \`dotTone\` (\`brand\` | \`warning\`).
`);

comp("WeekStrip", "Mobile inputs", 182, `
${M("h('div', { style: { padding: 20 } }, h(A.WeekStrip, { defaultValue: '15', days: [{ date: '12', weekday: 'Mon' }, { date: '13', weekday: 'Tue' }, { date: '14', weekday: 'Wed' }, { date: '15', weekday: 'Thu', dot: true }, { date: '16', weekday: 'Fri' }, { date: '17', weekday: 'Sat' }, { date: '18', weekday: 'Sun' }] }))")}
`, `# WeekStrip

Seven tall day pills; the selected day turns into an ink capsule with a dot when it has plans.

**Consumer provides:** \`days\` (\`[{date, weekday, dot?}]\`), \`value\` + \`onChange\` (or \`defaultValue\`), \`label\`.
`);

comp("CalendarCard", "Mobile inputs", 460, `
${M("h('div', { style: { padding: 16 } }, h(A.CalendarCard, { year: 2026, month: 5, today: 9, marks: [2, 5, 14, 20, 24] }))")}
`, `# CalendarCard

A midnight month card with SUN–SAT headers, blue dots on days with bookings, an underlined today, and tap to select.

**Consumer provides:** \`year\`, \`month\` (0–11), \`today\`, \`marks\` (day numbers), \`selected\`, \`onSelect\`.

- For picking a stay range use \`DatePicker\` inside a BottomSheet; this card is for browsing what is planned.
`);

comp("PeoplePicker", "Mobile inputs", 150, `
${M("h('div', { style: { padding: 20 } }, h(A.PeoplePicker, { people: [{ name: 'Omar Saleh' }, { name: 'Maya Haddad' }, { name: 'Lina Park' }] }))")}
`, `# PeoplePicker

A row of avatars where the chosen person grows and the others fade back.

**Consumer provides:** \`people\` (\`[{name, avatar?, short?}]\`), \`value\` + \`onChange\` (or \`defaultValue\`), \`label\`.
`);

comp("MemberPicker", "Mobile inputs", 140, `
${M("h('div', { style: { padding: 20 } }, h(A.MemberPicker, { people: ['Lina Park', 'Omar Saleh', 'Aiko Tan', 'Jon Berg'] }))")}
`, `# MemberPicker

Rounded-square avatars of the people on a booking, with a dashed add button.

**Consumer provides:** \`people\`, \`onAdd\`, \`addLabel\`.
`);

comp("FeatureCard", "Mobile content", 302, `
${M("h('div', { style: { padding: '16px 20px 0' } }, h(A.SnapCarousel, { itemWidth: '64%', label: 'Properties' }, h(A.FeatureCard, { icon: 'home-modern', title: 'Nordic Pine Lodge', text: 'Refresh photos and update the winter rates.', onOpen: null }), h(A.FeatureCard, { tone: 'light', icon: 'building-office-2', title: 'Minato Penthouse', text: 'Reply to two reviews from last week.', onOpen: null })))")}
`, `# FeatureCard

A tall card for a project or property: icon disc, title, two lines of text and an open button. Dark with the wave pattern, or light blue.

**Consumer provides:** \`title\`, \`text\`, \`icon\`, \`tone\` (\`dark\` | \`light\`), \`onOpen\`.

- Use in a SnapCarousel, with the first card dark and the rest light.
`);

comp("CategoryTile", "Mobile content", 235, `
${M("h('div', { style: { padding: '16px 20px 0' } }, h(A.SnapCarousel, { itemWidth: '42%', label: 'Categories' }, h(A.CategoryTile, { icon: 'home-modern', title: 'Stays', subtitle: '3 upcoming', progress: 0.6, active: true }), h(A.CategoryTile, { icon: 'paper-airplane', title: 'Flights', subtitle: '2 upcoming', progress: 0.35 }), h(A.CategoryTile, { icon: 'truck', title: 'Transfers', subtitle: '1 upcoming', progress: 0.2 })))")}
`, `# CategoryTile

A small tile with an icon, name, count and a thin progress bar. The active tile lifts onto white with an ink icon.

**Consumer provides:** \`icon\`, \`title\`, \`subtitle\`, \`progress\` (0–1), \`active\`, \`onPress\`.
`);

comp("Timeline", "Mobile content", 420, `
${M("h('div', { style: { padding: 20 } }, h(A.Timeline, { items: [{ featured: true, title: 'Flight to Tokyo', time: '08:45', text: 'EK 312 · Gate B18 · Seat 4A', people: ['Maya Haddad', 'Omar Saleh', 'Lina Park'], done: true }, { title: 'Hotel check-in', time: '14:00', text: 'Code arrives at noon' }, { title: 'Dinner reservation', time: '19:30', text: 'Table for 3, Roppongi' }] }))")}
`, `# Timeline

A vertical day plan: an ink line with nodes, a featured midnight card for what is next, and plain entries after it.

**Consumer provides:** \`items\` (\`[{title, time, text?, people?, featured?, done?}]\`).

- One featured item at a time: the next thing that happens.
`);

comp("AgendaCard", "Mobile content", 370, `
${M("h('div', { className: 'm-stack', style: { padding: 20 } }, h(A.AgendaCard, { variant: 'done', title: 'Host welcome call', subtitle: 'Arrival details with your host' }), h(A.AgendaCard, { time: '12:00 – 13:00', title: 'Airport transfer', subtitle: 'Driver meets you at gate B', people: ['Omar Saleh', 'Lina Park'], chips: ['Today', '1h'], onOpen: function () {} }))")}
`, `# AgendaCard

An event card: time, title in display type, a sub-line, people, duration chips and an open arrow. The \`done\` variant collapses to a grey row with a check.

**Consumer provides:** \`title\`, \`subtitle\`, \`time\`, \`people\`, \`chips\`, \`variant\` (\`default\` | \`done\`), \`onPress\`, \`onOpen\`.
`);

comp("PlanList", "Mobile content", 384, `
${M("h('div', { style: { padding: 20 } }, h(A.PlanList, { items: [{ title: 'Land at Haneda, terminal 3', time: '2:00 – 2:30 PM', featured: true, image: '/_blob/9aea358001db8b3d275a3771f097288f' }, { title: 'Transfer to Minato Penthouse', time: '2:30 – 3:45 PM' }, { title: 'Check-in and rest', time: '3:45 – 5:00 PM' }] }))")}
`, `# PlanList

A list of plan steps as large rounded rows; the current step is a midnight card with an image fading in behind it.

**Consumer provides:** \`items\` (\`[{title, time, featured?, scene?}]\`).
`);

comp("MiniStatCard", "Mobile content", 242, `
${M("h('div', { style: { padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } }, h(A.MiniStatCard, { title: 'Trips done', subtitle: 'Over the last year', value: '9', delta: '-3.48%' }), h(A.MiniStatCard, { title: 'Nights', subtitle: 'This year', value: '42', delta: '+12%' }))")}
`, `# MiniStatCard

A personal stat for a traveller's home screen: title, period, a big light number and a delta pill.

**Consumer provides:** \`title\`, \`subtitle\`, \`value\`, \`delta\` (with sign).
`);

comp("TripRow", "Mobile content", 309, `
${M("h('div', { style: { padding: '8px 20px' } }, h(A.TripRow, { date: 'August 12, 2026', logo: 'EK', from: { time: '07:00', city: 'Dubai' }, to: { time: '11:35', city: 'London' }, duration: '7h 35min' }), h(A.TripRow, { date: 'September 5, 2026', logo: 'AF', from: { time: '18:00', city: 'Paris' }, to: { time: '19:40', city: 'Oslo' }, duration: '1h 40min' }))")}
`, `# TripRow

An upcoming trip in a list: date, airline mark, departure and arrival times with cities, and a dotted route with a plane disc and a duration pill.

**Consumer provides:** \`date\`, \`logo\` (2–3 letter airline code or node), \`logoTone\`, \`from\` and \`to\` (\`{time, city}\`), \`duration\`, \`onPress\`.
`);

comp("FlightSearchSheet", "Mobile content", 540, `
${M("h('div', { style: { padding: 16 } }, h(A.FlightSearchSheet, {}))", "auto", "is-canvas")}
`, `# FlightSearchSheet

The mobile flight search card: trip-type switch, From and Destination tiles with a swap button between them, date tiles, travellers, class, and a full-width search button.

**Consumer provides:** \`from\`, \`to\` (\`{city, code}\`), \`trip\`, \`depart\`, \`ret\`, \`passengers\`, \`cabin\`, \`onSearch\`, \`cta\`, \`hideTrip\`.

- Place it overlapping a HeroHeader. Each tile opens a BottomSheet picker.
`);

comp("RouteHeader", "Mobile content", 330, `
${M("h(A.RouteHeader, { image: '/_blob/ed445217b94fbdcf26d3e82be94a5053', title: 'Select flight', onBack: function () {}, from: { code: 'DXB', city: 'Dubai' }, to: { code: 'LHR', city: 'London' }, meta: '27 Aug – 27 Sep · 1 traveller' })", "auto", "is-flush")}
`, `# RouteHeader

A midnight results header over a 3D glass globe (or the dotted world map when no \`image\` is given): compact app bar, a dashed arc between two glowing airport dots with a plane at its peak, and the trip summary.

**Consumer provides:** \`from\`, \`to\` (\`{code, city}\`), \`title\`, \`onBack\`, \`actions\`, \`meta\`, \`children\` (filter and sort pills).
`);

comp("TicketCard", "Mobile content", 300, `
h('div', { style: { width: 360, maxWidth: '100%' } }, h(A.TicketCard, { badge: 'Best', from: { time: '07:00', code: 'DXB', city: 'Dubai' }, to: { time: '11:35', code: 'LHR', city: 'London' }, duration: '7h 35m', cabin: 'Economy', price: '$649', airline: 'Emirates' }))
`, `# TicketCard

A flight result shaped like a ticket: times, codes and cities around a plane line, then a dashed perforation with half-circle notches, then class, price and airline.

**Consumer provides:** \`from\`, \`to\` (\`{time, code, city}\`), \`duration\`, \`cabin\`, \`price\`, \`priceUnit\`, \`airline\`, \`badge\`, \`onPress\`.

- The notches are painted in \`canvas\`, so list tickets on a canvas ground.
`);

comp("BoardingPass", "Mobile content", 720, `
h('div', { style: { display: 'flex', justifyContent: 'center', padding: '8px 0' } }, h('div', { style: { width: 360, maxWidth: '100%' } }, h(A.BoardingPass, { art: h('img', { src: '/_blob/8fc2235db98a1bda58e38c4210a68ba9', alt: '' }), carrier: 'Airiona', cabin: 'Business', date: 'Thu, 15 Oct', time: 'Boards 08:10', from: { code: 'DXB', city: 'Dubai', time: '08:45' }, to: { code: 'HND', city: 'Tokyo', time: '23:10' }, duration: '9h 25m', flight: 'EK 312', seat: '4A', passenger: 'Maya Haddad', zone: '2', seq: '042', details: [{ label: 'Flight', value: 'EK 312' }, { label: 'Gate', value: 'B18' }, { label: 'Seat', value: '4A' }, { label: 'Boarding', value: '08:10' }, { label: 'Terminal', value: '3' }, { label: 'Class', value: 'Business' }] })))
`, `# BoardingPass

A one-piece boarding pass: a sky top with the airline mark, the route in big airport codes and a plane that flies the dashed line, a 3D jet that glides in across the fold, a midnight panel of details, and a perforated stub with a real, scannable QR code.

**Consumer provides:** \`from\`, \`to\` (\`{code, city, time?}\`), \`date\`, \`time\`, \`duration\`, \`stops\`, \`details\` (\`[{label, value}]\`, 3–9), \`passenger\`, \`flight\`, \`seat\`, \`zone\`, \`seq\` (or \`facts\`), \`carrier\`, \`cabin\`, \`art\` (the jet from the Art group), \`qr\` (the string to encode; defaults to the flight, route, seat and passenger).

- The QR is generated in the component (\`QRCode\`, byte mode, error correction M) and is scannable. In production pass the airline's signed BCBP string as \`qr\`.
- The stub is cut with two real perforation holes (a mask, not painted circles), so the pass works on any background.
- Keep the screen awake and at full brightness while the pass is shown; never animate the QR after it settles.
`);

comp("QRCode", "Mobile content", 260, `
h('div', { className: 'ar-row', style: { gap: 24, alignItems: 'center', flexWrap: 'wrap' } },
  h('div', { style: { width: 160, padding: 10, borderRadius: 22, background: '#fff', boxShadow: 'var(--shadow-card)', color: 'var(--midnight)' } }, h(A.QRCode, { value: 'AIRIONA|EK 312|DXB|HND|4A|Maya Haddad', label: 'Boarding pass code' })),
  h('div', { style: { width: 120, padding: 10, borderRadius: 20, background: 'var(--midnight)', color: '#fff' } }, h(A.QRCode, { value: 'https://airiona.com/trips/K7QX2M', color: '#ffffff', background: 'transparent', label: 'Trip link' })),
  h('div', { style: { width: 96, color: 'var(--blue-700)' } }, h(A.QRCode, { value: 'K7QX2M', label: 'Booking reference' })))
`, `# QRCode

A real QR code drawn as one SVG path: byte mode (UTF-8), error correction M, versions 1–10 (up to about 210 characters). Verified module for module against the reference \`qrcode\` encoder.

**Consumer provides:** \`value\`, optional \`color\` (default currentColor), \`background\` (default white), \`quiet\` (quiet-zone modules, default 2), \`size\`, \`label\` (accessible name).

- Dark modules on a light ground scan best; keep at least 2 modules of quiet zone and 120px on screen for gate scanners.
- Used by \`BoardingPass\`. Good for trip links, check-in and booking references too.
`);

comp("PlaceCard", "Mobile content", 403, `
${M("h('div', { style: { padding: '16px 20px 0' } }, h(A.SnapCarousel, { itemWidth: '72%', label: 'Places' }, h(A.PlaceCard, { image: '/_blob/01ee3ef20e666d0eb3e5a01099a50262', title: 'Nordic Pine Lodge', region: 'Bavaria', location: 'Nuremberg, Germany', rating: '4.8' }), h(A.PlaceCard, { image: '/_blob/1c176c3ae32bd7ae8058e90b750cd5aa', title: 'Swiss Alps Retreat', region: 'Valais', location: 'Zermatt', rating: '4.9', saved: true })))")}
`, `# PlaceCard

A tall photo card with a glass save button and a smoked-glass plate holding the name, region, location and rating.

**Consumer provides:** \`title\`, \`region\`, \`location\`, \`rating\`, \`image\` (or \`scene\`), \`saved\`, \`onPress\`.
`);

comp("PlaceHero", "Mobile content", 418, `
${M("h('div', { style: { padding: 20 } }, h(A.PlaceHero, { image: '/_blob/01ee3ef20e666d0eb3e5a01099a50262', title: 'Nordic Pine Lodge', location: 'Nuremberg, Germany', price: '$264', onBack: function () {} }))")}
`, `# PlaceHero

The top of a place detail screen: a rounded photo with glass back and bookmark buttons, and a glass caption with name, location and price.

**Consumer provides:** \`title\`, \`location\`, \`price\`, \`priceLabel\`, \`image\` (or \`scene\`), \`onBack\`, \`saved\`.
`);

comp("InfoStatRow", "Mobile content", 100, `
${M("h('div', { style: { padding: 20 } }, h(A.InfoStatRow, { items: [{ icon: 'clock', label: '2h drive' }, { icon: 'sun', label: '16°C' }, { icon: 'star', label: '4.8' }] }))")}
`, `# InfoStatRow

Three quick facts, each with a solid icon in a small grey square.

**Consumer provides:** \`items\` (\`[{icon, label}]\`, exactly 3).
`);

comp("ExpandableText", "Mobile content", 200, `
${M("h('div', { style: { padding: 20 } }, h(A.ExpandableText, { lines: 3 }, 'A black timber cabin with floor-to-ceiling glass, set deep in the Bavarian forest. Wake to birdsong, light the wood stove, and walk straight from the deck onto the trails. Fast Wi-Fi, a full kitchen and a sauna for two.'))")}
`, `# ExpandableText

A description clamped to a few lines that fades out, with Read more / Show less.

**Consumer provides:** \`children\` (text), \`lines\` (default 4), \`moreLabel\`.
`);

comp("MiniDestination", "Mobile content", 266, `
${M("h('div', { style: { padding: '16px 20px 0' } }, h(A.SnapCarousel, { itemWidth: '58%', label: 'Destinations' }, h(A.MiniDestination, { image: '/_blob/553498393dce9963945eaffb9ede28b2', title: 'Lisbon', price: '$480', duration: '7h 30m', dates: '12 Mar – 22 Mar', badge: '-10%' }), h(A.MiniDestination, { image: '/_blob/9aea358001db8b3d275a3771f097288f', title: 'Tokyo', price: '$950', duration: '9h 40m', dates: '27 Apr – 22 May' })))", "auto", "is-canvas")}
`, `# MiniDestination

A compact destination card: photo with the city name and an optional discount badge, then price, flight time and dates.

**Consumer provides:** \`title\`, \`price\`, \`duration\`, \`dates\`, \`badge\`, \`image\` (or \`scene\`), \`onPress\`.
`);

comp("IllustrationCallout", "Mobile content", 200, `
${M(`h('div', { style: { padding: 20 } }, h(A.IllustrationCallout, { image: '${OB[2]}', linkLabel: 'House rules' }, 'Check-in from 15:00. Your code arrives by message at noon on arrival day.'))`)}
`, `# IllustrationCallout

A grey panel pairing a small illustration with one or two sentences and a link.

**Consumer provides:** \`children\` (text), \`image\` or \`icon\`, \`linkLabel\`, \`onLink\`.

- Use the onboarding art at thumbnail size to keep one visual voice.
`);

comp("ActivityFeed", "Mobile content", 394, `
${M("h('div', { style: { padding: 20 } }, h(A.ActivityFeed, { items: [{ title: 'Host sent the check-in code', time: 'Just now' }, { title: 'You added photos of the deck', time: 'Yesterday', attachments: ['forest', 'alpine'] }, { title: 'Payment confirmed · $1,056', time: '2 Oct' }] }))", "auto", "is-canvas")}
`, `# ActivityFeed

A newest-first list of booking events as cards, with optional image attachments.

**Consumer provides:** \`items\` (\`[{title, time, attachments?}]\`; attachments are Scene variants or swap in images).
`);

comp("DetailList", "Mobile content", 261, `
${M("h('div', { style: { padding: '8px 20px' } }, h(A.DetailList, { items: [{ label: 'Dates', value: '15–19 Oct' }, { label: 'Guests', value: '2 adults' }, { label: 'Reference', value: h('span', { className: 'ar-mono' }, 'K7QX2M') }, { label: 'Status', value: h(A.Badge, { tone: 'success', dot: true, size: 'sm' }, 'Confirmed') }] }))")}
`, `# DetailList

Label and value pairs in rows separated by hairlines, for the facts of a booking.

**Consumer provides:** \`items\` (\`[{label, value}]\`; value can be a node such as a Badge).
`);

comp("LetterRow", "Mobile content", 262, `
${M("h('div', { style: { padding: '8px 20px' } }, h(A.LetterRow, { mark: 'C', title: 'Completed stays', subtitle: 'Cabins and villas', meta: '3 days ago' }), h(A.LetterRow, { mark: 'In', title: 'In progress', subtitle: 'Tokyo trip', meta: '12:50 PM' }), h(A.LetterRow, { mark: 'Td', title: 'To do', subtitle: 'Book transfer', meta: '2 days ago' }))")}
`, `# LetterRow

A compact list row led by a letter mark in a rounded square, with a sub-line and a time.

**Consumer provides:** \`mark\`, \`title\`, \`subtitle\`, \`meta\`, \`onPress\`.
`);

comp("ProfileHeader", "Mobile content", 350, `
${M("h('div', { style: { padding: 20 } }, h(A.ProfileHeader, { name: 'Lina Park', subtitle: 'Your host · replies in 10 min', stats: [{ value: '4.9', label: 'Rating' }, { value: '214', label: 'Reviews' }, { value: '6 yrs', label: 'Hosting' }] }))")}
`, `# ProfileHeader

A centred profile: rounded-square avatar, name, one line about them and three stats on a grey plate.

**Consumer provides:** \`name\`, \`avatar\`, \`subtitle\`, \`stats\` (\`[{value, label}]\`, 3).
`);

comp("OnboardingFlow", "Mobile onboarding", 880, `
(function () { var imgs = ${JSON.stringify(OB)}; var steps = A.OnboardingFlow.copy.map(function (c, i) { return Object.assign({ image: imgs[i] }, c); });
  return h('div', { style: { display: 'flex', justifyContent: 'center' } }, h(A.PhoneFrame, {}, h(A.OnboardingFlow, { steps: steps }))); })()
`, `# OnboardingFlow

The five-step welcome: step counter and Skip at the top, a swipeable art slide, eyebrow, title and one sentence, then progress dots and a round next button whose ring fills as you go. The last step shows Get started.

**Consumer provides:** \`steps\` (\`[{image | art | scene, alt?, eyebrow, title, text, cta?}]\`, 3–5), \`onDone(reason)\` (\`'done'\` or \`'skip'\`), \`skipLabel\`, \`doneLabel\`, \`label\`. Default copy is on \`OnboardingFlow.copy\`.

**The art.** Five 3D illustrations in one style: glossy Ion Blue and frosted glass, pearl white, small midnight accents, on the \`mist\` ground (#EDF0F5), which is also the screen colour, so the images have no visible edge. They are in the Onboarding asset group (WebP, about 20 KB each, 896 × 1120).
1. Welcome: a plane flying through a blue ring above glass clouds.
2. Discover: a glass globe with blue map pins and a flight path.
3. Stay: a black A-frame cabin on a cloud island with a calendar tile.
4. Pay: a boarding pass, a card and a blue shield with a check.
5. Go: a phone with trip cards, a blue suitcase and an orbiting plane.

**Rules**
- Five steps maximum, each one idea. The title says the benefit; the sentence says how. No more than 16 words of body text.
- Swiping, tapping next, and tapping a dot all move between steps; Skip jumps to the last step, never straight out.
- New art follows the same brief: soft 3D render, Ion Blue #2B5CFF and sky #C8DDF4 glass, pearl white, midnight #070B2A accents, plain #EDF0F5 background, no text, no people, 4:5.
- Show once on first launch, and again only from Settings → "Replay intro".
`, "padding:20px 0;");
/* ---------- v1.5 Motion ---------- */
comp("CountUp", "Motion", 230, `
h(function CountUpDemo() {
  var k = React.useState(0);
  var cell = function (v, l) { return h('div', { key: l, className: 'ar-stat', style: { flex: '1 1 160px' } }, h('div', { className: 'ar-stat__label' }, l), h('div', { className: 'ar-stat__value' }, h(A.CountUp, { value: v }))); };
  return h('div', { className: 'ar-col', style: { gap: 14 } },
    h('div', { key: k[0], className: 'ar-row', style: { gap: 12, flexWrap: 'wrap', alignItems: 'stretch' } }, cell('$84,210', 'Revenue, October'), cell('1,350', 'Nights booked'), cell('87%', 'Occupancy'), cell('4.92', 'Guest rating')),
    h('div', null, h(A.Button, { variant: 'secondary', size: 'sm', iconStart: 'arrow-path', onClick: function () { k[1](k[0] + 1); } }, 'Replay')));
})
`, `# CountUp

Counts the number inside a string up from zero: \`"$84,210"\`, \`"87%"\`, \`"4.92"\`. Prefix, suffix, decimals and thousands separators are kept, and the width does not jump because digits are tabular.

**Consumer provides:** \`value\` (string or number), optional \`duration\` (ms, default 900 = \`duration-emphasis\`), \`animate\` (false to show the final value).

- Built into StatCard, MetricTile, TotalTimeTile, MiniStatCard, BalanceChart, ChannelCard, SegmentGauge and RatingBreakdown.
- Use for headline numbers only, at most three counting at once on a screen. Never count prices in a checkout or a table.
- Screen readers get the final value straight away; the counting copy is aria-hidden.
- Under reduced motion the final value shows at once.
`);

comp("SuccessBurst", "Motion", 330, `
h(function BurstDemo() {
  var k = React.useState(0);
  return h('div', { className: 'ar-col', style: { gap: 12, alignItems: 'center' } },
    h(A.SuccessBurst, { replayKey: k[0], title: 'Booking confirmed' }, 'Scandinavian Forest Cabin · 15–19 Oct. Reference K7QX2M is in your inbox.'),
    h(A.Button, { variant: 'secondary', size: 'sm', iconStart: 'arrow-path', onClick: function () { k[1](k[0] + 1); } }, 'Replay'));
})
`, `# SuccessBurst

The big stop. One celebration at the end of a flow: the disc pops, the tick draws itself, a ring and fourteen particles burst outward, then the title and line rise in. About 1.2s end to end (\`duration-celebrate\`).

**Consumer provides:** \`title\`, \`children\` (one line), optional \`size\` (\`md\` | \`sm\`), \`replayKey\` (change it to play again).

- Only for money and commitments that succeeded: booking confirmed, payment done, trip saved for offline. Once per flow, never on every save.
- Put it inside the success Dialog or at the top of the confirmation screen; buttons appear after the text has risen in.
- It has \`role="status"\`, so the title is announced.
`);

comp("Skeleton", "Motion", 318, `
h('div', { className: 'ar-row', style: { gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' } },
  h('div', { style: { flex: '1 1 240px', maxWidth: 300 } }, h(A.Skeleton, { variant: 'card', lines: 3, label: 'Loading stay' })),
  h('div', { style: { flex: '1 1 280px' } }, h(A.Skeleton, { variant: 'row', lines: 2 }), h(A.Skeleton, { variant: 'row', lines: 2 }), h(A.Skeleton, { variant: 'text', lines: 3 })))
`, `# Skeleton

A shimmering placeholder in the shape of what is loading, so the layout never jumps.

**Consumer provides:** \`variant\` (\`card\` | \`row\` | \`text\`), \`lines\` (default 3), \`label\` (announced, default "Loading").

- Show it only after 300ms of waiting; below that, show nothing and let the content arrive.
- Match the real layout: card skeletons in card grids, row skeletons in lists and tables.
- Replace it in one go (the content enters with its usual stagger); never mix skeleton and real rows.
`);

comp("RouteTransition", "Motion", 360, `
h(function RouteDemo() {
  var r = React.useState('stays'), v = React.useState('fade-through'), prev = React.useRef(0);
  var order = ['stays', 'flights', 'trips'], idx = order.indexOf(r[0]), dir = idx >= prev.current ? 'forward' : 'back';
  React.useEffect(function () { prev.current = idx; });
  var body = { stays: ['Stays', '128 places in Lisbon', 'home-modern'], flights: ['Flights', 'DXB → HND · 14 options', 'paper-airplane'], trips: ['Trips', '2 upcoming, 1 needs check-in', 'briefcase'] }[r[0]];
  return h('div', { className: 'ar-col', style: { gap: 16 } },
    h('div', { className: 'ar-row', style: { gap: 12, flexWrap: 'wrap' } },
      h(A.SegmentedControl, { label: 'Route', value: r[0], onChange: r[1], options: [{ value: 'stays', label: 'Stays' }, { value: 'flights', label: 'Flights' }, { value: 'trips', label: 'Trips' }] }),
      h(A.SegmentedControl, { label: 'Variant', tone: 'surface', size: 'sm', value: v[0], onChange: v[1], options: ['fade-through', 'shared-x', 'shared-y', 'scale'] })),
    h('div', { style: { overflow: 'hidden', borderRadius: 28 } },
      h(A.RouteTransition, { routeKey: r[0] + v[0], variant: v[0], direction: dir },
        h('div', { className: 'ar-w ar-w--sky', style: { minHeight: 180 } },
          h('div', { className: 'ar-w__row' }, h('div', { className: 'ar-w__titles' }, h('span', { className: 'ar-w__eyebrow' }, 'Route'), h('h3', { className: 'ar-w__title' }, body[0])), h('span', { className: 'ar-w__badge' }, h(A.Icon, { name: body[2], size: 20 }))),
          h('p', { style: { margin: 0, color: 'var(--ink-muted)' } }, body[1])))));
})
`, `# RouteTransition

Wraps page content and animates it in whenever \`routeKey\` changes.

**Consumer provides:** \`routeKey\` (the route or tab id), \`variant\`, \`direction\` (\`forward\` | \`back\`, for shared-x), \`children\`.

| Variant | Use it for |
|---|---|
| \`fade-through\` | Top-level destinations with no order: Stays, Flights, Trips, the library's own pages. |
| \`shared-x\` | Steps with an order: checkout steps, onboarding on the web, wizard pages. Back plays from the left. |
| \`shared-y\` | Opening a detail from a list on the web, a drawer becoming a page. |
| \`scale\` | Opening a full-screen viewer from a thumbnail (gallery, map). |

- 420ms (\`duration-page\`) with \`ease-enter\`. Content inside keeps its own stagger, which starts as the page lands.
- Keep the app shell (TopNav, SideNav) outside the transition; only the content moves.
- Production: Framer Motion \`AnimatePresence mode="wait"\` with the same durations and curves, or the View Transitions API with these keyframes.
`);

comp("ScreenStack", "Motion", 880, `
h(function StackDemo() {
  var s = React.useState({ key: 'list', dir: 'push' });
  var go = function (key, dir) { s[1]({ key: key, dir: dir }); };
  var list = h('div', { className: 'm-screen' },
    h(A.AppBar, { large: true, eyebrow: 'Thu, 15 Oct', title: 'Explore' }),
    h('div', { className: 'm-pad', style: { display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 40 } },
      h(A.PlaceCard, { image: '/_blob/01ee3ef20e666d0eb3e5a01099a50262', title: 'Nordic Pine Lodge', region: 'Bavaria', location: 'Nuremberg, Germany', rating: '4.8', onPress: function () { go('detail', 'push'); } }),
      h(A.PlaceCard, { image: '/_blob/1c176c3ae32bd7ae8058e90b750cd5aa', title: 'Swiss Alps Retreat', region: 'Valais', location: 'Zermatt, Switzerland', rating: '4.9', onPress: function () { go('detail', 'push'); } })));
  var detail = h('div', { className: 'm-screen' },
    h(A.PlaceHero, { image: '/_blob/01ee3ef20e666d0eb3e5a01099a50262', title: 'Nordic Pine Lodge', location: 'Nuremberg, Germany', price: '$412', priceLabel: 'per night', onBack: function () { go('list', 'pop'); } }),
    h('div', { className: 'm-pad', style: { paddingTop: 16 } }, h(A.InfoStatRow, { items: [{ icon: 'star', label: '4.8' }, { icon: 'users', label: '4 guests' }, { icon: 'clock', label: '2h drive' }] })));
  return h('div', { style: { display: 'flex', justifyContent: 'center' } },
    h(A.PhoneFrame, { statusTone: s[0].key === 'detail' ? 'light' : 'dark' }, h(A.ScreenStack, { screenKey: s[0].key, direction: s[0].dir }, s[0].key === 'list' ? list : detail)));
})
`, `# ScreenStack

Native push and pop between mobile screens. Pushing slides the new screen in from the right while the old one parallaxes 28% left and dims; popping plays the reverse. 380ms on the sheet curve (\`duration-sheet\`, \`ease-sheet\`), the same feel as iOS navigation.

**Consumer provides:** \`screenKey\` (the current screen id), \`direction\` (\`push\` | \`pop\`), \`children\` (the current screen).

- Push for drilling in (list → detail → booking). Pop for back. Tabs never push: switching tabs swaps instantly and only the TabBar indicator moves.
- Sheets are not screens: open dates, guests and filters in a BottomSheet over the current screen.
- The leaving screen is hidden from assistive tech and cannot be tapped while it leaves.
- Production: React Navigation native stack (iOS default animation) or Reanimated layout transitions with the same 380ms and curve.

Tap a place to push the detail; tap back to pop.
`);

// ---------- write ----------
for (const [name, c] of Object.entries(C)) {
  const dir = path.join(ROOT, name);
  fs.mkdirSync(dir, { recursive: true });
  const html = `<!-- @dsCard group="${c.group}" height=${c.height} -->
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>${name}</title>
<style>html,body{margin:0;background:var(--canvas)}</style>
</head>
<body>
<div id="root" class="ar ar-stage" style="${c.stageStyle}"></div>
<script>
  var A = window.Airiona, h = React.createElement;
  ReactDOM.createRoot(document.getElementById('root')).render(${c.body.trim()});
</script>
</body>
</html>
`;
  fs.writeFileSync(path.join(dir, "preview.html"), html);
  fs.writeFileSync(path.join(dir, "README.md"), c.readme.trim() + motionMd(name).replace(/\n+$/, "") + "\n");
}
console.log(Object.keys(C).length + " components written");

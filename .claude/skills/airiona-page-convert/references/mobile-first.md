# Mobile first

Design the 390px phone screen first; 768 and 1280 add room, they do not define the page. Most of our travellers book on a phone, often one-handed, often on a weak connection, sometimes in an airport queue.

## The phone screen (390 × 844)

- **One column.** `layout.base` is `stack` for almost every section. `grid-2` only for small, equal tiles (two stats, two date tiles). Never `grid-3`/`grid-4` at base: columns under 110px break labels and tap targets.
- **Order by task, not by the desktop picture.** Put what the person came to do first; a desktop side panel (summary, filters, map) usually moves below the main content or into a sheet.
- **The primary action stays in reach.** On any page taller than one screen with one main action (book, pay, continue), put it in a bottom section with `sticky.base: "bottom"` using `StickyActionBar` (price summary + one button) or `BookingBar`. On desktop set `sticky.lg: "none"` or move it to an `aside`.
- **Thumb zone.** Frequent controls in the bottom half; destructive or rare ones (delete, sign out) away from the bottom edge.
- **Navigation.** Root screens: `AppBar large` at the top and `TabBar` (3–5 destinations) at the bottom. Detail screens: `AppBar` with back. Desktop: `TopNav` (and `SideNav` for operator tools); swap with `show`.
- **Sheets, not popovers.** Choices that need room (filters, travellers, sort) open a `BottomSheet` or `ActionSheet` on phones. `Dialog` already becomes a bottom sheet on phones; keep it for one decision.
- **Tap targets** at least 44 × 44 px (the check errors under 24px and warns under 44). Space adjacent targets 8px apart.
- **No sideways scroll** except deliberate carousels (`layout: "scroll-x"`, `SnapCarousel`, `ChipScroller`) that show a peek of the next item. The check fails a page that scrolls sideways.
- **Text** 15px body on phones (the components already do this); nothing under 11px. Long descriptions go in `ExpandableText`.
- **Images** fill the width with a fixed aspect ratio; the hero may bleed to the edges (`bleed.base: true`).
- **Safe areas.** Bottom bars include the home indicator inset; headers clear the status bar. The components handle this through `--m-status-h` and `--m-home-h`; do not add your own padding for it.
- **Keyboards.** Every text field sets `type`/`inputMode` and `autocomplete` so the right keyboard and autofill appear. Do not put a sticky bar over a focused field.
- **Weak networks.** Show `Skeleton` in the final layout while loading; never a blank screen or a spinner alone.

## Tablet (768)

Two columns where content is a set of equal items (cards `grid-2`), forms stay one column but can pair short fields (`grid-2` for first and last name). Bottom bars usually stay.

## Desktop (1280)

- Content width caps at 1200px; the scaffold centres it.
- A summary or booking card moves to the right column: `area.lg: "aside"` (sticky at the top of the viewport).
- Grids grow (`grid-3`, `grid-4`) for listings and dashboards.
- Phone-only parts are hidden with `show.lg: false` (TabBar, StickyActionBar when an aside carries the action); desktop parts are hidden on phones with `show.base: false` and shown again with `show.lg: true`.

## What the check measures on the phone

`check` opens the page at 390 × 844 as a touch phone and fails on: script errors, sideways scrolling, tap targets under 24px, and forms whose empty submit shows fewer messages than required fields. It warns on tap targets under 44px, text under 11px, content ending under a fixed bottom bar, and focus not moving to the first invalid field.

# DatePicker

A date field that opens a calendar in a popover. Picks one date, or a check-in and check-out range across months.

**Consumer provides:** `mode` (`single` | `range`), `value` + `onChange` (ISO `"2026-10-15"`, or `[start, end]` in range mode) or `defaultValue`, `label`, optional `variant` (`field` default | `tiles` for range: Check-in and Check-out side by side | `sunken`), `min`, `max`, `unavailable` (ISO dates), `isDateDisabled(iso)`, `prices` (`{iso: "$128"}`), `lowPrices`, `presets` (`[{label, value}]`), `months` (1 or 2; range defaults to 2, phones always get 1), `startLabel`, `endLabel`, `unit` (default "night"/"nights"), `inclusive` (count both ends, for day ranges), `maxNights`, `today`, `placeholder`, `hint`, `error`, `align`.

- Values are ISO date strings in the property's local time. Never pass Date objects with times; check-in is a calendar day, not an instant.
- Range picking: first click sets check-in, second sets check-out. A range that would cross a booked-out day starts again from the clicked day. Hovering shows the stay before you commit.
- The footer always states the result in words ("15–19 Oct · 4 nights") with Clear and Done.
- Booked-out days are hatched and struck through. Prices sit under each day in mono; `lowPrices` turn green.
- Keyboard: ← → ↑ ↓ move by day and week, Page Up and Page Down by month, Home and End to the week's ends, Enter picks, Escape closes.
- Use `tiles` in booking search and listing pages; use the field for forms (passport expiry, date of birth).
- `Calendar` stays for a single month shown inline on a page; DatePicker is the field people tap.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Day tints. |
| Enter | Popover drops in. |
| State change | Months slide in from the direction you moved. |
| Tokens | duration-slow · ease-enter |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

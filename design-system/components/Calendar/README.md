# Calendar

A month grid for picking a date range, with nightly price under each day and booked-out days hatched.

**Consumer provides:** `year`, `month` (0–11), `range` + `onRangeChange` (or `defaultRange`) as `[startDay, endDay]`, `unavailable` (day numbers), `prices` (`{day: "$128"}`), `lowPrices` (days to mark in success), `today`, `legend`.

- First click sets check-in, second sets check-out. A range that would cross an unavailable day restarts at the clicked day.
- Booked-out days use the signature hatch and a strike-through, so they read without colour.
- Weeks start on Monday. Use the locale's first day in production.
- Show two months side by side on desktop (two Calendars in a flex row), one on mobile.
- Prices use the mono face so digits line up. Keep them to 4 characters ("$128", "€99").

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Day tints. |
| Press | Day scales to 0.9. |
| State change | Month changes slide in from the side you moved toward; picked start and end pop. |
| Tokens | duration-slow · ease-enter · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

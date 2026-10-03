# CalendarCard

A midnight month card with SUN–SAT headers, blue dots on days with bookings, an underlined today, and tap to select.

**Consumer provides:** `year`, `month` (0–11), `today`, `marks` (day numbers), `selected`, `onSelect`.

- For picking a stay range use `DatePicker` inside a BottomSheet; this card is for browsing what is planned.

## Motion

| Moment | Behaviour |
|---|---|
| Press | Day scales to 0.97. |
| State change | Month slides. |
| Tokens | duration-slow |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

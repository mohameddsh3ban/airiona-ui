# BookingBar

The sticky price-and-action bar at the bottom of a listing or checkout.

**Consumer provides:** `price`, `unit`, `dates` (or a fees note), optional `was` (struck price), `cta`, `ctaVariant`, `arrow`, `floating`, `onAction`.

- Mobile: docked to the bottom with `z-sticky`, full width, plus the safe-area inset. Desktop: `floating` inside the right column.
- The dates line is underlined because it opens the date picker.
- Show the total with taxes on the last step of checkout and say so ("Incl. taxes and fees").

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Button sweep. |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

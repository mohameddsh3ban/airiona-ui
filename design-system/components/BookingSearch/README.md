# BookingSearch

The flight search bar: trip type, From ⇄ To with a swap disc, dates, travellers and the brand search disc.

**Consumer provides:** `from` and `to` (`{city, code}`), `trip`, `depart`, `ret`, `travellers` (display strings), `activeField`, `onSearch`, `extra` (node at the top right, e.g. a "Flights · Hotels" switch).

- Each field is a tile (sunken, 64px, label above value). Tapping a tile opens its popover: airport list, `Calendar`, or `QuantityStepper` rows. The active tile gets the blue focus halo.
- Airport codes sit next to the city in mono, never alone.
- Choosing One way removes the Return tile.
- Tiles wrap: on phones the route spans the full width and dates sit two-up below it.
- This is the only place the brand search disc appears.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Search button icon tilts and grows. |
| Press | Swap scales to 0.92. |
| Enter | Spotlight follows the cursor across the bar. |
| State change | Swap rotates 180° per press on a spring while the airports trade places. |
| Tokens | duration-sheet · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

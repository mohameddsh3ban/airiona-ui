# FlightSearchSheet

The mobile flight search card: trip-type switch, From and Destination tiles with a swap button between them, date tiles, travellers, class, and a full-width search button.

**Consumer provides:** `from`, `to` (`{city, code}`), `trip`, `depart`, `ret`, `passengers`, `cabin`, `onSearch`, `cta`, `hideTrip`.

- Place it overlapping a HeroHeader. Each tile opens a BottomSheet picker.

## Motion

| Moment | Behaviour |
|---|---|
| Press | Swap scales. |
| State change | Swap icon turns 180° per press. |
| Tokens | duration-sheet · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

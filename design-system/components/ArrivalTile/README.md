# ArrivalTile

A midnight tile counting down to landing: big ETA, both airports with times, and a glowing progress line along the bottom edge.

**Consumer provides:** `eta`, `from` and `to` (`{code, city, time}`), `progress` (0–1), optional `eyebrow`.

- Pair with `GateTile` on the trip screen; use `FlightTicket` when the full booking matters.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Progress bar grows from the left. |
| State change | The plane glints every 2.6s. |
| Tokens | duration-emphasis |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

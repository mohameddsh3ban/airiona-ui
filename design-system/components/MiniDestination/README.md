# MiniDestination

A compact destination card: photo with the city name and an optional discount badge, then price, flight time and dates.

**Consumer provides:** `title`, `price`, `duration`, `dates`, `badge`, `image` (or `scene`), `onPress`.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Lifts; photo zooms. |
| Press | Scales to 0.98. |
| Tokens | 700ms |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

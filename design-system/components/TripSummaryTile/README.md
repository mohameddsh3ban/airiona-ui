# TripSummaryTile

A finished-ride summary: vehicle art in a tile, title and date, a soft badge, and three stats with small units.

**Consumer provides:** `title`, `date`, `stats` (`[{label, value, unit}]`), optional `art`, `badgeIcon`.

## Motion

| Moment | Behaviour |
|---|---|
| State change | Art floats gently. |
| Tokens | 6s loop |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

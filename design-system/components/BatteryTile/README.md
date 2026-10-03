# BatteryTile

Charge level as a bolt and percentage over five rounded cells that fill from the bottom, with time remaining.

**Consumer provides:** `percent`, `caption`, optional `cells` (default 5), `label` (accessible name).

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Cells fill up, 24ms apart. |
| Tokens | duration-emphasis |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

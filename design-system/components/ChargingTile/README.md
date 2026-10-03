# ChargingTile

A midnight tile for an EV charging bay: state, percentage and time left, a 0–50–100 scale and a glowing blue fill bar with a grip line.

**Consumer provides:** `percent`, `timeLeft`, optional `status`.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Charge bar grows; a light scans along it. |
| State change | Scan repeats every 2.4s while charging. |
| Tokens | duration-emphasis · 2.4s |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

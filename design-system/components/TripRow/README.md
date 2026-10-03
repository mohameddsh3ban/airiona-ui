# TripRow

An upcoming trip in a list: date, airline mark, departure and arrival times with cities, and a dotted route with a plane disc and a duration pill.

**Consumer provides:** `date`, `logo` (2–3 letter airline code or node), `logoTone`, `from` and `to` (`{time, city}`), `duration`, `onPress`.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Plane glides. |
| Press | Scales to 0.97. |
| Enter | Rows stagger in. |
| Tokens | 900ms glide |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

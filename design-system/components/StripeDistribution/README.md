# StripeDistribution

A row of thin pill stripes coloured by group, with each group's count above it and a legend below. Shows proportion with texture instead of one solid bar.

**Consumer provides:** `groups` (`[{label, count, bars, tone?}]`), `unit`.

- `bars` is the number of stripes per group; keep the total between 20 and 32.
- Used inside `AbsenceCard`; works alone inside any card.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Stripes grow up, 24ms apart. |
| Tokens | duration-emphasis |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

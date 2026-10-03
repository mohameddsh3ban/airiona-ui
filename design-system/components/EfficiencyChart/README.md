# EfficiencyChart

A midnight card with a glowing blue area chart, a ringed marker on the key point and a white delta pill above it.

**Consumer provides:** `title`, `period`, `delta`, `data` (values), `highlight` (index).

- The chart bleeds to the card edges; keep the card at least 220px tall.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Line draws left to right; the dot and flag pop in at the end. |
| Tokens | duration-emphasis |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

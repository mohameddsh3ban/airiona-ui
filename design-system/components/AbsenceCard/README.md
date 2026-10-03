# AbsenceCard

The combined card from the analytics board: a white inner card with title, info note and `StripeDistribution`, beside a `Heatmap`, on a sunken tray.

**Consumer provides:** `eyebrow`, `title`, `info`, `groups`, `unit`, `heatRows`, `heatCols`, `heat`, `heatHighlight`, `heatLabel`.

- Spans two dashboard columns. Under 720px the heatmap stacks below.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Spotlight. |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

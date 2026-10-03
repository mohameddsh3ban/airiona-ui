# Toast

A short notice that floats above the page after something happens.

**Consumer provides:** `title`, `children` (one sentence), `tone` (`info` | `success` | `warning` | `danger`), optional `time`, `action` + `onAction`, `onClose`.

- Bottom-right on desktop, top-centre on mobile, stacked newest on top, max 3.
- Success and info dismiss after 6s. Danger stays until dismissed and uses `role="alert"`.
- The title is the outcome ("Booking confirmed"); the body gives the specifics people need (dates, reference, amount).
- Money errors always say whether money was taken.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Timer pauses. |
| Enter | Rises and scales in; the icon pops 140ms later. |
| State change | With `duration`, a hairline timer runs down the bottom edge and closes the toast when it ends. |
| Tokens | duration-slow · ease-enter · linear |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

# StatCard

A dashboard tile: label with icon, a headline figure, a delta and an optional hatched bar chart.

**Consumer provides:** `label`, `value` (formatted), `icon`, `delta` (string starting with + or -), `caption`, `tone` (`surface` | `ink` | `brand`), `onOpen`, `bars` (`{values, highlight, flag, axis, inkIndex}`).

- Bars are hatched by default; the highlighted bar is solid Ion Blue with a value flag. One highlight per chart.
- Per row of stat cards: at most one `ink` and one `brand` tile; the rest `surface`.
- Deltas carry an arrow icon as well as colour. The caption says what the delta is compared to.
- Figures use the display face with tabular numerals.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Card lifts 3px; spotlight. |
| Enter | Value counts up from 0; delta rises in after 500ms. |
| State change | New values count up again. |
| Tokens | duration-emphasis · ease-out cubic |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

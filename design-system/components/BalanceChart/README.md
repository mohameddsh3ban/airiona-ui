# BalanceChart

The centre chart of the pilot dashboard: total with bar/line view toggles, fading background bars, a highlighted range with a blue edge and an ink tooltip, and range tabs below.

**Consumer provides:** `label`, `value`, `bars` (values), `yLabels`, `selection` (`[fromIndex, toIndex]`), `tooltip` (`{value, date}`), `ranges`, `range` + `onRange` (or `defaultRange`).

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Bar darkens. |
| Enter | Value counts up; bars grow. |
| State change | One indicator slides between ranges. |
| Tokens | duration-base · duration-emphasis |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

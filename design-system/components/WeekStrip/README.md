# WeekStrip

Seven tall day pills; the selected day turns into an ink capsule with a dot when it has plans.

**Consumer provides:** `days` (`[{date, weekday, dot?}]`), `value` + `onChange` (or `defaultValue`), `label`.

## Motion

| Moment | Behaviour |
|---|---|
| Press | Day scales to 0.97. |
| Enter | Days stagger in. |
| State change | Picked day pops into its pill. |
| Tokens | duration-slow · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

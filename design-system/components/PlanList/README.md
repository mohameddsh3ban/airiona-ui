# PlanList

A list of plan steps as large rounded rows; the current step is a midnight card with an image fading in behind it.

**Consumer provides:** `items` (`[{title, time, featured?, scene?}]`).

## Motion

| Moment | Behaviour |
|---|---|
| Press | Scales to 0.97. |
| Enter | Items stagger in; art floats. |
| Tokens | duration-slow |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

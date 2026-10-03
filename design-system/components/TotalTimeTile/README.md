# TotalTimeTile

A sky tile with an icon disc, a label and one big total with its unit.

**Consumer provides:** `icon`, `label`, `value`, `unit`, optional `tone`.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Spotlight. |
| Enter | Value counts up. |
| Tokens | duration-emphasis |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

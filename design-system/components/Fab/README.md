# Fab

A floating action button: round (60px) or extended with a label and a white icon disc.

**Consumer provides:** `label` (extended), `icon`, `tone` (`ink` | `brand`), `ariaLabel` (round), `onClick`.

- One per screen, bottom-right above the tab bar, or bottom-centre when there is no tab bar.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Icon turns 90°. |
| Press | Scales to 0.94. |
| Tokens | duration-slow · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

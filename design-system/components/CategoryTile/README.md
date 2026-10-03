# CategoryTile

A small tile with an icon, name, count and a thin progress bar. The active tile lifts onto white with an ink icon.

**Consumer provides:** `icon`, `title`, `subtitle`, `progress` (0–1), `active`, `onPress`.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Lifts 3px. |
| Press | Scales to 0.98. |
| Enter | Progress bar grows. |
| State change | Active tile fills its icon. |
| Tokens | duration-slow |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

# HabitTile

A midnight tile for a recurring task: eyebrow, task name, time left in blue, and a progress ring with an icon.

**Consumer provides:** `title`, `caption`, `progress` (0–1), `icon`, optional `eyebrow`.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Ring draws around. |
| Tokens | duration-emphasis |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

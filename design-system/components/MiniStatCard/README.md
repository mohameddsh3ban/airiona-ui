# MiniStatCard

A personal stat for a traveller's home screen: title, period, a big light number and a delta pill.

**Consumer provides:** `title`, `subtitle`, `value`, `delta` (with sign).

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Spotlight. |
| Enter | Value counts up; delta rises. |
| Tokens | duration-emphasis |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

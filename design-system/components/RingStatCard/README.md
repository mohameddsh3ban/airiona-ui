# RingStatCard

A headline measurement with its unit, a thin progress ring, and three labelled stats below a hairline. Light for activity summaries, dark for live navigation.

**Consumer provides:** `value`, `unit`, optional `icon` (e.g. a turn arrow), `ring` (`{value 0–1, label, unit}`), `stats` (`[{label, value}]`, exactly 3), `tone` (`light` | `dark`).

- Use dark while something is in progress (turn-by-turn to the property), light for a finished summary.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Spotlight. |
| Enter | Ring draws around. |
| Tokens | duration-emphasis |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

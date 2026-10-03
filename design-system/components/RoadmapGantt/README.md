# RoadmapGantt

A five-day roadmap: pill bars that fill to their progress, hatched remainder, avatars at the end, dashed day lines and an ink "today" marker.

**Consumer provides:** `title`, `days` (labels), `today` (index), `tasks` (`[{label, start, end, progress, tone: 'done' | 'muted' | 'brand', people}]`; start and end in day units, halves allowed), `onAdd`, `addLabel`.

- The hatch marks work not done yet, the same meaning as booked-out days: not this one, not yet.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Rows stagger in; bars grow from their start. |
| Tokens | duration-emphasis |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

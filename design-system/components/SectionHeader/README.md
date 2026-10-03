# SectionHeader

A 21px section title with a quiet "View all" action on the right.

**Consumer provides:** `title`, `action` (label), `onAction`, `chevron`.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Action arrow nudges 3px. |
| Tokens | duration-base |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

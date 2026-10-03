# AgendaCard

An event card: time, title in display type, a sub-line, people, duration chips and an open arrow. The `done` variant collapses to a grey row with a check.

**Consumer provides:** `title`, `subtitle`, `time`, `people`, `chips`, `variant` (`default` | `done`), `onPress`, `onOpen`.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Lifts. |
| Press | Scales to 0.98. |
| Enter | Cards stagger in. |
| Tokens | duration-slow |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

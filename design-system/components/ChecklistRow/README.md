# ChecklistRow

A card-style task row with a 28px checkbox, text, optional meta line and a status dot. The whole row is the touch target.

**Consumer provides:** `text`, `meta`, `checked` + `onChange` (or `defaultChecked`), `dot`, `dotTone` (`brand` | `warning`).

## Motion

| Moment | Behaviour |
|---|---|
| Press | Scales to 0.97. |
| State change | Done: box pops, tick draws. |
| Tokens | duration-base · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

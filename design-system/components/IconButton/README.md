# IconButton

A circular button that holds one icon. Always round.

**Consumer provides:** `icon`, `label` (required: becomes `aria-label` and tooltip), `variant`, `size`, optional `badge` (unread dot), `aria-pressed` for toggles.

- `surface` on canvas, `soft` inside cards, `outline` for steppers and calendar arrows, `ink` for the "open" arrow on dark-accent cards, `brand` only for the search disc.
- `white` and `glass` only over photography (back, share, save on listing photos).
- A pressed save button (`aria-pressed="true"`) fills the heart in `danger`.
- Minimum 36px. Never place two `brand` icon buttons in one view.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Icon scales to 1.08 on a spring. |
| Press | Scales to 0.94. |
| State change | Toggled on: icon pops. Heart: squash 0.7 → 1.32 → 1 with a red ring bursting outward. Badge pulses three times. |
| Tokens | duration-slow · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

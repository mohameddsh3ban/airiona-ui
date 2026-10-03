# SwipeRow

Wraps any row so a left swipe reveals up to three actions. Horizontal intent locks after 6px, so vertical scrolling is never hijacked.

**Consumer provides:** `children` (the row), `actions` (`[{label, icon, tone: 'neutral' | 'brand' | 'danger', onPress}]`).

- Swiping past half the action width opens it; less snaps back. A screen-reader button toggles the actions without swiping.
- Destructive action last, in danger.

## Motion

| Moment | Behaviour |
|---|---|
| Press | Action buttons scale to 0.92. |
| State change | Row follows the finger; snaps open or shut on the sheet curve. |
| Tokens | 260ms · ease-sheet |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

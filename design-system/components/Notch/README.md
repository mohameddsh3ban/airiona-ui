# Notch

The inverted-corner cut-out from the workspace board: a corner of the card is carved away with concave curves on both sides, and the gap holds round buttons.

**Consumer provides:** `corner` (`tr` | `tl`), `children` (one or two IconButtons), `bg` (the colour behind the card; default `canvas`).

- Place inside any `.ar-w` card. The cut is painted with `bg`, so it must match what the card sits on.
- Use at most one notch per card, and only where the buttons belong to the whole card.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Buttons in the notch lift 2px. |
| Press | Buttons scale to 0.94. |
| State change | The cut-out is redrawn when the card resizes. |
| Tokens | duration-fast |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

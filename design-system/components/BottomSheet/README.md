# BottomSheet

A panel that slides up from the bottom over a scrim. Drag the handle down to dismiss: more than 110px, or a flick faster than 0.6px/ms over at least 48px, closes it; anything less springs back.

**Consumer provides:** `open`, `onClose`, `children`, optional `title`, `leading` / `trailing` (round buttons in the bar under the handle), `footer` (sticky CTA), `maxHeight` (default 92%), `dismissible` (default true), `contained` (position inside a parent, for docs), `label`.

- Use for choices that keep people on the page: dates, guests, filters, the plan of a trip.
- Escape and the scrim also close it. Opening focuses the first control.
- Top corners use `sheet-radius` (34px). Slide timing is `duration-sheet` with the sheet easing.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Handle widens. |
| Enter | Slides up on the sheet curve; content cascades in after 120ms. |
| State change | Drag follows the finger; release past 110px or flick to dismiss; closing slides down in 260ms. |
| Tokens | duration-sheet · ease-sheet · ease-exit |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

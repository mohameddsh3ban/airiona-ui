# SnapCarousel

A horizontal list that snaps each card to the gutter and shows a peek of the next one.

**Consumer provides:** `children` (cards), `itemWidth` (default 78%), `gap` (px), `label`.

- Keep the peek at 20–30% so people see there is more. Bleeds to the screen edges.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Cards stagger in. |
| State change | Cards scale up from 0.94 as they scroll into view (scroll-driven where supported). |
| Tokens | scroll timeline |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

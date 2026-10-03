# StayCard

The hero card for a place to stay: full-bleed photo that fades into a deep tint, title and price, two tags and a white Reserve button.

**Consumer provides:** `title`, `price` (formatted), `unit`, `description` (max 3 lines, clamps), `tags` (max 2), `image` + `tint` (or `scene`), `photos` (count for dots), `saved`, `onReserve`, `cta`.

- `tint` must be dark enough for white text: take the darkest third of the photo and darken it until white text reaches 4.5:1.
- Use in carousels and 3-up grids on canvas. Width 260–320px.
- Price is per night with the unit in small type. Taxes go on the listing page, not here.
- One primary action only. Save lives in the glass heart.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Card lifts 4px with a deeper shadow; the photo zooms to 1.05 over 700ms; spotlight. |
| State change | Saved heart bursts. |
| Tokens | duration-slow · 700ms · ease-standard |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

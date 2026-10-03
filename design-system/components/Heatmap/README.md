# Heatmap

A grid of rounded cells shaded in five Ion Blue steps, with row and column labels. One cell can be highlighted in ink.

**Consumer provides:** `rows`, `cols` (labels), `values` (matrix of levels 0–4), optional `highlight` (`[row, col]`), `label` (accessible description).

- Levels map to `surface-sunken`, `blue-200`, `blue-400`, `blue-600`, `blue-900`: a single-hue scale that reads by lightness.
- Cells have a title tooltip with row and column; give the table form of the data elsewhere for screen readers.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Cell scales to 1.06 with a shadow. |
| Enter | Cells pop in, 18ms apart. |
| Tokens | duration-slow · duration-fast |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

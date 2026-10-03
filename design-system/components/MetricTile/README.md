# MetricTile

A compact KPI tile: label with a blue icon square, a big figure, a caption and either a delta or two side figures.

**Consumer provides:** `label`, `value`, `caption`, `icon`, and either `delta` (string starting with + or -) or `split` (`[{value, label, tone}]`, max 2), optional `tone`.

- Delta shows the number in success or danger with a filled arrow disc, so direction never depends on colour alone.
- Use `split` for a breakdown that adds context to the main figure (Confirmed / Pending), with status tones.
- Place 3–4 in a row at the top of operator dashboards.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Spotlight. |
| Enter | Value counts up; delta rises in. |
| Tokens | duration-emphasis |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

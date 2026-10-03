# SegmentGauge

A half-donut of chunky, rounded segments with a gap between each, the total in the middle and a legend underneath.

**Consumer provides:** `segments` (`[{label, value, display?, tone?}]`, 2–4), `total`, `totalLabel`, `eyebrow`, `title`, optional `onOpen`.

- Default tones in order: `blue-500`, `blue-300`, `action`, `line-strong`. They differ in lightness, so the parts stay apart without colour vision.
- Segments are proportional to `value`; `display` is the text shown in the legend.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Arcs draw in; the total counts up. |
| Tokens | duration-emphasis |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

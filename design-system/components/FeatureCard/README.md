# FeatureCard

A tall card for a project or property: icon disc, title, two lines of text and an open button. Dark with the wave pattern, or light blue.

**Consumer provides:** `title`, `text`, `icon`, `tone` (`dark` | `light`), `onOpen`.

- Use in a SnapCarousel, with the first card dark and the rest light.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Arrow nudges; pattern drifts. |
| Press | Scales to 0.98. |
| Tokens | 16s drift |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

# PlaceCard

A tall photo card with a glass save button and a smoked-glass plate holding the name, region, location and rating.

**Consumer provides:** `title`, `region`, `location`, `rating`, `image` (or `scene`), `saved`, `onPress`.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Photo zooms; plate rises 4px. |
| Press | Scales to 0.98. |
| State change | Saved heart bursts. |
| Tokens | 700ms |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

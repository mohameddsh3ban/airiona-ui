# DestinationCard

A photo card with a frosted glass plate: name, rating, a location line and a small Book now button.

**Consumer provides:** `title`, `rating`, `meta` (distance or place), `image` (or `scene`), `saved`, `onBook`, `cta`.

- Use for browsing grids (hotels near you, popular destinations). For the featured row use `StayCard`.
- The glass plate needs a busy photo behind it to read as glass; on flat images it still meets contrast because the glass is 72% white.
- The photo scales 4% on hover; nothing else moves.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Photo zooms to 1.04; the glass plate rises 4px. |
| State change | Saved heart bursts. |
| Tokens | 700ms · duration-slow |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

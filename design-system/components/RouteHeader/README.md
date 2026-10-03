# RouteHeader

A midnight results header over a 3D glass globe (or the dotted world map when no `image` is given): compact app bar, a dashed arc between two glowing airport dots with a plane at its peak, and the trip summary.

**Consumer provides:** `from`, `to` (`{code, city}`), `title`, `onBack`, `actions`, `meta`, `children` (filter and sort pills).

## Motion

| Moment | Behaviour |
|---|---|
| Enter | The globe art settles from 0.96. |
| State change | Dashes flow toward the destination; the plane bobs at the apex; airport dots pulse in turn. |
| Tokens | 1.2s dash loop · 3.6s bob |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

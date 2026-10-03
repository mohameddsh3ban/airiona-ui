# Skeleton

A shimmering placeholder in the shape of what is loading, so the layout never jumps.

**Consumer provides:** `variant` (`card` | `row` | `text`), `lines` (default 3), `label` (announced, default "Loading").

- Show it only after 300ms of waiting; below that, show nothing and let the content arrive.
- Match the real layout: card skeletons in card grids, row skeletons in lists and tables.
- Replace it in one go (the content enters with its usual stagger); never mix skeleton and real rows.

## Motion

| Moment | Behaviour |
|---|---|
| State change | Shimmer sweeps left to right every 1.4s until content arrives. |
| Tokens | 1.4s linear |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

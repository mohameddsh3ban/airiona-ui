# Ring

A thin circular progress ring with anything centred inside. Ink on light, blue on dark.

**Consumer provides:** `value` (0–1), `size`, `stroke`, `children` (label), `ariaLabel`.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Draws from empty to its value. |
| State change | Value changes ease along the ring. |
| Tokens | duration-emphasis · duration-slow |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

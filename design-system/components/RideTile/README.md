# RideTile

An airport transfer card: provider word, ETA disc, car illustration, meeting instruction, vehicle and plate.

**Consumer provides:** `provider`, `eta`, `etaUnit`, `title`, `vehicle`, `plate`, optional `art` (replace the drawn car with a photo).

- The plate uses mono so it can be read character by character.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Car rolls 6px forward. |
| Enter | Car drives in from the left. |
| Tokens | 900ms · ease-enter |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

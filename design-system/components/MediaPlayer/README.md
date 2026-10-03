# MediaPlayer

A compact player: artwork, title and artist, brand disc, a scrubber with times, and five controls with play/pause in ink.

**Consumer provides:** `title`, `artist`, `art` (node) or `scene`, `elapsed`, `remaining`, `progress` (0–1), `playing`.

- Heroicons used: arrows-right-left (shuffle), backward, play/pause, forward, queue-list.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Progress grows from the left. |
| Tokens | duration-emphasis |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

# Timeline

A vertical day plan: an ink line with nodes, a featured midnight card for what is next, and plain entries after it.

**Consumer provides:** `items` (`[{title, time, text?, people?, featured?, done?}]`).

- One featured item at a time: the next thing that happens.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Items stagger in. |
| State change | The featured node pulses. |
| Tokens | 1.6s loop |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

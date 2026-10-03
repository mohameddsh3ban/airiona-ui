# RecordingTile

A tile for a live capture: blue icon disc, title, state and elapsed time, with a large red stop button. Pressing it switches to an ink start button.

**Consumer provides:** `title`, `status`, `elapsed`, `icon`, `recording`.

## Motion

| Moment | Behaviour |
|---|---|
| Press | Button scales to 0.94. |
| State change | Recording: the button pulses red. |
| Tokens | 1.4s loop |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

# ProfileProjectCard

A brand-blue project card with the owner at the top, a notched top-right corner holding two round buttons, the project name, a progress bar, and a report picker with a send button.

**Consumer provides:** `person` (`{name, role, avatar?}`), `project`, `metaLabel`, `meta`, `progress` (0–1), `progressLabel`, `reports` (Select options), `onSend`, `unread`, `notchBg` (colour behind the card, default `canvas`).

- The notch is a real cut-out, not a border: set `notchBg` to whatever the card sits on.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Progress grows from the left. |
| Tokens | duration-emphasis |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

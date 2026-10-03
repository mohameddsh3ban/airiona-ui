# GateTile

A ticket-like tile with punched corner dots and an arrow: gate code in large display type, status and time.

**Consumer provides:** `code`, `title`, `caption`.

- The four corner dots echo a boarding pass. Keep the code to 2–4 characters.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Arrow nudges 4px. |
| State change | Live dot pulses. |
| Tokens | 1.6s |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

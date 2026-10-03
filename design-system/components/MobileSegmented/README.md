# MobileSegmented

A full-width switch with a thumb that slides between two or three options.

**Consumer provides:** `options` (strings or `{value, label, icon?}`), `value` + `onChange` (or `defaultValue`), `tone` (`brand` | `ink`), `label`.

- Brand tone for trip type in search; ink for switching sections of a detail screen.

## Motion

| Moment | Behaviour |
|---|---|
| Press | Scales to 0.97. |
| State change | Thumb slides on a spring. |
| Tokens | duration-base · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

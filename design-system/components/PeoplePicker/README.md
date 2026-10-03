# PeoplePicker

A row of avatars where the chosen person grows and the others fade back.

**Consumer provides:** `people` (`[{name, avatar?, short?}]`), `value` + `onChange` (or `defaultValue`), `label`.

## Motion

| Moment | Behaviour |
|---|---|
| Press | Scales to 0.97. |
| Enter | People stagger in. |
| State change | Picked person pops. |
| Tokens | duration-slow |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

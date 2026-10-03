# MemberPicker

Rounded-square avatars of the people on a booking, with a dashed add button.

**Consumer provides:** `people`, `onAdd`, `addLabel`.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Add button turns 90°. |
| Press | Scales to 0.97. |
| Tokens | duration-base · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

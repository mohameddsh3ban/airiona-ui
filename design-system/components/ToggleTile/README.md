# ToggleTile

A square tile for one setting: icon disc, open arrow, title, status line and a large switch with a soft blue glow when on.

**Consumer provides:** `title`, `status`, `offStatus`, `icon`, `checked` + `onChange` (or `defaultChecked`), optional `onOpen`.

- The switch applies immediately; the arrow opens the setting's detail.
- Size: 180–220px wide in a widget grid.

## Motion

| Moment | Behaviour |
|---|---|
| Press | Knob stretches. |
| State change | Knob slides on a spring. |
| Tokens | duration-base · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

# Switch

An on/off control for settings that take effect immediately.

**Consumer provides:** `label`, optional `description`, `checked`/`defaultChecked`, `onChange`.

- On = Ion Blue track. Label states the setting, description states the consequence.
- Never use a switch inside a form that needs a Save button. Use `Checkbox` there.

## Motion

| Moment | Behaviour |
|---|---|
| Press | Knob stretches to 27px while held. |
| State change | Knob slides on a spring; track colour cross-fades. |
| Tokens | duration-base · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

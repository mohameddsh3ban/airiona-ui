# Checkbox

A 20px square check for independent yes/no choices in forms.

**Consumer provides:** `label`, `checked`/`defaultChecked`, `onChange`, `disabled`, native input props.

- Checked state is ink with a white tick. Labels are clickable.
- Use for opt-ins and add-ons inside a form that is submitted later. For settings that apply immediately, use `Switch`.

## Motion

| Moment | Behaviour |
|---|---|
| Press | Box scales to 0.9. |
| State change | Checked: box pops and the tick draws itself in 200ms. |
| Tokens | duration-base · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

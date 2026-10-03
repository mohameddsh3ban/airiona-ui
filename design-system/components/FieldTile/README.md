# FieldTile

A large tappable field: uppercase label, optional icon, value, and a trailing icon or chevron. It opens a picker sheet rather than the keyboard.

**Consumer provides:** `label`, `value`, `placeholder`, `icon`, `trailingIcon`, `chevron`, `onPress`.

- Use for dates, airports, travellers and selects. For typed text use `TextField`.

## Motion

| Moment | Behaviour |
|---|---|
| Press | Scales to 0.97. |
| Tokens | duration-instant |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

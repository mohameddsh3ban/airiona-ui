# TextField

A labelled single-line input with optional icon, hint and error. Height 52px.

**Consumer provides:** `label` (always), `placeholder`, `hint`, `error` (message string), `iconStart`, `variant` (`outline` default, `sunken` inside cards), `type`, and native input props.

- The label sits above the field and never disappears. Placeholders show an example, not the label.
- `type="password"` adds the show/hide toggle automatically.
- Error messages say what is wrong and how to fix it: "Card number is incomplete. Check the last 4 digits." Never "Invalid input".
- Use `sunken` when the field sits on a white card next to other sunken tiles; use the outline on canvas or in auth forms.
- Group related fields in a 2-column grid on desktop, 1 column under 640px.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Border darkens. |
| Enter | Hint text rises in. |
| State change | Error: the field shakes once (380ms, 6px) and the message rises in. Focus ring eases out to 3px. |
| Tokens | duration-fast · ease-standard |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

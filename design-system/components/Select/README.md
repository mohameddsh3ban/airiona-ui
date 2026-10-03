# Select

A dropdown for choosing one value from a list: cabin class, airport, currency, sort order.

**Consumer provides:** `options` (strings or `{value, label, description?, icon?, meta?, disabled?}`), `value` + `onChange` (or `defaultValue`), `label`, `placeholder`, `hint`, `error`, optional `searchable` (adds a filter field), `variant` (`outline` | `sunken`), `size` (`md` 52px | `sm` 40px pill, for toolbars), `align` (`end` opens right-aligned), `iconStart`, `disabled`.

- Trigger matches `TextField` exactly, so selects and fields line up in one form grid.
- Keyboard: Enter, Space or ↓ opens; ↑ ↓ Home End move; Enter picks; Escape and Tab close. Typing goes into the filter when `searchable`.
- Use `description` to say what makes an option different ("Lie-flat seat, lounge access") and `meta` for a price or code in mono.
- Turn on `searchable` above 8 options. Above about 50, use an async combobox instead.
- Disabled options stay in the list with the reason in their description ("Sold out on this flight").
- For actions (Edit, Cancel), use `Menu`, not Select.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Option tints. |
| Enter | Options cascade in 22ms apart. |
| State change | Chevron flips 180°; the selected check pops. |
| Tokens | duration-base · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

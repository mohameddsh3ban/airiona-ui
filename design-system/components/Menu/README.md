# Menu

An action dropdown: a list of commands under a "more" button or any trigger.

**Consumer provides:** `items` (`[{label, icon?, onSelect?, tone?: 'danger', shortcut?, disabled?}]` or `{divider: true}`), optional `trigger` (an element; defaults to a ghost "more" IconButton), `label`, `heading`, `align` (`end` default, `start`), `defaultOpen`.

- Keyboard: Enter, Space or ↓ on the trigger opens and focuses the first item; ↑ ↓ move; Escape closes and returns focus.
- Order: most common first, destructive last after a divider, in `danger` tone.
- Destructive items open a `Dialog` to confirm; they never act straight from the menu.
- Labels are verbs ("Change dates", "Download invoice"). Max 7 items.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Item tints. |
| Enter | Items cascade in 22ms apart. |
| Tokens | duration-base · ease-enter |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

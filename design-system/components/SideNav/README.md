# SideNav

The vertical app navigation for the operator dashboard.

**Consumer provides:** `sections` (`[{title, items:[{value, icon, label, count?}]}]`), `value` + `onChange` (or `defaultValue`), `label`.

- The active item is an ink pill. Counts are Ion Blue and only for things waiting on the user.
- Group titles are overlines. Two or three groups, max 6 items each.
- Under 1024px it collapses into a sheet opened from a menu IconButton.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Icon nudges 2px right. |
| State change | One pill slides vertically to the active item; the active icon pops. |
| Tokens | duration-base · ease-standard |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

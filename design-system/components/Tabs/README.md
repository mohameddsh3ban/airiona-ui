# Tabs

Switches between panels of related content in the same place: listing sections, trip types, booking details.

**Consumer provides:** `tabs` (`[{value, label, icon?, count?, disabled?, content}]`), `value` + `onChange` (or `defaultValue`), `label` (accessible name of the tab list), optional `variant` (`line` | `card`), `size` (`md` 48px | `sm` 40px), `fitted` (tabs share the width), `extra` (node at the right end of the bar).

- `line` is the default: a hairline under the list and a 3px Ion Blue bar that slides to the active tab. Use it inside cards and pages.
- `card` turns the active tab into a white folder tab that opens into the panel. Use it on `canvas` when the panel is the main object on screen.
- Keyboard: ← → move and select, Home and End jump to the ends, Tab moves into the panel. Only the active tab is in the Tab order.
- Use Tabs when each option has its own panel. To filter or switch a view in place without panels, use `SegmentedControl`.
- Labels are one or two words. Counts are totals people care about (214 reviews), not decoration.
- Disabled tabs stay visible when the reason is obvious from context; otherwise leave them out.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Tab tints. |
| State change | Ink bar slides; the panel slides in from the side of the new tab. |
| Tokens | duration-base · duration-slow · ease-enter |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

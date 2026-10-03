# ChipScroller

A horizontally scrolling row of single-choice chips that bleeds to the screen edges, with an optional leading filter button.

**Consumer provides:** `options`, `value` + `onChange` (or `defaultValue`), `tone` (`ink` | `brand`), `onFilter`, `label`.

- 46px tall chips. Use brand tone on result screens where the selection filters a list.

## Motion

| Moment | Behaviour |
|---|---|
| Press | Chip scales to 0.97. |
| Enter | Chips stagger in. |
| State change | Selected chip pops. |
| Tokens | duration-slow · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

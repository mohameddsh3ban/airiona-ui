# QuantityStepper

A labelled minus/value/plus row for counting guests, rooms and bags.

**Consumer provides:** `label`, `description`, `value` + `onChange` (or `defaultValue`), `min`, `max`.

- Stack steppers in a popover from the Travellers tile; rows are separated by `line`.
- Buttons disable at the bounds; never hide them.
- The description gives the rule that decides the category (age range), not marketing copy.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Buttons darken. |
| Press | Buttons scale to 0.94. |
| State change | The number rolls: up from below on +, down from above on −. |
| Tokens | duration-base · ease-enter |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

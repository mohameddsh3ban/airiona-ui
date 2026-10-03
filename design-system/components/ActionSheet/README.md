# ActionSheet

A list of commands in a bottom sheet, with a separate Cancel button. The mobile counterpart of `Menu`.

**Consumer provides:** `open`, `onClose`, `title`, `actions` (`[{label, icon?, tone?: 'danger', onPress}]`, max 6), `cancelLabel`, `contained`.

- Destructive actions go last in `danger`, and still confirm in a Dialog or sheet if money moves.

## Motion

| Moment | Behaviour |
|---|---|
| Press | Items scale to 0.97. |
| Enter | Group slides up; Cancel follows 40ms later. |
| Tokens | duration-sheet · ease-sheet |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

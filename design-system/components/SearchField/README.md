# SearchField

A 60px mobile search pill with the keyboard's search key and an optional filter button: `filled` (sunken pill with a round ink filter inside) or `outline` (white pill with a divider).

**Consumer provides:** `placeholder`, `value` + `onChange` (or `defaultValue`), `onFilter` (shows the filter button; `null` for one without a handler), `variant`, `label`, `filterLabel`.

- The input is 16px so iOS does not zoom on focus. Tapping the filter opens a BottomSheet.

## Motion

| Moment | Behaviour |
|---|---|
| State change | Focus ring eases in. |
| Tokens | duration-fast |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

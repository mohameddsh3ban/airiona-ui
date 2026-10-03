# SegmentedControl

A pill group for switching between peer views or modes. Covers tabs, trip type and dashboard sections.

**Consumer provides:** `options` (strings or `{value, label, icon?, count?}`), `value` + `onChange` (or `defaultValue`), `tone` (`ink` | `brand` | `surface`), `variant` (`track` | `pills`), `size`, `label`.

- `track` on a sunken track is the default for in-card tabs. `pills` with brand tone is the app-level section switcher in the top bar.
- 2 to 5 options. More than 5: use a select or a scrolling chip row.
- Labels are one or two words. Counts are for things that need attention (unpaid invoices), not totals.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Text darkens. |
| Press | Item scales to 0.96. |
| State change | One indicator slides between options and resizes to the new label (no cross-fade). |
| Tokens | duration-base · ease-standard |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

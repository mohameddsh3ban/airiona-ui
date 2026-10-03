# PageHeader

The page title row of the pilot dashboard: a large title, an ink pill tab beside it, and secondary actions on the right.

**Consumer provides:** `title`, `tabs` (SegmentedControl options), `tab` + `onTab` (or `defaultTab`), `actions` (buttons).

## Motion

| Moment | Behaviour |
|---|---|
| State change | Tabs slide their indicator. |
| Tokens | duration-base |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

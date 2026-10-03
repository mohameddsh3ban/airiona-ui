# HoldingsPanel

A white card with a title and "see all" link, holding a midnight panel of grouped rows: token disc, name and sub-line, then a value or a sparkbar with a change pill.

**Consumer provides:** `title`, `linkLabel`, `href` or `onLink`, `groups` (`[{title, items: [{name, sub, symbol | icon, tone: 'sky' | 'brand', value | (spark + change)}]}]`).

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Row tints. |
| Enter | Rows stagger in. |
| Tokens | duration-slow |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

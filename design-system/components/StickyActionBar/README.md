# StickyActionBar

The bottom CTA bar on detail and checkout screens: an optional price summary and one 60px primary button, fading the content behind it.

**Consumer provides:** `children` (the button), optional `summary`.

- Sits above the home indicator. Hide the tab bar on screens that use it.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | CTA arrow nudges. |
| Press | Scales to 0.97. |
| Enter | Rises in 120ms after the screen. |
| Tokens | duration-page · ease-enter |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

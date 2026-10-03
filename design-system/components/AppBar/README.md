# AppBar

The top bar of a mobile screen: compact (back, centred title, actions) or large title (34px) for a tab's root screen.

**Consumer provides:** `title`, `large`, `onBack` (shows the back button; `null` for one without a handler), `actions`, `eyebrow`, `subtitle`, `accent` (blue square after the title), `titleSuffix`, `tone` (`light` | `dark`).

- Root screens of each tab use `large`; pushed screens use compact with back.
- Keep at most two actions; extra actions go in an ActionSheet.

## Motion

| Moment | Behaviour |
|---|---|
| Press | Buttons scale to 0.97. |
| Enter | Large title rises in. |
| Tokens | duration-page · ease-enter |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

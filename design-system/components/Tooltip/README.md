# Tooltip

A short label that appears on hover or keyboard focus to name an icon or add one fact.

**Consumer provides:** `content` (one short sentence), `children` (exactly one focusable element), optional `title`, `shortcut`, `placement` (`top` | `bottom` | `left` | `right`, flips when there is no room), `tone` (`ink` | `light`), `delay` (ms, default 350), `open` / `defaultOpen`.

- Shows after 350ms on hover and immediately on focus; hides on blur, mouse leave and Escape. It is linked to its trigger with `aria-describedby`.
- `ink` (midnight, white text) for icon names and shortcuts. `light` with a `title` for a fact that needs two lines, such as a policy.
- Never put anything you must read or click in a tooltip: no links, no buttons, nothing that only exists there. Touch screens never see it.
- Every icon-only button still needs its own `label`; the tooltip repeats it visually, it does not replace it.
- Max 260px wide. If it needs more, use inline text or a `Dialog`.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Appears after 350ms (instantly on keyboard focus) and scales in from 0.96. |
| Tokens | duration-fast |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

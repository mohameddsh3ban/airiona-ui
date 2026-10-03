# TopNav

The top bar: wordmark, a pill group of primary sections, actions and the signed-in user.

**Consumer provides:** `links` (`[{value, label}]`), `value` + `onChange`, `user` (`{name, email?, avatar?}`), optional `actions` (nodes), `brand` (node replacing the wordmark).

- Sticky at `z-sticky` on canvas. The active section is Ion Blue.
- Signed out: replace the user block with `Button variant="primary" size="sm"` "Sign in".
- Under 768px the links move into a horizontally scrolling row under the wordmark.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Link tints. |
| State change | The active pill (or underline) slides to the new link and resizes to it. |
| Tokens | duration-base · ease-standard |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

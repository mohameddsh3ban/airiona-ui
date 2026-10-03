# InfoStatRow

Three quick facts, each with a solid icon in a small grey square.

**Consumer provides:** `items` (`[{icon, label}]`, exactly 3).

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Stats stagger in. |
| Tokens | duration-slow |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

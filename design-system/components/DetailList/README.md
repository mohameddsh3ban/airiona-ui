# DetailList

Label and value pairs in rows separated by hairlines, for the facts of a booking.

**Consumer provides:** `items` (`[{label, value}]`; value can be a node such as a Badge).

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Rows stagger in. |
| Tokens | duration-slow |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

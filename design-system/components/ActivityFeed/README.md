# ActivityFeed

A newest-first list of booking events as cards, with optional image attachments.

**Consumer provides:** `items` (`[{title, time, attachments?}]`; attachments are Scene variants or swap in images).

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Entries stagger in. |
| Tokens | duration-slow |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

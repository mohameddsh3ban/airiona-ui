# AmenityList

A row of icon tiles that sums up a stay: guests, rooms, key facilities.

**Consumer provides:** `items` (`[{icon, label}]`), optional `plain` (no tile behind icons).

- Show 4–6 items on cards and listing headers; the full list goes in a sheet.
- Labels start with the number when there is one ("2 bedrooms").

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Items stagger in, 40ms apart. |
| Tokens | duration-slow · duration-stagger |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

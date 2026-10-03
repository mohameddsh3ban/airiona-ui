# AvatarStack

Overlapping avatars with an overflow count and an optional caption.

**Consumer provides:** `people` (names or `{name, src}`), `max` (default 4), `extra` (people not in the list), `caption` (node), `size`.

- Use for social proof on landing pages and for trip companions on bookings.
- Captions put the number in bold: "**10k+** travellers rated this 4.8".

## Motion

| Moment | Behaviour |
|---|---|
| Hover | The stack fans open (overlap −10px → −4px); a hovered face lifts 3px. |
| Tokens | duration-base · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

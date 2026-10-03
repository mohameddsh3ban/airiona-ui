# Leaderboard

A ranked list: avatar with a coloured ring, name, role in a tone colour, star score and a word rating.

**Consumer provides:** `items` (`[{name, role, roleTone?, score, label, avatar?, ring?}]`, 3–5), `eyebrow`, `title`, optional `onOpen`.

- Role colours come from text-safe tokens only (`blue-600`, `blue-700`, `success`, `warning`), so every role passes 4.5:1.
- The word rating always accompanies the score.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Row slides 4px right. |
| Enter | Rows stagger in. |
| Tokens | duration-slow · duration-stagger |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

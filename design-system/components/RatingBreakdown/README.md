# RatingBreakdown

An average score with a star, then a stacked bar split into rated bands with the percentage above each part.

**Consumer provides:** `score`, `scoreLabel`, `segments` (`[{label, value, tone?}]`, percentages), `eyebrow`, `title`, optional `note`, `onOpen`.

- Bar widths follow the values; each part keeps a 28px minimum so its label fits.
- The note gives the action that follows from the numbers.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Score counts up; bars grow from the left. |
| Tokens | duration-emphasis |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

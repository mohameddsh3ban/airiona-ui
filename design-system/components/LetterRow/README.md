# LetterRow

A compact list row led by a letter mark in a rounded square, with a sub-line and a time.

**Consumer provides:** `mark`, `title`, `subtitle`, `meta`, `onPress`.

## Motion

| Moment | Behaviour |
|---|---|
| Press | Scales to 0.97. |
| Enter | Rows stagger in. |
| Tokens | duration-slow |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

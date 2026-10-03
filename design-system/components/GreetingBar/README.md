# GreetingBar

The top of a home screen: a greeting, one line of context, and round actions or the avatar.

**Consumer provides:** `title`, `subtitle`, `eyebrow`, `actions`, `name` + `avatar` (avatar on the right), `avatarFirst`.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Greeting rises in. |
| Tokens | duration-page |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

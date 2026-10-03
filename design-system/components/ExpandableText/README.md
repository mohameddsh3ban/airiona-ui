# ExpandableText

A description clamped to a few lines that fades out, with Read more / Show less.

**Consumer provides:** `children` (text), `lines` (default 4), `moreLabel`.

## Motion

| Moment | Behaviour |
|---|---|
| Press | Scales to 0.97. |
| State change | The chevron flips 180° on a spring. |
| Tokens | duration-base · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

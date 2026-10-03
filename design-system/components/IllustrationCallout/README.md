# IllustrationCallout

A grey panel pairing a small illustration with one or two sentences and a link.

**Consumer provides:** `children` (text), `image` or `icon`, `linkLabel`, `onLink`.

- Use the onboarding art at thumbnail size to keep one visual voice.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Link arrow nudges. |
| Enter | Art floats. |
| Tokens | 6s loop |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

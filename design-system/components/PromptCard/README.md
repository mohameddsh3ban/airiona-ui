# PromptCard

"Question of the day": a chip, a 3D glass orb (the same art direction as onboarding) floating over a sky-to-blue panel, the suggested question in white, the data sources it will use, and an ink "Ask AI Assistant" button.

**Consumer provides:** `question`, `sources` (`[{icon, label}]`), `onAsk`, optional `eyebrow`, `cta`, `art`.

- The question is set at 19px semibold so white text meets the large-text contrast floor on the blue gradient.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Chips lift 2px; the orb's glow deepens. |
| Enter | The 3D orb scales in, then floats. |
| Tokens | 700ms · ease-spring · 6s float |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

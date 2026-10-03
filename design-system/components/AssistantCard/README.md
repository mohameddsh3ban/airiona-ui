# AssistantCard

An entry card for the AI assistant: a glossy blue orb, a notched top-left corner holding a brand arrow button, and a three-line label with the middle word bold.

**Consumer provides:** `onOpen`, `openLabel`, optional `art` (replace the orb with a portrait), `lines` (nodes), `notchBg`.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | The orb's glow deepens. |
| State change | The 3D orb floats. |
| Tokens | 6s loop |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

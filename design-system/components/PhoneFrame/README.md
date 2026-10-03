# PhoneFrame

A 390 × 820 device frame with status bar, dynamic island and home indicator, used to present mobile screens in docs and reviews.

**Consumer provides:** `children` (usually a `.m-screen` scroll area plus a TabBar or StickyActionBar), `statusTone` (`dark` | `light` for dark headers), `dark`, `homeTone`, `width`, `height`.

- Docs only. In the app, the real device provides the frame; keep `.m-screen` and the safe-area spacing.
- `.m-screen` is the scroll container: status-bar padding on top, 20px gutters, 120px bottom padding so content clears the tab bar. Modifiers: `is-flush` (no gutters), `is-top` (no top padding, for dark headers), `is-canvas` (grey ground).

## Motion

Static by design. It takes the motion of the card or screen it sits in.

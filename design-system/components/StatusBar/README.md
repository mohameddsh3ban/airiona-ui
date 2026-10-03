# StatusBar

The 9:41 time with signal, Wi-Fi and battery glyphs, positioned over the top 50px of the screen.

**Consumer provides:** `tone` (`dark` text on light screens, `light` on dark headers), `time`.

- Docs and prototypes only. In the app, reserve `env(safe-area-inset-top)` instead.

## Motion

Static by design. It takes the motion of the card or screen it sits in.

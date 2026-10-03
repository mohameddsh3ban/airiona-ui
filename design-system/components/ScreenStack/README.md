# ScreenStack

Native push and pop between mobile screens. Pushing slides the new screen in from the right while the old one parallaxes 28% left and dims; popping plays the reverse. 380ms on the sheet curve (`duration-sheet`, `ease-sheet`), the same feel as iOS navigation.

**Consumer provides:** `screenKey` (the current screen id), `direction` (`push` | `pop`), `children` (the current screen).

- Push for drilling in (list → detail → booking). Pop for back. Tabs never push: switching tabs swaps instantly and only the TabBar indicator moves.
- Sheets are not screens: open dates, guests and filters in a BottomSheet over the current screen.
- The leaving screen is hidden from assistive tech and cannot be tapped while it leaves.
- Production: React Navigation native stack (iOS default animation) or Reanimated layout transitions with the same 380ms and curve.

Tap a place to push the detail; tap back to pop.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Push: new screen slides in from the right while the old one parallaxes 28% left and dims. |
| State change | Pop: reverse. The old layer is inert while leaving. |
| Tokens | duration-sheet · ease-sheet |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

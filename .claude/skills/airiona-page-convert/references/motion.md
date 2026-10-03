# Motion

Airiona's motion lives inside the components (hover lifts, pressed scales, sliding indicators, sheets, exits). A page adds very little: pick from this list, say where and why, and stop.

| Moment | Use | Notes |
|---|---|---|
| Moving between top-level destinations | `RouteTransition` `fade-through` | Wrap the router outlet. One per app. |
| Ordered steps (checkout, onboarding) | `RouteTransition` `shared-x` | `direction: back` when going back. |
| Opening a detail from a list | `RouteTransition` `shared-y`, or `ScreenStack` push/pop on phone-style flows | ScreenStack gives the native parallax push. |
| Full-screen viewer (photos, boarding pass) | `RouteTransition` `scale` | |
| End of a booking or payment | `SuccessBurst` inside a `Dialog` | Once per flow; never for small saves. |
| Totals that the person just changed | `CountUp` | Prices after changing nights or guests; not on first load of every number. |
| Loading | `Skeleton` | Shimmer stops under reduced motion. |
| Feedback after an action | `Toast` | Enters and leaves on its own. |

Rules:
- One orchestrated moment per page at most; components already animate themselves.
- Never animate layout properties in page code; components use transform and opacity.
- Everything respects `prefers-reduced-motion` and `provideAiriona({ motion: 'reduce' })`; nothing needs page code for that.
- Write `"motion": [{ "where": "…", "component": "…", "variant": "…", "why": "…" }]`, or one entry with `"component": "none"` and the reason.

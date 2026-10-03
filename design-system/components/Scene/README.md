# Scene

A drawn landscape that stands in for photography while real images are not wired up yet. Five variants: `sky`, `alpine`, `coast`, `dusk`, `forest`.

**Consumer provides:** `variant`, optional `label`.

- Every media slot in the system (`FlightTicket`, `StayCard`, `DestinationCard`) takes an `image` URL first and falls back to a Scene. Ship real photography in production.
- Each variant has a matching dark `tint` (`Scene.tint(variant)`) used by `StayCard` to fade the photo into its text area. When you pass a real photo, pass a `tint` sampled from the photo's darkest third.
- Photography direction: wide, calm, natural light, plenty of sky. No people looking at camera, no heavy filters, no text baked in.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Fades in with its card. |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

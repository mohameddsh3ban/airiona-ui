# RouteTransition

Wraps page content and animates it in whenever `routeKey` changes.

**Consumer provides:** `routeKey` (the route or tab id), `variant`, `direction` (`forward` | `back`, for shared-x), `children`.

| Variant | Use it for |
|---|---|
| `fade-through` | Top-level destinations with no order: Stays, Flights, Trips, the library's own pages. |
| `shared-x` | Steps with an order: checkout steps, onboarding on the web, wizard pages. Back plays from the left. |
| `shared-y` | Opening a detail from a list on the web, a drawer becoming a page. |
| `scale` | Opening a full-screen viewer from a thumbnail (gallery, map). |

- 420ms (`duration-page`) with `ease-enter`. Content inside keeps its own stagger, which starts as the page lands.
- Keep the app shell (TopNav, SideNav) outside the transition; only the content moves.
- Production: Framer Motion `AnimatePresence mode="wait"` with the same durations and curves, or the View Transitions API with these keyframes.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Fade-through, shared X (direction-aware), shared Y or scale when the route key changes. |
| Tokens | duration-page · ease-enter |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

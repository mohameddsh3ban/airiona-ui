# HeroHeader

A midnight header with a dotted world map or flowing wave pattern, rounded bottom corners, and content that overlaps its lower edge (a search field or search card).

**Consumer provides:** `title`, `eyebrow`, `trailing` (avatar or button), `pattern` (`map` | `waves`), `overlap` (children straddle the bottom edge), `children`, `art`, `belowTitle`.

- Put the screen in `.m-screen.is-flush.is-top` and set the frame's status tone to light.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Title rises; overlapping card follows 80ms later. |
| State change | Waves drift slowly; map dots glint. |
| Tokens | duration-page · 18s drift |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

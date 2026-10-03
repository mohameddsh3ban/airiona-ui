# Button

Pill buttons in three sizes. The primary action is midnight ink, not blue: blue is reserved for brand moments and selection.

**Consumer provides:** `children` (label), `variant`, `size`, optional `iconStart`, `iconEnd`, `arrow`, `loading`, `block`, `href` (renders an `<a>`), and any native button props.

| variant | use |
|---|---|
| `primary` | The one main action per view: Book now, Check availability, Pay. |
| `brand` | Promotional or membership actions, and the final Pay step. At most one per screen. |
| `secondary` | Neutral actions next to a primary: Filters, Share itinerary. |
| `soft` | Toolbar actions inside cards: Export, Download. |
| `ghost` | Menus and inline view switches. |
| `white` / `glass` | Only on photography or the midnight panel. |

- `arrow` adds the signature arrow disc. Use it for actions that open a new place (a deal, a listing, a class), not for form submits.
- Sizes: `sm` 36px in dense cards and nav, `md` 44px default, `lg` 56px for booking bars and stay cards.
- Labels are verbs that say what happens: "Reserve", "Pay $1,284". Never "Submit" or "Click here".
- While a payment is in flight, use `loading` and change the label ("Paying…"); the button disables itself.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Lifts 1px; primary and brand get a light sweep across the label and a deeper shadow; the arrow disc turns 45°. |
| Press | Scales to 0.97 in duration-instant. |
| State change | Loading shows a spinner that turns on a soft curve. |
| Tokens | duration-fast · duration-instant · ease-standard · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

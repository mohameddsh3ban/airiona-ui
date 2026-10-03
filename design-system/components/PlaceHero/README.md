# PlaceHero

The top of a place detail screen: a rounded photo with glass back and bookmark buttons, and a glass caption with name, location and price.

**Consumer provides:** `title`, `location`, `price`, `priceLabel`, `image` (or `scene`), `onBack`, `saved`.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Photo settles from 0.96. |
| Tokens | 900ms · ease-enter |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

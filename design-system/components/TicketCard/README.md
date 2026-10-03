# TicketCard

A flight result shaped like a ticket: times, codes and cities around a plane line, then a dashed perforation with half-circle notches, then class, price and airline.

**Consumer provides:** `from`, `to` (`{time, code, city}`), `duration`, `cabin`, `price`, `priceUnit`, `airline`, `badge`, `onPress`.

- The notches are painted in `canvas`, so list tickets on a canvas ground.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Lifts 3px; the plane glides. |
| Press | Scales to 0.98. |
| Tokens | duration-slow |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

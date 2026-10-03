# FlightTicket

The flight card: photo on top, a white panel with origin, route line and destination, and an inset plate of three facts.

**Consumer provides:** `from` and `to` (`{code, city, time}`), `flight`, `duration`, `airline`, `cabin` (or `details` as `[{label, value}]`, exactly 3), optional `image`, `scene`, `hideMedia`.

- Airport codes are the hero: display face, 40px. Cities under them in muted text; times above.
- The route line is dashed with the plane disc in ink at the centre. For connections, put "1 stop · IST" in `duration`.
- Use `hideMedia` in lists of search results; keep the photo on itinerary and boarding-pass views.
- Max width 440px. In results lists, place it in a 2-column grid on desktop.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Card lifts 3px; the plane glides forward and back; spotlight follows the cursor. |
| Tokens | duration-slow · 900ms glide |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

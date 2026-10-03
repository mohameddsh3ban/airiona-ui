# BoardingPass

A one-piece boarding pass: a sky top with the airline mark, the route in big airport codes and a plane that flies the dashed line, a 3D jet that glides in across the fold, a midnight panel of details, and a perforated stub with a real, scannable QR code.

**Consumer provides:** `from`, `to` (`{code, city, time?}`), `date`, `time`, `duration`, `stops`, `details` (`[{label, value}]`, 3–9), `passenger`, `flight`, `seat`, `zone`, `seq` (or `facts`), `carrier`, `cabin`, `art` (the jet from the Art group), `qr` (the string to encode; defaults to the flight, route, seat and passenger).

- The QR is generated in the component (`QRCode`, byte mode, error correction M) and is scannable. In production pass the airline's signed BCBP string as `qr`.
- The stub is cut with two real perforation holes (a mask, not painted circles), so the pass works on any background.
- Keep the screen awake and at full brightness while the pass is shown; never animate the QR after it settles.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Lifts with its shadow. |
| Enter | Rises in; the 3D jet glides in across the fold and then floats; details stagger in; the QR settles from a soft blur and a scan light passes over it twice. |
| State change | A small plane flies the dashed route line on a loop. |
| Tokens | duration-page · ease-enter · 4.8s route loop |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

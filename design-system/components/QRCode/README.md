# QRCode

A real QR code drawn as one SVG path: byte mode (UTF-8), error correction M, versions 1–10 (up to about 210 characters). Verified module for module against the reference `qrcode` encoder.

**Consumer provides:** `value`, optional `color` (default currentColor), `background` (default white), `quiet` (quiet-zone modules, default 2), `size`, `label` (accessible name).

- Dark modules on a light ground scan best; keep at least 2 modules of quiet zone and 120px on screen for gate scanners.
- Used by `BoardingPass`. Good for trip links, check-in and booking references too.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Settles from a soft blur inside BoardingPass. |
| State change | Static once drawn. Never animate a code that is being scanned. |
| Tokens | 700ms · ease-enter |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

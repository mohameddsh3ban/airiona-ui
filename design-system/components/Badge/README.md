# Badge

A small pill for status and short facts.

**Consumer provides:** `children` (one to three words), `tone`, optional `dot`, `icon`, `size`.

- Booking status always uses a dot plus a word: Confirmed (success), Payment pending (warning), Cancelled (danger), Checked in (brand), Draft (neutral). Never colour alone.
- `brand` for offers and member perks, `ink` for a single standout fact (Top rated), `outline` for policy facts (Refundable).
- `glass` only over photography or dark panels.
- Sentence case. No trailing punctuation.

## Motion

| Moment | Behaviour |
|---|---|
| State change | Status dot pulses (live, pending). |
| Tokens | 2s · ease-standard |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

# BookingSteps

The checkout progress line: Search, Select, Travellers, Payment, Confirmed.

**Consumer provides:** `steps` (labels), `current` (0-based index).

- Done steps are ink with a tick, the current step is Ion Blue with a soft halo, upcoming steps are outlined numbers.
- Sits at the top of every checkout screen, under the top nav. Done steps can link back.
- Keep labels to one word so five steps fit at 360px.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Steps stagger in. |
| State change | Current dot pops and pulses twice; the connecting line fills. |
| Tokens | duration-slow · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

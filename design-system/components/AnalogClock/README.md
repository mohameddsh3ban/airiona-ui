# AnalogClock

A clock face with Roman quarter numerals, minute ticks, ink hands, an Ion Blue second hand and a faded digital minute behind.

**Consumer provides:** `time` ("HH:MM:SS", static) or nothing for a live clock; `live={false}` freezes it.

- Use for the property's local time next to `WorldClock`.

## Motion

| Moment | Behaviour |
|---|---|
| State change | Second hand ticks with a small spring; the digital readout under the hands updates with it. |
| Tokens | 300ms · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

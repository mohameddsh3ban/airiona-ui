# WorldClock

A city's local time with a day-progress slider and the offset from you in a pill. Light and dark versions.

**Consumer provides:** `city`, `zone`, `period`, `time`, `diff` (string with sign), `dayProgress` (0–1), `tone`.

- Ahead uses `success`, behind uses `danger`, and the sign is always in the text.

## Motion

| Moment | Behaviour |
|---|---|
| State change | Slider settles on a spring. |
| Tokens | duration-base · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

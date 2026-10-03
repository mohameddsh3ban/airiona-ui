# MeetingsStrip

A week strip of tall pill days with a month picker, a call summary and a dotted timeline that tracks the selected day.

**Consumer provides:** `title`, `summary`, `days` (`[{date, weekday, count?}]`), `value` + `onChange` (or `defaultValue`), `month`, `months` (Select options).

- Days are radio buttons. A small dot marks days that have meetings.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Day lifts 2px. |
| Enter | Days stagger in. |
| State change | Picked day pops. |
| Tokens | duration-base · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

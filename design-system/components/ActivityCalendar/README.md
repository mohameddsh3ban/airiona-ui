# ActivityCalendar

A midnight month of round day cells: goal met (blue fill), partly met (blue ring), today (red), with a month tag floating over day 1.

**Consumer provides:** `year`, `month` (0–11), `days` (`{dayNumber: 'goal' | 'partial' | 'today'}`), `title`, `legend`, `showMonthTag`.

- Use for streaks (daily check-ins, cleaning rounds). For picking dates use `DatePicker`.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Spotlight. |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

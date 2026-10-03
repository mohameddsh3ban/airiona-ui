# PillBarChart

Tall rounded bars inside pale pill tracks, one highlighted in Ion Blue with a value tooltip. Hover moves the highlight.

**Consumer provides:** `data` (`[{label, value}]`, 4–8 items), `eyebrow`, `title`, `unit` (word after the tooltip value), optional `highlight` (index), `max`, `onOpen` (shows the chevron button; pass `null` for a button without a handler).

- Bars are ink; only the highlighted bar is blue. Labels sit under each track; long labels truncate.
- Use for comparing categories at a glance. For time series use `BalanceChart` or `EfficiencyChart`.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Pill shows its tip. |
| Enter | Pills grow up from the axis, 24ms apart; the tip pops in last. |
| State change | Active pill pulses twice. |
| Tokens | duration-emphasis · ease-enter |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

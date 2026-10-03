# ChannelCard

The top-row card from the pilot dashboard: channel icon and name, amount with a green delta and an update time, then one of four chart panels.

**Consumer provides:** `name`, `icon`, `amount`, `delta`, `updated`, `chart` with `type`:
- `line`: midnight panel, blue line, white marker with a fading drop line, value bottom-right. `{data, marker, label, date}`
- `bars`: sky panel, white bars on a dashed baseline, midnight tooltip. `{data, highlight, label, date}`
- `meter`: midnight panel, sky fill block and a fading barcode. `{value 0–1, label, date}`
- `step`: Ion Blue panel, white curve, ringed marker, white value pill with the date under it. `{data, marker, label, date}`

- Use all four in one row, one per channel, so each card reads differently at a glance.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Spotlight. |
| Enter | Amount counts up; line or step chart draws; bars grow. |
| State change | Marker and tip pop in at the end. |
| Tokens | duration-emphasis |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

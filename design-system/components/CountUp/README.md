# CountUp

Counts the number inside a string up from zero: `"$84,210"`, `"87%"`, `"4.92"`. Prefix, suffix, decimals and thousands separators are kept, and the width does not jump because digits are tabular.

**Consumer provides:** `value` (string or number), optional `duration` (ms, default 900 = `duration-emphasis`), `animate` (false to show the final value).

- Built into StatCard, MetricTile, TotalTimeTile, MiniStatCard, BalanceChart, ChannelCard, SegmentGauge and RatingBreakdown.
- Use for headline numbers only, at most three counting at once on a screen. Never count prices in a checkout or a table.
- Screen readers get the final value straight away; the counting copy is aria-hidden.
- Under reduced motion the final value shows at once.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Counts from 0 to the value, keeping prefix, suffix, decimals and commas. |
| State change | Counts again when the value changes. Screen readers get the final value only. |
| Tokens | duration-emphasis · ease-out cubic |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

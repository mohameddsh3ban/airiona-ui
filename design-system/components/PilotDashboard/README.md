# PilotDashboard

The reference layout for the operator dashboard, built only from system parts: an underline top nav with icons, the page header, four ChannelCards (line, bars, meter, step), then PromptCard, BalanceChart and HoldingsPanel.

**Consumer provides:** optional `nav` and `channels` to replace the sample data; everything else is composed from the documented components.

- Layout: channels in 4 equal columns; second row at 0.82fr / 1.5fr / 1.04fr. Under 1180px it becomes 2 columns with the chart on top; under 720px, 1 column.
- Treat this as the source of truth for spacing: 14px between cards, 22px between rows, 28px page gutter.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Every card has its own spotlight. |
| Enter | Cards stagger in, row by row; numbers count up; charts draw. |
| State change | Nav pill and range indicator slide. |
| Tokens | duration-slow · duration-stagger · duration-emphasis |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

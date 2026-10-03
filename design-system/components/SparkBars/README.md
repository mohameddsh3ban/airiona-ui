# SparkBars

A 70×24 micro bar chart; the peak bar is solid, the rest are translucent. Built for dark panels.

**Consumer provides:** `values`.

## Motion

| Moment | Behaviour |
|---|---|
| Enter | Bars grow. |
| Tokens | duration-emphasis |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

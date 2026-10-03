# Chip

A toggle pill for filters and quick choices. Selected chips turn ink.

**Consumer provides:** `children`, `selected` + `onChange` (or `defaultSelected`), optional `icon`, `count` (results that match).

- Use in horizontally scrolling rows above results. Multiple can be selected.
- For mutually exclusive choices use `SegmentedControl` instead.
- Read-only labels on cards (Luxury stay, 2-day stay) are tags inside `StayCard` or a `Badge`, not chips.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Outline strengthens. |
| Press | Scales to 0.95. |
| State change | Selected: pops to 1.08 and settles, colour fills in duration-fast. |
| Tokens | duration-fast · duration-slow · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

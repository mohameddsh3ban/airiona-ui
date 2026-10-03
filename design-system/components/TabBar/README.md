# TabBar

Bottom navigation in three styles: `dot` (solid icon and a blue dot), `fab` (raised centre create button with a ring), `pill` (floating midnight capsule; the active tab is a white disc).

**Consumer provides:** `items` (`[{value, label, icon, badge?}]`, 3–5), `value` + `onChange` (or `defaultValue`), `variant`, `onFab`, `fabIcon`, `fabLabel`, `label`.

- Docks to the bottom with the home-indicator area included (84px). The pill floats 26px above the bottom edge.
- Labels are accessible names; `variant="labels"` shows them under the icons.
- Tab changes fire a light haptic tick.

## Motion

| Moment | Behaviour |
|---|---|
| Press | Items scale to 0.97. |
| State change | Dot, disc or pill slides to the new tab; the icon pops; FAB icon turns 90° on hover. |
| Tokens | duration-base · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

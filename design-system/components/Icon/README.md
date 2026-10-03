# Icon

Heroicons v2.2 (MIT, Tailwind Labs): the full 24px outline set at 1.5 stroke and the full solid set, plus five travel glyphs Heroicons does not have.

**Consumer provides:** `name` (any Heroicons name, kebab-case, as on heroicons.com), optional `variant` (`outline` default | `solid`), `size` (default 20), `strokeWidth` (default 1.5; leave it), `label` (only when the icon stands alone and carries meaning).

- In production, import Heroicons directly: `import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"` and `"@heroicons/react/24/solid"`. `Icon.reactName("magnifying-glass")` returns the export name.
- Outline is the default everywhere. Solid only for: filled rating stars, a saved heart, and status marks inside toasts and banners (`check-circle`, `exclamation-triangle`, `information-circle`).
- Airiona additions, drawn on the same grid and stroke because Heroicons has no equivalent: `plane`, `bed`, `bath`, `utensils`, `car`. Ship them as local SVG components next to Heroicons.
- Icons inherit `currentColor`. Colour them by setting `color` on the parent.
- Sizes: 14 in badges and tile labels, 16 in small buttons, 18 in fields and icon buttons, 20 default, 22–24 in amenity tiles and empty states.
- v1.0 short names still resolve (`search` → `magnifying-glass`, `x` → `x-mark`, `settings` → `cog-6-tooth`, `more` → `ellipsis-horizontal`…). Use the Heroicons names in new code.
- Never mix in another icon family, and never use emoji as icons.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Inherits from its parent (icon buttons scale it 1.08). |
| State change | Pressed icons pop 1 → 1.18 → 1. |
| Tokens | duration-slow · ease-spring |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

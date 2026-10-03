# DataTable

A card that lists records with search, sorting, row selection, bulk actions, row menus and pagination. Built for the operator side: bookings, guests, payouts.

**Consumer provides:** `columns` (`[{key, header, render?, accessor?, sortable?, sortValue?, searchValue?, align?, width?, mono?, numeric?, muted?, defaultDir?}]`), `rows`, `rowKey` (default `id`), optional `title`, `searchable` + `searchPlaceholder`, `actions` (toolbar nodes), `filters` (chip row), `selectable` + `selected`/`onSelectionChange`, `bulkActions(selectedKeys)`, `pageSize`, `defaultSort` (`{key, dir}`), `onRowClick`, `density` (`comfortable` | `compact`), `emptyTitle`, `emptyText`, `caption`.

- Rows are 64px (48px compact). Header is sunken, sticky, 12px.
- Put the identifier first in mono (`mono: true`), people as avatar + name + email, money right-aligned with `numeric: true`, status as a `Badge` with dot and word.
- Sorting cycles ascending, descending, off. Set `sortValue` when the rendered cell differs from the raw value.
- Selecting rows swaps the toolbar for an ink bulk bar with the count and `bulkActions`.
- Row actions sit in a `Menu` in the last column; destructive ones confirm with a `Dialog`.
- The table scrolls sideways inside its card on narrow screens; the page never does. Under 640px, prefer a card list for guests.
- Empty search result says what was searched and what to try instead.

## Motion

| Moment | Behaviour |
|---|---|
| Hover | Row tints; spotlight on the card. |
| Enter | Rows stagger in, 28ms apart. |
| State change | Sorting, paging and searching replay the row cascade; the bulk bar rises in. |
| Tokens | duration-slow · ease-enter |

All motion stops under `prefers-reduced-motion`; state changes still apply instantly.

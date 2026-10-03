# Page spec format (`docs/pages/<page>/page.spec.json`)

The spec records every decision about one page. `lint` checks it against the real component APIs; `scaffold` builds the Angular page from it; `render` writes the handoff from it. Edit the spec, never the generated files.

## Top level

| Key | Required | Meaning |
|---|---|---|
| `page` | yes | kebab-case slug; folder name and playground route (`#/<page>`). |
| `title` | yes | Human title ("Stay checkout"). |
| `route` | no | Route in the product app; defaults to `page`. |
| `target` | no | `angular` (default) or `react`. Lint checks inputs against that framework's API. |
| `source` | yes | `{ kind: screenshot \| figma \| url \| html \| brief, ref, notes }`. `notes` holds what the source does not show (phone layout, missing states). |
| `audience` | yes | Who uses the page, on what device, in what situation. |
| `primaryAction` | yes | The one job of the page ("Pay and confirm the stay"). |
| `types` | for data | `{ TypeName: { field: "string" \| "number" \| "boolean" \| "ISODate" \| "'a' \| 'b'" \| "Other" \| "Other[]" } }`. Suffix `?` for optional. |
| `data` | for data | Data the page renders. See below. |
| `sections` | yes | The page, top to bottom. See below. |
| `forms` | for forms | Fields, validation and submit behaviour. See below. |
| `motion` | recommended | `[{ where, component, variant, why }]`, or one entry saying none. |
| `a11y` | recommended | Notes the components do not already cover. |
| `gaps` | when used | `[{ element, need, nearest, proposal }]` for every `GAP` element. |
| `notes` | optional | Assumptions, open questions, answers to lint warnings. |

## data

```json
{ "name": "stay", "type": "Stay", "source": "GET /api/stays/:id", "sample": { "...": "..." },
  "states": { "loading": "Skeleton in the shape of the hero and facts", "empty": "n/a (single record)", "error": "Toast with Retry; keep the last loaded data" } }
```
`type` is a key of `types`, with `[]` for lists (then `sample` is an array and `states.empty` is required). Samples must contain every non-optional field of the type, with realistic values.

## sections

```json
{
  "id": "summary", "title": "Your stay", "purpose": "Confirms what is being paid for",
  "heading": true,
  "layout": { "base": "stack", "md": "grid-2", "lg": "stack" },
  "area": { "lg": "aside" },
  "sticky": { "base": "bottom", "lg": "none" },
  "show": { "base": true, "lg": false },
  "bleed": { "base": true },
  "form": "traveller",
  "intro": "One line under the title, outside the layout grid",
  "elements": [ "..." ]
}
```
- `layout`: `stack` (one column), `row` (wrapping inline row), `grid-2`/`grid-3`/`grid-4`, `split` (2:1), `scroll-x` (snapping horizontal list that bleeds to the screen edge). `base` is the 390px phone layout and is required; `md` (768) and `lg` (1280) override upward.
- `area.lg: "aside"` puts the section in a sticky right column on desktop (order summaries, booking bars, a sign-in form beside art). `area.lg: "full"` spans both columns (top navigation, footers) and starts a new block: an aside sits beside the main sections of its own block.
- Per-breakpoint values (`layout`, `sticky`, `show`, `bleed`, `span`) cascade upward: a value set at `base` holds at `md` and `lg` until one of them sets its own.
- `sticky`: `top`, `bottom` or `none` per breakpoint. `bottom` fixes the section to the bottom of the screen (use it for StickyActionBar / BookingBar) and the page keeps room so nothing ends under it; `none` puts it back in the page flow (for example `{ "base": "bottom", "lg": "none" }`).
- `show: { lg: false }` hides a section from 1280 up; `{ base: false, lg: true }` shows it only on desktop. Same on elements.
- `intro`: one sentence under the title, outside the layout grid (so a `scroll-x` carousel does not swallow it).
- `bleed.base: true` lets a header or carousel touch the screen edges on phones.
- `heading: false` hides the visible `title` (it still labels the section for screen readers).
- `form` wraps the section in that form; its elements can then place fields and the submit button.

## elements

```json
{
  "id": "dates", "component": "DatePicker",
  "inputs": { "mode": "range", "variant": "tiles", "min": "2026-10-03" },
  "bind": { "prices": "stay.nightlyPrices" },
  "field": "dates",
  "events": { "closed": "onDatesClosed" },
  "slot": "arFooter",
  "children": [ ],
  "text": "Book now",
  "submit": true,
  "span": { "md": 2, "lg": "full" },
  "show": { "lg": false },
  "why": "Range picking with nightly prices in one control",
  "alternatives": [ { "component": "Calendar", "rejected": "inline month grid takes the whole phone screen" } ],
  "states": { "loading": "...", "error": "..." },
  "a11y": "...", "notes": "..."
}
```
- `component`: a component name from the index, `"html"` (with `tag`: h1–h4, p, span, div, section, small, strong, a, ul, ol, li, img, hr, figure, figcaption, time, address; plus `class`, `text`, `href` for `a`, `src` and `alt` for `img`; html elements take no `inputs`, `bind`, `events`, `field` or `submit`), or `"GAP"` (with a `gaps` entry).
- `inputs`: literal values for the component's inputs. Strings become attributes, everything else a typed property. Only inputs the component has (`describe` lists them) plus `aria-*`, `data-*`, `role`, `title`, `type`, `href`, `class`, `style`, `id`, `tabindex`, `target`, `rel`. A string for an input typed as a union (`variant`, `tone`) must be one of its values.
- `bind`: input → data path (`"stay.name"`, `"stays[0].price"`). Lint resolves the path through `types` and the sample: the field must exist, an index must be inside the sample, and a field feeding a union input must be typed with that union.
- `each`: repeats the element for every item of a list (`"each": "hotels"`); inside it `bind` paths start with `item` (`"title": "item.name"`). `empty` is the text shown when the list is empty (defaults to the data's `states.empty`). Use it for any list, so the page renders as many items as the data has.
- `field`: places a form field (must exist in the section's form; the element's component must be one of the field's components).
- `events`: output → handler name; the scaffold writes a typed stub.
- `slot`: projects this element into the parent's named slot (`arFooter`, `arSummary`, `arTrailing`, `arActions`, `arArt`, …).
- `text`: text content (button label, heading text, chip label).
- `span`: grid columns to take per breakpoint, or `"full"` for the whole row.
- `submit: true`: this button submits the section's form (and shows the form's pending state when the component has `loading`).

## forms

```json
{
  "id": "traveller",
  "submit": { "label": "Pay $1,284", "action": "POST /api/bookings", "success": { "kind": "burst", "title": "You're going to Lisbon", "text": "Booking K7QX2M · 15–19 Oct", "dialogTitle": "Booking confirmed", "action": "View booking" }, "failure": "Toast (danger) with the server message; keep the form filled" },
  "fields": [
    { "name": "email", "label": "Email", "component": "TextField", "default": "",
      "inputs": { "type": "email", "autocomplete": "email", "inputMode": "email" },
      "validators": [ { "type": "required" }, { "type": "email" } ],
      "messages": { "required": "Enter your email so we can send the booking.", "email": "Enter an email like name@example.com." } },
    { "name": "tripType", "label": "Trip", "component": ["MobileSegmented", "SegmentedControl"], "default": "round" }
  ]
}
```
- A field's `inputs` (label, keyboard, autofill) apply to every element that places it; an element's own `inputs` win.
- `component` may list several form controls when the page swaps control per breakpoint: place the field twice (one element per component) and hide each at the other width with `show`.
- Validators: `required`, `requiredTrue` (checkbox must be ticked), `email`, `minLength`/`maxLength` (`value`: number), `min`/`max` (`value`), `pattern` (`value`: regex string), `phone`, `dateRange`, `futureDate`, `minAge` (`value`: years), `passport`, `postalCode`.
- Messages are keyed by the error the control reports: `required`, `email`, `minlength`, `maxlength`, `min`, `max`, `pattern`, `phone`, `dateRange`, `futureDate`, `minAge`, `passport`, `postalCode` (`requiredTrue` reports `required`).
- `success.kind`: `burst` (dialog with SuccessBurst; end of a booking flow), `toast` (saved settings, small confirmations), `navigate` (`to`: next route).

## A worked example

Two complete, checked conversions live in this repository: `docs/pages/login/` (a sign-in form, two columns on desktop, a gap) and `docs/pages/flight-home/` (a travel landing page with a search form, lists and gaps). Read one before your first page.

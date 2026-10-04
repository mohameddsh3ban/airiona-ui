---
name: airiona-page-convert
description: Convert a page design (screenshot, Figma export, URL, HTML or written brief) into an Airiona page, one page at a time - inventory every section and element, plan the 390px mobile layout first, pick the fitting Airiona component for each element with reasons, define typed data, states and form validation, then write a checked spec, a handoff document and a working Angular page with screenshots at 390/768/1280. Use when someone asks to convert, map, implement, hand off or "Airiona-ify" a page, screen or flow, or asks which Airiona components fit a design.
---

# Airiona page conversion

You turn one page design into an Airiona page that an engineer can ship: every element mapped to a real component, the phone layout decided before the desktop one, data and states typed, forms validated, and the result built and screenshotted. Work **one page at a time**; finish and check a page before starting the next.

Everything you produce is checked by tools in this repository. Never claim a step passed unless its command printed the result.

## Tools (run from the repository root)

| Command | Use it to |
|---|---|
| `node tools/page/airiona.mjs suggest "<what the element does>"` | Find components by intent ("pick check-in and check-out", "sticky pay button"). |
| `node tools/page/airiona.mjs describe <Component>` | Read a component's inputs, outputs, slots, guidance and a working example. **Do this before using any component.** |
| `node tools/page/airiona.mjs new <page>` | Start `docs/pages/<page>/page.spec.json`. |
| `node tools/page/airiona.mjs lint <page>` | Check the spec against the real component APIs and the rules below. |
| `node tools/page/airiona.mjs check <page>` | Lint, scaffold the Angular page, build it, screenshot 390/768/1280 and the app view (`native.png`), run the phone checks, write `HANDOFF.md`. |
| `docs/components/INDEX.md` | All 122 components, one line each, by group. Read it once per session. |

If `catalog/data/manifest.json` is missing, run `node tools/gen-manifest.mjs` first.

## The workflow, per page

Copy this checklist into your notes and tick it as you go.

```
Page: <slug>
- [ ] 1 Intake: source saved, audience, primary action, constraints
- [ ] 2 Inventory: sections and elements, top to bottom, with purpose
- [ ] 3 Mobile layout at 390 first, then 768 and 1280
- [ ] 4 Component per element (describe each one), alternatives rejected, gaps logged
- [ ] 5 Data: types, realistic sample, source, loading/empty/error
- [ ] 6 Forms: fields, validators, messages, keyboard and autofill, submit success/failure
- [ ] 7 Motion and accessibility notes
- [ ] 8 lint: 0 errors (warnings answered or explained in notes)
- [ ] 9 check: build passes, 0 errors; screenshots reviewed against the source
- [ ] 10 Report: what was mapped, gaps, open questions
```

### 1. Intake
- Save the source next to the spec: `docs/pages/<page>/source.<ext>` (copy the screenshot, or note the URL or Figma frame). Look at it closely; zoom into dense areas.
- Write `audience` (who, on which device, in what situation) and `primaryAction` (the one thing the page must get done). If the source shows a desktop layout only, the phone layout is still yours to design (step 3); say so in `source.notes`.
- Ask the person only when a decision changes the page and you cannot infer it (for example, whether a step needs an account). Otherwise choose, and record the assumption in `notes`.

### 2. Inventory
List every section top to bottom, then every element inside it: headings, text, images, controls, lists, cards, navigation, footers. For each element write what it does for the user, not what it looks like ("lets the traveller change dates", not "grey box with calendar icon"). Nothing on the source is skipped: decorative parts become `html` elements or are dropped with a note saying why.

### 3. Mobile layout first
Read `references/mobile-first.md`. Design the 390px phone layout before anything else: one column, the order a thumb meets things, the primary action reachable (sticky bottom bar on long pages), sheets instead of popovers, no sideways scrolling except deliberate carousels. Then say what changes at 768 and 1280 (`layout.md`, `layout.lg`, `area.lg: "aside"` for a sticky summary column, `show` to swap a TabBar for a TopNav).

### 4. Components
For each element: `suggest` with what it does, `describe` the top candidates, pick one. Record `why` and at least one rejected alternative for every non-trivial choice. Read `references/component-selection.md` for the decisions that come up most (Select vs MobileSegmented vs ChipScroller, Dialog vs BottomSheet, DataTable vs list rows, which card for which listing).
- Inputs must be real: `lint` rejects any input or output the component does not have. Use `describe` to see them.
- Use `"component": "html"` with a `tag` for plain headings, paragraphs and small text. Never use `html` for a control (button, input, select): that is what the library is for.
- When nothing fits, use `"component": "GAP"` and add an entry to `gaps` with the nearest component and a proposal. Do not force a near miss or invent a component.

### 5. Data and states
Read `references/data-and-states.md`. Define TypeScript-like `types`, one `data` entry per source with a realistic `sample` (real-looking names, prices, dates; never lorem ipsum), where it comes from, and what the page shows while loading, when empty and on error. Bind elements to data with `bind` (`"title": "stay.name"`). Type fields that feed a component's union input with the same union (`'success' | 'warning'`), or the build fails.

### 6. Forms
Read `references/forms.md`. Every field: the form control component, a visible label, validators from the allowed list, a message for each validator (written for the user: what is wrong and how to fix it), `type` / `inputMode` / `autocomplete` for the right keyboard and autofill. The submit button has a verb label, `"submit": true`, and the form says what success and failure look like. Card numbers never go in our forms: hand off to the payment provider.

### 7. Motion and accessibility
Read `references/motion.md`. Name the motion that serves the page (usually one `RouteTransition` variant and, at the end of a flow, one `SuccessBurst`) or say none. Add `a11y` notes for anything the components do not already cover: heading order, labels for icon-only buttons, focus after async steps, reading order when layout changes.

### 8. Lint
`node tools/page/airiona.mjs lint <page>` until it reports **0 errors**. Treat every warning as a question: fix it, or answer it in `notes`.

### 9. Check
`node tools/page/airiona.mjs check <page>`. It scaffolds `projects/playground/src/app/pages/<page>/`, builds the playground with only this page (another page's broken spec cannot block yours), opens the page at 390 (touch phone), 768 and 1280, and fails on script errors, sideways scrolling on phones, tap targets under 24px, or a form whose empty submit shows no messages. Then **open the screenshots** in `docs/pages/<page>/shots/` and compare them with the source, section by section. Fix the spec (not the generated code) and run `check` again until the page matches the source's intent and there are 0 errors. The build failing on a type is a spec problem: fix types, samples or inputs.

### 10. Report
Tell the person, briefly: the page, the components used per section, the gaps and proposals, the assumptions in `notes`, the check result (errors and warnings) and where the handoff is: `docs/pages/<page>/HANDOFF.md`. Then move to the next page only if asked.

## The spec

`references/spec-format.md` is the full format with an example. Rules that catch most mistakes:
- `page` is the folder name and route; ids are camelCase or kebab-case and unique across the page.
- `layout.base` is required for every section. Layouts: `stack`, `row`, `grid-2`, `grid-3`, `grid-4`, `split`, `scroll-x`.
- A field lives in `forms[].fields` (rules and messages) **and** is placed by an element with `"field": "<name>"` inside a section whose `form` is that form's id.
- Projected children use `slot` names the parent declares (`describe` lists them, e.g. `arFooter`, `arSummary`, `arTrailing`).
- Events map an output to a handler name: `"events": { "press": "openStay" }`.
- Lists use `"each": "<data list>"` with `item.` paths in `bind`, never one element per item.
- One heading per page at level 1: components that render a title (`AppBar large`, `HeroHeader`) take `headingLevel` when another element is the h1.

## Output of a finished page

```
docs/pages/<page>/
  source.png            the design you converted
  page.spec.json        the decisions (checked by lint)
  HANDOFF.md            for engineers and reviewers (generated)
  shots/390.png 768.png 1280.png 390-<form>-errors.png report.json
projects/playground/src/app/pages/<page>/   working Angular page (generated)
```

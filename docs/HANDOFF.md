# From design to code: the page handoff

How a page moves from a design to a merged Airiona page, and who does what.

```
design (screenshot / Figma / URL / brief)
  └─ Claude Code: /airiona-page-convert  ──►  docs/pages/<page>/page.spec.json   (decisions, checked)
                                             docs/pages/<page>/HANDOFF.md        (for review)
                                             docs/pages/<page>/shots/*.png       (390 / 768 / 1280 / native)
                                             projects/playground/src/app/pages/<page>/  (working page)
  └─ review (design + engineering)  ──►  spec changes, re-run check
  └─ engineer moves the page into the product app, wires real data and APIs
```

## Roles

| Who | Does |
|---|---|
| Designer | Provides the page (one frame per page, phone frame if one exists), states the primary action, answers open questions in the spec's `notes`. |
| Engineer running the skill | Runs `/airiona-page-convert` page by page, reviews screenshots against the design, iterates the spec until `check` passes. |
| Reviewer | Reads `HANDOFF.md`, looks at the three screenshots and the error-state shot, signs off or comments on the spec. |
| Design system owner | Picks up `gaps` entries: builds the missing component or explains the existing one. |

## Definition of done, per page

- `node tools/page/airiona.mjs check <page>` passes: **0 errors**. Every warning is fixed or answered in `notes`.
- The 390px screenshot reads top to bottom in task order, the primary action is in reach, nothing scrolls sideways.
- Every form field has a label, rules and messages; the empty-submit screenshot (`shots/390-<form>-errors.png`) shows them.
- Every data source has loading, empty (lists) and error states written down.
- Every element names its component and why; every `GAP` has a proposal.
- `HANDOFF.md` is regenerated from the final spec (it is, by `check`).

## Reviewing a page

1. Open `HANDOFF.md`; compare the three screenshots with the source.
2. Check the component choices against the catalog (`npm run catalog`, search the component).
3. Check the form table: messages in the person's words, right keyboards, no card data.
4. Check the gaps: is there really no component? Is the proposal right?
5. Comment on the spec (it is the single source); whoever runs the skill applies the change and re-runs `check`.

## Moving a page into the product app

1. Copy `projects/playground/src/app/pages/<page>/` and `shared/` (page-form, validators) into the app.
2. Replace `<PAGE>_SAMPLE` with the real data sources listed in the handoff (`data[].source`), keeping the types.
3. Replace each `console.info` handler stub with the real action (they are named after the spec's events and submits).
4. Keep the generated template and styles unless the spec changes; if the design changes, change the spec and regenerate here first so the handoff stays true.

## Gaps and new components

A `GAP` means no component fits. The design system owner either adds the component (design-system first, then Angular, then `npm run catalog:build` and `audit:parity`), or adds an input to an existing one. When it lands, replace the `GAP` element in the spec and re-run `check`.

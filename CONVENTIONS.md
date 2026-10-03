# Porting and writing Airiona components for Angular

Airiona's look lives entirely in `projects/airiona-ui/src/styles/components.css` (the same `bundle.css` the React reference uses). An Angular component is correct when it renders **the same DOM as the React component** (same elements, classes, ARIA attributes, inline styles, SVG geometry), so that stylesheet applies unchanged. Do not edit `components.css` or `tokens.css`.

## Sources of truth

- React reference implementation: `C:/Users/ASUS/AppData/Local/Temp/claude/C--Users-ASUS-Desktop-ref-airiona/3ce010e6-1500-409f-9a6b-54690f27a737/scratchpad/airiona-ds/project/components/bundle.js` (`h(tag, props, ...children)` is `React.createElement`).
- Preview bodies (what each component's demo shows): `.../scratchpad/gen-previews.cjs` — find `comp("Name", "Group", height, \`...body...\`, \`# README...\`)`.
- Types the React API exposes: `.../scratchpad/airiona-ds/project/components/index.d.ts`.
- READMEs with usage rules: `.../scratchpad/airiona-ds/project/components/<Name>/README.md`.
- Image blobs in previews (`/_blob/<id>`) map to showcase paths via `.../scratchpad/blob-map.json` (`photos/…`, `onboarding/…`, `art/…`); in demos use the `IMG` constants from `projects/showcase/src/app/demos/demo.ts`.

## Component rules

1. **Standalone, OnPush, signals.** `input()`, `input.required()`, `output()`, `model()` (two-way), `computed()`. Inject with `inject()`. No constructor DI, no `@Input()` decorators, no `NgModule`.
2. **One component per file**: `src/lib/<folder>/<kebab-name>.component.ts`, inline `template`, no `styles` (all styling comes from the global stylesheet). Small private helper components may share the file.
3. **Names**: class `Ar` + React name (`ArTabBar`), selector `ar-` + kebab name (`ar-tab-bar`). Native-element components use an attribute selector: `button[arChip]`, like `button[arButton]`.
4. **The host is the React root element.** Put the root's classes on the host (`host: { '[class]': 'hostClass()' }` or `class: 'ar-x'`) and its role / aria / data attributes too. This keeps parent `>` selectors and grid areas working.
   - When the React root must be a specific element for semantics or styling (`ol`, `ul`, `nav`, `header`, `table`, `form`, `label`, `article` where CSS targets the tag), render that element inside the template with the classes on it and give the host `style: 'display: contents'`.
   - Interactive roots (`button`, `a`): use an attribute selector on the native element.
   - Custom elements are `display: inline` by default, while a React `<div>` root is block. If the root class sets no `display` of its own, add the host tag to the `display: block` rule in `styles/angular.css`, or absolutely positioned children collapse to a sliver.
   - Static attributes land on the host element as well as on the input. Strip any input whose name is also an HTML attribute that changes rendering: `'[attr.title]': 'null'` (otherwise a native tooltip covers the component) and `'[attr.align]': 'null'` (legacy `align` sets `text-align`).
   - A component that sizes a slider or indicator from its items must re-measure when they resize (web fonts swap in after first render). Watch the active item with a `ResizeObserver`, as `ArIndicator` does; `document.fonts.ready` alone resolves too early.
5. **Children and slots.**
   - React `children` → `<ng-content />`.
   - Rich ReactNode props (`actions`, `footer`, `trailing`, `leading`, `art`, `media`, `summary`, …) → named projection: `<ng-content select="[arFooter]" />`; consumers write `<button arFooter …>`. Plain-text props stay `input<string>()`.
   - Render functions (e.g. a table cell renderer) → `TemplateRef` via a directive with `contentChildren`/`contentChild`, e.g. `<ng-template arCell="guest" let-row>`.
   - Data arrays (`items`, `options`, `days`, `steps`) stay inputs with **exported interfaces**.
6. **State.**
   - React `useControlled(value, default, onChange)` → `model<T>(default)` (works controlled and uncontrolled; emits `xChange`).
   - Anything that is a form value (checked, selected value, range, quantity, date) extends `ArValueControl<T>` from `core/value-control.ts` and adds `providers: [arValueAccessor(() => ArX)]`, so `[(ngModel)]` and `formControlName` work. Call `commit(v)` on user change and `touch()` on blur. See `forms/text-field.component.ts` and `actions/segmented-control.component.ts`.
7. **Outputs.** React `onX` → `output()` without the `on`, and never named like a native DOM event (`click`, `change`, `input`, `submit`, `select`, `focus`, `blur`, `close`, `scroll`). Use `press`, `closed`, `dismissed`, `action`, `opened`, `selected`, `back`, `fab`, `filter`, `send`, `add`, `open`.
8. **Browser APIs.** Never touch `window`/`document` at construction. Use `inject(ArPlatform)` (`isBrowser`, `window`, `reduceMotion()`, `haptic()`), `DOCUMENT`, `afterNextRender`, `afterEveryRender` (guard writes so they don't loop), `effect(onCleanup => …)` for timers/listeners, `viewChild('ref')` for elements. Must be SSR-safe and work **zoneless** (only signals trigger rendering; a `setTimeout` must write a signal).
9. **Helpers in core** (import from `../core/...`): `cx`, `uid`, `pad2`, `clamp`, `MONTHS`, `MONTHS_SHORT`, `DOW_MON`, `DOW_SHORT`, `fmtNumber`, `toOption`/`ArOption`, `ArIcon` (`<ar-icon name size strokeWidth variant iconClass>`), `ArScene`, `ArMedia` (`[image] [scene] [alt]`, image or drawn scene fallback), `arAssetUrl()`, `ArHeroPattern`, `ArBadge`, `ArAvatar`, `ArAvatarStack` (`ArPerson`), `ArRing`, `ArWordmark`, `ArCardHead` (eyebrow/title/openable/(open)), `widgetClass(tone, block)` + `ArWidgetTone` for `ar-w` widgets, `ArCountUp`, `ArIndicator` (sliding indicator directive), `arPresence(open, ms)` (exit animations: `is-leaving`), `arDismiss(open, inside, close)`, `arPopPosition(open, anchor, pop, align)`, `ArValueControl`, `arValueAccessor`, chart helpers `rnd`, `smoothPath`, `scalePts`, `linePath`, `ArPoint`, `ArButton`, `ArIconButton`, `ArSegmentedControl`, `ArTextField`. Use `<button arIconButton>` / `<button arButton>` wherever React renders `IconButton` / `Button`.
10. **Motion parity.** Keep every class the React code toggles (`is-leaving`, `is-next`, `is-prev`, `is-up`, `has-ind`, `ar-reveal`, `--rot`, `--c`, `--i`…) and every keyed remount (React `key` that changes → wrap in `@for (k of [key()]; track k)` to recreate the element).
11. **A11y parity.** Keep roles, `aria-*`, labels, `tabindex`, keyboard handlers from React.
12. **Docs.** JSDoc on each class with a short usage example, JSDoc on non-obvious inputs.

## Demos

Each batch writes `projects/showcase/src/app/demos/<batch>.demos.ts` exporting `<BATCH>_DEMOS: DemoDef[]` — one private demo component per library component, reproducing the React preview body (same states, data and layout), with `name`, `group` and `height` copied from `comp(...)`. Demos import from `'@airiona/ui'` and only use core components plus the batch's own components.

## Checking your work

```bash
npm run build:lib                                   # library + ng-add schematic, strict templates, partial compilation
npx ng build showcase --configuration development    # every demo against the library source
npx ng serve showcase                               # http://localhost:4200, `#all` lists every component, `?still` freezes motion
```
After adding a component file, run `node tools/gen-index.mjs` to refresh the folder barrels and `public-api.ts`.

`?solo#<name>` renders one demo on a bare stage at full width, the same way the React harness pages render a preview, so the two can be screenshotted and diffed pixel for pixel.

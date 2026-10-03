# Airiona for Angular

Source workspace for `@airiona/ui`, the Angular 20+ port of the Airiona design system (v1.6), and the showcase app that renders every component.

| Path | What it is |
| --- | --- |
| `projects/airiona-ui` | The library. Read its [README](projects/airiona-ui/README.md) for install, configuration and the component catalogue. |
| `projects/airiona-ui/icons` | Secondary entry `@airiona/ui/icons`: every Heroicon (`AR_ALL_ICONS`). |
| `projects/airiona-ui/schematics` | `ng add` schematic. |
| `projects/airiona-ui/src/styles` | `airiona.css` (tokens, component styles, Angular host rules). |
| `projects/showcase` | Zoneless demo app: 122 demos, one per reference component. |
| `tools/gen-index.mjs` | Regenerates the folder barrels and `public-api.ts` after adding a component. |
| `CONVENTIONS.md` | Porting rules: how React props map to `input()`/`model()`/`output()`, slots, templates and host classes. |

## Commands

```bash
npm install
```

```bash
npm run build:lib
```

```bash
npx ng serve showcase
```

Open `http://localhost:4200/#all` for every demo on one page, or `#<ComponentName>` for one. Add `?still` to freeze motion for screenshots.

```bash
npm pack ./dist/airiona-ui
```

That writes `airiona-ui-1.6.0.tgz`. In the product app:

```bash
ng add ./airiona-ui-1.6.0.tgz
```

## Adding a component

1. Port it into the matching folder under `projects/airiona-ui/src/lib/` following `CONVENTIONS.md`.
2. Run `node tools/gen-index.mjs`.
3. Add a demo in `projects/showcase/src/app/demos/` and register it in `registry.ts`.
4. Run `npm run build:lib` (strict partial compilation) and check the demo in the showcase.

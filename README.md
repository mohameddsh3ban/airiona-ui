# Airiona UI

The Airiona design system for flight and stay booking, in **Angular 20+** and **React 18/19**, with a catalog to browse it, one-command exports, and a Claude Code pipeline that turns page designs into Airiona pages.

| | What | Where |
|---|---|---|
| 📦 | `@airiona/ui`: Angular 20, 21, 22. Standalone, signals, zoneless and SSR safe | `projects/airiona-ui/` ([README](projects/airiona-ui/README.md)) |
| 📦 | `@airiona/react`: React 18 and 19. ES module, CommonJS, UMD, types, SSR safe | `packages/react/` ([README](packages/react/README.md)) |
| 🎨 | The design system source: React reference, styles, tokens, previews, assets | `design-system/` |
| 🔎 | Catalog: every component live in React and Angular, code, API, motion, PNG export | `catalog/` → `dist/catalog/` |
| 🧭 | Page pipeline: the `airiona-page-convert` skill and its CLI | `.claude/skills/airiona-page-convert/`, `tools/page/` |
| 🧪 | Playground: converted pages run here | `projects/playground/` |
| 🖼 | Showcase: one demo per component (the catalog's Angular previews) | `projects/showcase/` |

Both packages render the same markup with the same stylesheet; `npm run audit:parity` diffs every component pixel for pixel. Their APIs match closely but not exactly (a few inputs exist on one side only; the catalog's API tab shows each).

## Start

```bash
npm install
```

```bash
npx playwright install chromium
```

```bash
npm run catalog:build
```

```bash
npm run catalog
```

Open http://127.0.0.1:4400. Setup for product apps, CI and Claude Code: [docs/SETUP.md](docs/SETUP.md). How a page goes from design to code: [docs/HANDOFF.md](docs/HANDOFF.md).

## Commands

| Command | Does |
|---|---|
| `npm run build:lib` | Builds `@airiona/ui` (strict, partial compilation) and its `ng add` schematic. |
| `npm run build:react` | Builds `@airiona/react` from `design-system/components/bundle.js`. |
| `npm run sync` | Copies tokens and component CSS from `design-system/` into both packages (run after editing styles). |
| `npm run manifest` | Regenerates `catalog/data/manifest.json` and `docs/components/INDEX.md`. |
| `npm run catalog:build` | Builds the catalog (React pages, Angular showcase, thumbnails) into `dist/catalog/`. |
| `npm run catalog` | Serves the built catalog on port 4400. |
| `npm run catalog:test` | Opens every component in both frameworks in a real browser; checks code, API, export, search. |
| `npm run audit:parity` | Pixel diff of every component, React vs Angular. |
| `npm run export` | Everything into `exports/`: both packages, tokens, catalog site, PNGs, the skill. |
| `npm run export:png -- --scale 3` | PNG of every component in both frameworks at 3× device scale. |
| `npm run page -- <command>` | The page pipeline CLI (`suggest`, `describe`, `new`, `lint`, `check`, …). |

## Where to change things

- **A component's look or behaviour:** `design-system/components/bundle.css` (styles, shared) and `bundle.js` (React), then the Angular component in `projects/airiona-ui/src/lib/`. Run `npm run sync`, `npm run catalog:build`, `npm run audit:parity`.
- **Tokens:** `design-system/tokens.json`, then `npm run sync`.
- **A new component:** follow [CONVENTIONS.md](CONVENTIONS.md); add a preview in `design-system/components/<Name>/` and a demo in the showcase.

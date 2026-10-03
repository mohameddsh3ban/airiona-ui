# Airiona UI: notes for Claude Code

- **Converting a page or screen into Airiona:** use the `airiona-page-convert` skill (`.claude/skills/airiona-page-convert/`). One page at a time; never claim a step passed without running its command.
- **Never invent components or inputs.** Look them up: `node tools/page/airiona.mjs suggest "<what it does>"` and `node tools/page/airiona.mjs describe <Name>`. The full list is `docs/components/INDEX.md`.
- **Single source of styles:** `design-system/components/bundle.css` and `design-system/tokens.json`. Never edit `projects/airiona-ui/src/styles/components.css`, `tokens.css` or `packages/react/styles/*` directly; run `npm run sync`.
- **React and Angular render identical markup and pixels.** After changing a component, rebuild the catalog (`npm run catalog:build`) and run `npm run audit:parity` and `npm run catalog:test`. A few inputs exist in one framework only (the catalog's API tab shows each side); `lint` checks a spec against its `target` framework.
- **Angular porting rules:** `CONVENTIONS.md`.
- **Generated files, regenerate instead of editing:** `catalog/data/manifest.json`, `docs/components/INDEX.md`, `docs/pages/*/HANDOFF.md`, `projects/playground/src/app/pages/**`, `packages/react/dist`, `dist/`, `exports/`.

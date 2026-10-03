# Setup

Recommended setup for the engineering team: this repository, the product apps, Claude Code and CI.

## 1. This repository

| Need | Version |
|---|---|
| Node.js | 20.19+ or 22+ (tested on 24) |
| npm | 10+ |
| Angular CLI | comes with the workspace (20.3) |
| Chromium for Playwright | `npx playwright install chromium` |

```bash
npm install
```

```bash
npx playwright install chromium
```

```bash
npm run build:lib
```

```bash
npm run catalog:build
```

```bash
npm run catalog:test
```

`catalog:test` should end with `catalog: all checks passed`. If it does, the workspace is healthy.

## 2. An Angular product app (20, 21 or 22)

```bash
ng add ./airiona-ui-1.6.0.tgz
```

(`npm run export` writes the tarball to `exports/`; publish it to your registry to drop the path.)

`ng add` adds the stylesheet to `angular.json` and `provideAiriona({ icons: [AR_ALL_ICONS] })` to `app.config.ts`. Then:

1. **Assets:** copy `design-system/assets/` (photos, art, onboarding) into the app's `public/assets/` if you use the sample imagery, or point `provideAiriona({ assetsUrl })` at your CDN.
2. **Change detection:** zoneless (`provideZonelessChangeDetection()`, the Angular 21+ default) and zone.js both work.
3. **Server rendering:** `provideClientHydration()` works; the components touch the browser only after hydration.
4. **Fonts:** the stylesheet loads Bricolage Grotesque, Geist and Geist Mono from Google Fonts. To self-host, declare the same `@font-face` families and remove the Google import from your copy.
5. **Forms:** every input component is a form control: `formControlName`, `ngModel`, `[(value)]`. Copy `projects/playground/src/app/shared/page-form.ts` and `validators.ts` into the app for the pipeline's form helpers.
6. **Viewport:** `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` so phone safe areas apply.

## 3. A React product app (18 or 19)

```bash
npm install ./airiona-react-1.6.0.tgz
```

```tsx
import '@airiona/react/styles/airiona.css';
import { Button, DatePicker } from '@airiona/react';
```

Works with Vite, Next.js (App Router: components using state are client components; mark the importing file `'use client'`), and server rendering.

## 4. Claude Code

The page-conversion skill ships inside the repository at `.claude/skills/airiona-page-convert/`, so Claude Code picks it up when you run it here. `CLAUDE.md` at the root gives it the house rules.

- Convert a page: `/airiona-page-convert docs/designs/<page>.png` (or describe the page, or give a URL).
- The skill uses `node tools/page/airiona.mjs` for lookups and checks; it never claims a check passed without running it.
- To use the skill in another repository that consumes the packages, copy `exports/skill/airiona-page-convert` into that repository's `.claude/skills/`, and keep this workspace checked out next to it (the skill needs `tools/page/` and the manifest). The simplest setup is to convert pages here and move the generated folder into the product app.

## 5. CI (recommended gates)

```bash
npm ci && npx playwright install --with-deps chromium
```

```bash
npm run build:lib && npm run build:react
```

```bash
node tools/sync-design-system.mjs --check
```

```bash
npm run catalog:build && npm run catalog:test && npm run audit:parity
```

```bash
for p in $(npm run -s page -- list); do npm run -s page -- check "$p"; done
```

`sync --check` fails when someone edited a copied stylesheet instead of `design-system/`. `audit:parity` fails when React and Angular drift apart. The page loop keeps every converted page building and passing its phone checks.

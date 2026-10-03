# @airiona/react

The Airiona design system for **React 18 and 19**: 122 components for flight and stay booking, tokens and motion. Same markup and stylesheet as `@airiona/ui` for Angular.

```bash
npm install @airiona/react
```

```tsx
import '@airiona/react/styles/airiona.css';
import { Button, DatePicker, StickyActionBar } from '@airiona/react';

export function Checkout() {
  return (
    <StickyActionBar summary={<><b className="m-title-2">$1,284</b><span className="m-footnote">4 nights</span></>}>
      <Button variant="primary" size="lg" iconEnd="paper-airplane">Pay now</Button>
    </StickyActionBar>
  );
}
```

- ES module (`import`), CommonJS (`require`) and a UMD build (`@airiona/react/umd`, global `Airiona`, expects global `React` and `ReactDOM`).
- TypeScript types for every component (`dist/index.d.ts`).
- Server rendering safe: layout effects run only in the browser and dialogs render in place on the server.
- Styles: `@airiona/react/styles/airiona.css` (tokens + components). Tokens alone: `@airiona/react/styles/tokens.css`.
- Sample imagery: `@airiona/react/assets/*` (photos, 3D art, onboarding art).
- Next.js App Router: components with state are client components; import them from a `'use client'` file.

Browse every component with its code and API in the catalog (`npm run catalog` in the source repository).

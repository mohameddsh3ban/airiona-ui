import { Routes } from '@angular/router';
import { PlaygroundIndex } from './index.page';
import { NativeView } from './native.page';
import { PAGE_ROUTES } from './pages/pages.routes';

export const routes: Routes = [
  { path: '', component: PlaygroundIndex, title: 'Airiona Playground' },
  { path: 'native/:slug', component: NativeView, title: 'App view' },
  ...PAGE_ROUTES,
];

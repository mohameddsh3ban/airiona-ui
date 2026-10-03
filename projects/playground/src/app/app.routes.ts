import { Routes } from '@angular/router';
import { PlaygroundIndex } from './index.page';
import { PAGE_ROUTES } from './pages/pages.routes';

export const routes: Routes = [{ path: '', component: PlaygroundIndex, title: 'Airiona Playground' }, ...PAGE_ROUTES];

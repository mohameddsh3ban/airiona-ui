import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { provideAiriona } from '@airiona/ui';
import { AR_ALL_ICONS } from '@airiona/ui/icons';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // Hash routing so the built playground works from any static host and from file shots.
    provideRouter(routes, withHashLocation(), withComponentInputBinding()),
    provideAiriona({ icons: [AR_ALL_ICONS] }),
  ],
};

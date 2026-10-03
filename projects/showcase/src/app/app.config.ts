import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideAiriona } from '@airiona/ui';
import { AR_ALL_ICONS } from '@airiona/ui/icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Zoneless on purpose: proves every component runs on signals alone.
    provideZonelessChangeDetection(),
    provideAiriona({ icons: [AR_ALL_ICONS] }),
  ],
};

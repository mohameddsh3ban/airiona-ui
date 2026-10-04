import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// `?native` runs a page in app mode: the phone frame's status bar and home indicator become safe areas, and the
// browser behaviours an installed app does not have (scrollbars, tap flash, overscroll bounce) are switched off.
if (new URLSearchParams(location.search).has('native')) document.documentElement.classList.add('is-native');

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

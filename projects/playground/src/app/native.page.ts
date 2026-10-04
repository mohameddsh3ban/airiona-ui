import { ChangeDetectionStrategy, Component, DOCUMENT, computed, inject, input } from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ArButton, ArPhoneFrame } from '@airiona/ui';
import { PAGE_ROUTES } from './pages/pages.routes';

/**
 * The mobile-native option for every page: the page runs in app mode (`?native`) inside a phone frame with a 390 × 844 screen,
 * so reviewers see it as an installed app (status bar, home indicator, tab bar, no browser chrome). On a phone the
 * frame drops away and the page fills the screen.
 */
@Component({
  selector: 'pg-native',
  imports: [ArPhoneFrame, ArButton, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ar pg-native' },
  template: `
    @if (src(); as url) {
      <header class="pg-native__bar">
        <a arButton variant="ghost" size="sm" iconStart="chevron-left" routerLink="/">All pages</a>
        <b>{{ title() }}</b>
        <a arButton variant="secondary" size="sm" iconStart="computer-desktop" [routerLink]="'/' + slug()">Web view</a>
      </header>
      <ar-phone-frame class="pg-native__frame" [width]="412" [height]="844">
        <iframe class="pg-native__view" name="pg-native" [src]="url" [title]="title() + ', app view'"></iframe>
      </ar-phone-frame>
    } @else {
      <p class="pg-native__missing">No page called "{{ slug() }}". <a routerLink="/">See all pages</a>.</p>
    }
  `,
})
export class NativeView {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly location = inject(DOCUMENT).location;
  /** Route parameter (`withComponentInputBinding`). */
  readonly slug = input('');

  private readonly page = computed(() => PAGE_ROUTES.find((r) => r.path === this.slug()));
  protected readonly title = computed(() => String(this.page()?.title ?? this.slug()));
  // Only known page slugs reach the iframe, and the URL is this document's own absolute address with the search
  // and hash replaced, so it can never point at another origin (a "//host" path would, if used as-is).
  protected readonly src = computed<SafeResourceUrl | null>(() => {
    const page = this.page();
    if (!page || !this.location) return null;
    const url = new URL(this.location.href);
    url.search = '?native';
    url.hash = `#/${page.path}`;
    return url.origin === this.location.origin ? this.sanitizer.bypassSecurityTrustResourceUrl(url.href) : null;
  });
}

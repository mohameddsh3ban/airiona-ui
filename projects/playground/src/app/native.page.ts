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
  // The current document's own path, so the frame works on a dev server, a static host or any sub-path.
  private readonly path = inject(DOCUMENT).location?.pathname ?? '';
  /** Route parameter (`withComponentInputBinding`). */
  readonly slug = input('');

  private readonly page = computed(() => PAGE_ROUTES.find((r) => r.path === this.slug()));
  protected readonly title = computed(() => String(this.page()?.title ?? this.slug()));
  // Only known page slugs reach the iframe, so the trusted URL is always this app's own page.
  protected readonly src = computed<SafeResourceUrl | null>(() =>
    this.page() ? this.sanitizer.bypassSecurityTrustResourceUrl(`${this.path}?native#/${this.page()!.path}`) : null,
  );
}

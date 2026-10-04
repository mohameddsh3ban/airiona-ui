import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArButton } from '@airiona/ui';
import { PAGE_ROUTES } from './pages/pages.routes';

/** Lists the converted pages, each with its web view and its app (mobile-native) view. */
@Component({
  selector: 'pg-index',
  imports: [RouterLink, ArButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="ar" style="max-width: 760px; margin: 0 auto; padding: 32px 16px">
      <h1 class="m-large-title" style="margin: 0 0 8px">Sample pages</h1>
      <p style="color: var(--ink-muted); margin: 0 0 24px">Generated from specs in <code>docs/pages/</code>. Web opens the responsive page; App opens it as an installed phone app.</p>
      @for (r of pages; track r.path) {
        <div style="display: flex; align-items: center; gap: 10px; padding: 12px 12px 12px 18px; margin-bottom: 10px; border-radius: 20px; background: var(--surface)">
          <span style="flex: 1; min-width: 0"><b>{{ r.title }}</b> <span style="color: var(--ink-subtle)">/{{ r.path }}</span></span>
          <a arButton variant="secondary" size="sm" iconStart="computer-desktop" [routerLink]="'/' + r.path">Web</a>
          <a arButton variant="primary" size="sm" iconStart="device-phone-mobile" [routerLink]="'/native/' + r.path">App</a>
        </div>
      } @empty {
        <p>No pages yet. Run <code>node tools/page/airiona.mjs scaffold &lt;page&gt;</code>.</p>
      }
    </main>
  `,
})
export class PlaygroundIndex {
  protected readonly pages = PAGE_ROUTES.map((r) => ({ path: r.path ?? '', title: String(r.title ?? r.path) }));
}

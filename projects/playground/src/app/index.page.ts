import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PAGE_ROUTES } from './pages/pages.routes';

/** Lists the converted pages. */
@Component({
  selector: 'pg-index',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="ar" style="max-width: 720px; margin: 0 auto; padding: 32px 16px">
      <h1 class="m-large-title" style="margin: 0 0 8px">Converted pages</h1>
      <p style="color: var(--ink-muted); margin: 0 0 24px">Pages generated from specs in <code>docs/pages/</code>.</p>
      @for (r of pages; track r.path) {
        <a [routerLink]="'/' + r.path" style="display: block; padding: 16px 18px; margin-bottom: 10px; border-radius: 18px; background: var(--surface); color: inherit; text-decoration: none">
          <b>{{ r.title }}</b> <span style="color: var(--ink-subtle)">/{{ r.path }}</span>
        </a>
      } @empty {
        <p>No pages yet. Run <code>node tools/page/airiona.mjs scaffold &lt;page&gt;</code>.</p>
      }
    </main>
  `,
})
export class PlaygroundIndex {
  protected readonly pages = PAGE_ROUTES.map((r) => ({ path: r.path ?? '', title: String(r.title ?? r.path) }));
}

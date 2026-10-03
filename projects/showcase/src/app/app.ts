import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ArWordmark } from '@airiona/ui';
import { DEMOS } from './demos/registry';
import { DemoDef } from './demos/demo';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

@Component({
  selector: 'sc-root',
  imports: [NgComponentOutlet, ArWordmark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-solo]': 'solo' },
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly demos = DEMOS;
  protected readonly route = signal(this.readHash());
  protected readonly query = signal('');
  protected readonly groups = computed(() => {
    const q = this.query().toLowerCase();
    const map = new Map<string, DemoDef[]>();
    for (const d of this.demos) {
      if (q && !(d.name + ' ' + d.group).toLowerCase().includes(q)) continue;
      map.set(d.group, [...(map.get(d.group) ?? []), d]);
    }
    return [...map.entries()];
  });
  protected readonly isAll = computed(() => this.route().toLowerCase() === 'all');
  protected readonly current = computed(() => this.demos.find((d) => slug(d.name) === slug(this.route())) ?? this.demos[0]);
  /** `?solo#name` renders one bare stage at full width, matching the React harness pages, for screenshot diffs. */
  protected readonly solo = new URLSearchParams(location.search).has('solo');
  protected readonly slug = slug;

  constructor() {
    const onHash = () => this.route.set(this.readHash());
    window.addEventListener('hashchange', onHash);
    inject(DestroyRef).onDestroy(() => window.removeEventListener('hashchange', onHash));
    if (new URLSearchParams(location.search).has('still')) document.documentElement.classList.add('sc-still');
  }

  private readHash(): string {
    return decodeURIComponent(location.hash.slice(1)) || '';
  }
}

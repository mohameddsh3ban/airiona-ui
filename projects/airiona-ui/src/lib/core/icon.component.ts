import { ChangeDetectionStrategy, Component, computed, inject, input, numberAttribute } from '@angular/core';
import { ArIconRegistry } from './icon.registry';

interface PathDef {
  d: string;
  flag: boolean;
}

/**
 * Heroicons v2.2 (outline 1.5 stroke, or solid). The host uses `display: contents`, so the inner
 * `<svg class="ar-icon">` sits in the parent's layout exactly like the React version.
 *
 * ```html
 * <ar-icon name="paper-airplane" [size]="18" />
 * <ar-icon name="star" variant="solid" label="Rated" />
 * ```
 */
@Component({
  selector: 'ar-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <svg
      [class]="svgClass()"
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      [attr.stroke-width]="icon().solid ? null : strokeWidth()"
      [attr.aria-hidden]="label() ? null : 'true'"
      [attr.role]="label() ? 'img' : null"
      [attr.aria-label]="label() || null"
    >
      @for (p of paths(); track $index) {
        @if (icon().solid) {
          <path [attr.d]="p.d" [attr.fill-rule]="p.flag ? 'evenodd' : null" [attr.clip-rule]="p.flag ? 'evenodd' : null" />
        } @else {
          <path [attr.d]="p.d" [style.stroke-linecap]="p.flag ? 'butt' : null" />
        }
      }
    </svg>
  `,
})
export class ArIcon {
  private readonly registry = inject(ArIconRegistry);

  /** Any Heroicons name (kebab-case) or an Airiona addition: plane, bed, bath, utensils, car. */
  readonly name = input.required<string>();
  readonly variant = input<'outline' | 'solid'>('outline');
  readonly size = input(20, { transform: numberAttribute });
  readonly strokeWidth = input(1.5, { transform: numberAttribute });
  /** Accessible name. Without it the icon is decorative (aria-hidden). */
  readonly label = input<string>();
  /** Extra classes on the svg (e.g. 'ar-rating__star--off'). */
  readonly svgClassName = input<string>('', { alias: 'iconClass' });

  protected readonly icon = computed(() => this.registry.resolve(this.name(), this.variant()));
  protected readonly paths = computed<PathDef[]>(() => {
    const marker = this.icon().solid ? '!' : '~';
    return this.icon().paths.map((d) => (d.charAt(0) === marker ? { d: d.slice(1), flag: true } : { d, flag: false }));
  });
  protected readonly svgClass = computed(() =>
    ['ar-icon', this.icon().solid ? 'ar-icon--fill' : '', this.svgClassName()].filter(Boolean).join(' '),
  );
}

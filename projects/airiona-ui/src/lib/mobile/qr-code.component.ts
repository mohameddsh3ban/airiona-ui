import { ChangeDetectionStrategy, Component, computed, input, numberAttribute } from '@angular/core';
import { cx } from '../core/utils';
import { qrEncode, qrPath } from './qr-code';

/**
 * A real, scannable QR code drawn as one SVG path: byte mode (UTF-8), error correction M,
 * versions 1–10 (up to about 210 characters). The encoder runs once per value.
 *
 * ```html
 * <ar-qr-code value="AIRIONA|EK 312|DXB|HND|4A" label="Boarding pass code" />
 * <ar-qr-code value="K7QX2M" color="#ffffff" background="transparent" [size]="96" />
 * ```
 */
@Component({
  selector: 'ar-qr-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents', '[attr.color]': 'null' },
  template: `
    <svg
      [class]="svgClass()"
      [attr.viewBox]="'0 0 ' + full() + ' ' + full()"
      role="img"
      [attr.aria-label]="label() || 'QR code'"
      shape-rendering="crispEdges"
      [style.width]="sizeCss()"
      [style.height]="sizeCss()"
    >
      <rect [attr.width]="full()" [attr.height]="full()" [attr.fill]="background() || '#ffffff'" />
      <path [attr.d]="path()" [attr.fill]="color() || 'currentColor'" />
    </svg>
  `,
})
export class ArQRCode {
  /** The string to encode. Empty falls back to "AIRIONA". */
  readonly value = input<string | null | undefined>('');
  /** Module colour, default currentColor. */
  readonly color = input<string>();
  /** Background fill, default white. Use 'transparent' on dark surfaces. */
  readonly background = input<string>();
  /** Quiet-zone modules around the code, default 2. */
  readonly quiet = input(2, { transform: numberAttribute });
  /** Width and height; a number means px. Without it the SVG fills its container. */
  readonly size = input<number | string>();
  /** Accessible name, default "QR code". */
  readonly label = input<string>();
  /** Extra classes on the svg. */
  readonly svgClassName = input<string>('', { alias: 'qrClass' });

  /** Memoised: re-encodes only when `value` changes. */
  private readonly modules = computed(() => qrEncode(this.value() || 'AIRIONA'));
  protected readonly full = computed(() => this.modules().length + this.quiet() * 2);
  protected readonly path = computed(() => qrPath(this.modules(), this.quiet()));
  protected readonly sizeCss = computed(() => {
    const s = this.size();
    if (s === undefined || s === null || s === '') return null;
    return typeof s === 'number' ? `${s}px` : s;
  });
  protected readonly svgClass = computed(() => cx('ar-qr', this.svgClassName()));
}

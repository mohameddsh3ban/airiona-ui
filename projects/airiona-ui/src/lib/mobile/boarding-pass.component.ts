import { ChangeDetectionStrategy, Component, Directive, computed, contentChild, input } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArScene, arAssetUrl } from '../core/scene.component';
import { cx } from '../core/utils';
import { ArQRCode } from './qr-code.component';

export interface ArPassEnd {
  code: string;
  city: string;
  time?: string;
}

export interface ArPassFact {
  label: string;
  value: string | number;
}

/** Marks the 3D art projected into a BoardingPass: `<img arArt src="art/jet-3d.webp" alt="" />`. */
@Directive({ selector: '[arArt]' })
export class ArBoardingPassArt {}

/**
 * A one-piece boarding pass: sky top with the airline mark, the route in big airport codes with a plane
 * flying the dashed line, a 3D jet gliding across the fold, a midnight panel of details, and a perforated
 * stub with a real, scannable QR code. Give the jet with `artImage`, or project `<img arArt>`;
 * without either a drawn sky scene fills the fold.
 *
 * ```html
 * <ar-boarding-pass artImage="art/jet-3d.webp" date="Thu, 15 Oct" [from]="{ code: 'DXB', city: 'Dubai' }"
 *   [to]="{ code: 'HND', city: 'Tokyo' }" flight="EK 312" seat="4A" passenger="Maya Haddad"
 *   [details]="[{ label: 'Gate', value: 'B18' }]" />
 * ```
 */
@Component({
  selector: 'ar-boarding-pass',
  imports: [ArIcon, ArScene, ArQRCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'm-pass', role: 'article', '[attr.aria-label]': "'Boarding pass ' + (flight() || '')" },
  template: `
    <div class="m-pass__body">
      <div class="m-pass__top">
        <div class="m-pass__row">
          <span class="m-pass__brand"><i aria-hidden="true"></i>{{ carrier() || 'Airiona' }}</span>
          <span class="m-pass__chip">{{ cabin() || 'Boarding pass' }}</span>
        </div>
        <div class="m-pass__route">
          <div>
            <b>{{ from()?.code }}</b><span>{{ from()?.city }}</span>
            @if (from()?.time) {
              <small>{{ from()?.time }}</small>
            }
          </div>
          <div class="m-pass__mid">
            <span class="m-pass__line" aria-hidden="true"><span class="m-pass__plane"><ar-icon name="plane" [size]="18" /></span></span>
            <span>{{ duration() }}</span><small>{{ stops() || 'Non-stop' }}</small>
          </div>
          <div class="is-to">
            <b>{{ to()?.code }}</b><span>{{ to()?.city }}</span>
            @if (to()?.time) {
              <small>{{ to()?.time }}</small>
            }
          </div>
        </div>
        <div class="m-pass__date">
          <ar-icon name="calendar-days" [size]="15" />{{ date() }}@if (time()) {<span>{{ ' · ' + time() }}</span>}
        </div>
      </div>
      <div [class]="artClass()" aria-hidden="true">
        @if (artSrc()) {
          <img [src]="artSrc()" alt="" />
        }
        <ng-content select="[arArt]" />
        @if (!hasArt()) {
          <ar-scene variant="sky" />
        }
      </div>
      <div class="m-pass__details">
        @for (d of details(); track d.label) {
          <div><span>{{ d.label }}</span><b>{{ d.value }}</b></div>
        }
      </div>
      <div class="m-pass__stub">
        <div class="m-pass__qr">
          <ar-qr-code [value]="qr()" [label]="'Boarding pass code for ' + (passenger() || 'passenger')" />
          <i class="m-pass__scan" aria-hidden="true"></i>
        </div>
        <div class="m-pass__stubinfo">
          <span>{{ scanLabel() || 'Scan at the gate' }}</span>
          <b>{{ passenger() }}</b>
          <div class="m-pass__facts">
            @for (x of factList(); track x.label) {
              <span>{{ x.label }}<b>{{ x.value }}</b></span>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ArBoardingPass {
  private readonly asset = arAssetUrl();

  readonly date = input<string>();
  /** Shown after the date, e.g. "Boards 08:10". */
  readonly time = input<string>();
  readonly from = input<ArPassEnd>();
  readonly to = input<ArPassEnd>();
  readonly duration = input<string>();
  /** Default "Non-stop". */
  readonly stops = input<string>();
  /** The midnight panel, 3–9 items. */
  readonly details = input<ArPassFact[]>([]);
  readonly passenger = input<string>();
  readonly flight = input<string>();
  readonly seat = input<string>();
  /** Default "2". Ignored when `facts` is set. */
  readonly zone = input<string>();
  /** Default "042". Ignored when `facts` is set. */
  readonly seq = input<string>();
  /** Pills on the stub; defaults to Zone and Seq. */
  readonly facts = input<ArPassFact[]>();
  /** Default "Airiona". */
  readonly carrier = input<string>();
  /** Chip in the top right, default "Boarding pass". */
  readonly cabin = input<string>();
  /** The 3D jet from the Art group (e.g. 'art/jet-3d.webp'). Or project `<img arArt>`. */
  readonly artImage = input<string | null>();
  /** String encoded in the QR. Defaults to flight, route, seat, passenger and date; pass the airline's BCBP string in production. */
  readonly qrValue = input<string>(undefined, { alias: 'qr' });
  /** Default "Scan at the gate". */
  readonly scanLabel = input<string>();

  private readonly projectedArt = contentChild(ArBoardingPassArt);
  protected readonly artSrc = computed(() => this.asset(this.artImage()));
  protected readonly hasArt = computed(() => !!this.artSrc() || !!this.projectedArt());
  protected readonly artClass = computed(() => cx('m-pass__art', !this.hasArt() && 'is-scene'));
  protected readonly qr = computed(
    () =>
      this.qrValue() ||
      ['AIRIONA', this.flight() || '', this.from()?.code || '', this.to()?.code || '', this.seat() || '', this.passenger() || '', this.date() || ''].join('|'),
  );
  protected readonly factList = computed<ArPassFact[]>(
    () => this.facts() || [{ label: 'Zone', value: this.zone() || '2' }, { label: 'Seq', value: this.seq() || '042' }],
  );
}

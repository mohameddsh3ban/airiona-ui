import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';
import { ArIcon } from '../core/icon.component';
import { ArMedia, ArSceneVariant } from '../core/scene.component';

export interface ArEndpoint {
  code: string;
  city: string;
  time: string;
}
export interface ArTicketDetail {
  label: string;
  value: string;
}

/**
 * Flight card: photo on top, a panel with origin, route line and destination, and an inset plate of three facts.
 * Use `hideMedia` in search results; keep the photo on itinerary and boarding-pass views.
 *
 * ```html
 * <ar-flight-ticket [from]="{ code: 'DXB', city: 'Dubai', time: '08:45' }" [to]="{ code: 'HND', city: 'Tokyo', time: '23:10' }"
 *                   flight="EK 312" duration="9h 25m · Non-stop" airline="Emirates" cabin="Business" />
 * ```
 */
@Component({
  selector: 'ar-flight-ticket',
  imports: [ArIcon, ArMedia],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <article class="ar-ticket" [attr.aria-label]="ariaLabel()">
      @if (!hideMedia()) {
        <div class="ar-ticket__media"><ar-media [image]="image()" [scene]="scene()" alt="" /></div>
      }
      <div class="ar-ticket__panel" [style.margin]="hideMedia() ? '0px' : null">
        <div class="ar-ticket__route">
          <div class="ar-ticket__end">
            <span class="ar-ticket__time">{{ from().time }}</span><span class="ar-ticket__code">{{ from().code }}</span><span class="ar-ticket__city">{{ from().city }}</span>
          </div>
          <div class="ar-ticket__mid">
            <span class="ar-ticket__flight">{{ flight() }}</span>
            <span class="ar-ticket__line"><span class="ar-ticket__plane"><ar-icon name="plane" [size]="16" [strokeWidth]="1.75" /></span></span>
            <span class="ar-ticket__dur">{{ duration() }}</span>
          </div>
          <div class="ar-ticket__end ar-ticket__end--to">
            <span class="ar-ticket__time">{{ to().time }}</span><span class="ar-ticket__code">{{ to().code }}</span><span class="ar-ticket__city">{{ to().city }}</span>
          </div>
        </div>
        <div class="ar-ticket__plate">
          @for (d of rows(); track d.label) {
            <div class="ar-ticket__cell"><span class="ar-ticket__k">{{ d.label }}</span><span class="ar-ticket__v">{{ d.value }}</span></div>
          }
        </div>
      </div>
    </article>
  `,
})
export class ArFlightTicket {
  readonly from = input.required<ArEndpoint>();
  readonly to = input.required<ArEndpoint>();
  readonly flight = input<string>('');
  /** "9h 25m · Non-stop", or "1 stop · IST" for connections. */
  readonly duration = input<string>('');
  readonly airline = input<string>('');
  readonly cabin = input<string>('');
  /** Replaces Airline / Flight / Class. Exactly 3. */
  readonly details = input<ArTicketDetail[]>();
  readonly image = input<string | null>();
  readonly scene = input<ArSceneVariant>('sky');
  readonly hideMedia = input(false, { transform: booleanAttribute });

  protected readonly rows = computed<ArTicketDetail[]>(
    () =>
      this.details() ?? [
        { label: 'Airline', value: this.airline() },
        { label: 'Flight', value: this.flight() },
        { label: 'Class', value: this.cabin() },
      ],
  );
  protected readonly ariaLabel = computed(() => 'Flight ' + this.flight() + ' from ' + this.from().city + ' to ' + this.to().city);
}

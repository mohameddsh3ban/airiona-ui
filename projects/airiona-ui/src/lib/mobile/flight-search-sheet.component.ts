import { ChangeDetectionStrategy, Component, booleanAttribute, inject, input, linkedSignal, output, signal } from '@angular/core';
import { ArButton } from '../actions/button.component';
import { ArIcon } from '../core/icon.component';
import { ArPlatform } from '../core/platform';
import { ArFieldTile } from './field-tile.component';
import { ArMobileSegmented } from './mobile-segmented.component';

export interface ArFlightSearchPlace {
  city: string;
  code: string;
}

export type ArFlightTrip = 'round' | 'one';

export interface ArFlightSearch {
  from: ArFlightSearchPlace;
  to: ArFlightSearchPlace;
  trip: ArFlightTrip;
}

/**
 * Mobile flight search card: trip-type switch, From / Destination tiles with a swap button, dates, travellers,
 * class and a full-width search button. Place it overlapping a HeroHeader.
 *
 * ```html
 * <ar-flight-search-sheet [from]="{ city: 'Dubai', code: 'DXB' }" (searched)="find($event)" />
 * ```
 */
@Component({
  selector: 'ar-flight-search-sheet',
  imports: [ArButton, ArIcon, ArFieldTile, ArMobileSegmented],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <form class="m-flightform" (submit)="submit($event)">
      @if (!hideTrip()) {
        <ar-mobile-segmented label="Trip type" [(value)]="tripValue" [options]="tripOptions" />
      }
      <div class="m-flightform__route">
        <button arFieldTile label="From" [value]="origin().city + ' · ' + origin().code" trailingIcon="plane"></button>
        <button type="button" class="m-flightform__swap m-tap" aria-label="Swap origin and destination" (click)="swap()">
          <span class="m-flightform__spin" [style.--rot]="spin() * 180 + 'deg'"><ar-icon name="arrows-up-down" [size]="18" /></span>
        </button>
        <button arFieldTile label="Destination" [value]="destination().city + ' · ' + destination().code" trailingIcon="map-pin"></button>
      </div>
      <div class="m-flightform__grid">
        <button arFieldTile label="Departure" icon="calendar-days" [value]="depart()"></button>
        @if (tripValue() === 'round') {
          <button arFieldTile label="Return" icon="calendar-days" [value]="ret()"></button>
        }
        <button arFieldTile label="Travellers" icon="user" [value]="passengers()" chevron></button>
        <button arFieldTile label="Class" [value]="cabin()" chevron></button>
      </div>
      <button arButton variant="brand" size="lg" block type="submit">{{ cta() }}</button>
    </form>
  `,
})
export class ArFlightSearchSheet {
  private readonly platform = inject(ArPlatform);

  readonly from = input<ArFlightSearchPlace>({ city: 'Dubai', code: 'DXB' });
  readonly to = input<ArFlightSearchPlace>({ city: 'London', code: 'LHR' });
  /** Initial trip type. */
  readonly trip = input<ArFlightTrip>('round');
  readonly depart = input<string>('27 Aug');
  /** Return date (React prop `ret`). */
  readonly ret = input<string>('27 Sep');
  readonly passengers = input<string>('1 adult');
  readonly cabin = input<string>('Economy');
  readonly cta = input<string>('Search flights');
  readonly hideTrip = input(false, { transform: booleanAttribute });
  /** Submitted with the current route and trip type. */
  readonly searched = output<ArFlightSearch>();

  protected readonly origin = linkedSignal(() => this.from());
  protected readonly destination = linkedSignal(() => this.to());
  protected readonly tripValue = linkedSignal<string | null>(() => this.trip());
  protected readonly spin = signal(0);
  protected readonly tripOptions = [
    { value: 'round', label: 'Round trip', icon: 'arrows-right-left' },
    { value: 'one', label: 'One way', icon: 'arrow-right' },
  ];

  protected swap(): void {
    this.platform.haptic();
    const a = this.origin();
    this.origin.set(this.destination());
    this.destination.set(a);
    this.spin.update((n) => n + 1);
  }

  protected submit(e: Event): void {
    e.preventDefault();
    this.platform.haptic(12);
    this.searched.emit({ from: this.origin(), to: this.destination(), trip: (this.tripValue() as ArFlightTrip) ?? 'round' });
  }
}

import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, model, output, signal } from '@angular/core';
import { ArIconButton } from '../actions/icon-button.component';
import { ArSegmentedControl } from '../actions/segmented-control.component';
import { ArIcon } from '../core/icon.component';
import { cx } from '../core/utils';

/** A sunken 64px field tile: label above value. Used by BookingSearch and date pickers. */
@Component({
  selector: 'button[arTile]',
  imports: [ArIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { type: 'button', '[class]': 'hostClass()' },
  template: `
    <span class="ar-tile__label">@if (icon()) {<ar-icon [name]="icon()!" [size]="14" />}{{ label() }}</span>
    <span class="ar-tile__value">{{ value() }}@if (code()) {<span class="ar-tile__code">{{ code() }}</span>}</span>
  `,
})
export class ArTile {
  readonly label = input<string>('');
  readonly icon = input<string>();
  /** Display value (city, date, travellers…). */
  readonly value = input<string>('');
  /** Airport code shown in mono next to the value. */
  readonly code = input<string>();
  /** Blue focus halo while its popover is open. */
  readonly active = input(false, { transform: booleanAttribute });
  protected readonly hostClass = computed(() => cx('ar-tile', this.active() && 'is-active'));
}

export interface ArPlace {
  city: string;
  code: string;
}
export type ArTripType = 'one' | 'round' | 'multi';
export type ArBookingField = 'from' | 'to' | 'dep' | 'ret' | 'pax';
export interface ArFlightQuery {
  from: ArPlace;
  to: ArPlace;
  trip: ArTripType;
}

const TRIP_OPTIONS = [
  { value: 'one', label: 'One way' },
  { value: 'round', label: 'Round trip' },
  { value: 'multi', label: 'Multi-city' },
];

/**
 * Flight search bar: trip type, From ⇄ To with a spinning swap disc, dates, travellers and the brand search disc.
 * Tiles emit `fieldOpen` so the host can open the matching popover; project a node into the top right with `arExtra`.
 *
 * ```html
 * <ar-booking-search activeField="dep" (search)="find($event)">
 *   <ar-segmented-control arExtra size="sm" [options]="['Flights', 'Hotels']" />
 * </ar-booking-search>
 * ```
 */
@Component({
  selector: 'ar-booking-search',
  imports: [ArIconButton, ArSegmentedControl, ArTile],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <form class="ar-search" role="search" (submit)="submit($event)">
      <div class="ar-row" style="justify-content: space-between">
        <ar-segmented-control label="Trip type" size="sm" tone="brand" [value]="trip()" (valueChange)="setTrip($event)" [options]="tripOptions" />
        <ng-content select="[arExtra]" />
      </div>
      <div class="ar-search__fields">
        <div class="ar-search__route">
          <button arTile label="From" icon="plane" [value]="from().city" [code]="from().code" [active]="activeField() === 'from'" (click)="open('from')"></button>
          <button
            arIconButton
            icon="arrows-right-left"
            size="sm"
            variant="surface"
            label="Swap origin and destination"
            class="ar-search__swap"
            [style.--rot]="spin() * 180 + 'deg'"
            (click)="swap()"
          ></button>
          <button arTile label="To" icon="map-pin" [value]="to().city" [code]="to().code" [active]="activeField() === 'to'" (click)="open('to')"></button>
        </div>
        <div class="ar-search__dates">
          <button arTile label="Departure" icon="calendar" [value]="depart()" [active]="activeField() === 'dep'" (click)="open('dep')"></button>
          @if (trip() !== 'one') {
            <button arTile label="Return" icon="calendar" [value]="ret()" [active]="activeField() === 'ret'" (click)="open('ret')"></button>
          }
        </div>
        <button arTile label="Travellers" icon="users" class="ar-tile--guests" [value]="travellers()" [active]="activeField() === 'pax'" (click)="open('pax')"></button>
        <button arIconButton icon="magnifying-glass" variant="brand" size="lg" label="Search flights" type="submit" class="ar-search__go"></button>
      </div>
    </form>
  `,
})
export class ArBookingSearch {
  readonly from = model<ArPlace>({ city: 'Dubai', code: 'DXB' });
  readonly to = model<ArPlace>({ city: 'Tokyo', code: 'HND' });
  readonly trip = model<ArTripType>('round');
  /** Tile showing the focus halo. */
  readonly activeField = model<ArBookingField | null>(null);
  /** Display string for the departure tile. */
  readonly depart = input('Thu, 15 Oct');
  /** Display string for the return tile. */
  readonly ret = input('Sun, 25 Oct');
  readonly travellers = input('2 adults · Economy');

  /** Submitted with the current route and trip type. */
  readonly search = output<ArFlightQuery>();
  /** A tile was pressed (open its popover). */
  readonly fieldOpen = output<ArBookingField>();

  protected readonly tripOptions = TRIP_OPTIONS;
  protected readonly spin = signal(0);

  protected setTrip(v: string | null): void {
    if (v === 'one' || v === 'round' || v === 'multi') this.trip.set(v);
  }

  protected open(field: ArBookingField): void {
    this.activeField.set(field);
    this.fieldOpen.emit(field);
  }

  protected swap(): void {
    const f = this.from();
    this.from.set(this.to());
    this.to.set(f);
    this.spin.update((n) => n + 1);
  }

  protected submit(ev: Event): void {
    ev.preventDefault();
    this.search.emit({ from: this.from(), to: this.to(), trip: this.trip() });
  }
}

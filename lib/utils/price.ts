import type { Departure, RoomPrices, Tour } from '../content/tours.ts';
import { upcomingDepartures } from './departures.ts';

const pkr = new Intl.NumberFormat('en-PK');

/** "PKR 145,000": whole rupees, grouped in thousands. */
export function formatPkr(amount: number): string {
  return `PKR ${pkr.format(amount)}`;
}

/** A departure's room prices: its own set (e.g. an Eid date), or else the tour's (ADR-0017). */
export function departurePrices(tour: Pick<Tour, 'prices'>, departure: Pick<Departure, 'prices'>): RoomPrices {
  return departure.prices ?? tour.prices;
}

/**
 * The price a tour card shows: the twin price of its departure, or with no dates left the tour's
 * "from" price, which is then its own twin price (ADR-0017).
 */
export function cardPrice(tour: Pick<Tour, 'prices'>, departure: Pick<Departure, 'prices'> | undefined): number {
  return departure ? departurePrices(tour, departure).twin : tour.prices.twin;
}

/**
 * The "from" price as of `today` (YYYY-MM-DD, Asia/Karachi): the lowest twin price across the
 * tour's upcoming departures, or the tour's own twin price when none is left. Never stored.
 */
export function fromPrice(tour: Pick<Tour, 'prices' | 'departures'>, today: string): number {
  const upcoming = upcomingDepartures(tour.departures, today);
  if (upcoming.length === 0) return tour.prices.twin;
  return Math.min(...upcoming.map((departure) => departurePrices(tour, departure).twin));
}

/** The price the booking shows: the chosen departure's twin price, or "from" until one is chosen. */
export function shownPrice(
  tour: Pick<Tour, 'prices' | 'departures'>,
  chosen: Pick<Departure, 'prices'> | undefined,
  today: string,
): number {
  return chosen ? departurePrices(tour, chosen).twin : fromPrice(tour, today);
}

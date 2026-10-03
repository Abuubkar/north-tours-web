import type { Departure } from '../content/tours.ts';

/** At this many seats or fewer a departure is urgent ("Only 3 seats left"). */
const URGENT_AT = 3;

export type SeatStatus = 'open' | 'urgent' | 'soldout';

/** Worked out from seats left; never stored in content. */
export function seatStatus({ seatsLeft }: Pick<Departure, 'seatsLeft'>): SeatStatus {
  if (seatsLeft === 0) return 'soldout';
  return seatsLeft <= URGENT_AT ? 'urgent' : 'open';
}

/** The seats line on cards and rows: "3 of 16 seats left", or "Sold out · waitlist open". */
export function seatsLeftText({ seatsLeft, seatsTotal }: Pick<Departure, 'seatsLeft' | 'seatsTotal'>): string {
  if (seatStatus({ seatsLeft }) === 'soldout') return 'Sold out · waitlist open';
  return `${seatsLeft} of ${seatsTotal} seats left`;
}

/** The urgent tag, "Only 3 seats left", or null when the departure isn't urgent. */
export function urgencyText({ seatsLeft }: Pick<Departure, 'seatsLeft'>): string | null {
  if (seatStatus({ seatsLeft }) !== 'urgent') return null;
  return `Only ${seatsLeft} ${seatsLeft === 1 ? 'seat' : 'seats'} left`;
}

/** Shown in place of dates when a tour has no departures left. */
export const NO_UPCOMING_DATES = 'No upcoming dates · ask on WhatsApp';

/**
 * Departures still to come. `today` is a YYYY-MM-DD date in Asia/Karachi, passed in so the
 * build and the browser apply the same rule: a departure shows on its own date and is hidden
 * from the next day.
 */
export function upcomingDepartures<T extends Pick<Departure, 'start'>>(departures: readonly T[], today: string): T[] {
  return departures.filter((departure) => departure.start >= today);
}

const karachiDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Karachi',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** Today's date in Pakistan (YYYY-MM-DD) at the given moment. */
export function todayInKarachi(now: Date): string {
  return karachiDate.format(now);
}

/**
 * The departure a tour card shows, from a tour's upcoming departures in date order: the next
 * one with seats left. Only when every one is sold out does it show the next sold-out date,
 * with the waitlist. Undefined when there are none.
 */
export function shownDeparture<T extends Pick<Departure, 'seatsLeft'>>(departures: readonly T[]): T | undefined {
  return departures.find((departure) => seatStatus(departure) !== 'soldout') ?? departures[0];
}

/**
 * Upcoming departures across tours, one card per tour: each tour's shown departure as of
 * `today` (YYYY-MM-DD, Asia/Karachi), soonest first, then by tour title, at most `limit`.
 * A tour with nothing left drops out and the next tour fills in.
 */
export function soonestDepartures<T extends { title: string; departures: readonly Departure[] }>(
  tours: readonly T[],
  today: string,
  limit: number,
): { tour: T; departure: Departure }[] {
  return tours
    .flatMap((tour) => {
      const departure = shownDeparture(upcomingDepartures(tour.departures, today));
      return departure ? [{ tour, departure }] : [];
    })
    .sort((a, b) => a.departure.start.localeCompare(b.departure.start) || a.tour.title.localeCompare(b.tour.title))
    .slice(0, limit);
}

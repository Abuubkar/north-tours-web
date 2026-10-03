import { todayInKarachi, upcomingDepartures } from '../utils/departures.ts';
import { loadTravelContent } from './check.ts';
import type { Destination } from './destinations.ts';
import { CONTENT_DIR, ContentError } from './files.ts';
import type { Tour } from './tours.ts';

type Travel = { tours: Tour[]; destinations: Destination[] };

/**
 * Valid tours and destinations as of `today` (YYYY-MM-DD, Asia/Karachi): departures before
 * today are dropped, so the built site never lists a trip that has already left.
 */
export function travelAsOf(today: string, dir = CONTENT_DIR): Travel {
  const { tours, destinations, problems } = loadTravelContent(dir);
  if (problems.length > 0) throw new ContentError(problems);
  return {
    destinations,
    tours: tours.map((tour) => ({ ...tour, departures: upcomingDepartures(tour.departures, today) })),
  };
}

let cached: Travel | undefined;

function travel(): Travel {
  cached ??= travelAsOf(todayInKarachi(new Date()));
  return cached;
}

/** All tours, each with its upcoming departures in date order. */
export function getTours(): Tour[] {
  return travel().tours;
}

export function getTour(slug: string): Tour | undefined {
  return travel().tours.find((tour) => tour.slug === slug);
}

export function getDestinations(): Destination[] {
  return travel().destinations;
}

export function getDestination(slug: string): Destination | undefined {
  return travel().destinations.find((destination) => destination.slug === slug);
}

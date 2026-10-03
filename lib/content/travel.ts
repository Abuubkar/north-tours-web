import { loadTravelContent } from './check.ts';
import { ContentError } from './files.ts';
import type { Destination } from './destinations.ts';
import type { Tour } from './tours.ts';

let cached: { tours: Tour[]; destinations: Destination[] } | undefined;

function travel() {
  if (!cached) {
    const { tours, destinations, problems } = loadTravelContent();
    if (problems.length > 0) throw new ContentError(problems);
    cached = { tours, destinations };
  }
  return cached;
}

/** All tours, each with its departures in date order. */
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

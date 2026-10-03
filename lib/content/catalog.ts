import { todayInKarachi, upcomingDepartures } from '../utils/departures.ts';
import { loadDestinations, type Destination } from './destinations.ts';
import { CONTENT_DIR, ContentError } from './files.ts';
import { checkTourLinks } from './links.ts';
import { loadTours, type Tour } from './tours.ts';

/** The catalog: every tour and the destinations they visit. */
type Catalog = { tours: Tour[]; destinations: Destination[] };

/** Loads tours and destinations together and checks the links between them. */
export function loadCatalog(dir = CONTENT_DIR) {
  const destinations = loadDestinations(dir);
  const tours = loadTours(dir);
  return {
    tours: tours.items,
    destinations: destinations.items,
    problems: [
      ...destinations.problems,
      ...tours.problems,
      ...checkTourLinks(tours.items, tours.files, destinations.files),
    ],
  };
}

/**
 * The valid catalog as of `today` (YYYY-MM-DD, Asia/Karachi): departures before today are
 * dropped, so the built site never lists a trip that has already left.
 */
export function catalogAsOf(today: string, dir = CONTENT_DIR): Catalog {
  const { tours, destinations, problems } = loadCatalog(dir);
  if (problems.length > 0) throw new ContentError(problems);
  return {
    destinations,
    tours: tours.map((tour) => ({ ...tour, departures: upcomingDepartures(tour.departures, today) })),
  };
}

let cached: Catalog | undefined;

function catalog(): Catalog {
  cached ??= catalogAsOf(todayInKarachi(new Date()));
  return cached;
}

/** All tours, each with its upcoming departures in date order. */
export function getTours(): Tour[] {
  return catalog().tours;
}

export function getTour(slug: string): Tour | undefined {
  return catalog().tours.find((tour) => tour.slug === slug);
}

export function getDestinations(): Destination[] {
  return catalog().destinations;
}

export function getDestination(slug: string): Destination | undefined {
  return catalog().destinations.find((destination) => destination.slug === slug);
}

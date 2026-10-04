import type { Destination } from '../content/destinations.ts';
import type { Tour } from '../content/tours.ts';
import { NO_FILTERS, tourResults, type ListedTour, type TourResult } from './tourFilters.ts';

/*
 * What a destination page works out from the tours (PRD #63): never stored in the destination's
 * file, so adding a tour never needs a destination edit.
 */

/** The tours that visit a destination: those whose `destinations` include it, in the order given. */
export function toursVisiting<T extends Pick<Tour, 'destinations'>>(slug: string, tours: readonly T[]): T[] {
  return tours.filter((tour) => tour.destinations.includes(slug));
}

/**
 * A destination's tours as cards, as of `today` (YYYY-MM-DD, Asia/Karachi): every one, with the
 * departure its card shows (the next with seats, else the next sold out, else none), in the
 * Tours page's order: bookable, sold out, then no upcoming dates; soonest first; ties by title.
 */
export function tourCards<T extends ListedTour>(tours: readonly T[], today: string): TourResult<T>[] {
  return tourResults(tours, NO_FILTERS, today);
}

/** What a place to see is, shown as its tag: the design's four, and meadows (Fairy Meadows, Deosai). */
export const PLACE_KINDS = ['heritage', 'viewpoint', 'lake', 'adventure', 'meadow'] as const;

/** A destination page's sections, top to bottom. */
export type DestinationSection = 'hero' | 'overview' | 'calendar' | 'places' | 'gettingThere' | 'goodToKnow' | 'tours' | 'banner';

/**
 * The sections a destination's page shows, in order: the hero, overview, season calendar,
 * getting there and the private trip banner always; places to see, good to know and the tours
 * that visit only with places, notes and tours. Every section is an <h2> under the page's <h1>,
 * so leaving one out never skips a heading level.
 */
export function destinationSections({ destination, tours }: { destination: Pick<Destination, 'places' | 'notes'>; tours: readonly unknown[] }): DestinationSection[] {
  const sections: [DestinationSection, boolean][] = [
    ['hero', true],
    ['overview', true],
    ['calendar', true],
    ['places', Boolean(destination.places?.length)],
    ['gettingThere', true],
    ['goodToKnow', Boolean(destination.notes?.length)],
    ['tours', tours.length > 0],
    ['banner', true],
  ];
  return sections.flatMap(([section, shows]) => (shows ? [section] : []));
}

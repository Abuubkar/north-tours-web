import type { Destination } from '../content/destinations.ts';
import type { Tour } from '../content/tours.ts';

/*
 * What a destination page works out from the tours (PRD #63): never stored in the destination's
 * file, so adding a tour never needs a destination edit.
 */

/** The tours that visit a destination: those whose `destinations` include it, in the order given. */
export function toursVisiting<T extends Pick<Tour, 'destinations'>>(slug: string, tours: readonly T[]): T[] {
  return tours.filter((tour) => tour.destinations.includes(slug));
}

/** What a place to see is, shown as its tag: the design's four, and meadows (Fairy Meadows, Deosai). */
export const PLACE_KINDS = ['heritage', 'viewpoint', 'lake', 'adventure', 'meadow'] as const;

/** A destination page's sections, top to bottom. */
export type DestinationSection = 'hero' | 'overview' | 'calendar' | 'places';

/**
 * The sections a destination's page shows, in order: the hero, overview and season calendar
 * always; places to see only with places. Every section is an <h2> under the page's <h1>, so
 * leaving one out never skips a heading level.
 */
export function destinationSections(destination: Pick<Destination, 'places'>): DestinationSection[] {
  return ['hero', 'overview', 'calendar', ...(destination.places?.length ? (['places'] as const) : [])];
}

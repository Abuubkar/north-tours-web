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
export type DestinationSection = 'hero' | 'overview' | 'calendar' | 'places' | 'gettingThere' | 'goodToKnow';

/**
 * The sections a destination's page shows, in order: the hero, overview, season calendar and
 * getting there always; places to see and good to know only with places and notes. Every
 * section is an <h2> under the page's <h1>, so leaving one out never skips a heading level.
 */
export function destinationSections(destination: Pick<Destination, 'places' | 'notes'>): DestinationSection[] {
  const sections: [DestinationSection, boolean][] = [
    ['hero', true],
    ['overview', true],
    ['calendar', true],
    ['places', Boolean(destination.places?.length)],
    ['gettingThere', true],
    ['goodToKnow', Boolean(destination.notes?.length)],
  ];
  return sections.flatMap(([section, shows]) => (shows ? [section] : []));
}

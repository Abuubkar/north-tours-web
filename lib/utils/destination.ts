import type { Tour } from '../content/tours.ts';

/*
 * What a destination page works out from the tours (PRD #63): never stored in the destination's
 * file, so adding a tour never needs a destination edit.
 */

/** The tours that visit a destination: those whose `destinations` include it, in the order given. */
export function toursVisiting<T extends Pick<Tour, 'destinations'>>(slug: string, tours: readonly T[]): T[] {
  return tours.filter((tour) => tour.destinations.includes(slug));
}

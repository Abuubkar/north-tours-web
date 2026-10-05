import type { Destination } from '../content/destinations.ts';
import { routes } from '../routes.ts';
import { formatElevation } from './elevation.ts';

/** One place in the Homepage's altitude strip: a destination, its page and its altitude. */
export type AltitudePlace = {
  name: string;
  href: string;
  /** "2,438 m", as in the destination's facts. */
  altitude: string;
};

/**
 * The altitude strip's places (PRD #135): one per destination, in content order, each linking to
 * its page with the main town's altitude. The figures are the destinations' own, so they stay
 * covered by each destination's `sample` flag. No destinations, no places (and no strip).
 */
export function altitudePlaces(destinations: Pick<Destination, 'name' | 'slug' | 'altitude'>[]): AltitudePlace[] {
  return destinations.map(({ name, slug, altitude }) => ({
    name,
    href: routes.destination(slug),
    altitude: formatElevation(altitude),
  }));
}

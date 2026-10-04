import { toursVisiting } from '../utils/destination.ts';
import { fillTokens } from '../utils/tokens.ts';
import { getDestination, getTours } from './catalog.ts';
import { isPhoto } from './images.ts';
import { getDestinationCopy, getHomeCopy } from './pages.ts';
import { getSettings } from './settings.ts';

/** The destination page's <title>: "Hunza tours from Lahore" (the brand is added after). */
export function destinationPageTitle(slug: string): string {
  return fillTokens(getDestinationCopy().title, { destination: getDestination(slug)!.name });
}

/**
 * Everything a destination page shows, read through the loaders and shaped for its sections, so
 * the route only composes. Its tours are worked out from the tours, never stored.
 */
export function getDestinationPage(slug: string) {
  const destination = getDestination(slug)!;
  const settings = getSettings();
  return {
    destination,
    copy: getDestinationCopy(),
    settings,
    /** The destination's photo; until it has one, the Homepage's. */
    sharePhoto: isPhoto(destination.image) ? destination.image : getHomeCopy().hero.image,
    tours: toursVisiting(slug, getTours()),
  };
}

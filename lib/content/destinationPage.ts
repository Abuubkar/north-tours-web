import { todayInKarachi } from '../utils/departures.ts';
import { toursVisiting } from '../utils/destination.ts';
import { fillTokens } from '../utils/tokens.ts';
import { destinationMessage, whatsappLink } from '../utils/whatsapp.ts';
import { getDestination, getTours } from './catalog.ts';
import { isPhoto } from './images.ts';
import { getDestinationCopy, getHomeCopy, getToursCopy } from './pages.ts';
import { getSettings } from './settings.ts';

/** The destination page's <title>: "Hunza tours from Lahore" (the brand is added after). */
export function destinationPageTitle(slug: string): string {
  return fillTokens(getDestinationCopy().title, { destination: getDestination(slug)!.name });
}

/**
 * Everything a destination page shows, read through the loaders and shaped for its sections, so
 * the route only composes. Its tours are worked out from the tours, never stored, and picked down
 * to what their cards need, since the cards are client code.
 */
export function getDestinationPage(slug: string) {
  const destination = getDestination(slug)!;
  const settings = getSettings();
  return {
    destination,
    copy: getDestinationCopy(),
    settings,
    /** The page's words take the destination's name. */
    tokens: { destination: destination.name },
    /** The destination's photo; until it has one, the Homepage's. */
    sharePhoto: isPhoto(destination.image) ? destination.image : getHomeCopy().hero.image,
    /** The build's date (Asia/Karachi), for the browser's re-check of departures. */
    builtOn: todayInKarachi(new Date()),
    /** The WhatsApp number and messages, for the tour cards. */
    whatsapp: { contact: settings.contact, whatsapp: settings.whatsapp },
    /** "Ask on WhatsApp" about this destination (the private trip banner). */
    askHref: whatsappLink(settings.contact.whatsapp, destinationMessage(settings.whatsapp, destination.name)),
    /** The Tours banner's place photo, until the owner supplies one of a family with their guide (ADR-0009). */
    bannerImage: getToursCopy().banner.image,
    tours: toursVisiting(slug, getTours()).map((t) => ({
      slug: t.slug,
      title: t.title,
      route: t.route,
      days: t.days,
      nights: t.nights,
      prices: t.prices,
      rating: t.rating,
      image: t.image,
      destinations: t.destinations,
      tripTypes: t.tripTypes,
      departures: t.departures,
    })),
  };
}

import { whatsappLink } from '../utils/whatsapp.ts';
import { getDestinations } from './catalog.ts';
import { isPhoto } from './images.ts';
import { getDestinationsCopy, getHomeCopy, getToursCopy } from './pages.ts';
import { getSettings } from './settings.ts';

/** Everything the destinations page shows, read through the loaders, so the route only composes. */
export function getDestinationsPage() {
  const settings = getSettings();
  const destinations = getDestinations();
  const first = destinations[0].image;
  return {
    copy: getDestinationsCopy(),
    settings,
    /** Every destination, in the loader's order. */
    destinations,
    /** The first destination's photo; until it has one, the Homepage's. */
    sharePhoto: isPhoto(first) ? first : getHomeCopy().hero.image,
    /** "Ask on WhatsApp" with the general message (the private trip banner). */
    askHref: whatsappLink(settings.contact.whatsapp, settings.whatsapp.generalMessage),
    /** The Tours banner's place photo, until the owner supplies one of a family with their guide (ADR-0009). */
    bannerImage: getToursCopy().banner.image,
  };
}

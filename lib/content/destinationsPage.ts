import { whatsappLink } from '../utils/whatsapp.ts';
import { getDestinations } from './catalog.ts';
import type { Destination } from './destinations.ts';
import { isPhoto, type Photo } from './images.ts';
import { getDestinationsCopy, getHomeCopy, getToursCopy } from './pages.ts';
import { getSettings } from './settings.ts';

/** The page's share image: the first destination's photo, or the Homepage's while none has one. */
export function destinationsSharePhoto(destinations: Pick<Destination, 'image'>[], fallback: Photo): Photo {
  return destinations.map((d) => d.image).find(isPhoto) ?? fallback;
}

/** Everything the destinations page shows, read through the loaders, so the route only composes. */
export function getDestinationsPage() {
  const settings = getSettings();
  const destinations = getDestinations();
  return {
    copy: getDestinationsCopy(),
    settings,
    /** Every destination, in the loader's order, each picked down to what its card shows. */
    destinations: destinations.map(({ slug, name, bestSeason, image }) => ({ slug, name, bestSeason, image })),
    sharePhoto: destinationsSharePhoto(destinations, getHomeCopy().hero.image),
    /** "Ask on WhatsApp" with the general message (the private trip banner). */
    askHref: whatsappLink(settings.contact.whatsapp, settings.whatsapp.generalMessage),
    /** The Tours banner's place photo, until the owner supplies one of a family with their guide (ADR-0009). */
    bannerImage: getToursCopy().banner.image,
  };
}

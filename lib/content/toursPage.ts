import { todayInKarachi } from '../utils/departures.ts';
import { getDestinations, getTours } from './catalog.ts';
import { getHomeCopy, getToursCopy } from './pages.ts';
import { getSettings } from './settings.ts';

/**
 * Everything the Tours page shows, read through the loaders and shaped for its sections, so the
 * route only composes. The list is client code, so each tour is picked down to what its card
 * and the list need.
 */
export function getToursPage() {
  const settings = getSettings();
  return {
    copy: getToursCopy(),
    settings,
    /** The build's date (Asia/Karachi), for the browser's re-check of departures. */
    builtOn: todayInKarachi(new Date()),
    /** The page has no photo of its own, so it shares the Homepage's. */
    sharePhoto: getHomeCopy().hero.image,
    /** The WhatsApp number and messages. */
    whatsapp: { contact: settings.contact, whatsapp: settings.whatsapp },
    tours: getTours().map((t) => ({
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
    /** In the loader's order: the Destination options. */
    destinations: getDestinations().map((d) => ({ slug: d.slug, name: d.name })),
  };
}

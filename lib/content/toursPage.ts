import { todayInKarachi } from '../utils/departures.ts';
import { optionLabels } from '../utils/resultsText.ts';
import { getDestinations, getTour, getTours } from './catalog.ts';
import { getHomeCopy, getToursCopy } from './pages.ts';
import { getReviews } from './reviews.ts';
import { ratingSummary } from '../utils/rating.ts';
import { whatsappLink } from '../utils/whatsapp.ts';
import { getSettings } from './settings.ts';

/** The most recent reviews the page shows. */
const REVIEW_CARDS = 3;

/**
 * Everything the Tours page shows, read through the loaders and shaped for its sections, so the
 * route only composes. The list is client code, so each tour is picked down to what its card
 * and the list need.
 */
export function getToursPage() {
  const settings = getSettings();
  const copy = getToursCopy();
  const destinations = getDestinations();
  return {
    copy,
    settings,
    /** The build's date (Asia/Karachi), for the browser's re-check of departures. */
    builtOn: todayInKarachi(new Date()),
    /** The page has no photo of its own, so it shares the Homepage's. */
    sharePhoto: getHomeCopy().hero.image,
    /** The WhatsApp number and messages. */
    whatsapp: { contact: settings.contact, whatsapp: settings.whatsapp },
    /** "Ask on WhatsApp" with the general message (the private trip banner). */
    askHref: whatsappLink(settings.contact.whatsapp, settings.whatsapp.generalMessage),
    /** The three most recent reviews, and the rating across every tour. */
    reviews: getReviews()
      .slice(0, REVIEW_CARDS)
      .map((review) => ({ review, tourTitle: getTour(review.tour)!.title })),
    ratingSummary: ratingSummary(getTours().map((tour) => tour.rating)),
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
    /** Destination slugs in the loader's order: the Destination options. */
    destinations: destinations.map((d) => d.slug),
    /** Each option's words: destination names, and the page's labels for the fixed groups. */
    optionLabels: optionLabels(destinations, copy.filters.options),
  };
}

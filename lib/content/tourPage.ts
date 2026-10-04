import { dayCount } from '../utils/dates.ts';
import { todayInKarachi } from '../utils/departures.ts';
import { paymentMethodsLabel } from '../utils/payments.ts';
import { fillTokens, settingsTokens, textTokens } from '../utils/tokens.ts';
import { getTour, getTours } from './catalog.ts';
import { getFaqs, tourPageFaqs } from './faqs.ts';
import { isPhoto } from './images.ts';
import { getHomeCopy, getTourCopy } from './pages.ts';
import { getReviewsForTour } from './reviews.ts';
import { getSettings } from './settings.ts';

/** The tour's most recent reviews shown on its page. */
const REVIEW_CARDS = 3;

/** The tour page's <title>: "Hunza & Skardu Grand, 9 days from Lahore" (the brand is added after). */
export function tourPageTitle(slug: string): string {
  const tour = getTour(slug)!;
  return fillTokens(getTourCopy().title, { tour: tour.title, duration: dayCount(tour.days) });
}

/**
 * Everything the tour page shows, read through the loaders and shaped for its sections, so the
 * route only composes. Values for client components are picked down to what they use, since
 * everything passed to them is sent to the browser.
 */
export function getTourPage(slug: string) {
  const tour = getTour(slug)!;
  const copy = getTourCopy();
  const settings = getSettings();
  const tokens = { ...settingsTokens(settings), licence: settings.legal.dtsLicence };
  return {
    tour,
    copy,
    settings,
    tokens,
    /** The build's date (Asia/Karachi), for the browser's re-check of departures. */
    builtOn: todayInKarachi(new Date()),
    /** The tour's photo; until it has one, the Homepage's. */
    sharePhoto: isPhoto(tour.image) ? tour.image : getHomeCopy().hero.image,
    /** The WhatsApp number and messages. */
    whatsapp: { contact: settings.contact, whatsapp: settings.whatsapp },
    paymentMethods: paymentMethodsLabel(settings),
    reviews: getReviewsForTour(slug)
      .slice(0, REVIEW_CARDS)
      .map((review) => ({ review, tourTitle: tour.title })),
    /** The tour's own questions, then the shared ones marked for tour pages, answers filled from settings. */
    questions: [...tour.faqs, ...tourPageFaqs(getFaqs())].map(({ question, answer }) => ({
      question,
      answer: fillTokens(answer, textTokens(settings)),
    })),
    /** Every tour as its card needs it (this one too; the rule leaves it out), for the related trips. */
    relatedCandidates: getTours().map((t) => ({
      slug: t.slug,
      title: t.title,
      route: t.route,
      days: t.days,
      nights: t.nights,
      prices: t.prices,
      rating: t.rating,
      image: t.image,
      destinations: t.destinations,
      departures: t.departures,
    })),
  };
}

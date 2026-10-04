import { dayCount } from '../utils/dates.ts';
import { todayInKarachi } from '../utils/departures.ts';
import { paymentMethodsLabel } from '../utils/payments.ts';
import { faqPage, touristTrip } from '../utils/structuredData.ts';
import { fillTokens, settingsTokens, textTokens } from '../utils/tokens.ts';
import { cardTour } from '../utils/cardTour.ts';
import { getTour, getTours } from './catalog.ts';
import { getFaqs, tourPageFaqs } from './faqs.ts';
import { isPhoto } from './images.ts';
import { getHomeCopy, getTourCopy, getToursCopy } from './pages.ts';
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
  const answerTokens = textTokens(settings);
  const builtOn = todayInKarachi(new Date());
  const sharePhoto = isPhoto(tour.image) ? tour.image : getHomeCopy().hero.image;
  const reviews = getReviewsForTour(slug).slice(0, REVIEW_CARDS);
  const questions = [...tour.faqs, ...tourPageFaqs(getFaqs())].map(({ question, answer }) => ({
    question,
    answer: fillTokens(answer, answerTokens),
  }));
  return {
    tour,
    copy,
    settings,
    tokens,
    /** The build's date (Asia/Karachi), for the browser's re-check of departures. */
    builtOn,
    /** The tour's photo; until it has one, the Homepage's. */
    sharePhoto,
    /** The WhatsApp number and messages. */
    whatsapp: { contact: settings.contact, whatsapp: settings.whatsapp },
    paymentMethods: paymentMethodsLabel(settings),
    reviews: reviews.map((review) => ({ review, tourTitle: tour.title })),
    /** The tour's own questions, then the shared ones marked for tour pages, answers filled from settings. */
    questions,
    /** For search engines: the trip with its offers, and the questions the page shows. */
    structuredData: {
      trip: touristTrip({
        tour,
        image: sharePhoto.src,
        tripTypeLabels: getToursCopy().filters.options.type,
        reviews,
        today: builtOn,
        settings,
      }),
      faqs: faqPage(questions),
    },
    /** Every tour as its card needs it (this one too; the rule leaves it out), for the related trips. */
    relatedCandidates: getTours().map(cardTour),
  };
}

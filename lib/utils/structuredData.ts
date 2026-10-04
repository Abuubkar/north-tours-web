import type { Review } from '../content/reviews.ts';
import type { Settings } from '../content/settings.ts';
import type { Tour } from '../content/tours.ts';
import { seatStatus, upcomingDepartures, type SeatStatus } from './departures.ts';
import { shareImageUrl } from './metadata.ts';
import { hasPlaceholder } from './placeholder.ts';
import { departurePrices } from './price.ts';
import { siteUrlFor } from './siteUrl.ts';
import type { TripType } from './tourFilters.ts';

/*
 * Structured data (JSON-LD, PRD #94) as plain objects; `JsonLd` writes them into the page. A
 * value with a `[placeholder]` part is left out, except the brand name, which is required and
 * shows as written until it's real (`launch:check` lists it). Ratings and reviews are only
 * marked up once they're real (ADR-0022).
 */

export type JsonObject = { [key: string]: unknown };

const CONTEXT = 'https://schema.org';

/** The value, or undefined (left out of the JSON) while any part of it is a `[placeholder]`. */
const real = (value: string) => (hasPlaceholder(value) ? undefined : value);

/** The company, on the Homepage. No rating: search engines ignore a business's ratings of itself. */
export function travelAgency(
  settings: Pick<Settings, 'brand' | 'site' | 'social' | 'payments'> & { contact: Pick<Settings['contact'], 'phone' | 'email' | 'officeAddress'> },
  page: { description: string; image: string },
): JsonObject {
  const sameAs = Object.values(settings.social).filter((link) => !hasPlaceholder(link));
  return {
    '@context': CONTEXT,
    '@type': 'TravelAgency',
    name: settings.brand.name,
    url: siteUrlFor('/', settings.site.url),
    description: page.description,
    image: shareImageUrl(page.image, settings.site.url),
    telephone: real(settings.contact.phone),
    email: real(settings.contact.email),
    address: real(settings.contact.officeAddress),
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    paymentAccepted: settings.payments.methods.join(', '),
    currenciesAccepted: 'PKR',
  };
}

const AVAILABILITY: Record<SeatStatus, string> = {
  open: 'https://schema.org/InStock',
  urgent: 'https://schema.org/LimitedAvailability',
  soldout: 'https://schema.org/SoldOut',
};

export type TripData = {
  tour: Pick<Tour, 'slug' | 'title' | 'summary' | 'tripTypes' | 'itinerary' | 'prices' | 'departures' | 'rating' | 'sample'>;
  /** The tour page's share photo; its 1200×630 crop is the image. */
  image: string;
  /** Trip types as the site labels them ("Family"). */
  tripTypeLabels: Record<TripType, string>;
  /** The reviews the page shows. */
  reviews: Pick<Review, 'name' | 'rating' | 'quote' | 'month' | 'sample'>[];
  /** The build's date, YYYY-MM-DD in Asia/Karachi: departures before it aren't offered. */
  today: string;
  settings: Pick<Settings, 'brand' | 'site'>;
};

/**
 * A tour page's trip: its itinerary, one offer per upcoming departure (the twin price per
 * person in PKR, availability from seats, valid until it leaves), and its rating and reviews
 * only once they aren't sample (ADR-0022).
 */
export function touristTrip({ tour, image, tripTypeLabels, reviews, today, settings }: TripData): JsonObject {
  const url = (path: string) => siteUrlFor(path, settings.site.url);
  const page = url(`/tours/${tour.slug}`);
  const upcoming = upcomingDepartures(tour.departures, today);
  const ratingIsReal = !tour.sample && !tour.rating.sample && tour.rating.count > 0;
  const realReviews = reviews.filter((review) => !review.sample);
  return {
    '@context': CONTEXT,
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.summary,
    url: page,
    image: shareImageUrl(image, settings.site.url),
    touristType: tour.tripTypes.map((type) => tripTypeLabels[type]),
    provider: { '@type': 'TravelAgency', name: settings.brand.name, url: url('/') },
    itinerary: {
      '@type': 'ItemList',
      itemListElement: tour.itinerary.map((day, i) => ({ '@type': 'ListItem', position: i + 1, name: day.title, description: day.text })),
    },
    offers:
      upcoming.length > 0
        ? upcoming.map((departure) => ({
            '@type': 'Offer',
            price: departurePrices(tour, departure).twin,
            priceCurrency: 'PKR',
            availability: AVAILABILITY[seatStatus(departure)],
            validThrough: departure.start,
            url: `${page}#dates`,
            itemOffered: { '@type': 'Trip', name: tour.title, departureTime: departure.start, arrivalTime: departure.end },
          }))
        : undefined,
    aggregateRating: ratingIsReal
      ? { '@type': 'AggregateRating', ratingValue: tour.rating.score, reviewCount: tour.rating.count, bestRating: 5 }
      : undefined,
    review:
      realReviews.length > 0
        ? realReviews.map((review) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: review.name },
            reviewRating: { '@type': 'Rating', ratingValue: review.rating, bestRating: 5 },
            reviewBody: review.quote,
            datePublished: review.month,
          }))
        : undefined,
  };
}

/** The questions a page shows, in its order, each with its answer as shown (tokens filled). */
export function faqPage(questions: { question: string; answer: string }[]): JsonObject {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: questions.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

/** The JSON for a `<script type="application/ld+json">`, with `<` escaped so no text can close the script. */
export function jsonLdText(data: JsonObject): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

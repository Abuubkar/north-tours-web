import type { Tour } from '../content/tours.ts';

/**
 * A tour as the lists of cards use it: the card's own fields, and the destinations, trip types
 * and departures the lists filter and sort on. Everything passed to a client component is written
 * into the page's HTML, so lists of cards get this, never the whole tour with its itinerary, stays
 * and questions.
 */
export function cardTour({ slug, title, route, days, nights, prices, rating, image, destinations, tripTypes, departures }: Tour) {
  return { slug, title, route, days, nights, prices, rating, image, destinations, tripTypes, departures };
}

export type CardTour = ReturnType<typeof cardTour>;

import type { Departure, Tour } from '../content/tours.ts';
import { seatStatus, shownDeparture } from './departures.ts';

/*
 * The Tours page's list (PRD #56): which departure each card shows, and the order of the cards.
 * The page renders these; the browser runs them again with its own date.
 */

/** What the list needs from a tour. */
export type ListedTour = Pick<Tour, 'title'> & { departures: readonly Departure[] };

/** A card on the list: its tour and the departure it shows, or none when the tour has no dates left. */
export type TourResult<T extends ListedTour> = { tour: T; departure: Departure | undefined };

/** Bookable trips first, then sold out (the card's date is full), then trips with no upcoming dates. */
function availability(departure: Departure | undefined): number {
  if (!departure) return 2;
  return seatStatus(departure) === 'soldout' ? 1 : 0;
}

/**
 * Every tour as a card, as of `today` (YYYY-MM-DD, Asia/Karachi). Each card shows the tour's
 * next departure with seats, or its next sold-out one when all are full (`shownDeparture`).
 * Bookable trips come first, then sold-out ones, then those with no upcoming dates; within
 * each, the soonest departure first, then by title.
 */
export function tourResults<T extends ListedTour>(tours: readonly T[], today: string): TourResult<T>[] {
  return tours
    .map((tour) => ({ tour, departure: shownDeparture(tour.departures, today) }))
    .sort(
      (a, b) =>
        availability(a.departure) - availability(b.departure) ||
        (a.departure?.start ?? '').localeCompare(b.departure?.start ?? '') ||
        a.tour.title.localeCompare(b.tour.title),
    );
}

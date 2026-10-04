import type { Departure, Tour } from '../content/tours.ts';
import { shownDeparture } from './departures.ts';

type Candidate = Pick<Tour, 'slug' | 'title' | 'destinations'> & { departures: readonly Departure[] };

/**
 * "Other trips from Lahore" as of `today` (YYYY-MM-DD, Asia/Karachi): other tours with a
 * departure still to come, those sharing a destination with `tour` first, then by the date each
 * card shows (lib/utils/departures `shownDeparture`) and title. At most `limit`.
 */
export function relatedTours<T extends Candidate>(
  tour: Pick<Tour, 'slug' | 'destinations'>,
  tours: readonly T[],
  today: string,
  limit: number,
): { tour: T; departure: Departure }[] {
  const shares = (other: T) => other.destinations.some((d) => tour.destinations.includes(d));
  return tours
    .filter((other) => other.slug !== tour.slug)
    .flatMap((other) => {
      const departure = shownDeparture(other.departures, today);
      return departure ? [{ tour: other, departure }] : [];
    })
    .sort(
      (a, b) =>
        Number(shares(b.tour)) - Number(shares(a.tour)) ||
        a.departure.start.localeCompare(b.departure.start) ||
        a.tour.title.localeCompare(b.tour.title),
    )
    .slice(0, limit);
}

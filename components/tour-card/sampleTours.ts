import { samplePhoto } from '@/components/ui/MediaFrame/samplePhotos';
import type { Departure, Tour } from '@/lib/content/tours';

/* Sample tours for stories, which can't read content files. */

export const sampleTour: Tour = {
  slug: 'hunza-skardu-grand',
  title: 'Hunza & Skardu Grand',
  summary: 'Nine days by road from Lahore up the Karakoram Highway: three nights in Hunza, then Skardu, its lakes and the Deosai plains.',
  route: ['Lahore', 'Hunza', 'Skardu'],
  destinations: ['hunza', 'skardu'],
  tripTypes: ['family'],
  days: 9,
  nights: 8,
  priceFrom: 145000,
  difficulty: 'Easy walking, long road days',
  transport: 'Coaster, with jeeps for Deosai',
  bestSeason: { from: 'Apr', to: 'Oct' },
  rating: { score: 4.9, count: 128 },
  image: samplePhoto,
  departures: [],
};

export const openDeparture: Departure = { start: '2027-05-26', end: '2027-06-03', seatsTotal: 16, seatsLeft: 9 };
export const urgentDeparture: Departure = { start: '2027-05-12', end: '2027-05-20', seatsTotal: 16, seatsLeft: 3 };
export const soldOutDeparture: Departure = { start: '2027-06-09', end: '2027-06-17', seatsTotal: 16, seatsLeft: 0 };

/** A departure from `start` to `end` with `seatsLeft` of 16 seats, for stories. */
export function departureOn(start: string, end: string, seatsLeft: number): Departure {
  return { start, end, seatsTotal: 16, seatsLeft };
}

/** A tour named `title` with the given departures (start dates and seats left). */
export function tourWith(title: string, departures: [start: string, seatsLeft: number][]): Tour {
  const slug = title.toLowerCase().replace(/[^a-z]+/g, '-');
  return {
    ...sampleTour,
    slug,
    title,
    days: 1,
    nights: 0,
    departures: departures.map(([start, seatsLeft]) => ({ start, end: start, seatsTotal: 16, seatsLeft })),
  };
}

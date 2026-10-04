import { tourWith } from '@/components/tour-card/sampleTours';
import type { ToursCopy } from '@/lib/content/pages';
import type { Tour } from '@/lib/content/tours';

/* Sample Tours page copy and tours for the filter stories, which can't read content files. */

export const sampleToursCopy: ToursCopy = {
  title: 'All our trips from Lahore',
  description: 'Every group tour from Lahore, with dates, prices per person and seats left.',
  header: {
    headline: 'All our trips from Lahore',
    lead: 'Prices per person, twin sharing. Every departure leaves from Lahore.',
  },
  results: {
    count: { one: '{count} trip', other: '{count} trips' },
    sortedBy: 'Sorted by {sort} · sold-out trips last',
  },
  sorts: { soonest: 'Soonest departure' },
};

type Sample = Pick<Tour, 'destinations' | 'tripTypes' | 'days'> & { twin: number; departures: [string, number][] };

/** The last day of a trip of `days` days from `start` (YYYY-MM-DD). */
const lastDay = (start: string, days: number) => new Date(Date.parse(start) + (days - 1) * 86_400_000).toISOString().slice(0, 10);

/** A tour for the list stories: its own valleys, trip types, length, twin price and departures. */
function listed(title: string, { destinations, tripTypes, days, twin, departures }: Sample) {
  const tour = tourWith(title, departures);
  return {
    ...tour,
    destinations,
    tripTypes,
    days,
    nights: days - 1,
    prices: { twin, triple: twin, quad: twin },
    departures: tour.departures.map((d) => ({ ...d, end: lastDay(d.start, days) })),
  };
}

/**
 * The eight sample tours, as in content but in 2099, so they're always upcoming against the
 * browser's real date. Fairy Meadows' June date is full; its July one has seats.
 */
export const sampleListTours = [
  listed('Fairy Meadows Trek', { destinations: ['fairy-meadows'], tripTypes: ['friends', 'couples'], days: 5, twin: 68000, departures: [['2099-06-14', 0], ['2099-07-12', 7]] }),
  listed('Hunza Express', { destinations: ['hunza'], tripTypes: ['family', 'couples'], days: 6, twin: 98000, departures: [['2099-06-02', 12], ['2099-08-18', 16]] }),
  listed('Hunza & Skardu Grand', { destinations: ['hunza', 'skardu'], tripTypes: ['family', 'couples', 'friends'], days: 9, twin: 145000, departures: [['2099-05-12', 3], ['2099-05-26', 9]] }),
  listed('Murree & Galiyat Weekend', { destinations: ['murree'], tripTypes: ['family', 'corporate'], days: 3, twin: 28000, departures: [['2099-05-29', 14], ['2099-06-26', 20]] }),
  listed('Naran-Kaghan Getaway', { destinations: ['naran-kaghan'], tripTypes: ['family', 'friends', 'corporate'], days: 4, twin: 38000, departures: [['2099-05-22', 11], ['2099-07-24', 17]] }),
  listed('Skardu & Deosai', { destinations: ['skardu'], tripTypes: ['friends', 'couples'], days: 6, twin: 110000, departures: [['2099-07-16', 3], ['2099-08-13', 10]] }),
  listed('Swat Family Escape', { destinations: ['swat'], tripTypes: ['family'], days: 5, twin: 52000, departures: [['2099-06-05', 9], ['2099-07-03', 18]] }),
  listed('Swat & Kalam Summer', { destinations: ['swat'], tripTypes: ['family', 'friends'], days: 4, twin: 45000, departures: [['2099-07-10', 10], ['2099-08-07', 18]] }),
];

/** The sample tours in the order the list shows them: by the date each card shows, soonest first. */
export const sampleSoonestOrder = [
  'Hunza & Skardu Grand',
  'Naran-Kaghan Getaway',
  'Murree & Galiyat Weekend',
  'Hunza Express',
  'Swat Family Escape',
  'Swat & Kalam Summer',
  'Fairy Meadows Trek',
  'Skardu & Deosai',
];

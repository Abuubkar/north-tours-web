import type { Decorator } from '@storybook/nextjs-vite';
import { tourWith } from '@/components/tour-card/sampleTours';
import type { FilterTour } from '@/hooks/useTourFilters';
import type { ToursCopy } from '@/lib/content/pages';
import type { Tour } from '@/lib/content/tours';
import type { OptionLabels } from '@/lib/utils/resultsText';
import { TourFiltersProvider } from './TourFiltersProvider/TourFiltersProvider';

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
  filters: {
    label: 'Filter trips',
    groups: { dest: 'Destination', dur: 'Duration', budget: 'Budget', type: 'Trip type', month: 'Month' },
    options: {
      dur: { '2-4': '2–4 days', '5-7': '5–7 days', '8plus': '8+ days' },
      budget: { 'under-50k': 'Under PKR 50k', '50-100k': 'PKR 50–100k', '100k-plus': 'PKR 100k+' },
      type: { family: 'Family', couples: 'Couples', friends: 'Friends', corporate: 'Corporate' },
    },
    clearAll: 'Clear all',
  },
  sortLabel: 'Sort:',
  sorts: {
    soonest: 'Soonest departure',
    'price-asc': 'Price: low to high',
    'price-desc': 'Price: high to low',
    shortest: 'Shortest first',
  },
  empty: {
    headline: 'No trips match these filters yet.',
    lead: 'Tell us what you’re looking for and we’ll plan it. Most private trips start with a WhatsApp message.',
    clearLabel: 'Clear all filters',
    planLabel: 'Plan a private trip',
  },
};

/** Each sample option's words: destination names, and the page's labels for the rest. */
export const sampleOptionLabels: OptionLabels = {
  dest: { 'fairy-meadows': 'Fairy Meadows', hunza: 'Hunza', murree: 'Murree', 'naran-kaghan': 'Naran-Kaghan', skardu: 'Skardu', swat: 'Swat' },
  ...sampleToursCopy.filters.options,
};

/** The sample destinations, in the loader's order (by slug). */
export const sampleDestinationSlugs = ['fairy-meadows', 'hunza', 'murree', 'naran-kaghan', 'skardu', 'swat'];

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

/**
 * Wraps a story in the Tours view for these tours. The build day is in 2020 and the browser's
 * real today is later, so any 2020 date is dropped as on a stale build; the 2099 ones stay.
 */
export function withTourFilters(tours: FilterTour[] = sampleListTours): Decorator {
  return function WithTourFilters(Story) {
    return (
      <TourFiltersProvider tours={tours} destinations={sampleDestinationSlugs} builtOn="2020-01-01">
        <Story />
      </TourFiltersProvider>
    );
  };
}

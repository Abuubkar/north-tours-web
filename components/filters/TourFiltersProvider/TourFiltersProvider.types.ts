import type { ReactNode } from 'react';
import type { FilterTour } from '@/hooks/useTourFilters';

export type TourFiltersProviderProps = {
  /** Every tour, each with its departures as built (those already past are dropped when the site is built). */
  tours: FilterTour[];
  /** Destination slugs, in the loader's order: the Destination options. */
  destinations: string[];
  /** The build's date (YYYY-MM-DD, Asia/Karachi), so the first render matches the built HTML. */
  builtOn: string;
  /** Everything that reads or changes the view: the filter bars, the sheets and the results. */
  children: ReactNode;
};

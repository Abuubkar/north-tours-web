'use client';

import { TourFiltersContext, useTourFiltersState } from '@/hooks/useTourFilters';
import type { TourFiltersProviderProps } from './TourFiltersProvider.types';

/** Holds the Tours page's one view (filters, sort, results) for everything inside it. */
export function TourFiltersProvider({ tours, destinations, builtOn, children }: TourFiltersProviderProps) {
  return <TourFiltersContext value={useTourFiltersState(tours, destinations, builtOn)}>{children}</TourFiltersContext>;
}

import { createContext, use, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type RefObject } from 'react';
import type { Tour } from '@/lib/content/tours';
import {
  clearFilters,
  facetCounts,
  FILTER_BAR_QUERY,
  filterOptions,
  NO_FILTERS,
  toggleFilter,
  tourResults,
  type FacetCounts,
  type FilterGroupId,
  type FilterOptions,
  type ListedTour,
  type Sort,
  type TourFilters,
  type TourResult,
} from '@/lib/utils/tourFilters';
import { parseToursSearch, RESULTS_PENDING, toursSearch } from '@/lib/utils/toursSearch';
import { useToday } from './useToday';

/** A tour as the list filters it (`ListedTour`), with what its card shows. */
export type FilterTour = ListedTour & Pick<Tour, 'slug' | 'route' | 'nights' | 'rating' | 'image'>;

/** The Tours page's one view, shared by the filter bar, the sheets, the chips and the results. */
export type TourFiltersState = {
  filters: TourFilters;
  options: FilterOptions;
  /** How many tours each option would show (faceted). */
  counts: FacetCounts;
  /** The cards for the view, in order. */
  results: TourResult<FilterTour>[];
  /** How many times the visitor has changed the view; the results announce their count after each. */
  changes: number;
  /** Picks an option, or unpicks it (Month: one at a time). */
  toggle: (group: FilterGroupId, id: string) => void;
  setSort: (sort: Sort) => void;
  /** Removes every filter, keeping the sort. */
  clearAll: () => void;
  /** The results' heading, where focus goes once the filters are cleared. */
  headingRef: RefObject<HTMLHeadingElement | null>;
  /** The mobile bar's "Filters", where focus goes below 820px (the results heading is hidden there). */
  filtersButtonRef: RefObject<HTMLButtonElement | null>;
  /** Moves focus to where the results start, after the last filter is removed. */
  focusResults: () => void;
};

export const TourFiltersContext = createContext<TourFiltersState | null>(null);

/** The view from the nearest `TourFiltersProvider`. */
export function useTourFilters(): TourFiltersState {
  const state = use(TourFiltersContext);
  if (!state) throw new Error('useTourFilters needs a TourFiltersProvider above it');
  return state;
}

/** The URL isn't watched: the page reads its link once, then writes each change itself. */
const noUpdates = () => () => {};

/** Writes the view into the address bar without adding to the history, so Back still leaves the page. */
function writeUrl(filters: TourFilters) {
  window.history.replaceState(null, '', `${window.location.pathname}${toursSearch(filters)}${window.location.hash}`);
}

/**
 * The view for the Tours page (PRD #56). The page is built with every tour in the default
 * order; after hydration the browser re-checks the departures with its own date, reads the link
 * (rewriting a messy one to its clean form) and shows the view it asks for. From the visitor's
 * first change the view is theirs and the link is no longer read; each change is written back
 * to the address bar with `replaceState`. It doesn't use Next's
 * `useSearchParams`, which under static export would leave the results out of the built HTML.
 */
export function useTourFiltersState(tours: FilterTour[], destinations: readonly string[], builtOn: string): TourFiltersState {
  const today = useToday(builtOn);
  // The link's query: none while hydrating, so the first render matches the built HTML.
  const linked = useSyncExternalStore(noUpdates, () => window.location.search, () => null);
  const [chosen, setChosen] = useState<TourFilters | null>(null);
  const [changes, setChanges] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const filtersButtonRef = useRef<HTMLButtonElement>(null);

  const options = useMemo(() => filterOptions(tours, destinations, today), [tours, destinations, today]);
  const filters = chosen ?? (linked === null ? NO_FILTERS : parseToursSearch(linked, options));

  // Once, after hydration: a link that asked for something else (unknown values, a past month)
  // becomes its clean form.
  const fromLink = chosen === null && linked !== null;
  useEffect(() => {
    if (fromLink && window.location.search !== toursSearch(filters)) writeUrl(filters);
  }, [fromLink, filters]);

  // The linked view is in place before this paint, so the hidden results can show.
  useLayoutEffect(() => {
    if (linked !== null) document.documentElement.removeAttribute(RESULTS_PENDING);
  }, [linked]);

  function change(next: TourFilters) {
    setChosen(next);
    setChanges((n) => n + 1);
    writeUrl(next);
  }

  return {
    filters,
    options,
    counts: facetCounts(tours, filters, options, today),
    results: tourResults(tours, filters, today),
    changes,
    toggle: (group, id) => change(toggleFilter(filters, options, group, id)),
    setSort: (sort) => change({ ...filters, sort }),
    clearAll: () => change(clearFilters(filters)),
    headingRef,
    filtersButtonRef,
    // From 820px the results heading shows; below it, the mobile bar's "Filters".
    focusResults: () =>
      (window.matchMedia(FILTER_BAR_QUERY).matches ? headingRef.current : filtersButtonRef.current)?.focus(),
  };
}

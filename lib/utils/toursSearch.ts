import {
  BUDGETS,
  DEFAULT_SORT,
  DURATIONS,
  LIST_GROUPS,
  NO_FILTERS,
  SORTS,
  TRIP_TYPES,
  type FilterOptions,
  type Sort,
  type TourFilters,
} from './tourFilters.ts';

/*
 * The Tours page's view in its URL (PRD #56), so a filtered list can be shared on WhatsApp and
 * other pages can link to one: /tours?dest=hunza,skardu&dur=5-7&budget=under-50k&type=family&month=2027-06&sort=price-asc
 */

/** The query's parameters, in the order they're written. */
export const TOURS_PARAMS = [...LIST_GROUPS, 'month', 'sort'] as const;

/** The fixed groups' options in order; destinations follow the loader, which only the page knows. */
const FIXED_ORDER: Partial<Record<(typeof LIST_GROUPS)[number], readonly string[]>> = { dur: DURATIONS, budget: BUDGETS, type: TRIP_TYPES };

/**
 * The query for a view: "?dest=hunza&type=family". Parameters are written in a fixed order,
 * values comma-separated in option order (destinations as given: the page keeps them in the
 * loader's order), and empty groups and the default sort are left out, so the default view is ""
 * (plain /tours).
 */
export function toursSearch(filters: Partial<TourFilters>): string {
  const params: string[] = [];
  for (const group of LIST_GROUPS) {
    const values: readonly string[] = filters[group] ?? [];
    const order = FIXED_ORDER[group];
    const ordered = order ? order.filter((id) => values.includes(id)) : values;
    if (ordered.length > 0) params.push(`${group}=${ordered.join(',')}`);
  }
  if (filters.month) params.push(`month=${filters.month}`);
  if (filters.sort && filters.sort !== DEFAULT_SORT) params.push(`sort=${filters.sort}`);
  return params.length > 0 ? `?${params.join('&')}` : '';
}

const isSort = (value: string | null): value is Sort => SORTS.includes(value as Sort);

/**
 * The view a query asks for, given the options there are. Unknown parameters and values are
 * dropped (a month with no upcoming departures too), values are put in option order, only the
 * first month is kept, and an unknown sort is the default.
 */
export function parseToursSearch(search: string, options: FilterOptions): TourFilters {
  const query = new URLSearchParams(search);
  const values = (name: string) => query.get(name)?.split(',') ?? [];
  const known = <T extends string>(ids: readonly T[], name: string): T[] => {
    const asked = values(name);
    return ids.filter((id) => asked.includes(id));
  };
  const sort = query.get('sort');
  return {
    dest: known(options.dest, 'dest'),
    dur: known(options.dur, 'dur'),
    budget: known(options.budget, 'budget'),
    type: known(options.type, 'type'),
    month: values('month').find((month) => options.month.includes(month)) ?? NO_FILTERS.month,
    sort: isSort(sort) ? sort : DEFAULT_SORT,
  };
}

/** Set on <html> while a linked view hasn't been applied yet; the results stay hidden (their space kept) until then. */
export const RESULTS_PENDING = 'data-results-pending';

/**
 * A tiny script for the page's HTML, run before the results are painted: when the link asks for
 * filters or a sort, it marks the results as pending, so the full list built into the page never
 * flashes before the asked-for one. Without JavaScript it never runs, and nothing is hidden.
 */
export const PENDING_SCRIPT = `if(/[?&](${TOURS_PARAMS.join('|')})=/.test(location.search))document.documentElement.setAttribute('${RESULTS_PENDING}','')`;

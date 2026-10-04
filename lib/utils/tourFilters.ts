import type { Departure, Tour } from '../content/tours.ts';
import { seatStatus, shownDeparture, upcomingDepartures } from './departures.ts';
import { fromPrice } from './price.ts';

/*
 * The Tours page's filters and sort (PRD #56): the options, which tours match, the counts beside
 * each option, which departure each card shows and the order of the cards. The page renders
 * these; the browser runs them again with its own date.
 */

/** Trip lengths: up to 4 days, 5 to 7, 8 or more. */
export const DURATIONS = ['2-4', '5-7', '8plus'] as const;

/** Budgets on the tour's "from" price: under PKR 50,000, 50,000 to 100,000, over 100,000. */
export const BUDGETS = ['under-50k', '50-100k', '100k-plus'] as const;

/** Who a trip suits; tours list theirs in content. */
export const TRIP_TYPES = ['family', 'couples', 'friends', 'corporate'] as const;

export const SORTS = ['soonest', 'price-asc', 'price-desc', 'shortest'] as const;

export type Duration = (typeof DURATIONS)[number];
export type Budget = (typeof BUDGETS)[number];
export type TripType = (typeof TRIP_TYPES)[number];
export type Sort = (typeof SORTS)[number];

export const DEFAULT_SORT: Sort = 'soonest';

/** From this width the desktop filter bar shows; below it, the mobile bar and its sheets. */
export const FILTER_BAR_QUERY = '(width >= 820px)';

/** Below this width the results have one or two columns, and the private trip banner follows two cards. */
export const NARROW_RESULTS_QUERY = '(width < 1100px)';

/** The groups where several options can be picked, in URL and chip order. Month (one at a time) follows. */
export const LIST_GROUPS = ['dest', 'dur', 'budget', 'type'] as const;

export type ListGroup = (typeof LIST_GROUPS)[number];

/** Every filter group: the list groups, then Month. */
export type FilterGroupId = ListGroup | 'month';

/** Every filter group, in the order the bar and the sheet show them. */
export const FILTER_GROUPS: readonly FilterGroupId[] = [...LIST_GROUPS, 'month'];

/** What the visitor asked for: options picked in each group (in option order), one month or none, and the sort. */
export type TourFilters = {
  dest: string[];
  dur: Duration[];
  budget: Budget[];
  type: TripType[];
  /** YYYY-MM. */
  month: string | null;
  sort: Sort;
};

/** The default view: every trip, soonest first. */
export const NO_FILTERS: TourFilters = { dest: [], dur: [], budget: [], type: [], month: null, sort: DEFAULT_SORT };

/** Every option in each group, in order. */
export type FilterOptions = {
  /** Destination slugs, in the loader's order. */
  dest: readonly string[];
  dur: readonly Duration[];
  budget: readonly Budget[];
  type: readonly TripType[];
  /** Every month with an upcoming departure (YYYY-MM), in date order. */
  month: readonly string[];
};

/** What the list needs from a tour. */
export type ListedTour = Pick<Tour, 'title' | 'destinations' | 'tripTypes' | 'days' | 'prices'> & {
  departures: readonly Departure[];
};

/** A card on the list: its tour and the departure it shows, or none when the tour has no dates left. */
export type TourResult<T> = { tour: T; departure: Departure | undefined };

/** The options, as of `today`: the destinations given, the fixed groups, and the months with an upcoming departure. */
export function filterOptions(tours: readonly ListedTour[], destinations: readonly string[], today: string): FilterOptions {
  const months = tours.flatMap((tour) => upcomingDepartures(tour.departures, today).map((d) => d.start.slice(0, 7)));
  return { dest: destinations, dur: DURATIONS, budget: BUDGETS, type: TRIP_TYPES, month: [...new Set(months)].sort() };
}

/** The departures in view: those still to come, and in the chosen month if there is one. */
function inView(tour: ListedTour, month: string | null, today: string): Departure[] {
  const upcoming = upcomingDepartures(tour.departures, today);
  return month ? upcoming.filter((d) => d.start.startsWith(month)) : upcoming;
}

/**
 * The departure a tour's card shows: the next one in view with seats, or the next sold-out one
 * when all are full (`shownDeparture`). With a month chosen, the first in that month.
 */
export function cardDeparture(tour: ListedTour, month: string | null, today: string): Departure | undefined {
  return shownDeparture(inView(tour, month, today), today);
}

/**
 * The tour's price for Budget and the price sorts: its "from" price over the departures in view
 * (#49), or its twin price with none left.
 */
export function tourPrice(tour: ListedTour, month: string | null, today: string): number {
  return fromPrice({ prices: tour.prices, departures: inView(tour, month, today) }, today);
}

const DURATION_TEST: Record<Duration, (days: number) => boolean> = {
  '2-4': (days) => days <= 4,
  '5-7': (days) => days >= 5 && days <= 7,
  '8plus': (days) => days >= 8,
};

const BUDGET_TEST: Record<Budget, (price: number) => boolean> = {
  'under-50k': (price) => price < 50_000,
  '50-100k': (price) => price >= 50_000 && price <= 100_000,
  '100k-plus': (price) => price > 100_000,
};

/** Nothing picked in a group matches every tour; otherwise any picked option will do. */
const anyOf = <T>(picked: readonly T[], test: (option: T) => boolean) => picked.length === 0 || picked.some(test);

/** Whether a tour matches: any option within a group, every group. A month needs an upcoming departure in it. */
export function matches(tour: ListedTour, filters: TourFilters, today: string): boolean {
  const view = inView(tour, filters.month, today);
  const price = tourPrice(tour, filters.month, today);
  return (
    anyOf(filters.dest, (dest) => tour.destinations.includes(dest)) &&
    anyOf(filters.dur, (dur) => DURATION_TEST[dur](tour.days)) &&
    anyOf(filters.budget, (budget) => BUDGET_TEST[budget](price)) &&
    anyOf(filters.type, (type) => tour.tripTypes.includes(type)) &&
    (filters.month === null || view.length > 0)
  );
}

/** Each option's count, by group: `{ dest: { hunza: 3, … }, … }`. */
export type FacetCounts = { [G in keyof FilterOptions]: Record<string, number> };

/**
 * How many tours each option would show: those matching every other group plus that option. A
 * group's own picks are left out, so its counts don't drop to zero because something in it is
 * already picked.
 */
export function facetCounts(tours: readonly ListedTour[], filters: TourFilters, options: FilterOptions, today: string): FacetCounts {
  const count = (only: Partial<TourFilters>) => tours.filter((tour) => matches(tour, { ...filters, ...only }, today)).length;
  const counts = (ids: readonly string[], only: (id: string) => Partial<TourFilters>) =>
    Object.fromEntries(ids.map((id) => [id, count(only(id))]));
  return {
    dest: counts(options.dest, (id) => ({ dest: [id] })),
    dur: counts(options.dur, (id) => ({ dur: [id as Duration] })),
    budget: counts(options.budget, (id) => ({ budget: [id as Budget] })),
    type: counts(options.type, (id) => ({ type: [id as TripType] })),
    month: counts(options.month, (id) => ({ month: id })),
  };
}

/** Bookable trips first, then sold out (the card's date is full), then trips with no upcoming dates. */
function availability(departure: Departure | undefined): number {
  if (!departure) return 2;
  return seatStatus(departure) === 'soldout' ? 1 : 0;
}

type Listed<T> = TourResult<T> & { price: number };

const startOf = ({ departure }: Listed<ListedTour>) => departure?.start ?? '';

const SORT_ORDER: Record<Sort, (a: Listed<ListedTour>, b: Listed<ListedTour>) => number> = {
  soonest: (a, b) => startOf(a).localeCompare(startOf(b)),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  shortest: (a, b) => a.tour.days - b.tour.days || startOf(a).localeCompare(startOf(b)),
};

/**
 * The cards for a view, as of `today` (YYYY-MM-DD, Asia/Karachi): the tours that match, each with
 * the departure it shows. Bookable trips come first, then sold-out ones, then those with no
 * upcoming dates; within each, the chosen sort (soonest by the card's date, price by the tour's
 * price, shortest by days then soonest), then title.
 */
export function tourResults<T extends ListedTour>(tours: readonly T[], filters: TourFilters, today: string): TourResult<T>[] {
  return tours
    .filter((tour) => matches(tour, filters, today))
    .map((tour) => ({
      tour,
      departure: cardDeparture(tour, filters.month, today),
      price: tourPrice(tour, filters.month, today),
    }))
    .sort(
      (a, b) =>
        availability(a.departure) - availability(b.departure) ||
        SORT_ORDER[filters.sort](a, b) ||
        a.tour.title.localeCompare(b.tour.title),
    )
    .map(({ tour, departure }) => ({ tour, departure }));
}

/**
 * The view with an option picked, or unpicked if it was. Each list group stays in option order.
 * Month takes one at a time: another replaces it, and picking it again clears it.
 */
export function toggleFilter(filters: TourFilters, options: FilterOptions, group: FilterGroupId, id: string): TourFilters {
  if (group === 'month') return { ...filters, month: filters.month === id ? null : id };
  const picked: readonly string[] = filters[group];
  const next = picked.includes(id) ? picked.filter((p) => p !== id) : [...picked, id];
  return { ...filters, [group]: (options[group] as readonly string[]).filter((option) => next.includes(option)) };
}

/** The options picked in a group (Month: the one month, if any). */
export function pickedOptions(filters: TourFilters, group: FilterGroupId): readonly string[] {
  if (group !== 'month') return filters[group];
  return filters.month ? [filters.month] : [];
}

/** The picked options as chips, in group order and then option order: "Hunza", "Family", "June 2027". */
export function activeFilters(filters: TourFilters): { group: FilterGroupId; id: string }[] {
  return [
    ...LIST_GROUPS.flatMap((group) => filters[group].map((id: string) => ({ group, id }))),
    ...(filters.month ? [{ group: 'month' as const, id: filters.month }] : []),
  ];
}

/** Every filter removed; the sort stays. */
export function clearFilters(filters: TourFilters): TourFilters {
  return { ...NO_FILTERS, sort: filters.sort };
}

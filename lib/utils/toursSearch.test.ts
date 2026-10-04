import { describe, expect, it } from 'vitest';
import { routes } from '../routes.ts';
import { NO_FILTERS, type FilterOptions, type TourFilters } from './tourFilters.ts';
import { parseToursSearch, PENDING_SCRIPT, RESULTS_PENDING, toursSearch } from './toursSearch.ts';

const options: FilterOptions = {
  dest: ['fairy-meadows', 'hunza', 'murree', 'naran-kaghan', 'skardu', 'swat'],
  dur: ['2-4', '5-7', '8plus'],
  budget: ['under-50k', '50-100k', '100k-plus'],
  type: ['family', 'couples', 'friends', 'corporate'],
  month: ['2027-05', '2027-06', '2027-07', '2027-08'],
};

const view = (filters: Partial<TourFilters>): TourFilters => ({ ...NO_FILTERS, ...filters });

describe('toursSearch', () => {
  it('writes every parameter in a fixed order, values comma-separated', () => {
    const filters = view({
      sort: 'price-asc',
      month: '2027-06',
      type: ['family'],
      budget: ['under-50k'],
      dur: ['5-7'],
      dest: ['hunza', 'skardu'],
    });
    expect(toursSearch(filters)).toBe('?dest=hunza,skardu&dur=5-7&budget=under-50k&type=family&month=2027-06&sort=price-asc');
  });

  it('puts the fixed groups’ values in option order, whatever order they come in', () => {
    expect(toursSearch(view({ type: ['corporate', 'family'], dur: ['8plus', '2-4'] }))).toBe('?dur=2-4,8plus&type=family,corporate');
  });

  it('leaves out empty groups and the default sort', () => {
    expect(toursSearch(view({ type: ['family'], sort: 'soonest' }))).toBe('?type=family');
  });

  it('is empty for the default view, so it is plain /tours', () => {
    expect(toursSearch(NO_FILTERS)).toBe('');
  });
});

describe('parseToursSearch', () => {
  it('reads a shared view', () => {
    expect(parseToursSearch('?dest=hunza&type=family', options)).toEqual(view({ dest: ['hunza'], type: ['family'] }));
  });

  it('drops unknown parameters and values', () => {
    expect(parseToursSearch('?dest=nowhere,hunza&dur=1-2&utm=x&type=family,solo&budget=free', options)).toEqual(
      view({ dest: ['hunza'], type: ['family'] }),
    );
    expect(parseToursSearch('?dest=nowhere&sort=soonest&utm=x', options)).toEqual(NO_FILTERS);
  });

  it('puts values in option order', () => {
    expect(parseToursSearch('?dest=skardu,hunza', options).dest).toEqual(['hunza', 'skardu']);
  });

  it('keeps only the first month', () => {
    expect(parseToursSearch('?month=2027-07,2027-06', options).month).toBe('2027-07');
  });

  it('drops a month with no upcoming departures', () => {
    expect(parseToursSearch('?month=2026-09', options).month).toBeNull();
    expect(parseToursSearch('?month=2026-09,2027-08', options).month).toBe('2027-08');
  });

  it('accepts any sort, and the default by name', () => {
    expect(parseToursSearch('?sort=shortest', options).sort).toBe('shortest');
    expect(parseToursSearch('?sort=soonest', options).sort).toBe('soonest');
    expect(parseToursSearch('?sort=cheapest', options).sort).toBe('soonest');
  });

  it('round-trips: a parsed link written back is its clean form', () => {
    const clean = '?dest=hunza,skardu&dur=5-7&budget=50-100k&type=family,friends&month=2027-06&sort=price-desc';
    expect(toursSearch(parseToursSearch(clean, options))).toBe(clean);
    expect(toursSearch(parseToursSearch('?type=friends,family&sort=soonest&dest=skardu,hunza&x=1', options))).toBe(
      '?dest=hunza,skardu&type=family,friends',
    );
  });
});

describe('routes.toursWith', () => {
  it('links to the Tours page filtered, on the same format', () => {
    expect(routes.toursWith({ dest: ['hunza'] })).toBe('/tours?dest=hunza');
    expect(routes.toursWith({})).toBe('/tours');
  });
});

describe('PENDING_SCRIPT', () => {
  /** Runs the script against a page at `search`; true if it marked the results as pending. */
  const marks = (search: string) => {
    const set: string[] = [];
    const documentElement = { setAttribute: (name: string) => set.push(name) };
    new Function('location', 'document', PENDING_SCRIPT)({ search }, { documentElement });
    return set.includes(RESULTS_PENDING);
  };

  it('marks the results as pending when the link asks for filters or a sort', () => {
    expect(marks('?dest=hunza&type=family')).toBe(true);
    expect(marks('?sort=price-asc')).toBe(true);
    expect(marks('?utm=x&month=2027-06')).toBe(true);
  });

  it('leaves the plain page alone', () => {
    expect(marks('')).toBe(false);
    expect(marks('?utm=x')).toBe(false);
    expect(marks('?destination=hunza')).toBe(false);
  });
});

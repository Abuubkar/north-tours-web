import { describe, expect, it } from 'vitest';
import type { Departure } from '../content/tours.ts';
import {
  activeFilters,
  cardDeparture,
  clearFilters,
  facetCounts,
  filterOptions,
  matches,
  NO_FILTERS,
  tourPrice,
  toggleFilter,
  tourResults,
  type ListedTour,
  type TourFilters,
} from './tourFilters.ts';

const today = '2027-05-01';
const on = (start: string, seatsLeft = 8, twin?: number): Departure => ({
  start,
  end: start,
  seatsTotal: 16,
  seatsLeft,
  ...(twin && { prices: { twin, triple: twin, quad: twin } }),
});

type Spec = Partial<Omit<ListedTour, 'prices'>> & { twin?: number };
const tour = (title: string, { twin = 60_000, ...rest }: Spec = {}, ...departures: Departure[]): ListedTour => ({
  title,
  destinations: ['hunza'],
  tripTypes: ['family'],
  days: 5,
  prices: { twin, triple: twin, quad: twin },
  departures,
  ...rest,
});
const view = (filters: Partial<TourFilters>): TourFilters => ({ ...NO_FILTERS, ...filters });

/** "Title start" per card, or "Title none" for a tour with no dates left. */
const listed = (tours: ListedTour[], filters: Partial<TourFilters> = {}, day = today) =>
  tourResults(tours, view(filters), day).map(({ tour, departure }) => `${tour.title} ${departure?.start ?? 'none'}`);
const titles = (tours: ListedTour[], filters: Partial<TourFilters> = {}) =>
  tourResults(tours, view(filters), today).map(({ tour }) => tour.title);

/** The eight tours in content (dates and prices as there), for the design's cases. */
const content = [
  tour('Fairy Meadows Trek', { destinations: ['fairy-meadows'], tripTypes: ['friends', 'couples'], days: 5, twin: 68000 }, on('2027-06-14', 0), on('2027-07-12', 7)),
  tour('Hunza Express', { destinations: ['hunza'], tripTypes: ['family', 'couples'], days: 6, twin: 98000 }, on('2027-06-02', 12), on('2027-08-18', 16, 104000)),
  tour('Hunza & Skardu Grand', { destinations: ['hunza', 'skardu'], tripTypes: ['family', 'couples', 'friends'], days: 9, twin: 145000 }, on('2027-05-12', 3), on('2027-05-26', 9), on('2027-06-09', 0), on('2027-06-23', 14)),
  tour('Murree & Galiyat Weekend', { destinations: ['murree'], tripTypes: ['family', 'corporate'], days: 3, twin: 28000 }, on('2027-05-29', 14), on('2027-06-26', 20)),
  tour('Naran-Kaghan Getaway', { destinations: ['naran-kaghan'], tripTypes: ['family', 'friends', 'corporate'], days: 4, twin: 38000 }, on('2027-05-22', 11), on('2027-06-19', 20), on('2027-07-24', 17)),
  tour('Skardu & Deosai', { destinations: ['skardu'], tripTypes: ['friends', 'couples'], days: 6, twin: 110000 }, on('2027-07-16', 3), on('2027-08-13', 10)),
  tour('Swat Family Escape', { destinations: ['swat'], tripTypes: ['family'], days: 5, twin: 52000 }, on('2027-06-05', 9), on('2027-07-03', 18)),
  tour('Swat & Kalam Summer', { destinations: ['swat'], tripTypes: ['family', 'friends'], days: 4, twin: 45000 }, on('2027-07-10', 10), on('2027-08-07', 18)),
];
const destinations = ['fairy-meadows', 'hunza', 'murree', 'naran-kaghan', 'skardu', 'swat'];
const options = filterOptions(content, destinations, today);

describe('filterOptions', () => {
  it('lists destinations in the order given (the loader’s), and the fixed groups', () => {
    expect(options.dest).toEqual(destinations);
    expect(options.dur).toEqual(['2-4', '5-7', '8plus']);
    expect(options.budget).toEqual(['under-50k', '50-100k', '100k-plus']);
    expect(options.type).toEqual(['family', 'couples', 'friends', 'corporate']);
  });

  it('lists every month with an upcoming departure, in date order', () => {
    expect(options.month).toEqual(['2027-05', '2027-06', '2027-07', '2027-08']);
  });

  it('leaves out a month whose departures have all passed', () => {
    expect(filterOptions(content, destinations, '2027-06-01').month).toEqual(['2027-06', '2027-07', '2027-08']);
  });
});

describe('matches', () => {
  it('takes any option within a group, and needs every group', () => {
    const swat = content.filter((t) => t.title.startsWith('Swat'));
    expect(titles(content, { dest: ['swat', 'murree'] })).toEqual(['Murree & Galiyat Weekend', ...swat.map((t) => t.title)]);
    expect(titles(content, { dest: ['swat', 'murree'], type: ['corporate'] })).toEqual(['Murree & Galiyat Weekend']);
  });

  it('matches a tour that visits two destinations on either', () => {
    expect(titles(content, { dest: ['skardu'] })).toContain('Hunza & Skardu Grand');
    expect(titles(content, { dest: ['hunza'] })).toContain('Hunza & Skardu Grand');
  });

  it.each([
    [4, '2-4', true],
    [5, '2-4', false],
    [5, '5-7', true],
    [7, '5-7', true],
    [8, '5-7', false],
    [8, '8plus', true],
  ] as const)('a %i-day tour %s: %s', (days, dur, expected) => {
    expect(matches(tour('T', { days }, on('2027-06-01')), view({ dur: [dur] }), today)).toBe(expected);
  });

  it.each([
    [49_999, 'under-50k', true],
    [50_000, 'under-50k', false],
    [50_000, '50-100k', true],
    [100_000, '50-100k', true],
    [100_001, '50-100k', false],
    [100_001, '100k-plus', true],
    [100_000, '100k-plus', false],
  ] as const)('PKR %i in %s: %s', (twin, budget, expected) => {
    expect(matches(tour('T', { twin }, on('2027-06-01')), view({ budget: [budget] }), today)).toBe(expected);
  });

  it('matches a month when the tour has an upcoming departure starting in it', () => {
    const grand = content[2];
    expect(matches(grand, view({ month: '2027-05' }), today)).toBe(true);
    expect(matches(grand, view({ month: '2027-06' }), today)).toBe(true);
    expect(matches(grand, view({ month: '2027-07' }), today)).toBe(false);
    expect(matches(grand, view({ month: '2027-05' }), '2027-05-27')).toBe(false);
  });

  it('never matches a month for a tour with no dates left', () => {
    expect(matches(tour('T'), view({ month: '2027-05' }), today)).toBe(false);
    expect(matches(tour('T'), NO_FILTERS, today)).toBe(true);
  });

  it('prices the budget over the departures in view', () => {
    // Hunza Express: 98,000 from in June; its August date alone costs 104,000.
    const express = content[1];
    expect(matches(express, view({ budget: ['50-100k'] }), today)).toBe(true);
    expect(matches(express, view({ budget: ['50-100k'], month: '2027-08' }), today)).toBe(false);
    expect(matches(express, view({ budget: ['100k-plus'], month: '2027-08' }), today)).toBe(true);
  });
});

describe("the card's departure and the tour's price", () => {
  const grand = content[2];

  it('is the next departure with seats, kept sold out only when every one is full', () => {
    expect(cardDeparture(grand, null, today)?.start).toBe('2027-05-12');
    expect(cardDeparture(tour('Full', {}, on('2027-06-14', 0), on('2027-07-12', 0)), null, today)?.start).toBe('2027-06-14');
    expect(cardDeparture(content[0], null, today)?.start).toBe('2027-07-12');
  });

  it('narrows to the chosen month: the first date in it with seats, else the first', () => {
    expect(cardDeparture(grand, '2027-06', today)?.start).toBe('2027-06-23');
    expect(cardDeparture(content[0], '2027-06', today)?.start).toBe('2027-06-14');
  });

  it('is none, and the twin price, when nothing is left', () => {
    const left = tour('Left', { twin: 45_000 }, on('2027-04-20', 5, 50_000));
    expect(cardDeparture(left, null, today)).toBeUndefined();
    expect(tourPrice(left, null, today)).toBe(45_000);
  });

  it('prices the tour at its lowest twin price over the departures in view', () => {
    const express = content[1];
    expect(tourPrice(express, null, today)).toBe(98_000);
    expect(tourPrice(express, '2027-08', today)).toBe(104_000);
  });
});

describe('facetCounts', () => {
  const counts = (filters: Partial<TourFilters>) => facetCounts(content, view(filters), options, today);

  it('counts each option against every other group', () => {
    const { dest, type } = counts({ type: ['family'] });
    expect(dest).toEqual({ 'fairy-meadows': 0, hunza: 2, murree: 1, 'naran-kaghan': 1, skardu: 1, swat: 2 });
    expect(type).toEqual({ family: 6, couples: 4, friends: 5, corporate: 2 });
  });

  it('leaves a group’s own picks out of its counts', () => {
    const { dest } = counts({ dest: ['hunza'] });
    expect(dest.swat).toBe(2);
    expect(dest.hunza).toBe(2);
  });

  it('gives the design’s cases: Hunza + Family → 2, Murree + 8+ days → 0', () => {
    expect(counts({ type: ['family'] }).dest.hunza).toBe(2);
    expect(counts({ dest: ['hunza'] }).type.family).toBe(2);
    expect(counts({ dest: ['murree'] }).dur['8plus']).toBe(0);
    expect(tourResults(content, view({ dest: ['murree'], dur: ['8plus'] }), today)).toEqual([]);
  });

  it('counts months on their own departures', () => {
    expect(counts({ dest: ['swat'] }).month).toEqual({ '2027-05': 0, '2027-06': 1, '2027-07': 2, '2027-08': 1 });
  });
});

describe('tourResults', () => {
  const tours = [
    tour('Open late', { days: 9, twin: 145_000 }, on('2027-07-01')),
    tour('Open soon', { days: 3, twin: 28_000 }, on('2027-05-10')),
    tour('Open middle', { days: 5, twin: 68_000 }, on('2027-06-01')),
    tour('Full', { days: 2, twin: 20_000 }, on('2027-05-05', 0)),
    tour('No dates', { days: 1, twin: 10_000 }),
  ];

  it.each([
    ['soonest', ['Open soon', 'Open middle', 'Open late']],
    ['price-asc', ['Open soon', 'Open middle', 'Open late']],
    ['price-desc', ['Open late', 'Open middle', 'Open soon']],
    ['shortest', ['Open soon', 'Open middle', 'Open late']],
  ] as const)('sorts %s, with sold-out and no-dates trips last', (sort, bookable) => {
    expect(titles(tours, { sort })).toEqual([...bookable, 'Full', 'No dates']);
  });

  it('sorts the shortest by days, then the soonest', () => {
    const same = [tour('B', { days: 4 }, on('2027-06-01')), tour('A', { days: 4 }, on('2027-07-01')), tour('C', { days: 3 }, on('2027-08-01'))];
    expect(titles(same, { sort: 'shortest' })).toEqual(['C', 'B', 'A']);
  });

  it('sorts by price within the sold-out and no-dates trips too', () => {
    const full = [tour('Dear', { twin: 90_000 }, on('2027-05-05', 0)), tour('Cheap', { twin: 30_000 }, on('2027-06-05', 0))];
    expect(titles(full, { sort: 'price-asc' })).toEqual(['Cheap', 'Dear']);
    expect(titles([tour('Dear', { twin: 90_000 }), tour('Cheap', { twin: 30_000 })], { sort: 'price-desc' })).toEqual(['Dear', 'Cheap']);
  });

  it('breaks ties by title', () => {
    const same = [tour('Swat', {}, on('2027-06-05')), tour('Naran', {}, on('2027-06-05')), tour('B'), tour('A')];
    expect(listed(same)).toEqual(['Naran 2027-06-05', 'Swat 2027-06-05', 'A none', 'B none']);
    expect(titles([tour('B', {}, on('2027-06-01')), tour('A', {}, on('2027-07-01'))], { sort: 'price-asc' })).toEqual(['A', 'B']);
  });

  it('orders the default view by the date each card shows', () => {
    expect(listed(content)).toEqual([
      'Hunza & Skardu Grand 2027-05-12',
      'Naran-Kaghan Getaway 2027-05-22',
      'Murree & Galiyat Weekend 2027-05-29',
      'Hunza Express 2027-06-02',
      'Swat Family Escape 2027-06-05',
      'Swat & Kalam Summer 2027-07-10',
      'Fairy Meadows Trek 2027-07-12',
      'Skardu & Deosai 2027-07-16',
    ]);
  });

  it('shows each card’s date in the chosen month', () => {
    expect(listed(content, { month: '2027-06', dest: ['hunza', 'fairy-meadows'] })).toEqual([
      'Hunza Express 2027-06-02',
      'Hunza & Skardu Grand 2027-06-23',
      'Fairy Meadows Trek 2027-06-14',
    ]);
  });

  it('drops a departure that has passed, and moves a tour with none left to the end', () => {
    const passing = [tour('Hunza', {}, on('2027-05-02'), on('2027-05-20')), tour('Swat', {}, on('2027-05-03')), tour('Naran', {}, on('2027-05-10'))];
    expect(listed(passing, {}, '2027-05-04')).toEqual(['Naran 2027-05-10', 'Hunza 2027-05-20', 'Swat none']);
  });
});

describe('clearFilters', () => {
  it('removes every filter and keeps the sort', () => {
    expect(clearFilters(view({ dest: ['hunza'], month: '2027-06', sort: 'price-desc' }))).toEqual(view({ sort: 'price-desc' }));
  });
});

describe('toggleFilter', () => {
  it('picks and unpicks an option, keeping its group in option order', () => {
    const skardu = toggleFilter(NO_FILTERS, options, 'dest', 'skardu');
    expect(skardu.dest).toEqual(['skardu']);
    expect(toggleFilter(skardu, options, 'dest', 'hunza').dest).toEqual(['hunza', 'skardu']);
    expect(toggleFilter(skardu, options, 'dest', 'skardu').dest).toEqual([]);
  });

  it('takes one month at a time: another replaces it, and picking it again clears it', () => {
    const june = toggleFilter(NO_FILTERS, options, 'month', '2027-06');
    const july = toggleFilter(june, options, 'month', '2027-07');
    expect(july.month).toBe('2027-07');
    expect(toggleFilter(july, options, 'month', '2027-07').month).toBeNull();
  });
});

describe('activeFilters', () => {
  it('lists the picked options in group order, then option order, month last', () => {
    const filters = view({ type: ['family', 'corporate'], month: '2027-06', dest: ['hunza', 'swat'], budget: ['under-50k'] });
    expect(activeFilters(filters)).toEqual([
      { group: 'dest', id: 'hunza' },
      { group: 'dest', id: 'swat' },
      { group: 'budget', id: 'under-50k' },
      { group: 'type', id: 'family' },
      { group: 'type', id: 'corporate' },
      { group: 'month', id: '2027-06' },
    ]);
    expect(activeFilters(NO_FILTERS)).toEqual([]);
  });
});

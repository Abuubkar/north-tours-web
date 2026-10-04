import { describe, expect, it } from 'vitest';
import type { Departure } from '../content/tours.ts';
import { relatedTours } from './related.ts';

const on = (start: string, seatsLeft = 5): Departure => ({ start, end: start, seatsTotal: 16, seatsLeft });
const tour = (slug: string, destinations: string[], departures: Departure[]) => ({ slug, title: slug, destinations, departures });

const grand = tour('hunza-skardu-grand', ['hunza', 'skardu'], [on('2027-05-12')]);
const tours = [
  grand,
  tour('swat', ['swat'], [on('2027-05-20')]),
  tour('naran', ['naran-kaghan'], [on('2027-05-22')]),
  tour('hunza-express', ['hunza'], [on('2027-06-02')]),
  tour('skardu-deosai', ['skardu'], [on('2027-07-16')]),
  tour('murree', ['murree'], [on('2027-04-01')]),
];
const slugs = (today = '2027-05-01', from = tours) => relatedTours(grand, from, today, 3).map((r) => r.tour.slug);

describe('relatedTours', () => {
  it('puts tours sharing a destination first, then the soonest', () => {
    expect(slugs()).toEqual(['hunza-express', 'skardu-deosai', 'swat']);
  });

  it('leaves out the tour itself, and tours with no date left', () => {
    expect(slugs()).not.toContain('hunza-skardu-grand');
    expect(slugs()).not.toContain('murree');
  });

  it('shows at most three', () => {
    expect(slugs()).toHaveLength(3);
  });

  it('orders by title when the dates match', () => {
    const same = [grand, tour('b', ['x'], [on('2027-05-20')]), tour('a', ['y'], [on('2027-05-20')])];
    expect(slugs('2027-05-01', same)).toEqual(['a', 'b']);
  });

  it('drops a tour whose dates have passed, and the next fills in', () => {
    expect(slugs('2027-06-03')).toEqual(['skardu-deosai']);
  });
});

import { describe, expect, it } from 'vitest';
import type { Departure } from '../content/tours.ts';
import { tourResults } from './tourFilters.ts';

const on = (start: string, seatsLeft = 8): Departure => ({ start, end: start, seatsTotal: 16, seatsLeft });
const tour = (title: string, ...departures: Departure[]) => ({ title, departures });
const today = '2027-05-01';

/** "Title start" per card, or "Title none" for a tour with no dates left. */
const listed = (tours: ReturnType<typeof tour>[], day = today) =>
  tourResults(tours, day).map(({ tour, departure }) => `${tour.title} ${departure?.start ?? 'none'}`);

describe("the card's departure", () => {
  it('is the next departure with seats', () => {
    expect(listed([tour('Hunza', on('2027-05-12'), on('2027-05-26'))])).toEqual(['Hunza 2027-05-12']);
  });

  it('passes over a sold-out next date to one with seats', () => {
    expect(listed([tour('Fairy Meadows', on('2027-06-14', 0), on('2027-07-12'))])).toEqual(['Fairy Meadows 2027-07-12']);
  });

  it('keeps the next sold-out date when every upcoming one is full', () => {
    expect(listed([tour('Fairy Meadows', on('2027-06-14', 0), on('2027-07-12', 0))])).toEqual(['Fairy Meadows 2027-06-14']);
  });

  it('is none when no departure is left', () => {
    expect(listed([tour('Murree', on('2027-04-20'))])).toEqual(['Murree none']);
    expect(listed([tour('Murree')])).toEqual(['Murree none']);
  });

  it('never shows a departure that has passed', () => {
    expect(listed([tour('Hunza', on('2027-05-12'), on('2027-05-26'))], '2027-05-13')).toEqual(['Hunza 2027-05-26']);
  });
});

describe('the order', () => {
  it('puts bookable trips first, then sold-out ones, then trips with no upcoming dates', () => {
    const tours = [
      tour('No dates'),
      tour('Full', on('2027-05-02', 0)),
      tour('Open', on('2027-09-01')),
    ];
    expect(listed(tours)).toEqual(['Open 2027-09-01', 'Full 2027-05-02', 'No dates none']);
  });

  it('orders each group by the date the card shows, soonest first', () => {
    const tours = [
      tour('Swat', on('2027-06-05')),
      tour('Fairy Meadows', on('2027-05-14', 0), on('2027-07-12')),
      tour('Naran', on('2027-05-22')),
      tour('Late full', on('2027-08-01', 0)),
      tour('Early full', on('2027-05-03', 0)),
    ];
    expect(listed(tours)).toEqual([
      'Naran 2027-05-22',
      'Swat 2027-06-05',
      'Fairy Meadows 2027-07-12',
      'Early full 2027-05-03',
      'Late full 2027-08-01',
    ]);
  });

  it('breaks ties by title', () => {
    const tours = [tour('Swat', on('2027-06-05')), tour('Naran', on('2027-06-05')), tour('B'), tour('A')];
    expect(listed(tours)).toEqual(['Naran 2027-06-05', 'Swat 2027-06-05', 'A none', 'B none']);
  });

  it('moves a tour whose last date has passed to the end', () => {
    const tours = [tour('Hunza', on('2027-05-02')), tour('Swat', on('2027-06-05'))];
    expect(listed(tours, '2027-05-03')).toEqual(['Swat 2027-06-05', 'Hunza none']);
  });
});

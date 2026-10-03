import { describe, expect, it } from 'vitest';
import {
  seatsLeftText,
  seatStatus,
  shownDeparture,
  soonestDepartures,
  todayInKarachi,
  upcomingDepartures,
  urgencyText,
} from './departures.ts';

const seats = (seatsLeft: number, seatsTotal = 16) => ({ seatsLeft, seatsTotal });

describe('seatStatus', () => {
  it.each([
    [0, 'soldout'],
    [1, 'urgent'],
    [3, 'urgent'],
    [4, 'open'],
    [16, 'open'],
  ] as const)('%i seats left is %s', (left, status) => {
    expect(seatStatus(seats(left))).toBe(status);
  });
});

describe('seats wording', () => {
  it.each([
    [0, 'Sold out · waitlist open', null],
    [1, '1 of 16 seats left', 'Only 1 seat left'],
    [3, '3 of 16 seats left', 'Only 3 seats left'],
    [4, '4 of 16 seats left', null],
    [16, '16 of 16 seats left', null],
  ])('%i seats left', (left, line, tag) => {
    expect(seatsLeftText(seats(left))).toBe(line);
    expect(urgencyText(seats(left))).toBe(tag);
  });
});

describe('upcomingDepartures', () => {
  const departures = [{ start: '2026-10-03' }, { start: '2026-10-04' }, { start: '2026-10-05' }];

  it('keeps today and later, drops earlier dates', () => {
    expect(upcomingDepartures(departures, '2026-10-04')).toEqual([
      { start: '2026-10-04' },
      { start: '2026-10-05' },
    ]);
  });

  it('hides a departure from the day after its date', () => {
    expect(upcomingDepartures(departures, '2026-10-06')).toEqual([]);
  });

  it('keeps everything before the first departure', () => {
    expect(upcomingDepartures(departures, '2026-01-01')).toHaveLength(3);
  });
});

describe('todayInKarachi', () => {
  it('moves to the next day at midnight Pakistan time (UTC+5)', () => {
    expect(todayInKarachi(new Date('2026-10-04T18:59:59Z'))).toBe('2026-10-04');
    expect(todayInKarachi(new Date('2026-10-04T19:00:00Z'))).toBe('2026-10-05');
    expect(todayInKarachi(new Date('2026-10-04T20:30:00Z'))).toBe('2026-10-05');
  });
});

const departure = (start: string, seatsLeft = 8) => ({ start, end: start, seatsTotal: 16, seatsLeft });

describe('shownDeparture', () => {
  const today = '2027-05-01';

  it('shows the next departure with seats', () => {
    expect(shownDeparture([departure('2027-05-01', 0), departure('2027-05-08'), departure('2027-05-15')], today)).toEqual(
      departure('2027-05-08'),
    );
  });

  it('shows the next sold-out date only when every upcoming departure is sold out', () => {
    expect(shownDeparture([departure('2027-05-01', 0), departure('2027-05-08', 0)], today)).toEqual(departure('2027-05-01', 0));
  });

  it('never shows a past departure, even one with seats', () => {
    expect(shownDeparture([departure('2027-04-20'), departure('2027-05-08', 0)], today)).toEqual(departure('2027-05-08', 0));
  });

  it('shows nothing when nothing is upcoming', () => {
    expect(shownDeparture([departure('2027-04-20')], today)).toBeUndefined();
    expect(shownDeparture([], today)).toBeUndefined();
  });
});

describe('soonestDepartures', () => {
  const tour = (title: string, ...departures: ReturnType<typeof departure>[]) => ({ title, departures });
  const pick = (tours: ReturnType<typeof tour>[], today = '2027-05-01', limit = 4) =>
    soonestDepartures(tours, today, limit).map(({ tour, departure }) => `${tour.title} ${departure.start}`);

  it('shows one departure per tour, soonest first', () => {
    const tours = [
      tour('Swat', departure('2027-06-05'), departure('2027-07-03')),
      tour('Hunza', departure('2027-05-12'), departure('2027-05-26')),
    ];
    expect(pick(tours)).toEqual(['Hunza 2027-05-12', 'Swat 2027-06-05']);
  });

  it('orders tours leaving on the same day by title', () => {
    expect(pick([tour('Swat', departure('2027-06-05')), tour('Naran', departure('2027-06-05'))])).toEqual([
      'Naran 2027-06-05',
      'Swat 2027-06-05',
    ]);
  });

  it('drops past departures, moving a tour to its following one', () => {
    const tours = [tour('Hunza', departure('2027-05-12'), departure('2027-05-26'))];
    expect(pick(tours, '2027-05-13')).toEqual(['Hunza 2027-05-26']);
  });

  it('drops a tour with nothing left, and the next tour fills in', () => {
    const tours = [
      tour('Hunza', departure('2027-05-12')),
      tour('Naran', departure('2027-05-22')),
      tour('Swat', departure('2027-06-05')),
    ];
    expect(pick(tours, '2027-05-13', 2)).toEqual(['Naran 2027-05-22', 'Swat 2027-06-05']);
  });

  it('shows at most `limit` tours', () => {
    const tours = ['A', 'B', 'C', 'D', 'E'].map((title, i) => tour(title, departure(`2027-05-0${i + 1}`)));
    expect(pick(tours)).toEqual(['A 2027-05-01', 'B 2027-05-02', 'C 2027-05-03', 'D 2027-05-04']);
  });

  it('skips a sold-out next date for one with seats, and sorts by the date shown', () => {
    const tours = [
      tour('Fairy Meadows', departure('2027-06-14', 0), departure('2027-07-12')),
      tour('Swat', departure('2027-06-20')),
    ];
    expect(pick(tours)).toEqual(['Swat 2027-06-20', 'Fairy Meadows 2027-07-12']);
  });

  it('keeps a tour whose upcoming dates are all sold out, at its next date', () => {
    const tours = [tour('Fairy Meadows', departure('2027-06-14', 0), departure('2027-07-12', 0))];
    expect(pick(tours)).toEqual(['Fairy Meadows 2027-06-14']);
  });
});

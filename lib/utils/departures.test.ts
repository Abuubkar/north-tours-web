import { describe, expect, it } from 'vitest';
import {
  seatsLeftText,
  seatStatus,
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

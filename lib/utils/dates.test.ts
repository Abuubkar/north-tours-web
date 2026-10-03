import { describe, expect, it } from 'vitest';
import { dateRange, messageDate, tripLength } from './dates.ts';

describe('dateRange', () => {
  it('names the month once when both dates share it', () => {
    expect(dateRange('2027-05-12', '2027-05-20')).toBe('12–20 May');
  });

  it('names both months across a month end', () => {
    expect(dateRange('2027-05-26', '2027-06-03')).toBe('26 May – 3 Jun');
  });

  it('names both months across a year end', () => {
    expect(dateRange('2027-12-28', '2028-01-03')).toBe('28 Dec – 3 Jan');
  });
});

describe('tripLength', () => {
  it('counts days and nights', () => {
    expect(tripLength(9, 8)).toBe('9 days, 8 nights');
    expect(tripLength(2, 1)).toBe('2 days, 1 night');
  });

  it('leaves nights out of a day trip', () => {
    expect(tripLength(1, 0)).toBe('1 day');
  });
});

describe('messageDate', () => {
  it('gives the start date with the year', () => {
    expect(messageDate('2027-05-12')).toBe('12 May 2027');
    expect(messageDate('2027-06-03')).toBe('3 Jun 2027');
  });
});

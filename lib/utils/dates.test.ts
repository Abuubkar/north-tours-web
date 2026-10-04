import { describe, expect, it } from 'vitest';
import { dateRange, dayCount, messageDate, messageDateRange, monthYear, seasonRange, shortMonthYear, tripLength, yearsSince } from './dates.ts';

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

describe('dayCount', () => {
  it('counts days alone, in the singular for one', () => {
    expect(dayCount(9)).toBe('9 days');
    expect(dayCount(1)).toBe('1 day');
  });
});

describe('messageDate', () => {
  it('gives the start date with the year', () => {
    expect(messageDate('2027-05-12')).toBe('12 May 2027');
    expect(messageDate('2027-06-03')).toBe('3 Jun 2027');
  });
});

describe('messageDateRange', () => {
  it('adds the year once', () => {
    expect(messageDateRange('2027-05-12', '2027-05-20')).toBe('12–20 May 2027');
    expect(messageDateRange('2027-05-26', '2027-06-03')).toBe('26 May – 3 Jun 2027');
  });

  it('gives both years when the trip crosses the new year', () => {
    expect(messageDateRange('2026-12-28', '2027-01-03')).toBe('28 Dec 2026 – 3 Jan 2027');
  });
});

describe('monthYear', () => {
  it('names the month in full, with the year', () => {
    expect(monthYear('2026-05')).toBe('May 2026');
    expect(monthYear('2026-12')).toBe('December 2026');
  });
});

describe('yearsSince', () => {
  it('counts whole years to the current year', () => {
    expect(yearsSince(2014, 2026)).toBe(12);
    expect(yearsSince(2026, 2026)).toBe(0);
  });
});

describe('seasonRange', () => {
  it('names both months in full', () => {
    expect(seasonRange({ from: 'Apr', to: 'Oct' })).toBe('April – October');
    expect(seasonRange({ from: 'Jun', to: 'Sep' })).toBe('June – September');
  });

  it('names them in short for a destination’s other valleys: "Apr – Oct"', () => {
    expect(seasonRange({ from: 'Apr', to: 'Oct' }, 'short')).toBe('Apr – Oct');
  });
});

describe('short month and year', () => {
  it('reads a month as the planner’s chips do', () => {
    expect(shortMonthYear('2027-06')).toBe('Jun 2027');
    expect(shortMonthYear('2026-12')).toBe('Dec 2026');
  });
});

import { describe, expect, it } from 'vitest';
import { destinationChoices, lengthForDays, monthChoices, UNSURE } from './plannerOptions.ts';

describe('destination choices', () => {
  it('lists the destinations in the loader’s order, then “Not sure”', () => {
    expect(destinationChoices(['fairy-meadows', 'hunza', 'swat'])).toEqual(['fairy-meadows', 'hunza', 'swat', UNSURE]);
  });
});

describe('month choices', () => {
  it('are the 12 months from today’s month', () => {
    expect(monthChoices('2027-01-31')).toEqual([
      '2027-01', '2027-02', '2027-03', '2027-04', '2027-05', '2027-06',
      '2027-07', '2027-08', '2027-09', '2027-10', '2027-11', '2027-12',
    ]);
  });

  it('run across the year end', () => {
    const months = monthChoices('2026-10-04');
    expect(months).toHaveLength(12);
    expect(months.slice(0, 4)).toEqual(['2026-10', '2026-11', '2026-12', '2027-01']);
    expect(months.at(-1)).toBe('2027-09');
  });
});

describe('trip length from flexible days', () => {
  it.each([
    [2, '2-4'],
    [4, '2-4'],
    [5, '5-7'],
    [7, '5-7'],
    [8, '8-10'],
    [10, '8-10'],
    [11, '10plus'],
    [21, '10plus'],
  ])('%i days → %s', (days, length) => {
    expect(lengthForDays(days)).toBe(length);
  });
});

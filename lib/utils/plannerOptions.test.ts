import { describe, expect, it } from 'vitest';
import {
  ageLabel,
  AGES,
  DEPARTING_FROM,
  destinationChoices,
  GROUP_TYPES,
  HOTELS,
  labelled,
  lengthForDays,
  monthChoices,
  PLANNER_BUDGETS,
  TRANSPORT,
  UNSURE,
} from './plannerOptions.ts';

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

describe('step 2 options', () => {
  it('list each question’s ids in order', () => {
    expect(GROUP_TYPES).toEqual(['family', 'couple', 'friends', 'corporate']);
    expect(HOTELS).toEqual(['comfortable', 'upgraded', 'best']);
    expect(TRANSPORT).toEqual(['car', 'coaster', 'suggest']);
    expect(DEPARTING_FROM).toEqual(['lahore', 'islamabad', 'other']);
    expect(PLANNER_BUDGETS).toEqual(['under-50k', '50-100k', '100k-plus', 'not-sure']);
  });

  it('offer ages “Under 2” (0), then 2 to 17', () => {
    expect(AGES[0]).toBe(0);
    expect(AGES.slice(1)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
  });
});

describe('option words', () => {
  it('“Under 2” for 0, the number otherwise', () => {
    expect(ageLabel(0, 'Under 2')).toBe('Under 2');
    expect(ageLabel(9, 'Under 2')).toBe('9');
  });

  it('pairs each id with its words, in order', () => {
    expect(labelled(['car', 'coaster'] as const, { car: 'Car', coaster: 'Coaster' })).toEqual([
      { id: 'car', label: 'Car' },
      { id: 'coaster', label: 'Coaster' },
    ]);
  });
});

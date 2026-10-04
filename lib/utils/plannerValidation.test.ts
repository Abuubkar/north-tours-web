import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { plannerCopyFile, type PlannerCopy } from '../content/pages.ts';
import { DEFAULT_ANSWERS, type TripAnswers } from './plannerAnswers.ts';
import { whereWhenErrors } from './plannerValidation.ts';

const { errors: messages }: PlannerCopy = JSON.parse(readFileSync(plannerCopyFile(), 'utf8'));
const today = '2026-10-04';
const valid: TripAnswers = { ...DEFAULT_ANSWERS, destinations: ['hunza'], month: '2027-06' };
const exact = (from: string | null, to: string | null): TripAnswers => ({ ...valid, dateMode: 'exact', from, to });
const check = (answers: TripAnswers) => whereWhenErrors(answers, today, messages);

describe('step 1, Where and when', () => {
  it('passes with a destination and a month', () => {
    expect(check(valid)).toEqual([]);
  });

  it('needs a destination; “Not sure” alone passes', () => {
    expect(check({ ...valid, destinations: [] })).toEqual([
      { group: 'destinations', fields: ['destinations'], message: 'Choose at least one destination, or “Not sure, suggest something”.' },
    ]);
    expect(check({ ...valid, destinations: ['unsure'] })).toEqual([]);
  });

  it('needs a month for flexible dates, and one still to come', () => {
    expect(check({ ...valid, month: null })).toEqual([{ group: 'dates', fields: ['month'], message: 'Pick a month, or switch to exact dates.' }]);
    expect(check({ ...valid, month: '2026-09' })[0].fields).toEqual(['month']);
    expect(check({ ...valid, month: '2026-10' })).toEqual([]);
  });

  it('lists every problem in page order', () => {
    expect(check(DEFAULT_ANSWERS).map((e) => e.group)).toEqual(['destinations', 'dates']);
  });

  it('needs both exact dates', () => {
    expect(check(exact('2027-06-12', null))).toEqual([{ group: 'dates', fields: ['to'], message: 'Add a start and an end date.' }]);
    expect(check(exact(null, null))[0].fields).toEqual(['from', 'to']);
  });

  it('refuses a date before today in Karachi; today passes', () => {
    expect(check(exact('2026-10-03', '2026-10-08'))).toEqual([
      { group: 'dates', fields: ['from'], message: 'That date has passed. Choose today or later.' },
    ]);
    expect(check(exact('2026-10-04', '2026-10-08'))).toEqual([]);
  });

  it('refuses an end before the start; the same day passes', () => {
    expect(check(exact('2027-06-18', '2027-06-12'))).toEqual([
      { group: 'dates', fields: ['to'], message: 'The end date is before the start date.' },
    ]);
    expect(check(exact('2027-06-12', '2027-06-12'))).toEqual([]);
  });
});

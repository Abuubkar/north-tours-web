import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { plannerCopyFile, type PlannerCopy } from '../content/pages.ts';
import { DEFAULT_ANSWERS, type TripAnswers } from './plannerAnswers.ts';
import { parsePlanner, PLANNER_PENDING, PLANNER_PENDING_SCRIPT, searchWithoutDestination, serialisePlanner, withLinkedDestination } from './plannerStorage.ts';

const { errors: messages }: PlannerCopy = JSON.parse(readFileSync(plannerCopyFile(), 'utf8'));
const destinations = ['hunza', 'skardu', 'swat'];
const context = { destinations, today: '2026-10-04', messages };

const trip: TripAnswers = {
  ...DEFAULT_ANSWERS,
  destinations: ['hunza', 'unsure'],
  month: '2027-06',
  length: '8-10',
  adults: 3,
  children: 2,
  ages: [0, 9],
  groupType: 'family',
  hotels: 'best',
  transport: 'coaster',
  departingFrom: 'other',
  otherCity: 'Multan',
  budget: 'not-sure',
};

/** Saved data with one field changed, as JSON. */
const saved = (change: Record<string, unknown>, step = 2) => JSON.stringify({ ...JSON.parse(serialisePlanner(trip, step)), ...change });

describe('saving', () => {
  it('writes the trip answers and the step, never the details', () => {
    const written = JSON.parse(serialisePlanner(trip, 3));
    expect(written).toEqual({ ...trip, step: 3 });
    for (const detail of ['name', 'phone', 'bestTime', 'notes']) expect(written).not.toHaveProperty(detail);
  });

  it('never saves the thank-you', () => {
    expect(JSON.parse(serialisePlanner(trip, 5)).step).toBe(4);
  });

  it('round-trips: what’s parsed is written again unchanged', () => {
    const raw = serialisePlanner(trip, 2);
    const { answers, step } = parsePlanner(raw, context);
    expect(answers).toEqual(trip);
    expect(serialisePlanner(answers, step)).toBe(raw);
  });
});

describe('reading saved answers', () => {
  it('gives the defaults for nothing saved or unreadable data', () => {
    expect(parsePlanner(null, context)).toEqual({ answers: DEFAULT_ANSWERS, step: 1 });
    expect(parsePlanner('{not json', context)).toEqual({ answers: DEFAULT_ANSWERS, step: 1 });
    expect(parsePlanner('[1,2]', context)).toEqual({ answers: DEFAULT_ANSWERS, step: 1 });
  });

  it.each([
    ['an unknown or removed destination', { destinations: ['hunza', 'nowhere', 'murree'] }, { destinations: ['hunza'] }],
    ['a past month', { month: '2026-09' }, { month: null }],
    ['a month past the 12 offered', { month: '2027-10' }, { month: null }],
    ['a past date', { dateMode: 'exact', from: '2026-10-03', to: '2027-06-18' }, { from: null, to: '2027-06-18' }],
    ['a date that isn’t real', { from: '2027-02-30' }, { from: null }],
    ['0 adults', { adults: 0 }, { adults: 2 }],
    ['41 adults', { adults: 41 }, { adults: 2 }],
    ['an unknown hotels id', { hotels: 'palace' }, { hotels: null }],
    ['an unknown city', { departingFrom: 'karachi' }, { departingFrom: 'lahore' }],
  ])('%s falls back alone', (_, change, expected) => {
    const { answers } = parsePlanner(saved(change), context);
    expect(answers).toEqual({ ...trip, ...change, ...expected });
  });

  it('ignores the old days and auto-length fields, keeping the picked length', () => {
    const { answers } = parsePlanner(saved({ days: 9, lengthAuto: true }), context);
    expect(answers).toEqual(trip);
    expect(answers).not.toHaveProperty('days');
  });

  it('drops ages that don’t match the children', () => {
    expect(parsePlanner(saved({ ages: [6, 9, 12] }), context).answers.ages).toEqual([null, null]);
    expect(parsePlanner(saved({ ages: [6, 40] }), context).answers.ages).toEqual([null, null]);
  });
});

describe('the step on return', () => {
  it('is the saved step when every step before it passes', () => {
    expect(parsePlanner(saved({}, 2), context).step).toBe(2);
    expect(parsePlanner(saved({}, 3), context).step).toBe(3);
  });

  it('a saved review returns to Your details, since details are never saved', () => {
    expect(parsePlanner(saved({}, 4), context).step).toBe(3);
  });

  it('moves back to the first step that doesn’t pass', () => {
    expect(parsePlanner(saved({ destinations: [] }, 2), context).step).toBe(1);
    expect(parsePlanner(saved({ ages: [6, null] }, 3), context).step).toBe(2);
  });

  it('never restores the thank-you, or a step that isn’t one', () => {
    expect(parsePlanner(saved({ step: 5 }), context).step).toBe(1);
    expect(parsePlanner(saved({ step: 'review' }), context).step).toBe(1);
  });
});

describe('a ?dest= link', () => {
  it('adds a destination from content, keeping the saved ones in order, once', () => {
    expect(withLinkedDestination(DEFAULT_ANSWERS, '?dest=hunza', destinations).destinations).toEqual(['hunza']);
    expect(withLinkedDestination({ ...trip, destinations: ['skardu'] }, '?dest=hunza', destinations).destinations).toEqual(['hunza', 'skardu']);
    expect(withLinkedDestination(trip, '?dest=hunza', destinations).destinations).toEqual(['hunza', 'unsure']);
  });

  it('ignores anything else', () => {
    expect(withLinkedDestination(trip, '?dest=nowhere', destinations)).toBe(trip);
    expect(withLinkedDestination(trip, '?dest=unsure', destinations)).toBe(trip);
    expect(withLinkedDestination(trip, '', destinations)).toBe(trip);
  });

  it('leaves the rest of the query when it’s removed', () => {
    expect(searchWithoutDestination('?dest=hunza')).toBe('');
    expect(searchWithoutDestination('?dest=hunza&utm=x')).toBe('?utm=x');
  });
});

describe('the pending script', () => {
  /** Runs the script against a page at `search` with `saved` in storage (or storage throwing); what it marked pending, if anything. */
  const marks = (search: string, saved: string | null | Error) => {
    const set: Record<string, string> = {};
    const localStorage = {
      getItem: () => {
        if (saved instanceof Error) throw saved;
        return saved;
      },
    };
    const documentElement = { setAttribute: (name: string, value: string) => (set[name] = value) };
    new Function('localStorage', 'location', 'document', PLANNER_PENDING_SCRIPT)(localStorage, { search }, { documentElement });
    return set[PLANNER_PENDING] ?? null;
  };

  it('marks the whole planner pending with saved answers, and only the form with a ?dest= link alone', () => {
    expect(marks('', '{"step":2}')).toBe('saved');
    expect(marks('?dest=hunza', '{"step":2}')).toBe('saved');
    expect(marks('?dest=hunza', null)).toBe('link');
    expect(marks('?utm=x&dest=hunza', new Error('blocked'))).toBe('link');
  });

  it('leaves it alone with neither', () => {
    expect(marks('', null)).toBeNull();
    expect(marks('?utm=x', new Error('blocked'))).toBeNull();
  });
});

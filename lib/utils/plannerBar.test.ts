import { describe, expect, it } from 'vitest';
import { DEFAULT_ANSWERS, type TripAnswers } from './plannerAnswers.ts';
import { answeredCount, barLabel, type BarWords } from './plannerBar.ts';
import type { TripSummary } from './plannerSummary.ts';

const words: BarWords = {
  yourTrip: 'Your trip',
  suggestions: 'Suggestions',
  noDates: 'Dates?',
  more: '+{count}',
  people: { one: '{count} person', other: '{count} people' },
  destinations: { hunza: 'Hunza', skardu: 'Skardu' },
};
const label = (change: Partial<TripAnswers>) => barLabel({ ...DEFAULT_ANSWERS, ...change }, words);
const empty: TripSummary = { destinations: null, dates: null, length: null, group: null, groupType: null, hotels: null, transport: null, from: null, budget: null };

describe('answered count', () => {
  it('counts the rows with an answer: none, some, all', () => {
    expect(answeredCount(empty)).toBe(0);
    expect(answeredCount({ ...empty, destinations: 'Hunza', group: '2 adults', from: 'Lahore', dates: 'Jun 2027' })).toBe(4);
    const all = Object.fromEntries(Object.keys(empty).map((key) => [key, 'x'])) as TripSummary;
    expect(answeredCount(all)).toBe(9);
  });
});

describe('bar label', () => {
  it('shows the first month when several are picked', () => {
    expect(label({ destinations: ['hunza'], months: ['2027-06', '2027-07', '2027-09'] })).toBe('Hunza · Jun · 2 people');
  });

  it('names one valley, the month and the people', () => {
    expect(label({ destinations: ['hunza'], months: ['2027-06'], children: 2, ages: [6, 9] })).toBe('Hunza · Jun · 4 people');
  });

  it('counts the other valleys after the first', () => {
    expect(label({ destinations: ['hunza', 'skardu'] })).toBe('Hunza +1 · Dates? · 2 people');
  });

  it('shortens “Help me choose” to its own word, “Suggestions”', () => {
    expect(label({ destinations: ['unsure'] })).toBe('Suggestions · Dates? · 2 people');
  });

  it('reads “Your trip” and “Dates?” before anything is chosen', () => {
    expect(label({})).toBe('Your trip · Dates? · 2 people');
  });

  it('uses the start of exact dates, and “1 person”', () => {
    expect(label({ dateMode: 'exact', from: '2027-06-12', to: '2027-06-18', adults: 1 })).toBe('Your trip · 12 Jun · 1 person');
    expect(label({ dateMode: 'exact', from: null, months: ['2027-06'] })).toBe('Your trip · Dates? · 2 people');
  });
});

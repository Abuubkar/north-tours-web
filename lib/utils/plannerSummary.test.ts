import { describe, expect, it } from 'vitest';
import { EMPTY_PHONE } from './phone.ts';
import { DEFAULT_ANSWERS, type TripAnswers } from './plannerAnswers.ts';
import { EMPTY_DETAILS } from './plannerDetails.ts';
import { readFileSync } from 'node:fs';
import { plannerCopyFile, type PlannerCopy } from '../content/pages.ts';
import { detailsSummary, reviewSections, summaryWords, tripSummary } from './plannerSummary.ts';

const copy: PlannerCopy = JSON.parse(readFileSync(plannerCopyFile(), 'utf8'));
const sampleWords = summaryWords(copy, [
  { slug: 'hunza', name: 'Hunza' },
  { slug: 'skardu', name: 'Skardu' },
]);

const trip = (change: Partial<TripAnswers>) => tripSummary({ ...DEFAULT_ANSWERS, ...change }, sampleWords);

describe('trip summary', () => {
  it('leaves unanswered rows empty; the group and city always have an answer', () => {
    expect(tripSummary(DEFAULT_ANSWERS, sampleWords)).toEqual({
      destinations: null,
      dates: null,
      length: null,
      group: '2 adults',
      groupType: null,
      hotels: null,
      transport: null,
      from: 'Lahore',
      budget: null,
    });
  });

  it('names the destinations in order; “Help me choose” reads as the card does, alone or with a valley', () => {
    expect(trip({ destinations: ['hunza', 'skardu'] }).destinations).toBe('Hunza, Skardu');
    expect(trip({ destinations: ['unsure'] }).destinations).toBe('Help me choose');
    expect(trip({ destinations: ['hunza', 'unsure'] }).destinations).toBe('Hunza, Help me choose');
  });

  it('writes flexible and exact dates: the months alone, each year once, with no days to count', () => {
    expect(trip({ months: ['2027-06'] }).dates).toBe('Jun 2027');
    expect(trip({ months: ['2027-06', '2027-07'] }).dates).toBe('Jun, Jul 2027');
    expect(trip({ months: ['2026-11', '2026-12', '2027-01'] }).dates).toBe('Nov, Dec 2026, Jan 2027');
    expect(trip({ dateMode: 'exact', from: '2027-06-12', to: '2027-06-18' }).dates).toBe('12 Jun 2027 – 18 Jun 2027');
    expect(trip({ dateMode: 'exact', from: '2027-06-12', to: null }).dates).toBeNull();
  });

  it('writes the group with and without children and ages', () => {
    expect(trip({ adults: 1 }).group).toBe('1 adult');
    expect(trip({ adults: 1, children: 1, ages: [6] }).group).toBe('1 adult, 1 child (age 6)');
    expect(trip({ children: 1, ages: [6] }).group).toBe('2 adults, 1 child (age 6)');
    expect(trip({ children: 2, ages: [6, 9] }).group).toBe('2 adults, 2 children (ages 6, 9)');
    expect(trip({ children: 2, ages: [0, null] }).group).toBe('2 adults, 2 children (age under 2)');
    expect(trip({ children: 2, ages: [null, null] }).group).toBe('2 adults, 2 children');
  });

  it('leaves the length empty until one is picked, whatever the month', () => {
    expect(trip({ months: ['2027-06'] }).length).toBeNull();
  });

  it('joins several picks in the page’s words, in the options’ order', () => {
    expect(
      trip({ lengths: ['5-7', '8-10'], groupType: ['family', 'friends'], hotels: ['comfortable', 'upgraded'], transport: ['car', 'suggest'], budget: ['50-100k', 'not-sure'] }),
    ).toMatchObject({
      length: '5–7 days, 8–10 days',
      groupType: 'Family, Friends',
      hotels: 'Comfortable, Upgraded',
      transport: 'Car, Let us suggest',
      budget: 'PKR 50–100k, Not sure yet',
    });
    expect(detailsSummary({ ...EMPTY_DETAILS, bestTime: ['morning', 'evening'] }, sampleWords).bestTime).toBe('Morning, Evening');
  });

  it('writes the options in the page’s words, the length too', () => {
    expect(trip({ months: ['2027-06'], lengths: ['5-7'], groupType: ['family'], hotels: ['upgraded'], transport: ['car'], budget: ['50-100k'] })).toMatchObject({
      length: '5–7 days',
      groupType: 'Family',
      hotels: 'Upgraded',
      transport: 'Car',
      budget: 'PKR 50–100k',
    });
  });

  it('leaves from the typed city, or “Other city” until one is typed', () => {
    expect(trip({ departingFrom: 'other', otherCity: ' Multan ' }).from).toBe('Multan');
    expect(trip({ departingFrom: 'other', otherCity: '' }).from).toBe('Other city');
    expect(trip({ departingFrom: 'islamabad', otherCity: 'Multan' }).from).toBe('Islamabad');
  });
});

describe('details summary', () => {
  it('is empty until filled in', () => {
    expect(detailsSummary(EMPTY_DETAILS, sampleWords)).toEqual({ name: null, phone: null, bestTime: null, notes: null });
  });

  it('writes the number in international form, in either mode', () => {
    const pk = detailsSummary({ ...EMPTY_DETAILS, name: ' Ayesha Khan ', phone: { ...EMPTY_PHONE, pk: '0300 1234567' }, bestTime: ['evening'], notes: 'Hi' }, sampleWords);
    expect(pk).toEqual({ name: 'Ayesha Khan', phone: '+92 300 1234567', bestTime: 'Evening', notes: 'Hi' });
    expect(detailsSummary({ ...EMPTY_DETAILS, phone: { mode: 'intl', pk: '', code: '44', number: '7700 900123' } }, sampleWords).phone).toBe('+44 7700 900123');
  });
});

describe('review sections', () => {
  it('group the rows by step, with the page’s labels and an Edit named for its section', () => {
    const sections = reviewSections(
      trip({ destinations: ['hunza'] }),
      detailsSummary(EMPTY_DETAILS, sampleWords),
      ['Where and when', 'Who’s coming', 'Your details'],
      copy.review,
    );
    expect(sections.map((s) => [s.step, s.editLabel])).toEqual([
      [1, 'Edit where and when'],
      [2, 'Edit who’s coming'],
      [3, 'Edit your details'],
    ]);
    expect(sections[0].rows).toEqual([
      { label: 'Destinations', value: 'Hunza' },
      { label: 'Dates', value: null },
      { label: 'Trip length', value: null },
    ]);
    expect(sections[1].rows.map((r) => r.label)).toEqual(['Group', 'Group type', 'Hotels', 'Transport', 'Departing from', 'Budget']);
    expect(sections[2].rows.map((r) => r.label)).toEqual(['Name', 'WhatsApp', 'Best time', 'Anything else']);
  });
});

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { plannerCopyFile, type PlannerCopy } from '../content/pages.ts';
import { settingsFile, type Settings } from '../content/settings.ts';
import { EMPTY_PHONE } from './phone.ts';
import { DEFAULT_ANSWERS, type TripAnswers } from './plannerAnswers.ts';
import { EMPTY_DETAILS, type Details } from './plannerDetails.ts';
import { callBackMessage, tripRequestMessage } from './plannerMessage.ts';
import { detailsSummary, summaryWords, tripSummary } from './plannerSummary.ts';

const copy: PlannerCopy = JSON.parse(readFileSync(plannerCopyFile(), 'utf8'));
const { whatsapp }: Settings = JSON.parse(readFileSync(settingsFile(), 'utf8'));
const words = summaryWords(copy, [{ slug: 'hunza', name: 'Hunza' }]);

const answers: TripAnswers = {
  ...DEFAULT_ANSWERS,
  destinations: ['hunza'],
  months: ['2027-06'],
  lengths: ['5-7'],
  children: 2,
  ages: [6, 9],
  groupType: ['family'],
  hotels: ['upgraded'],
  transport: ['car'],
  budget: ['50-100k'],
};
const details: Details = {
  name: 'Ayesha Khan',
  phone: { ...EMPTY_PHONE, pk: '300 123 4567' },
  bestTime: ['evening'],
  notes: 'Travelling with my mother, who prefers short walks.',
};
const request = (a: TripAnswers, d: Details) => tripRequestMessage(whatsapp.planner, tripSummary(a, words), detailsSummary(d, words));
const callBack = (a: TripAnswers, d: Details) => callBackMessage(whatsapp.planner, tripSummary(a, words), detailsSummary(d, words));

describe('trip request', () => {
  it('writes the month alone when no trip length is picked', () => {
    expect(request({ ...answers, lengths: [] }, details)).toContain('• Dates: Jun 2027\n');
  });

  it('writes every answer, a line each', () => {
    expect(request(answers, details)).toBe(
      [
        'Assalam o Alaikum! I’d like to plan a private trip.',
        '• Destinations: Hunza',
        '• Dates: Jun 2027 (5–7 days)',
        '• Group: 2 adults, 2 children (ages 6, 9) · Family',
        '• Hotels: Upgraded · Transport: Car',
        '• Departing from: Lahore',
        '• Budget per person: PKR 50–100k',
        '• Best time to reach me: Evening',
        '• Notes: Travelling with my mother, who prefers short walks.',
        'Name: Ayesha Khan',
        'WhatsApp: +92 300 123 4567',
      ].join('\n'),
    );
  });

  it('leaves out the optional lines nobody answered, and leaves hotels and transport to “Any”', () => {
    const plain = { ...DEFAULT_ANSWERS, destinations: ['hunza'], dateMode: 'exact' as const, from: '2027-06-12', to: '2027-06-18' };
    expect(request(plain, { ...EMPTY_DETAILS, name: 'Ayesha', phone: { mode: 'intl', pk: '', code: '44', number: '7700 900123' } })).toBe(
      [
        'Assalam o Alaikum! I’d like to plan a private trip.',
        '• Destinations: Hunza',
        '• Dates: 12 Jun 2027 – 18 Jun 2027',
        '• Group: 2 adults',
        '• Hotels: Any · Transport: Any',
        '• Departing from: Lahore',
        'Name: Ayesha',
        'WhatsApp: +44 7700 900123',
      ].join('\n'),
    );
  });
});

describe('several picks', () => {
  const several: TripAnswers = {
    ...answers,
    months: ['2026-12', '2027-01'],
    lengths: ['5-7', '8-10'],
    groupType: ['family', 'friends'],
    hotels: ['comfortable', 'upgraded'],
    transport: ['car', 'coaster'],
    budget: ['50-100k', '100k-plus'],
  };
  const both: Details = { ...details, bestTime: ['morning', 'evening'] };

  it('joins them on each line of the trip request, and Departing from stays one city', () => {
    const lines = request(several, both).split('\n');
    expect(lines).toContain('• Dates: Dec 2026, Jan 2027 (5–7 days, 8–10 days)');
    expect(lines).toContain('• Group: 2 adults, 2 children (ages 6, 9) · Family, Friends');
    expect(lines).toContain('• Hotels: Comfortable, Upgraded · Transport: Car, Coaster');
    expect(lines).toContain('• Departing from: Lahore');
    expect(lines).toContain('• Budget per person: PKR 50–100k, PKR 100k+');
    expect(lines).toContain('• Best time to reach me: Morning, Evening');
  });

  it('names every best time in the call back', () => {
    expect(callBack(several, both).split('\n')[0]).toBe('Please call me back on +92 300 123 4567, best time morning, evening.');
  });
});

describe('call back', () => {
  it('asks for a call on the number at the best time, then the trip and the name', () => {
    expect(callBack(answers, details)).toBe(
      [
        'Please call me back on +92 300 123 4567, best time evening.',
        '• Destinations: Hunza',
        '• Dates: Jun 2027 (5–7 days)',
        '• Group: 2 adults, 2 children (ages 6, 9) · Family',
        '• Hotels: Upgraded · Transport: Car',
        '• Departing from: Lahore',
        '• Budget per person: PKR 50–100k',
        '• Notes: Travelling with my mother, who prefers short walks.',
        'Name: Ayesha Khan',
      ].join('\n'),
    );
  });

  it('says “any time” without a best time, with the number in international form', () => {
    const abroad = { ...details, bestTime: [], phone: { mode: 'intl' as const, pk: '', code: '44', number: '7700 900123' } };
    expect(callBack(answers, abroad).split('\n')[0]).toBe('Please call me back on +44 7700 900123, best time any time.');
  });
});

import { describe, expect, it } from 'vitest';
import {
  dateMin,
  DEFAULT_ANSWERS,
  pickLength,
  pickDeparture,
  pickMonth,
  pickOption,
  setAdults,
  setAge,
  setChildren,
  setOtherCity,
  setDate,
  toggleDestination,
  type TripAnswers,
} from './plannerAnswers.ts';

const choices = ['hunza', 'skardu', 'swat', 'unsure'];
const flexible = (change: Partial<TripAnswers> = {}): TripAnswers => ({ ...DEFAULT_ANSWERS, months: ['2027-06'], ...change });

describe('defaults', () => {
  it('start flexible, nothing chosen, Lahore, and no days to count', () => {
    expect(DEFAULT_ANSWERS).toMatchObject({
      destinations: [],
      dateMode: 'flexible',
      months: [],
      lengths: [],
      groupType: [],
      hotels: [],
      transport: [],
      budget: [],
      departingFrom: 'lahore',
    });
    expect(Object.keys(DEFAULT_ANSWERS)).not.toContain('days');
    expect(Object.keys(DEFAULT_ANSWERS)).not.toContain('lengthAuto');
  });
});

describe('destinations', () => {
  it('tick and untick, kept in the choices’ order', () => {
    const one = toggleDestination(DEFAULT_ANSWERS, 'swat', choices);
    const two = toggleDestination(one, 'hunza', choices);
    expect(two.destinations).toEqual(['hunza', 'swat']);
    expect(toggleDestination(two, 'swat', choices).destinations).toEqual(['hunza']);
  });
});

describe('months', () => {
  it('any number, earliest first whatever the order picked, and a second press unpicks one', () => {
    const july = pickMonth(DEFAULT_ANSWERS, '2027-07');
    const both = pickMonth(july, '2027-06');
    expect(both.months).toEqual(['2027-06', '2027-07']);
    expect(pickMonth(both, '2027-01').months).toEqual(['2027-01', '2027-06', '2027-07']);
    expect(pickMonth(both, '2027-07').months).toEqual(['2027-06']);
    expect(pickMonth(pickMonth(both, '2027-07'), '2027-06').months).toEqual([]);
  });
});

describe('trip lengths', () => {
  it('only what the visitor picked: nothing until then, whatever the month', () => {
    expect(flexible().lengths).toEqual([]);
    expect(pickLength(flexible(), '8-10').lengths).toEqual(['8-10']);
  });

  it('any number, shortest first, and a second press unpicks one', () => {
    const both = pickLength(pickLength(flexible(), '8-10'), '2-4');
    expect(both.lengths).toEqual(['2-4', '8-10']);
    expect(pickLength(both, '8-10').lengths).toEqual(['2-4']);
  });
});

describe('exact dates', () => {
  it('an emptied field is no date', () => {
    expect(setDate(DEFAULT_ANSWERS, 'from', '2027-06-12').from).toBe('2027-06-12');
    expect(setDate({ ...DEFAULT_ANSWERS, to: '2027-06-18' }, 'to', '').to).toBeNull();
  });

  it('offer nothing before today, and To nothing before From', () => {
    expect(dateMin(DEFAULT_ANSWERS, 'from', '2026-10-04')).toBe('2026-10-04');
    expect(dateMin({ ...DEFAULT_ANSWERS, from: '2027-06-12' }, 'to', '2026-10-04')).toBe('2027-06-12');
    expect(dateMin({ ...DEFAULT_ANSWERS, from: '2027-06-12' }, 'from', '2026-10-04')).toBe('2026-10-04');
    expect(dateMin({ ...DEFAULT_ANSWERS, from: '2026-01-01' }, 'to', '2026-10-04')).toBe('2026-10-04');
  });
});

describe('group size', () => {
  it('starts at 2 adults and no children, leaving from Lahore', () => {
    expect(DEFAULT_ANSWERS).toMatchObject({ adults: 2, children: 0, ages: [], departingFrom: 'lahore' });
  });

  it('keeps adults from 1 to 40 and children from 0 to 20', () => {
    expect(setAdults(DEFAULT_ANSWERS, 0).adults).toBe(1);
    expect(setAdults(DEFAULT_ANSWERS, 41).adults).toBe(40);
    expect(setAdults(DEFAULT_ANSWERS, 40).adults).toBe(40);
    expect(setChildren(DEFAULT_ANSWERS, -1).children).toBe(0);
    expect(setChildren(DEFAULT_ANSWERS, 21).children).toBe(20);
  });

  it('gives each child an age slot, and lowering the count drops the extra ages', () => {
    const two = setAge(setAge(setChildren(DEFAULT_ANSWERS, 2), 0, 6), 1, 9);
    expect(two.ages).toEqual([6, 9]);
    expect(setChildren(two, 1).ages).toEqual([6]);
    expect(setChildren(setChildren(two, 1), 2).ages).toEqual([6, null]);
  });
});

describe('optional chips', () => {
  it('pick any number, in the options’ order, and a second press unpicks one', () => {
    const friends = pickOption(DEFAULT_ANSWERS, 'groupType', 'friends');
    const both = pickOption(friends, 'groupType', 'family');
    expect(both.groupType).toEqual(['family', 'friends']);
    expect(pickOption(both, 'groupType', 'friends').groupType).toEqual(['family']);
  });

  it.each([
    ['hotels', 'best', 'comfortable', ['comfortable', 'best']],
    ['transport', 'suggest', 'car', ['car', 'suggest']],
    ['budget', 'not-sure', 'under-50k', ['under-50k', 'not-sure']],
  ] as const)('%s takes several too', (question, first, second, both) => {
    const answers = pickOption(pickOption(DEFAULT_ANSWERS, question, first), question, second);
    expect(answers[question]).toEqual(both);
  });
});

describe('departing from', () => {
  it('stays one city (the owner’s decision): another replaces it, and pressing the chosen one keeps it', () => {
    expect(DEFAULT_ANSWERS.departingFrom).toBe('lahore');
    expect(pickDeparture(DEFAULT_ANSWERS, 'lahore').departingFrom).toBe('lahore');
    expect(pickDeparture(pickDeparture(DEFAULT_ANSWERS, 'islamabad'), 'other').departingFrom).toBe('other');
  });

  it('keeps the city typed for “Other city”', () => {
    expect(setOtherCity(DEFAULT_ANSWERS, 'Multan').otherCity).toBe('Multan');
  });
});

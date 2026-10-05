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
const flexible = (change: Partial<TripAnswers> = {}): TripAnswers => ({ ...DEFAULT_ANSWERS, month: '2027-06', ...change });

describe('defaults', () => {
  it('start flexible, nothing chosen, and no days to count', () => {
    expect(DEFAULT_ANSWERS).toMatchObject({ destinations: [], dateMode: 'flexible', month: null, length: null });
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

describe('month', () => {
  it('another month replaces it, and the same one clears it', () => {
    const june = pickMonth(DEFAULT_ANSWERS, '2027-06');
    expect(pickMonth(june, '2027-07').month).toBe('2027-07');
    expect(pickMonth(june, '2027-06').month).toBeNull();
  });
});

describe('trip length', () => {
  it('is only what the visitor picked: nothing until then, whatever the month', () => {
    expect(flexible().length).toBeNull();
    expect(pickLength(flexible(), '8-10').length).toBe('8-10');
  });

  it('another length replaces it, and the same one again clears it', () => {
    const picked = pickLength(flexible(), '8-10');
    expect(pickLength(picked, '5-7').length).toBe('5-7');
    expect(pickLength(picked, '8-10').length).toBeNull();
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
  it('pick one, and a second press clears it', () => {
    const family = pickOption(DEFAULT_ANSWERS, 'groupType', 'family');
    expect(family.groupType).toBe('family');
    expect(pickOption(family, 'groupType', 'friends').groupType).toBe('friends');
    expect(pickOption(family, 'groupType', 'family').groupType).toBeNull();
  });
});

describe('departing from', () => {
  it('always has one: pressing the chosen city keeps it', () => {
    expect(pickDeparture(DEFAULT_ANSWERS, 'lahore').departingFrom).toBe('lahore');
    expect(pickDeparture(DEFAULT_ANSWERS, 'other').departingFrom).toBe('other');
  });

  it('keeps the city typed for “Other city”', () => {
    expect(setOtherCity(DEFAULT_ANSWERS, 'Multan').otherCity).toBe('Multan');
  });
});

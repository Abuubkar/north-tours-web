import { describe, expect, it } from 'vitest';
import { DEFAULT_ANSWERS, lengthIsAutoFilled, pickLength, pickMonth, toggleDestination, tripLength, type TripAnswers } from './plannerAnswers.ts';

const choices = ['hunza', 'skardu', 'swat', 'unsure'];
const flexible = (change: Partial<TripAnswers> = {}): TripAnswers => ({ ...DEFAULT_ANSWERS, month: '2027-06', ...change });

describe('defaults', () => {
  it('start flexible, about 6 days, nothing chosen', () => {
    expect(DEFAULT_ANSWERS).toMatchObject({ destinations: [], dateMode: 'flexible', month: null, days: 6, length: null, lengthAuto: true });
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

describe('trip length auto-fill', () => {
  it.each([
    [4, '2-4'],
    [5, '5-7'],
    [7, '5-7'],
    [8, '8-10'],
    [10, '8-10'],
    [11, '10plus'],
  ])('follows %i flexible days → %s', (days, length) => {
    const answers = flexible({ days });
    expect(tripLength(answers)).toBe(length);
    expect(lengthIsAutoFilled(answers)).toBe(true);
  });

  it('waits for a month, and doesn’t apply to exact dates', () => {
    expect(tripLength(DEFAULT_ANSWERS)).toBeNull();
    expect(tripLength(flexible({ dateMode: 'exact' }))).toBeNull();
  });

  it('stops once a length is picked, whatever the days', () => {
    const picked = pickLength(flexible({ days: 6 }), '8-10');
    expect(tripLength(picked)).toBe('8-10');
    expect(tripLength({ ...picked, days: 3 })).toBe('8-10');
    expect(lengthIsAutoFilled(picked)).toBe(false);
  });

  it('picking the shown length again clears it, and it stays cleared', () => {
    const cleared = pickLength(flexible({ days: 6 }), '5-7');
    expect(tripLength(cleared)).toBeNull();
    expect(tripLength({ ...cleared, days: 9 })).toBeNull();
  });
});

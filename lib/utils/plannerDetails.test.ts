import { describe, expect, it } from 'vitest';
import { EMPTY_DETAILS, firstName, pickBestTime, switchPhoneMode } from './plannerDetails.ts';

describe('your details', () => {
  it('start empty, with a Pakistani number', () => {
    expect(EMPTY_DETAILS).toEqual({ name: '', phone: { mode: 'pk', pk: '', code: '', number: '' }, bestTime: null, notes: '' });
  });

  it('switch the number’s mode and back, keeping what was typed in each', () => {
    const typed = { ...EMPTY_DETAILS, phone: { ...EMPTY_DETAILS.phone, pk: '300 123', code: '44' } };
    const abroad = switchPhoneMode(typed);
    expect(abroad.phone).toEqual({ mode: 'intl', pk: '300 123', code: '44', number: '' });
    expect(switchPhoneMode(abroad).phone.mode).toBe('pk');
  });

  it('pick a best time, and clear it on a second press', () => {
    const evening = pickBestTime(EMPTY_DETAILS, 'evening');
    expect(evening.bestTime).toBe('evening');
    expect(pickBestTime(evening, 'evening').bestTime).toBeNull();
  });
});

describe('first name', () => {
  it('is the first word of the name', () => {
    expect(firstName({ ...EMPTY_DETAILS, name: '  Ayesha  Khan ' })).toBe('Ayesha');
    expect(firstName({ ...EMPTY_DETAILS, name: 'Bilal' })).toBe('Bilal');
  });
});

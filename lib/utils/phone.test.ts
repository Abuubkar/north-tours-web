import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { plannerCopyFile, type PlannerCopy } from '../content/pages.ts';
import { EMPTY_PHONE, internationalPhone, phoneProblem, phoneTyped, pkDigits, type Phone } from './phone.ts';

const { errors: messages }: PlannerCopy = JSON.parse(readFileSync(plannerCopyFile(), 'utf8'));
const pk = (typed: string): Phone => ({ ...EMPTY_PHONE, pk: typed });
const intl = (code: string, number: string): Phone => ({ ...EMPTY_PHONE, mode: 'intl', code, number });
const problem = (phone: Phone) => phoneProblem(phone, messages);

describe('typing a number', () => {
  it('keeps digits and spaces, up to the limit', () => {
    expect(phoneTyped('0300-123 4567x')).toBe('0300123 4567');
    expect(phoneTyped('0300 123 45678', 13)).toBe('0300 123 4567');
  });
});

describe('Pakistani numbers', () => {
  it.each(['300 123 4567', '0300 1234567', '92 300 1234567', '0300-123-4567'])('“%s” passes', (typed) => {
    expect(problem(pk(typed))).toBeNull();
    expect(pkDigits(typed)).toBe('3001234567');
  });

  it('needs a number', () => {
    expect(problem(pk(''))).toEqual({ fields: ['phone'], message: messages.phoneEmpty });
    expect(problem(pk('   '))?.message).toBe(messages.phoneEmpty);
  });

  it('counts the digits of an incomplete number', () => {
    expect(problem(pk('300 123 456'))?.message).toBe(
      'This number looks incomplete (9 of 10 digits). Pakistani mobile numbers have 10 digits after +92, for example 3XX XXX XXXX.',
    );
    expect(problem(pk('300 12'))?.message).toMatch(/\(5 of 10 digits\)/);
  });

  it('refuses 11 digits not starting with 0, and a number starting with 4', () => {
    expect(problem(pk('30012345678'))?.message).toBe(messages.phoneInvalid);
    expect(problem(pk('400 123 4567'))?.message).toBe(messages.phoneInvalid);
  });
});

describe('international numbers', () => {
  it('need 8 to 15 digits in all', () => {
    expect(problem(intl('44', '12345'))).toEqual({ fields: ['number'], message: messages.phoneIntl });
    expect(problem(intl('44', '123456'))).toBeNull();
    expect(problem(intl('44', '7700 900123 456'))).toBeNull();
    expect(problem(intl('44', '7700 900123 4567'))?.fields).toEqual(['number']);
  });

  it('refuses a country code starting with 0', () => {
    expect(problem(intl('044', '7700 900123'))).toEqual({ fields: ['countryCode'], message: messages.phoneIntl });
  });

  it('need a number', () => {
    expect(problem(intl('', ''))).toEqual({ fields: ['countryCode'], message: messages.phoneEmpty });
    expect(problem(intl('44', ''))?.message).toBe(messages.phoneIntl);
  });
});

describe('international form', () => {
  it('writes a Pakistani number after +92, as typed, its leading 0 or 92 dropped', () => {
    expect(internationalPhone(pk('300 123 4567'))).toBe('+92 300 123 4567');
    expect(internationalPhone(pk('0300 1234567'))).toBe('+92 300 1234567');
    expect(internationalPhone(pk('92 300 1234567'))).toBe('+92 300 1234567');
  });

  it('writes the country code and number', () => {
    expect(internationalPhone(intl('44', '7700  900123 '))).toBe('+44 7700 900123');
  });
});

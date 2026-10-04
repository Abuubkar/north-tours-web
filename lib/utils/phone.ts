import { fillTokens } from './tokens.ts';

/*
 * The planner's WhatsApp number (PRD #71): a Pakistani mobile by default, written the way people
 * write it, or a country code and number for someone abroad. Never stored.
 */

/** pk: "+92" and a Pakistani mobile. intl: a country code and a number. Each mode keeps what was typed in it. */
export type Phone = { mode: 'pk' | 'intl'; pk: string; code: string; number: string };

export const EMPTY_PHONE: Phone = { mode: 'pk', pk: '', code: '', number: '' };

/** The longest Pakistani number as typed: "0300 123 4567" with spaces. */
export const PK_MAX_LENGTH = 13;

/** A country code: 1 to 3 digits. */
export const CODE_MAX_LENGTH = 3;

/** What the number fields keep from a key press or a paste: digits and spaces. */
export function phoneTyped(value: string, maxLength?: number): string {
  const kept = value.replace(/[^\d ]/g, '');
  return maxLength === undefined ? kept : kept.slice(0, maxLength);
}

/** The words a phone problem uses (page copy); `incomplete` takes {count}. */
export type PhoneMessages = { phoneEmpty: string; phoneIncomplete: string; phoneInvalid: string; phoneIntl: string };

/**
 * A Pakistani number's 10 digits after +92: spaces and dashes are ignored, and a leading 92
 * (12 digits) or 0 (11 digits) is dropped, so "0300 1234567" and "300 123 4567" are the same.
 */
export function pkDigits(typed: string): string {
  const digits = typed.replace(/[\s-]/g, '');
  if (/^92\d{10}$/.test(digits)) return digits.slice(2);
  if (/^0\d{10}$/.test(digits)) return digits.slice(1);
  return digits;
}

const digitCount = (text: string) => text.replace(/\D/g, '').length;

/** The number's problem, with the field to focus (phone, countryCode or number), or null when it's fine. */
export function phoneProblem(phone: Phone, messages: PhoneMessages): { fields: string[]; message: string } | null {
  if (phone.mode === 'pk') {
    const digits = pkDigits(phone.pk);
    if (digits === '') return { fields: ['phone'], message: messages.phoneEmpty };
    if (digits.length < 10) return { fields: ['phone'], message: fillTokens(messages.phoneIncomplete, { count: String(digits.length) }) };
    return /^3\d{9}$/.test(digits) ? null : { fields: ['phone'], message: messages.phoneInvalid };
  }
  const code = phone.code.trim();
  const number = phone.number.trim();
  if (code === '' && number === '') return { fields: ['countryCode'], message: messages.phoneEmpty };
  if (!/^[1-9]\d{0,2}$/.test(code)) return { fields: ['countryCode'], message: messages.phoneIntl };
  const total = code.length + digitCount(number);
  const fine = /^[\d ]+$/.test(number) && total >= 8 && total <= 15;
  return fine ? null : { fields: ['number'], message: messages.phoneIntl };
}

const tidy = (text: string) => text.trim().replace(/\s+/g, ' ');

/** The number in international form for the review and the message: "+92 300 123 4567", "+44 7700 900123". */
export function internationalPhone(phone: Phone): string {
  if (phone.mode === 'intl') return `+${phone.code.trim()} ${tidy(phone.number)}`;
  const typed = tidy(phone.pk);
  const digits = typed.replace(/\D/g, '');
  if (/^92\d{10}$/.test(digits)) return `+92 ${tidy(typed.replace(/^9\s*2/, ''))}`;
  if (/^0\d{10}$/.test(digits)) return `+92 ${tidy(typed.replace(/^0/, ''))}`;
  return `+92 ${typed}`;
}

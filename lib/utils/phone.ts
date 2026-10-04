import type { PlannerCopy } from '../content/pages.ts';
import { fillTokens } from './tokens.ts';

/*
 * The planner's WhatsApp number (PRD #71): a Pakistani mobile by default, written the way people
 * write it, or a country code and number for someone abroad. Never stored.
 */

/** pk: "+92" and a Pakistani mobile. intl: a country code and a number. Each mode keeps what was typed in it. */
export type Phone = { mode: 'pk' | 'intl'; pk: string; code: string; number: string };

export const EMPTY_PHONE: Phone = { mode: 'pk', pk: '', code: '', number: '' };

/** A Pakistani mobile's digits after +92. */
const PK_DIGITS = 10;

/** The longest Pakistani number as typed, with spaces: "92 300 123 4567". */
export const PK_MAX_LENGTH = 15;

/** A country code: 1 to 3 digits. */
export const CODE_MAX_LENGTH = 3;

/** A number abroad in all, country code included (E.164). */
const INTL_DIGITS = { min: 8, max: 15 } as const;

/** What the number fields keep from a key press or a paste: digits and spaces. */
export function phoneTyped(value: string, maxLength?: number): string {
  const kept = value.replace(/[^\d ]/g, '');
  return maxLength === undefined ? kept : kept.slice(0, maxLength);
}

/** The words a phone problem uses (page copy); `phoneIncomplete` takes {count}. */
export type PhoneMessages = Pick<PlannerCopy['errors'], 'phoneEmpty' | 'phoneIncomplete' | 'phoneInvalid' | 'phoneIntl'>;

/** The prefix a Pakistani number was typed with: "92" before 10 digits, "0" before 10, or none. */
function pkPrefix(digits: string): '92' | '0' | '' {
  if (digits.length === PK_DIGITS + 2 && digits.startsWith('92')) return '92';
  if (digits.length === PK_DIGITS + 1 && digits.startsWith('0')) return '0';
  return '';
}

/**
 * A Pakistani number's 10 digits after +92: spaces and dashes are ignored, and a leading 92
 * (12 digits) or 0 (11 digits) is dropped, so "0300 1234567" and "300 123 4567" are the same.
 */
export function pkDigits(typed: string): string {
  const digits = typed.replace(/[\s-]/g, '');
  return digits.slice(pkPrefix(digits).length);
}

const digitCount = (text: string) => text.replace(/\D/g, '').length;

/** The number's problem, with the field to focus (phone, countryCode or number), or null when it's fine. */
export function phoneProblem(phone: Phone, messages: PhoneMessages): { fields: string[]; message: string } | null {
  if (phone.mode === 'pk') {
    const digits = pkDigits(phone.pk);
    if (digits === '') return { fields: ['phone'], message: messages.phoneEmpty };
    if (digits.length < PK_DIGITS) return { fields: ['phone'], message: fillTokens(messages.phoneIncomplete, { count: String(digits.length) }) };
    return digits.length === PK_DIGITS && digits.startsWith('3') && /^\d+$/.test(digits) ? null : { fields: ['phone'], message: messages.phoneInvalid };
  }
  const code = phone.code.trim();
  const number = phone.number.trim();
  if (code === '' && number === '') return { fields: ['countryCode'], message: messages.phoneEmpty };
  if (!/^[1-9]\d{0,2}$/.test(code)) return { fields: ['countryCode'], message: messages.phoneIntl };
  const total = code.length + digitCount(number);
  const fine = /^[\d ]+$/.test(number) && total >= INTL_DIGITS.min && total <= INTL_DIGITS.max;
  return fine ? null : { fields: ['number'], message: messages.phoneIntl };
}

const tidy = (text: string) => text.trim().replace(/\s+/g, ' ');

/** The number in international form for the review and the message: "+92 300 123 4567", "+44 7700 900123". */
export function internationalPhone(phone: Phone): string {
  if (phone.mode === 'intl') return `+${phone.code.trim()} ${tidy(phone.number)}`;
  const typed = tidy(phone.pk);
  // Drop the prefix's digits from the number as typed, keeping the visitor's spacing after it.
  let drop = pkPrefix(typed.replace(/\D/g, '')).length;
  const rest = [...typed].filter((char) => (drop > 0 && /\d/.test(char) ? (drop--, false) : true)).join('');
  return `+92 ${tidy(rest)}`;
}

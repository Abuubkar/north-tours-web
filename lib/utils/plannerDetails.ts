import { EMPTY_PHONE, type Phone } from './phone.ts';
import type { BestTime } from './plannerOptions.ts';

/*
 * Your details (PRD #71): who to reply to and when. They live in memory only, never in the
 * browser's storage (ADR-0018), and leave the page only in the WhatsApp message the visitor sends.
 */

export type Details = {
  name: string;
  phone: Phone;
  bestTime: BestTime | null;
  /** "Anything else?", up to 500 characters so the WhatsApp link stays short. */
  notes: string;
};

export const EMPTY_DETAILS: Details = { name: '', phone: EMPTY_PHONE, bestTime: null, notes: '' };

/** The longest "Anything else?". */
export const NOTES_MAX_LENGTH = 500;

/** Switches between a Pakistani number and a country code and number, keeping what was typed in each. */
export function switchPhoneMode(details: Details): Details {
  return { ...details, phone: { ...details.phone, mode: details.phone.mode === 'pk' ? 'intl' : 'pk' } };
}

/** The best time to call: picking the chosen one again clears it. */
export function pickBestTime(details: Details, time: BestTime): Details {
  return { ...details, bestTime: details.bestTime === time ? null : time };
}

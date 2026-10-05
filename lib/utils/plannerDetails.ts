import { EMPTY_PHONE, type Phone } from './phone.ts';
import { BEST_TIMES, toggled, type BestTime } from './plannerOptions.ts';

/*
 * Your details (PRD #71): who to reply to and when. They live in memory only, never in the
 * browser's storage (ADR-0018), and leave the page only in the WhatsApp message the visitor sends.
 */

export type Details = {
  name: string;
  phone: Phone;
  /** Any number of times, in the options' order (named as its question in page copy, like the trip's chip questions). */
  bestTime: BestTime[];
  /** "Anything else?", up to 500 characters so the WhatsApp link stays short. */
  notes: string;
};

export const EMPTY_DETAILS: Details = { name: '', phone: EMPTY_PHONE, bestTime: [], notes: '' };

/** The longest "Anything else?". */
export const NOTES_MAX_LENGTH = 500;

/** The first word of the name, for "Thanks, Ayesha.". */
export function firstName(details: Details): string {
  return details.name.trim().split(/\s+/)[0] ?? '';
}

/** Switches between a Pakistani number and a country code and number, keeping what was typed in each. */
export function switchPhoneMode(details: Details): Details {
  return { ...details, phone: { ...details.phone, mode: details.phone.mode === 'pk' ? 'intl' : 'pk' } };
}

/** The best time to call: picks the time, or unpicks it; any number, morning first. */
export function pickBestTime(details: Details, time: BestTime): Details {
  return { ...details, bestTime: toggled(details.bestTime, time, BEST_TIMES) };
}

import { SHORT_MONTHS } from './dates.ts';

/*
 * The Trip Planner's choices (PRD #71). Ids are stable (they're saved and appear in page copy);
 * the words for each come from page copy, destinations' names from content.
 */

/** "Not sure, suggest something": the destination choice that asks for advice instead. */
export const UNSURE = 'unsure';

export const DATE_MODES = ['exact', 'flexible'] as const;
export type DateMode = (typeof DATE_MODES)[number];

/** Trip lengths, as the Tours duration filter starts them (2–4 days fits the 2-day minimum). */
export const TRIP_LENGTHS = ['2-4', '5-7', '8-10', '10plus'] as const;
export type TripLength = (typeof TRIP_LENGTHS)[number];

/** The flexible "Roughly N days". */
export const DAYS = { min: 2, max: 21, default: 6 } as const;

/** How many months ahead the month chips reach, this month included. */
const MONTHS_AHEAD = 12;

/** The destination choices: every destination in the loader's order, then "Not sure". */
export function destinationChoices(slugs: readonly string[]): string[] {
  return [...slugs, UNSURE];
}

/** "2027-06-14" → "2027-06". */
export const monthOf = (date: string) => date.slice(0, 7);

/** The 12 months from `today`'s month (YYYY-MM-DD in Karachi) on, as YYYY-MM: Oct 2026 to Sep 2027. */
export function monthChoices(today: string): string[] {
  const [year, month] = today.split('-').map(Number);
  return Array.from({ length: MONTHS_AHEAD }, (_, i) => {
    const index = month - 1 + i;
    const y = year + Math.floor(index / 12);
    const m = (index % 12) + 1;
    return `${y}-${String(m).padStart(2, '0')}`;
  });
}

/** A month chip's words: "2027-06" → "Jun 2027". */
export function monthLabel(id: string): string {
  const [year, month] = id.split('-').map(Number);
  return `${SHORT_MONTHS[month - 1]} ${year}`;
}

/** The trip length that fits a number of flexible days: up to 4, up to 7, up to 10, then more. */
export function lengthForDays(days: number): TripLength {
  if (days <= 4) return '2-4';
  if (days <= 7) return '5-7';
  if (days <= 10) return '8-10';
  return '10plus';
}

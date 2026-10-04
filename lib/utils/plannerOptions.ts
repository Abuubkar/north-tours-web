/*
 * The Trip Planner's choices (PRD #71). Ids are stable (they're saved and appear in page copy);
 * the words for each come from page copy, destinations' names from content.
 */

import { BUDGETS } from './tourFilters.ts';

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

/** The trip length that fits a number of flexible days: up to 4, up to 7, up to 10, then more. */
export function lengthForDays(days: number): TripLength {
  if (days <= 4) return '2-4';
  if (days <= 7) return '5-7';
  if (days <= 10) return '8-10';
  return '10plus';
}

/** Who's coming: adults (18 and over) and children (under 18). */
export const ADULTS = { min: 1, max: 40, default: 2 } as const;
export const CHILDREN = { min: 0, max: 20, default: 0 } as const;

/** "Under 2": a child's age before the years count. */
export const UNDER_TWO = 0;

/** The oldest a child can be (18 and over is an adult). */
const OLDEST_CHILD = 17;

/** A child's age: "Under 2", then 2 to 17. */
export const AGES: readonly number[] = [UNDER_TWO, ...Array.from({ length: OLDEST_CHILD - 1 }, (_, i) => i + 2)];

/** An age's words: "Under 2" (the page's), or the number. */
export function ageLabel(age: number, underTwo: string): string {
  return age === UNDER_TWO ? underTwo : String(age);
}

/** Each option's id with its words, in the ids' order, as the chip groups list them. */
export function labelled<T extends string>(ids: readonly T[], labels: Readonly<Record<T, string>>): { id: T; label: string }[] {
  return ids.map((id) => ({ id, label: labels[id] }));
}

export const GROUP_TYPES = ['family', 'couple', 'friends', 'corporate'] as const;
export const HOTELS = ['comfortable', 'upgraded', 'best'] as const;
export const TRANSPORT = ['car', 'coaster', 'suggest'] as const;
/** Where the trip starts: Lahore by default; "other" asks which city. */
export const DEPARTING_FROM = ['lahore', 'islamabad', 'other'] as const;
/** Budget per person, as the Tours budget filter splits it, and "Not sure yet". */
export const PLANNER_BUDGETS = [...BUDGETS, 'not-sure'] as const;

/** The best time to call: details, never stored. */
export const BEST_TIMES = ['morning', 'afternoon', 'evening'] as const;

export type GroupType = (typeof GROUP_TYPES)[number];
export type Hotels = (typeof HOTELS)[number];
export type Transport = (typeof TRANSPORT)[number];
export type DepartingFrom = (typeof DEPARTING_FROM)[number];
export type PlannerBudget = (typeof PLANNER_BUDGETS)[number];
export type BestTime = (typeof BEST_TIMES)[number];

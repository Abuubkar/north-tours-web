import type { Season } from '../content/fields.ts';

/*
 * Date wording for cards and messages. Content dates are YYYY-MM-DD with no time zone, so
 * they're read and shown as calendar dates, never shifted by the visitor's clock.
 */

/** January to December, as content writes them ("Jan") and as the season calendar shows them. */
export const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parts(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return { year, month: SHORT_MONTHS[month - 1], day };
}

/** "12–20 May" in one month, "26 May – 3 Jun" across two. */
export function dateRange(start: string, end: string): string {
  const from = parts(start);
  const to = parts(end);
  if (from.month === to.month && from.year === to.year) return `${from.day}–${to.day} ${to.month}`;
  return `${from.day} ${from.month} – ${to.day} ${to.month}`;
}

const plural = (count: number, noun: string) => `${count} ${noun}${count === 1 ? '' : 's'}`;

/** A trip's length in days alone, as in its page title: "9 days", "1 day". */
export function dayCount(days: number): string {
  return plural(days, 'day');
}

/** "9 days, 8 nights"; a day trip is "1 day". */
export function tripLength(days: number, nights: number): string {
  return nights > 0 ? `${plural(days, 'day')}, ${plural(nights, 'night')}` : plural(days, 'day');
}

/** A departure's dates in a WhatsApp message, with the year: "12–20 May 2027", "26 May – 3 Jun 2027". */
export function messageDateRange(start: string, end: string): string {
  const from = parts(start);
  const to = parts(end);
  if (from.year !== to.year) return `${messageDate(start)} – ${messageDate(end)}`;
  return `${dateRange(start, end)} ${to.year}`;
}

/** The date in a WhatsApp message, with the year: "12 May 2027". */
export function messageDate(date: string): string {
  const { year, month, day } = parts(date);
  return `${day} ${month} ${year}`;
}

/** January to December in full, as read out and in review months. */
export const LONG_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** A review's month, "2026-05" → "May 2026". */
export function monthYear(month: string): string {
  const [year, number] = month.split('-').map(Number);
  return `${LONG_MONTHS[number - 1]} ${year}`;
}

/** A month in short, "2027-06" → "Jun 2027" (the planner's month chips). */
export function shortMonthYear(month: string): string {
  const [year, number] = month.split('-').map(Number);
  return `${SHORT_MONTHS[number - 1]} ${year}`;
}

/** Whole years since `since`, as of `currentYear`: operating since 2014 is 12 years in 2026. */
export function yearsSince(since: number, currentYear: number): number {
  return currentYear - since;
}

/** A best season, Apr to Oct → "April – October", or in short, "Apr – Oct" (a destination's "other valleys" card). */
export function seasonRange({ from, to }: Season, length: 'long' | 'short' = 'long'): string {
  if (length === 'short') return `${from} – ${to}`;
  const long = (month: string) => LONG_MONTHS[SHORT_MONTHS.indexOf(month)];
  return `${long(from)} – ${long(to)}`;
}

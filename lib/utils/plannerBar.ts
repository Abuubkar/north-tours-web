import { messageDate } from './dates.ts';
import type { TripAnswers } from './plannerAnswers.ts';
import { UNSURE } from './plannerOptions.ts';
import { SUMMARY_ROWS, type TripSummary } from './plannerSummary.ts';
import { fillTokens } from './tokens.ts';

/*
 * The trip at a glance (PRD #71): how many of the nine rows are answered (the side column), and
 * the summary bar's one-line label on phones, "Hunza · Jun · 4 people".
 */

/** From this width the planner shows its side column and keeps the progress in the form; below it, the bars. */
export const WIDE_LAYOUT_QUERY = '(width >= 1100px)';

/** How many of the nine trip rows have an answer. */
export function answeredCount(trip: TripSummary): number {
  return SUMMARY_ROWS.filter((row) => trip[row] !== null).length;
}

/** The bar label's words (page copy). */
export type BarWords = {
  /** No destination yet. */
  yourTrip: string;
  /** "Not sure" as the first destination. */
  suggestions: string;
  /** No dates yet. */
  noDates: string;
  /** After the first destination, the others: "+{count}". */
  more: string;
  people: { one: string; other: string };
  /** Destination names by slug. */
  destinations: Readonly<Record<string, string>>;
};

/** "Hunza · Jun · 4 people", "Hunza +1 · Dates? · 2 people", "Your trip · 12 Jun · 1 person". */
export function barLabel(answers: TripAnswers, words: BarWords): string {
  const [first, ...others] = answers.destinations;
  const name = first === undefined ? words.yourTrip : first === UNSURE ? words.suggestions : (words.destinations[first] ?? first);
  const where = others.length > 0 ? `${name} ${fillTokens(words.more, { count: String(others.length) })}` : name;
  const day = answers.dateMode === 'exact' ? answers.from && messageDate(answers.from).split(' ').slice(0, 2).join(' ') : answers.month && shortMonth(answers.month);
  const people = answers.adults + answers.children;
  const count = fillTokens(people === 1 ? words.people.one : words.people.other, { count: String(people) });
  return [where, day || words.noDates, count].join(' · ');
}

/** "2027-06" → "Jun". */
function shortMonth(month: string): string {
  return messageDate(`${month}-01`).split(' ')[1];
}

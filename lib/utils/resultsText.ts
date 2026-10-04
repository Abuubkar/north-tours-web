import { fillTokens } from './tokens.ts';

/** Page copy for a count of trips: "{count} trip" and "{count} trips". */
export type CountWords = { one: string; other: string };

/** "1 trip", "8 trips", "0 trips", from the page's words. */
export function tripsCount(count: number, words: CountWords): string {
  return fillTokens(count === 1 ? words.one : words.other, { count: String(count) });
}

/** "Sorted by {sort} · sold-out trips last", with the sort's label in lower case: "soonest departure". */
export function sortedByText(template: string, sortLabel: string): string {
  return fillTokens(template, { sort: sortLabel.charAt(0).toLowerCase() + sortLabel.slice(1) });
}

import type { ToursCopy } from '../content/pages.ts';
import { monthYear } from './dates.ts';
import { fillTokens } from './tokens.ts';
import type { FilterGroupId } from './tourFilters.ts';

/** Page copy for a count of trips: "{count} trip" and "{count} trips". */
type CountWords = ToursCopy['results']['count'];

/** "1 trip", "8 trips", "0 trips", from the page's words. */
export function tripsCount(count: number, words: CountWords): string {
  return fillTokens(count === 1 ? words.one : words.other, { count: String(count) });
}

/** "Sorted by {sort} · sold-out trips last", with the sort's label in lower case: "soonest departure". */
export function sortedByText(template: string, sortLabel: string): string {
  return fillTokens(template, { sort: sortLabel.charAt(0).toLowerCase() + sortLabel.slice(1) });
}

/** Each option's words: destination names by slug, and the page's labels for the fixed groups. */
export type OptionLabels = { dest: Record<string, string> } & ToursCopy['filters']['options'];

/** Each option's words, from the destinations (name by slug) and the page's labels for the fixed groups. */
export function optionLabels(
  destinations: readonly { slug: string; name: string }[],
  options: ToursCopy['filters']['options'],
): OptionLabels {
  return { dest: Object.fromEntries(destinations.map((d) => [d.slug, d.name])), ...options };
}

/** An option's words: "Hunza", "5–7 days", "Family"; a month is "June 2027". */
export function optionLabel(labels: OptionLabels, group: FilterGroupId, id: string): string {
  if (group === 'month') return monthYear(id);
  return (labels[group] as Record<string, string>)[id];
}

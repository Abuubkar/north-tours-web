/**
 * The section in view, from each section's top (px from the top of the viewport): the last one
 * whose top is above the line, a fraction of the viewport's height (50% for the itinerary's
 * days). Null above the first, so nothing is marked before it.
 */
export function sectionInView<T extends string>(sections: readonly { id: T; top: number }[], viewportHeight: number, line: number): T | null {
  return sections.filter(({ top }) => top < viewportHeight * line).at(-1)?.id ?? null;
}

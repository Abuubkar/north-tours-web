/** The number of columns a grid shows: how many of its items share the first row's top edge. */
export function gridColumns(items: HTMLElement[]): number {
  const tops = items.map((item) => Math.round(item.getBoundingClientRect().top));
  return tops.filter((top) => top === tops[0]).length;
}

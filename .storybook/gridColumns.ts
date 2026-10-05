import { expect } from 'storybook/test';

/** The number of columns a grid shows: how many of its items share the first row's top edge. */
export function gridColumns(items: HTMLElement[]): number {
  const tops = items.map((item) => Math.round(item.getBoundingClientRect().top));
  return tops.filter((top) => top === tops[0]).length;
}

/**
 * The space between a grid's items, in whole pixels: `column` between the first two items side by
 * side, `row` between the first row's bottom and the second row's top (null where there's no such pair).
 */
export function gridGaps(items: HTMLElement[]): { column: number | null; row: number | null } {
  const boxes = items.map((item) => item.getBoundingClientRect());
  const firstRow = boxes.filter((box) => Math.round(box.top) === Math.round(boxes[0].top));
  const next = boxes.find((box) => Math.round(box.top) > Math.round(boxes[0].top));
  return {
    column: firstRow.length > 1 ? Math.round(firstRow[1].left - firstRow[0].right) : null,
    row: next ? Math.round(next.top - Math.max(...firstRow.map((box) => box.bottom))) : null,
  };
}

/** Whether `element` draws any border or outline, or paints a background behind its children's gaps. */
export const drawsLines = (element: Element) => {
  const style = getComputedStyle(element);
  const widths = [style.borderTopWidth, style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth];
  const outline = style.outlineStyle !== 'none' && style.outlineWidth !== '0px';
  return widths.some((width) => width !== '0px') || outline || style.backgroundColor !== 'rgba(0, 0, 0, 0)';
};

/** A card grid's gaps (column and row, as `gridGaps` measures them), with no line on the list or any cell. */
export async function expectCardGaps(list: HTMLElement, items: HTMLElement[], gaps: { column: number | null; row: number | null }) {
  await expect(gridGaps(items)).toEqual(gaps);
  for (const element of [list, ...items]) await expect(drawsLines(element)).toBe(false);
}

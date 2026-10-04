import type { ReactNode } from 'react';

/**
 * pair (the default): the label at the left, the value at the right; with a `note` under the
 * label it takes the room-price look (docs/components.md §1.2 item 19), the label and value
 * larger and in the main text colour.
 */
type Pair = {
  layout?: 'pair';
  /** A line under the label, e.g. "3 per room". */
  note?: string;
};

/**
 * column: the label in a fixed column and the value as text beside it, wrapping under it on
 * narrow screens (a destination's "By road" and "By air"). No note.
 */
type Column = { layout: 'column'; note?: never };

export type KeyValueRowProps = (Pair | Column) & {
  /** What the value is, e.g. "Phone". */
  label: string;
  /** Text or a link, e.g. a tel: link. */
  children: ReactNode;
};

import type { ReactNode } from 'react';

export type KeyValueRowProps = {
  /** What the value is, e.g. "Phone". */
  label: string;
  /**
   * A line under the label, e.g. "3 per room". With it the row takes the room-price look
   * (docs/components.md §1.2 item 19): the label and value larger and in the main text colour.
   */
  note?: string;
  /**
   * pair (the default): the label at the left, the value at the right. column: the label in a
   * fixed column and the value as text beside it, wrapping under it on narrow screens (a
   * destination's "By road" and "By air").
   */
  layout?: 'pair' | 'column';
  /** Text or a link, e.g. a tel: link. */
  children: ReactNode;
};

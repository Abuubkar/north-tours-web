import type { ReactNode } from 'react';

export type KeyValueRowProps = {
  /** What the value is, e.g. "Phone". */
  label: string;
  /**
   * A line under the label, e.g. "3 per room". With it the row takes the room-price look
   * (docs/components.md §1.2 item 19): the label and value larger and in the main text colour.
   */
  note?: string;
  /** Text or a link, e.g. a tel: link. */
  children: ReactNode;
};

import type { ReactNode } from 'react';

export type DropdownProps = {
  /** Text on the trigger chip, e.g. "Destination" or "Sort: Soonest departure". */
  label: ReactNode;
  /** Applied filters shown on the trigger, e.g. 2. */
  count?: number;
  /** The trigger shows its active style when filters are applied. */
  active?: boolean;
  /** The option rows; supplied by the caller (Tours filters, sort). */
  children: ReactNode;
};

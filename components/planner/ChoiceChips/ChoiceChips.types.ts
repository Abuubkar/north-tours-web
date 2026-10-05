import type { ReactNode } from 'react';

export type ChoiceChipsProps<T extends string = string> = {
  id: string;
  label: string;
  hint: string;
  /** Each option's id and words, in order. */
  options: readonly { id: T; label: string }[];
  /** The picked options: any number, or exactly one for a single answer (Departing from). */
  value: readonly T[];
  /** Called with the pressed option; the caller decides whether it adds, removes or replaces it. */
  onPick: (id: T) => void;
  /** Shown under the chips, e.g. the field for another city. */
  children?: ReactNode;
};

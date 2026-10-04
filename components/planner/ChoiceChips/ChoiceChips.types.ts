import type { ReactNode } from 'react';

export type ChoiceChipsProps<T extends string = string> = {
  id: string;
  label: string;
  hint: string;
  /** Each option's id and words, in order. */
  options: readonly { id: T; label: string }[];
  /** The chosen option, or null. */
  value: T | null;
  /** Called with the pressed option; the caller decides whether pressing the chosen one clears it. */
  onPick: (id: T) => void;
  /** Shown under the chips, e.g. the field for another city. */
  children?: ReactNode;
};

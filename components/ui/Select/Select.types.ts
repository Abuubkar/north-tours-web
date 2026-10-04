import type { Ref } from 'react';

export type SelectOption = { value: string; label: string };

export type SelectProps = {
  /** Shown above the select, and its accessible name. */
  label: string;
  /** The first option, shown until one is chosen; it can't be chosen itself. */
  placeholder: string;
  options: SelectOption[];
  /** The chosen option's value, or null for none. */
  value: string | null;
  onChange: (value: string) => void;
  ref?: Ref<HTMLSelectElement>;
};

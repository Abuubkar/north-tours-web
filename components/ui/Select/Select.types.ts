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
  /** Its id, so a form can focus it; one is made up otherwise. */
  id?: string;
  /** Draws the error border and sets `aria-invalid`. */
  invalid?: boolean;
  /** The ids of what describes it, e.g. a group's error message. */
  describedBy?: string;
};

import type { InputHTMLAttributes, Ref } from 'react';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type' | 'aria-invalid'> & {
  /** Text or a date. Dates keep the surface's light or dark picker. */
  type?: 'text' | 'date';
  /** Draws the error border and sets `aria-invalid`; the message comes from `FormField`. */
  invalid?: boolean;
  className?: string;
  ref?: Ref<HTMLInputElement>;
};

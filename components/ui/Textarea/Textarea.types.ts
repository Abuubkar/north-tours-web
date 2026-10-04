import type { TextareaHTMLAttributes } from 'react';

export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'aria-invalid'> & {
  /** Draws the error border and sets `aria-invalid`; the message comes from `FormField`. */
  invalid?: boolean;
  className?: string;
};

import type { TextareaHTMLAttributes } from 'react';

export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & {
  className?: string;
};

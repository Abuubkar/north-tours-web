import type { ReactNode } from 'react';

export type FactCellProps = {
  /** What the fact is, e.g. "Duration". */
  label: string;
  /** The value: text, or a price, rating or dates with their seats. */
  children: ReactNode;
  /** hero: under a photo hero's title. strip: a cell in the quick facts strip. */
  size?: 'hero' | 'strip';
  className?: string;
};

import type { ReactNode } from 'react';

export type ClosingCtaProps = {
  /** The section's anchor, e.g. "book"; About's has none. */
  id?: string;
  headline: string;
  /** A line under the headline; About's has none. */
  lead?: string;
  /** The button pair. */
  actions: ReactNode;
  /** Below the buttons, e.g. the mini trust strip. */
  children?: ReactNode;
};

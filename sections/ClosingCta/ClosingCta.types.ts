import type { ReactNode } from 'react';

export type ClosingCtaProps = {
  /** The section's anchor, e.g. "book". */
  id: string;
  headline: string;
  lead: string;
  /** The button pair. */
  actions: ReactNode;
  /** Below the buttons, e.g. the mini trust strip. */
  children?: ReactNode;
};

import type { ReactNode } from 'react';

export type TourCardsSectionProps = {
  /** The section's anchor, e.g. "departures". */
  id: string;
  copy: {
    headline: string;
    /** Beside the headline, e.g. what the prices mean. */
    note: string;
    allToursLabel: string;
  };
  /** The cards. */
  children: ReactNode;
};

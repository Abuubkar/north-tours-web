import type { ReactNode } from 'react';

export type TourCardsSectionProps = {
  /** The section's anchor, e.g. "departures". */
  id: string;
  copy: {
    headline: string;
    /** Beside the headline, e.g. what the prices mean, with a link to all tours (the Homepage). */
    note?: string;
    allToursLabel?: string;
  };
  /** The cards. */
  children: ReactNode;
};

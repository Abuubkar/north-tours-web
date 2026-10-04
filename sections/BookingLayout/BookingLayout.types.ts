import type { ReactNode } from 'react';

export type BookingLayoutProps = {
  /** Names the aside, e.g. "Book this tour". */
  label: string;
  /** The booking panel. */
  aside: ReactNode;
  /** The main column's sections, from the overview to dates and prices. */
  children: ReactNode;
};

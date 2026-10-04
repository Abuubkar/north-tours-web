import type { ReactNode } from 'react';
import type { Departure } from '@/lib/content/tours';

export type BookingProviderProps = {
  /** The tour's departures still upcoming when the site was built. */
  departures: Departure[];
  /** The build's date (YYYY-MM-DD, Asia/Karachi), so the first render matches the built HTML. */
  builtOn: string;
  /** Everything that reads or changes the booking: the panel, the departure rows, the bar and sheet. */
  children: ReactNode;
};

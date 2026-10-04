import type { DepartureListProps } from '@/components/departures/DepartureList/DepartureList.types';
import type { TourCopy } from '@/lib/content/pages';

export type DatesAndPricesProps = {
  tour: DepartureListProps['tour'];
  copy: TourCopy['dates'];
  settings: DepartureListProps['settings'];
  /** The room note, its tokens filled. */
  roomsNote: string;
};

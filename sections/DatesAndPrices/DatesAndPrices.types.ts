import type { DepartureListProps } from '@/components/departures/DepartureList/DepartureList.types';

export type DatesAndPricesProps = DepartureListProps & {
  /** The room note, its tokens filled. */
  roomsNote: string;
};

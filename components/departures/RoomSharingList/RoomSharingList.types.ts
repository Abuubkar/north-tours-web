import type { TourCopy } from '@/lib/content/pages';
import type { RoomPrices } from '@/lib/content/tours';

export type RoomSharingListProps = {
  /** The heading and each room's name and note. */
  copy: Omit<TourCopy['dates']['rooms'], 'note'>;
  /** The note under the rows, its tokens filled. */
  note: string;
  /** The tour's own prices per person. */
  prices: RoomPrices;
};

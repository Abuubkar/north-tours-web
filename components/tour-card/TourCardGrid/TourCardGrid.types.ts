import type { Settings } from '@/lib/content/settings';
import type { Departure } from '@/lib/content/tours';
import type { TourCardProps } from '../TourCard/TourCard.types';

export type TourCardGridProps = {
  /** Each card's tour and the departure it shows. */
  cards: { tour: TourCardProps['tour']; departure: Departure }[];
  /** 4 on the Homepage; 3 on Tour Detail and Destination (DESIGN.md §5, MIN 280). */
  maxColumns: 3 | 4;
  settings: Pick<Settings, 'contact' | 'whatsapp'>;
};

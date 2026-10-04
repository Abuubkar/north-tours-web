import type { Settings } from '@/lib/content/settings';
import type { Tour } from '@/lib/content/tours';
import type { SeeAllToursCellProps } from '../SeeAllToursCell/SeeAllToursCell.types';
import type { TourCardProps } from '../TourCard/TourCard.types';

export type DestinationToursProps = {
  /** The tours that visit, each with its departures still upcoming when the site was built. */
  tours: (TourCardProps['tour'] & Pick<Tour, 'destinations' | 'tripTypes' | 'departures'>)[];
  /** The build's date (YYYY-MM-DD, Asia/Karachi), so the first render matches the built HTML. */
  builtOn: string;
  /** The last cell, to the Tours page filtered to the destination. */
  seeAll: SeeAllToursCellProps;
  settings: Pick<Settings, 'contact' | 'whatsapp'>;
};

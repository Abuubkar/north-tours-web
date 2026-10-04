import type { Settings } from '@/lib/content/settings';
import type { CardTour } from '@/lib/utils/cardTour';
import type { SeeAllToursCellProps } from '../SeeAllToursCell/SeeAllToursCell.types';

export type DestinationToursProps = {
  /** The tours that visit, with their departures; each card keeps only those still to come as of today. */
  tours: CardTour[];
  /** The build's date (YYYY-MM-DD, Asia/Karachi), so the first render matches the built HTML. */
  builtOn: string;
  /** The last cell, to the Tours page filtered to the destination. */
  seeAll: SeeAllToursCellProps;
  settings: Pick<Settings, 'contact' | 'whatsapp'>;
};

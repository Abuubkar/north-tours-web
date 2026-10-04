import type { TourCardProps } from '@/components/tour-card/TourCard/TourCard.types';
import type { Settings } from '@/lib/content/settings';
import type { Departure } from '@/lib/content/tours';

export type ResultsGridProps = {
  /** Each card's tour and the departure it shows (none when the tour has no dates left), in order. */
  results: { tour: TourCardProps['tour']; departure: Departure | undefined }[];
  settings: Pick<Settings, 'contact' | 'whatsapp'>;
};

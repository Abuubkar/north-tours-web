import type { TourCardProps } from '@/components/tour-card/TourCard/TourCard.types';
import type { Settings } from '@/lib/content/settings';
import type { TourResult } from '@/lib/utils/tourFilters';

export type ResultsGridProps = {
  /** Each card's tour and the departure it shows (none when the tour has no dates left), in order. */
  results: TourResult<TourCardProps['tour']>[];
  settings: Pick<Settings, 'contact' | 'whatsapp'>;
};

import type { TourCardProps } from '@/components/tour-card/TourCard/TourCard.types';
import type { ToursCopy } from '@/lib/content/pages';
import type { Settings } from '@/lib/content/settings';
import type { Tour } from '@/lib/content/tours';

export type TourResultsProps = {
  /** Every tour, each with its departures still upcoming when the site was built. */
  tours: (TourCardProps['tour'] & Pick<Tour, 'departures'>)[];
  /** The build's date (YYYY-MM-DD, Asia/Karachi), so the first render matches the built HTML. */
  builtOn: string;
  copy: Pick<ToursCopy, 'results' | 'sorts'>;
  settings: Pick<Settings, 'contact' | 'whatsapp'>;
};

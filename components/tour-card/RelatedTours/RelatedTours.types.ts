import type { Settings } from '@/lib/content/settings';
import type { Tour } from '@/lib/content/tours';
import type { CardTour } from '@/lib/utils/cardTour';

export type RelatedToursProps = {
  /** The page's tour, left out of the cards. */
  tour: Pick<Tour, 'slug' | 'destinations'>;
  /** Every tour, each with its departures still upcoming when the site was built. */
  tours: CardTour[];
  /** The build's date (YYYY-MM-DD, Asia/Karachi), so the first render matches the built HTML. */
  builtOn: string;
  settings: Pick<Settings, 'contact' | 'whatsapp'>;
};

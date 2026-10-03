import type { Settings } from '@/lib/content/settings';
import type { Tour } from '@/lib/content/tours';

export type UpcomingDeparturesProps = {
  /** Every tour, each with its departures still upcoming when the site was built. */
  tours: Tour[];
  /** The build's date (YYYY-MM-DD, Asia/Karachi), so the first render matches the built HTML. */
  builtOn: string;
  /** How many cards to show. */
  limit: number;
  settings: Pick<Settings, 'contact' | 'whatsapp'>;
};

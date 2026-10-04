import type { ToursCopy } from '@/lib/content/pages';
import type { Settings } from '@/lib/content/settings';

export type TourResultsProps = {
  copy: Pick<ToursCopy, 'results' | 'sorts' | 'empty'>;
  settings: Pick<Settings, 'contact' | 'whatsapp'>;
};

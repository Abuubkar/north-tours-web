import type { ReactNode } from 'react';
import type { ToursCopy } from '@/lib/content/pages';
import type { Settings } from '@/lib/content/settings';
import type { OptionLabels } from '@/lib/utils/resultsText';

export type TourResultsProps = {
  copy: Pick<ToursCopy, 'results' | 'sorts' | 'empty' | 'filters'>;
  /** Each option's words, for the chips above the results on phones. */
  labels: OptionLabels;
  settings: Pick<Settings, 'contact' | 'whatsapp'>;
  /** After the first row of cards, and only when there are any: the private trip banner. */
  banner?: ReactNode;
};

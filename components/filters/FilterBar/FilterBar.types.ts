import type { ToursCopy } from '@/lib/content/pages';
import type { OptionLabels } from '@/lib/utils/resultsText';

export type FilterBarProps = {
  copy: Pick<ToursCopy, 'filters' | 'sortLabel' | 'sorts' | 'results'>;
  /** Each option's words. */
  labels: OptionLabels;
};

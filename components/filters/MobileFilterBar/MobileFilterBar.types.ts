import type { ToursCopy } from '@/lib/content/pages';
import type { OptionLabels } from '@/lib/utils/resultsText';

export type MobileFilterBarProps = {
  copy: Pick<ToursCopy, 'filters' | 'mobile' | 'results' | 'sorts'>;
  /** Each option's words. */
  labels: OptionLabels;
};

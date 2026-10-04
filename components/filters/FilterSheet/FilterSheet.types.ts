import type { ToursCopy } from '@/lib/content/pages';
import type { OptionLabels } from '@/lib/utils/resultsText';

export type FilterSheetProps = {
  open: boolean;
  onClose: () => void;
  copy: Pick<ToursCopy, 'filters' | 'mobile' | 'results'>;
  /** Each option's words. */
  labels: OptionLabels;
};

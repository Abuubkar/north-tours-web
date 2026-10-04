import type { ToursCopy } from '@/lib/content/pages';

export type EmptyResultsProps = {
  copy: ToursCopy['empty'];
  /** "Clear all filters": removes every filter (the sort stays). */
  onClear: () => void;
};

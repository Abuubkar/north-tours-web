import type { ToursCopy } from '@/lib/content/pages';

export type SortSheetProps = {
  open: boolean;
  onClose: () => void;
  /** The sheet's title, "Sort by". */
  title: string;
  /** Each sort's words. */
  sorts: ToursCopy['sorts'];
};

import type { ReactNode } from 'react';
import type { TourCardProps } from '@/components/tour-card/TourCard/TourCard.types';
import type { Settings } from '@/lib/content/settings';
import type { TourResult } from '@/lib/utils/tourFilters';

export type ResultsGridProps = {
  /** Each card's tour and the departure it shows (none when the tour has no dates left), in order. */
  results: TourResult<TourCardProps['tour']>[];
  /** Shown after the first row (the private trip banner). */
  banner?: ReactNode;
  /** The view is in place (after hydration): cards below the fold may rise. */
  ready: boolean;
  /** How many times the visitor has changed the view; after a change nothing rises. */
  changes: number;
  settings: Pick<Settings, 'contact' | 'whatsapp'>;
};

/** One run of cards in the grid: before the banner, or after it. */
export type CardListProps = Omit<ResultsGridProps, 'banner'> & {
  /** The first card's place in the results, for which photos load first. */
  from: number;
  className: string;
};

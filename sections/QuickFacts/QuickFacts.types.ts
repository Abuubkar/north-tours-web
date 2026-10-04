import type { TourCopy } from '@/lib/content/pages';
import type { Tour } from '@/lib/content/tours';

export type QuickFactsProps = {
  copy: TourCopy['quickFacts'];
  tour: Pick<Tour, 'difficulty' | 'transport' | 'bestSeason' | 'departures'>;
  /** From settings: where every trip leaves from. */
  pickupPoint: string;
};

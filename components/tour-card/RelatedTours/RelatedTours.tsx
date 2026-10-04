'use client';

import { useToday } from '@/hooks/useToday';
import { relatedTours } from '@/lib/utils/related';
import { TourCardGrid } from '../TourCardGrid/TourCardGrid';
import type { RelatedToursProps } from './RelatedTours.types';

/** How many other trips the page offers. */
const RELATED = 3;

/**
 * Three other trips: those sharing a destination first, then the soonest (lib/utils/related).
 * Checked again in the browser, so a tour whose dates have passed drops out and the next fills in.
 */
export function RelatedTours({ tour, tours, builtOn, settings }: RelatedToursProps) {
  const cards = relatedTours(tour, tours, useToday(builtOn), RELATED);
  return <TourCardGrid cards={cards} maxColumns={3} settings={settings} />;
}

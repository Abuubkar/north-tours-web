import { seasonRange } from '@/lib/utils/dates';
import { formatElevation } from '@/lib/utils/elevation';
import { FactCell } from '../FactCell/FactCell';
import { FactsRow } from '../FactsRow/FactsRow';
import type { DestinationFactsProps } from './DestinationFacts.types';

/**
 * A destination's hero facts: best season, altitude, the road from Lahore and how many tours
 * visit. With no tour visiting, the Tours fact is left out rather than showing 0.
 */
export function DestinationFacts({ destination, tourCount, copy }: DestinationFactsProps) {
  return (
    <FactsRow>
      <FactCell label={copy.bestSeason}>{seasonRange(destination.bestSeason)}</FactCell>
      <FactCell label={copy.altitude}>{formatElevation(destination.altitude)}</FactCell>
      <FactCell label={copy.fromLahore}>{destination.fromLahore}</FactCell>
      {tourCount > 0 && <FactCell label={copy.tours}>{tourCount}</FactCell>}
    </FactsRow>
  );
}

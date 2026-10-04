'use client';

import { RatingInline } from '@/components/ui/RatingInline/RatingInline';
import { TextLink } from '@/components/ui/TextLink/TextLink';
import { useToday } from '@/hooks/useToday';
import { dateRange, tripLength } from '@/lib/utils/dates';
import { NO_UPCOMING_DATES, shownDeparture } from '@/lib/utils/departures';
import { fromPrice } from '@/lib/utils/price';
import { PriceBlock } from '../../tour/PriceBlock/PriceBlock';
import { SeatsStatus } from '../../tour/SeatsStatus/SeatsStatus';
import { FactCell } from '../FactCell/FactCell';
import { FactsRow } from '../FactsRow/FactsRow';
import type { HeroFactsProps } from './HeroFacts.types';

/**
 * A tour's hero facts: duration, rating, the "from" price and the next departure with its seats
 * (the one a tour card shows: the next with seats, or the next sold-out one when all are full).
 * It works both out again in the browser, so a page built days ago never shows a trip that has
 * left, or a price only a past date had.
 */
export function HeroFacts({ tour, builtOn, copy, whatsappHref }: HeroFactsProps) {
  const today = useToday(builtOn);
  const next = shownDeparture(tour.departures, today);

  return (
    <FactsRow>
      <FactCell label={copy.duration}>{tripLength(tour.days, tour.nights)}</FactCell>
      <FactCell label={copy.rating}>
        <RatingInline score={tour.rating.score} count={tour.rating.count} size="fact" />
      </FactCell>
      <FactCell label={copy.from}>
        <PriceBlock amount={fromPrice(tour, today)} size="fact" from={false} note={copy.fromNote} />
      </FactCell>
      <FactCell label={copy.nextDeparture}>
        {next ? (
          <>
            {dateRange(next.start, next.end)}
            <SeatsStatus departure={next} />
          </>
        ) : (
          <TextLink href={whatsappHref}>{NO_UPCOMING_DATES}</TextLink>
        )}
      </FactCell>
    </FactsRow>
  );
}

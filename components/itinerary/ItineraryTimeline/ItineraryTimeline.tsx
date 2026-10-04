'use client';

import { useMemo } from 'react';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { dayState, ITINERARY_LINE } from '@/lib/utils/itinerary';
import { ItineraryDay } from '../ItineraryDay/ItineraryDay';
import { ItineraryMap } from '../ItineraryMap/ItineraryMap';
import type { ItineraryTimelineProps } from './ItineraryTimeline.types';
import styles from './ItineraryTimeline.module.css';

/**
 * The days as an ordered list on a timeline, with the side map beside them from 1280px. The day
 * being read is the last whose top is above half the screen (#46's scroll-spy rule at 50%,
 * watched with an IntersectionObserver, no scroll listener); its node and the map follow it.
 */
export function ItineraryTimeline({ days, copy, drawing, miniMaps }: ItineraryTimelineProps) {
  const ids = useMemo(() => days.map((_, i) => `day-${i + 1}`), [days]);
  const inView = useScrollSpy(ids, ITINERARY_LINE);
  const active = inView === null ? -1 : ids.indexOf(inView);

  return (
    <div className={styles.layout}>
      <ol className={styles.days}>
        {days.map((day, i) => (
          <ItineraryDay
            key={ids[i]}
            day={day}
            number={i + 1}
            state={dayState(i, active)}
            copy={copy}
            miniMap={miniMaps[i]}
          />
        ))}
      </ol>
      <div className={styles.side}>
        <ItineraryMap drawing={drawing} days={days} active={active} copy={copy.map} />
      </div>
    </div>
  );
}

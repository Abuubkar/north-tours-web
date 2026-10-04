import type { CSSProperties } from 'react';
import { ITINERARY_MAP_FRAME, stopStates } from '@/lib/utils/itinerary';
import { overlayPosition } from '@/lib/utils/projection';
import { sequenceNumber } from '@/lib/utils/sequence';
import { fillTokens } from '@/lib/utils/tokens';
import type { ItineraryMapProps } from './ItineraryMap.types';
import styles from './ItineraryMap.module.css';

const { width, height } = ITINERARY_MAP_FRAME;

/** Places an overlay at a point in the drawing, in percent, so it stays put at any size. */
const placeAt = (x: number, y: number) => overlayPosition({ x, y }, ITINERARY_MAP_FRAME) as CSSProperties;

/**
 * The side map (from 1280px): the route, a line drawn up to the day being read, and each stop
 * as current (gold), visited or still to come; the start is a square. Schematic: no basemap, no
 * borders (CLAUDE.md §8). One image with a short description; the day list carries the content,
 * so its changing header isn't announced.
 */
export function ItineraryMap({ drawing, days, active, copy }: ItineraryMapProps) {
  const start = drawing.stops[0].name;
  const states = stopStates(start, days, active);
  const progress = active < 0 ? 0 : drawing.progress[active];

  return (
    <div className={styles.map} role="img" aria-label={copy.description}>
      <p className={styles.header}>
        <span className={styles.day}>
          {active < 0 ? copy.start : fillTokens(copy.day, { day: sequenceNumber(active + 1), days: sequenceNumber(days.length) })}
        </span>
        <span className={styles.title}>{active < 0 ? start : days[active].title}</span>
      </p>
      <div className={styles.frame} style={{ aspectRatio: `${width} / ${height}` }}>
        <svg className={styles.drawing} viewBox={`0 0 ${width} ${height}`}>
          <path className={styles.route} d={drawing.d} />
          <path className={styles.progress} d={drawing.d} pathLength={1} style={{ strokeDashoffset: 1 - progress }} />
        </svg>
        {drawing.stops.map((stop) => {
          const state = states.get(stop.name) ?? 'upcoming';
          const square = stop.name === start && state !== 'current';
          return (
            <span key={stop.name} className={`${styles.stop} ${styles[stop.label]} ${styles[state]}`} style={placeAt(stop.x, stop.y)}>
              <span className={`${styles.marker} ${square ? styles.square : ''}`} />
              <span className={styles.label}>{stop.name}</span>
            </span>
          );
        })}
      </div>
      <p className={styles.caption}>{copy.caption}</p>
    </div>
  );
}

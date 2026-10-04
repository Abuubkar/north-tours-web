import type { CSSProperties } from 'react';
import { MINI_MAP_FRAME } from '@/lib/utils/itinerary';
import type { DayMiniMapProps } from './DayMiniMap.types';
import styles from './DayMiniMap.module.css';

const { width, height } = MINI_MAP_FRAME;

/** Places an overlay at a point in the drawing, in percent. */
const placeAt = (x: number, y: number) => ({ '--x': `${(x / width) * 100}%`, '--y': `${(y / height) * 100}%` }) as CSSProperties;

/**
 * A thumbnail beside a day (below 1280px): the route, the progress up to that day, the start
 * (a square), and the day's stop as a gold dot, with where the day starts and ends labelled.
 * Hidden from screen readers: the day's text says the same.
 */
export function DayMiniMap({ drawing, day, stops }: DayMiniMapProps) {
  const from = stops[0];
  const to = stops[stops.length - 1];
  const point = (name: string) => drawing.stops.find((stop) => stop.name === name)!;
  const start = drawing.stops[0];

  return (
    <div className={styles.map} aria-hidden="true">
      <svg className={styles.drawing} viewBox={`0 0 ${width} ${height}`}>
        <path className={styles.route} d={drawing.d} />
        <path className={styles.progress} d={drawing.d} pathLength={1} strokeDashoffset={1 - drawing.progress[day]} />
      </svg>
      <span className={styles.start} style={placeAt(start.x, start.y)} />
      <span className={styles.current} style={placeAt(point(to).x, point(to).y)} />
      {from !== to && (
        <span className={`${styles.label} ${styles[point(from).label]}`} style={placeAt(point(from).x, point(from).y)}>
          {from}
        </span>
      )}
      <span className={`${styles.label} ${styles.toLabel} ${styles[point(to).label]}`} style={placeAt(point(to).x, point(to).y)}>
        {to}
      </span>
    </div>
  );
}

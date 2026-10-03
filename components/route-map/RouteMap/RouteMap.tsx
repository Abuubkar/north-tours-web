import type { CSSProperties } from 'react';
import { drawRouteMap, MAP_FRAME } from '@/lib/utils/projection';
import type { RouteMapProps } from './RouteMap.types';
import styles from './RouteMap.module.css';

const { width, height } = MAP_FRAME;

/** Marker and label styles for each kind of stop (DESIGN.md §9). */
const kindClass = {
  start: { marker: styles.startMarker, label: styles.startLabel },
  waypoint: { marker: styles.waypointMarker, label: styles.waypointLabel },
  destination: { marker: styles.destinationMarker, label: styles.destinationLabel },
};

/** Places an overlay at a point in the drawing, in percent, so it stays put at any size. */
const at = (x: number, y: number) => ({ '--x': `${(x / width) * 100}%`, '--y': `${(y / height) * 100}%` }) as CSSProperties;

/**
 * The schematic road map (DESIGN.md §9; CLAUDE.md §8: no borders, no basemap), drawn in full.
 * Roads are SVG; markers and labels are HTML laid over it so they keep their size on phones.
 * Screen readers get one image with a description, then the legend.
 */
export function RouteMap({ map }: RouteMapProps) {
  const { stops, roads, parallels, meridians } = drawRouteMap(map);

  return (
    <figure className={styles.figure}>
      <div className={styles.frame} role="img" aria-label={map.description} data-surface="dark">
        <svg className={styles.drawing} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
          {parallels.map((line) => (
            <line key={line.label} className={styles.grid} x1={0} x2={width} y1={line.at} y2={line.at} />
          ))}
          {meridians.map((line) => (
            <line key={line.label} className={styles.grid} x1={line.at} x2={line.at} y1={0} y2={height} />
          ))}
          {roads.valley.map((d) => (
            <path key={d} className={styles.valleyRoad} d={d} />
          ))}
          {roads.main.map((d) => (
            <path key={d} className={styles.mainRoad} d={d} />
          ))}
        </svg>
        <div aria-hidden="true">
          {parallels.map((line) => (
            <span key={line.label} className={styles.parallel} style={at(0, line.at)}>
              {line.label}
            </span>
          ))}
          {meridians.map((line) => (
            <span key={line.label} className={styles.meridian} style={at(line.at, 0)}>
              {line.label}
            </span>
          ))}
          {stops.map((stop) => (
            <div key={stop.name} className={`${styles.stop} ${styles[stop.label]}`} style={at(stop.x, stop.y)}>
              <span className={`${styles.marker} ${kindClass[stop.kind].marker}`} />
              <span className={`${styles.label} ${kindClass[stop.kind].label}`}>
                {stop.name}
                {stop.kind === 'start' && <span className={styles.startNote}> · {map.startLabel}</span>}
              </span>
            </div>
          ))}
          <p className={styles.caption}>
            <span className={styles.captionTitle}>{map.caption.title}</span>
            <span>{map.caption.note}</span>
          </p>
        </div>
      </div>
      <figcaption className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.mainSwatch} aria-hidden="true" />
          {map.legend.mainRoute}
        </span>
        <span className={styles.legendItem}>
          <span className={styles.valleySwatch} aria-hidden="true" />
          {map.legend.valleyRoads}
        </span>
        <span className={styles.legendItem}>
          <span className={styles.dotSwatch} aria-hidden="true" />
          {map.legend.destinations}
        </span>
      </figcaption>
    </figure>
  );
}

import type { CSSProperties } from 'react';
import { drawRouteMap, MAP_FRAME, overlayPosition } from '@/lib/utils/projection';
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
const placeAt = (x: number, y: number) => overlayPosition({ x, y }, MAP_FRAME) as CSSProperties;

/**
 * The schematic road map (DESIGN.md §9; CLAUDE.md §8: no borders, no basemap), drawn in full.
 * Roads are SVG; markers and labels are HTML laid over it so they keep their size on phones.
 * Screen readers get one image with a description, then the legend; a decorative map is hidden
 * from them and has no legend.
 */
export function RouteMap({ map, decorative = false }: RouteMapProps) {
  const { stops, roads, parallels, meridians } = drawRouteMap(map);
  const image = decorative ? {} : { role: 'img', 'aria-label': map.description };

  return (
    <figure className={styles.figure} aria-hidden={decorative || undefined}>
      <div className={styles.frame} {...image} data-surface="dark" style={{ aspectRatio: `${width} / ${height}` }}>
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
            <span key={line.label} className={styles.parallel} style={placeAt(0, line.at)}>
              {line.label}
            </span>
          ))}
          {meridians.map((line) => (
            <span key={line.label} className={styles.meridian} style={placeAt(line.at, 0)}>
              {line.label}
            </span>
          ))}
          {stops.map((stop) => (
            <div key={stop.name} className={`${styles.stop} ${styles[stop.label]}`} style={placeAt(stop.x, stop.y)}>
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
      {!decorative && (
        <figcaption className={styles.legend}>
          <span className={styles.legendItem}>
            <svg className={styles.swatch} viewBox="0 0 20 2" aria-hidden="true">
              <line className={styles.mainRoad} x1={0} x2={20} y1={1} y2={1} />
            </svg>
            {map.legend.mainRoute}
          </span>
          <span className={styles.legendItem}>
            <svg className={styles.swatch} viewBox="0 0 20 2" aria-hidden="true">
              <line className={styles.valleyRoad} x1={0} x2={20} y1={1} y2={1} />
            </svg>
            {map.legend.valleyRoads}
          </span>
          <span className={styles.legendItem}>
            <span className={styles.dotSwatch} aria-hidden="true" />
            {map.legend.destinations}
          </span>
        </figcaption>
      )}
    </figure>
  );
}

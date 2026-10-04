import { useRef, type CSSProperties } from 'react';
import { usePinLabel } from '@/hooks/usePinLabel';
import { drawPlacesMap, PLACES_MAP_FRAME } from '@/lib/utils/placesMap';
import { overlayPosition } from '@/lib/utils/projection';
import { PlacePin } from '../PlacePin/PlacePin';
import type { PlacesMapProps } from './PlacesMap.types';
import styles from './PlacesMap.module.css';

const { width, height } = PLACES_MAP_FRAME;

const placeAt = (x: number, y: number) => overlayPosition({ x, y }, PLACES_MAP_FRAME) as CSSProperties;

const edgeClass = { top: styles.top, bottom: styles.bottom, left: styles.inside, right: styles.inside };

/**
 * A schematic of the destination's places (CLAUDE.md §8: no roads, borders or basemap): a
 * graticule, a few names for context and a numbered pin for each place. The pins are buttons
 * named by place; the drawing, the names and the caption are hidden from screen readers, since
 * the list beside it carries the content.
 */
export function PlacesMap({ places, labels, caption, lit, picked, mapRef, onPoint, onPick }: PlacesMapProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  usePinLabel(frameRef, lit);
  const drawing = drawPlacesMap(places, labels);

  return (
    <div ref={mapRef} className={styles.map}>
      <div ref={frameRef} className={styles.frame} style={{ aspectRatio: `${width} / ${height}` }}>
        <svg className={styles.drawing} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
          {drawing.parallels.map((line) => (
            <line key={line.label} className={styles.grid} x1={0} x2={width} y1={line.at} y2={line.at} />
          ))}
          {drawing.meridians.map((line) => (
            <line key={line.label} className={styles.grid} x1={line.at} x2={line.at} y1={0} y2={height} />
          ))}
        </svg>
        <div aria-hidden="true">
          {drawing.parallels.map((line) => (
            <span key={line.label} className={styles.parallel} style={placeAt(0, line.at)}>
              {line.label}
            </span>
          ))}
          {drawing.meridians.map((line) => (
            <span key={line.label} className={styles.meridian} style={placeAt(line.at, height)}>
              {line.label}
            </span>
          ))}
          {drawing.labels.map((label) => (
            <span
              key={label.text}
              className={`${styles.context} ${label.edge ? edgeClass[label.edge] : styles.inside} ${label.align === 'end' ? styles.end : ''}`}
              style={placeAt(label.x, label.y)}
              data-context-label=""
            >
              {label.text}
            </span>
          ))}
        </div>
        {drawing.pins.map((pin, i) => (
          <PlacePin
            key={pin.id}
            id={pin.id}
            name={places[i].name}
            number={i + 1}
            position={placeAt(pin.x, pin.y)}
            lit={lit === pin.id}
            pressed={picked === pin.id}
            onPoint={onPoint}
            onPick={onPick}
          />
        ))}
      </div>
      <p className={styles.caption} aria-hidden="true">
        {caption}
      </p>
    </div>
  );
}

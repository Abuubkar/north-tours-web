'use client';

import type { CSSProperties } from 'react';
import { Icon } from '@/components/ui/Icon/Icon';
import { useTicker } from '@/hooks/useTicker';
import { altitudeFont } from './altitudeFont';
import type { AltitudeListProps, AltitudeStripProps } from './AltitudeStrip.types';
import styles from './AltitudeStrip.module.css';

const ICON_SIZE = 16;

/** The places, each a link to its destination: the name, then "▲ 2,438 m" (the ▲ decorative). */
function AltitudeList({ places, duplicate = false, ref }: AltitudeListProps) {
  return (
    <ul ref={ref} className={styles.list} aria-hidden={duplicate || undefined} inert={duplicate}>
      {places.map(({ name, href, altitude }) => (
        <li key={href}>
          <a href={href} className={styles.place}>
            <span className={styles.name}>{name}</span>
            <span>
              <span aria-hidden="true">▲</span> {altitude}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * The Homepage's altitude strip (2f, ADR-0030): a light strip under the header, in the page flow,
 * running slowly through every destination and its altitude. The list is drawn twice for a
 * seamless loop; the copy is hidden and inert, so each place is read and tabbed once. It pauses on
 * hover and while focus is in it, and the button at its end stops it. With reduced motion, or
 * before the script runs, it stands still and scrolls sideways.
 */
export function AltitudeStrip({ places, copy }: AltitudeStripProps) {
  const { moving, running, loopWidth, paused, togglePaused, loopRef, viewportRef, onFocus, onBlur } = useTicker();
  if (places.length === 0) return null;

  return (
    <nav
      aria-label={copy.label}
      data-surface="light"
      data-altitude-strip
      data-running={running || undefined}
      data-paused={paused || undefined}
      className={`${styles.strip} ${altitudeFont.variable}`}
      style={{ '--loop-w': loopWidth ?? undefined } as CSSProperties}
    >
      <div ref={viewportRef} className={styles.viewport} onFocus={onFocus} onBlur={onBlur}>
        <div className={styles.track}>
          <AltitudeList places={places} ref={loopRef} />
          {moving && <AltitudeList places={places} duplicate />}
        </div>
      </div>
      {moving && (
        <button
          type="button"
          className={styles.pause}
          aria-pressed={paused}
          aria-label={copy.pause}
          onClick={togglePaused}
        >
          <Icon name={paused ? 'play' : 'pause'} size={ICON_SIZE} />
        </button>
      )}
    </nav>
  );
}

'use client';

import type { MouseEvent } from 'react';
import { ON_TRIP_ANCHOR } from '@/lib/routes';
import { isPlainClick } from '@/lib/utils/clicks';
import type { OnTripMobileBannerProps } from './OnTripMobileBanner.types';
import styles from './OnTripMobileBanner.module.css';

/**
 * Brings the on-trip panel in below the header (smoothly, unless the visitor prefers reduced
 * motion) and moves focus to "Call travel support", or to the panel's heading while there's no
 * button, so a traveller in a hurry can call at once.
 */
function goToPanel(event: MouseEvent<HTMLAnchorElement>) {
  const panel = document.getElementById(ON_TRIP_ANCHOR);
  if (!panel || !isPlainClick(event)) return;
  event.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  panel.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'start' });
  const target = panel.querySelector<HTMLElement>('a[href^="tel:"]') ?? panel.querySelector<HTMLElement>('h2');
  target?.focus({ preventScroll: true });
}

/**
 * Phones only (below 820px): a light strip at the top of the page, "On a trip right now? Get
 * help ↓", to the on-trip panel. Without JavaScript the link still jumps to it.
 */
export function OnTripMobileBanner({ text }: OnTripMobileBannerProps) {
  return (
    <a href={`#${ON_TRIP_ANCHOR}`} data-surface="light" className={styles.banner} onClick={goToPanel}>
      {text}
      <span aria-hidden="true">↓</span>
    </a>
  );
}

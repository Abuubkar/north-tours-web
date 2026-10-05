import { useEffect, useRef, useState, type FocusEvent } from 'react';
import { useMediaQuery } from './useMediaQuery';

/**
 * The altitude strip's motion (ADR-0016, ADR-0030). The strip runs only when the visitor allows
 * motion and the script has run: until then (built HTML, no JavaScript, reduced motion) it stands
 * still and scrolls sideways. While running, the loop's width is measured, so the CSS animation
 * keeps one speed (`--ticker-speed`) whatever the places' length; the pause button stops it.
 *
 * A place that takes keyboard focus is brought fully into view (the CSS stops the strip while a
 * place shows its focus ring); when focus leaves the places, the strip starts again from the top.
 */
export function useTicker() {
  const moving = useMediaQuery('(prefers-reduced-motion: no-preference)');
  const [paused, setPaused] = useState(false);
  const [loopWidth, setLoopWidth] = useState<number | null>(null);
  const loopRef = useRef<HTMLUListElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loop = loopRef.current;
    if (!moving || !loop) return;
    const observer = new ResizeObserver(() => setLoopWidth(loop.offsetWidth));
    observer.observe(loop);
    return () => observer.disconnect();
  }, [moving]);

  function onFocus(event: FocusEvent<HTMLElement>) {
    const place = event.target;
    if (!place.matches(':focus-visible')) return;
    // After the style change that stops the strip, so the place is measured where it now stands.
    requestAnimationFrame(() => place.scrollIntoView({ block: 'nearest', inline: 'nearest' }));
  }

  function onBlur(event: FocusEvent<HTMLElement>) {
    const viewport = viewportRef.current;
    if (moving && viewport && !viewport.contains(event.relatedTarget)) viewport.scrollLeft = 0;
  }

  return {
    /** The visitor allows motion and the script has run: the copy and the pause button show. */
    moving,
    running: moving && loopWidth !== null,
    loopWidth,
    paused,
    togglePaused: () => setPaused((was) => !was),
    loopRef,
    viewportRef,
    onFocus,
    onBlur,
  };
}

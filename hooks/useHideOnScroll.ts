import { useEffect, useState, type RefObject } from 'react';

/** Past this far down the page, scrolling down hides the bar. */
const HIDE_AFTER = 320;

/** Smaller moves (a trackpad's jitter) are ignored. */
const MIN_MOVE = 4;

/** Whether keyboard focus (not a click's) is inside `element`. */
const keyboardFocusIn = (element: HTMLElement) =>
  element.contains(document.activeElement) && document.activeElement!.matches(':focus-visible');

/**
 * Whether a sticky bar should step out of the way (the Tours filter bars): hidden while the
 * visitor scrolls down past 320px, shown again as soon as they scroll up, and always shown while
 * keyboard focus is inside it (or moves into it). A clicked control keeps focus without a ring,
 * so after a click the bar still hides. The bar's own CSS moves it.
 *
 * It reads the scroll direction with one passive listener, at most once a frame. ADR-0016 rules
 * out scroll listeners for scroll-linked animation; the direction can't come from scroll-driven
 * animations or an IntersectionObserver, and the movement itself is a CSS transition.
 */
export function useHideOnScroll(barRef: RefObject<HTMLElement | null>): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let lastY = window.scrollY;
    let frame = 0;

    function update() {
      frame = 0;
      const y = window.scrollY;
      if (Math.abs(y - lastY) < MIN_MOVE) return;
      const down = y > lastY;
      lastY = y;
      setHidden(down && y > HIDE_AFTER && !keyboardFocusIn(bar!));
    }
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };
    const onFocus = () => setHidden(false);

    window.addEventListener('scroll', onScroll, { passive: true });
    bar.addEventListener('focusin', onFocus);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      bar.removeEventListener('focusin', onFocus);
    };
  }, [barRef]);

  return hidden;
}

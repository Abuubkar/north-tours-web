import { useLayoutEffect, type RefObject } from 'react';

/** Smallest distance kept between the panel and the edge of the viewport. */
const VIEWPORT_MARGIN = 8;

/**
 * For browsers without CSS anchor positioning: places a fixed panel under its anchor while
 * open (above it when there's no room below), kept inside the viewport, following scroll and
 * resize. Does nothing where CSS can.
 */
export function useAnchorFallback(
  panelRef: RefObject<HTMLElement | null>,
  anchorRef: RefObject<HTMLElement | null>,
  open: boolean,
) {
  useLayoutEffect(() => {
    if (!open || CSS.supports('anchor-name: --anchor')) return;

    function place() {
      const panel = panelRef.current;
      const anchor = anchorRef.current;
      if (!panel || !anchor) return;
      const box = anchor.getBoundingClientRect();
      const gap = parseFloat(getComputedStyle(panel).marginTop) || 0;
      const fitsBelow = box.bottom + gap + panel.offsetHeight <= window.innerHeight - VIEWPORT_MARGIN;
      const top = fitsBelow ? box.bottom : box.top - panel.offsetHeight - 2 * gap;
      const maxLeft = window.innerWidth - panel.offsetWidth - VIEWPORT_MARGIN;
      panel.style.top = `${Math.max(VIEWPORT_MARGIN, top)}px`;
      panel.style.left = `${Math.max(VIEWPORT_MARGIN, Math.min(box.left, maxLeft))}px`;
    }

    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, panelRef, anchorRef]);
}

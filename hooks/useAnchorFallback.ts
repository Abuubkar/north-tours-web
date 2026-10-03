import { useLayoutEffect, type RefObject } from 'react';

const EDGE_GAP = 8;

/**
 * For browsers without CSS anchor positioning: places a fixed panel under its anchor while
 * open, kept inside the viewport, and follows scroll and resize. Does nothing where CSS can.
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
      const maxLeft = window.innerWidth - panel.offsetWidth - EDGE_GAP;
      panel.style.top = `${box.bottom}px`;
      panel.style.left = `${Math.max(EDGE_GAP, Math.min(box.left, maxLeft))}px`;
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

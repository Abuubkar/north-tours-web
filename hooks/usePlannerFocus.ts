import { useEffect, type RefObject } from 'react';

/** Where focus goes after Next or Back: the progress heading, or the first field with a problem. */
export type FocusRequest = { target: 'progress' } | { target: 'field'; field: string };

/** Room left between the sticky bars and a field scrolled to (the 16px step of the spacing scale). */
const SCROLL_GAP = 16;

const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';

/** Where the sticky bar stops (under the header) and where its bottom edge sits once stuck. */
function stuckEdges(bar: HTMLElement) {
  const top = parseFloat(getComputedStyle(bar).top) || 0;
  return { top, bottom: top + bar.offsetHeight };
}

const pageTop = (element: Element) => element.getBoundingClientRect().top + window.scrollY;

/**
 * Scrolling and focus after a step change or a failed Next (PRD #71), so components only
 * render. A field's section lands just below the header and the sticky bar (`barRef`), and the
 * field takes focus. After a step change the form's top comes back into view if the visitor had
 * scrolled past it, and the progress heading takes focus. Smooth, or at once with reduced motion.
 * Each new request object runs once.
 */
export function usePlannerFocus(
  request: FocusRequest | null,
  refs: {
    fieldId: (field: string) => string;
    progressRef: RefObject<HTMLElement | null>;
    formRef: RefObject<HTMLElement | null>;
    barRef: RefObject<HTMLElement | null>;
  },
) {
  const { fieldId, progressRef, formRef, barRef } = refs;
  useEffect(() => {
    const bar = barRef.current;
    if (!request || !bar) return;
    const edges = stuckEdges(bar);
    const behavior = scrollBehavior();
    if (request.target === 'field') {
      const field = document.getElementById(fieldId(request.field));
      if (!field) return;
      field.focus({ preventScroll: true });
      const section = field.closest('[data-form-field]') ?? field;
      window.scrollTo({ top: pageTop(section) - edges.bottom - SCROLL_GAP, behavior });
      return;
    }
    const form = formRef.current;
    if (form && form.getBoundingClientRect().top < edges.top) {
      window.scrollTo({ top: pageTop(form) - edges.top, behavior });
    }
    progressRef.current?.focus({ preventScroll: true });
  }, [request, fieldId, progressRef, formRef, barRef]);
}

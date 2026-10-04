import { useEffect, type RefObject } from 'react';

/**
 * Where focus goes: the progress heading (after Next or Back), the first field with a problem
 * (after a failed Next; the phone switch focuses its new field without scrolling), the step's
 * first field (after Edit), or the thank-you heading.
 */
export type FocusRequest =
  | { target: 'progress' }
  | { target: 'field'; field: string; scroll?: false }
  | { target: 'first' }
  | { target: 'success' };

/** Room left between the sticky bars and a field scrolled to (the 16px step of the spacing scale). */
const SCROLL_GAP = 16;

/** The controls a step starts with, for Edit. */
const FOCUSABLE = 'button, input, select, textarea, a[href]';

const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';

/** The sticky header's height, where nothing else sticks under it (the thank-you). */
const headerHeight = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0;

/** Where the sticky bar stops (under the header) and where its bottom edge sits once stuck. */
function stuckEdges(bar: HTMLElement | null) {
  if (!bar) return { top: headerHeight(), bottom: headerHeight() };
  const top = parseFloat(getComputedStyle(bar).top) || 0;
  return { top, bottom: top + bar.offsetHeight };
}

const pageTop = (element: Element) => element.getBoundingClientRect().top + window.scrollY;

/**
 * Scrolling and focus after a step change, a failed Next or an Edit (PRD #71), so components only
 * render. A field's section lands just below the header and the sticky bar (`barRef`) and the
 * field takes focus. After a step change the form's top comes back into view if the visitor had
 * scrolled past it, and the progress heading (or the thank-you) takes focus. Smooth, or at once
 * with reduced motion. Each new request object runs once.
 */
export function usePlannerFocus(
  request: FocusRequest | null,
  refs: {
    fieldId: (field: string) => string;
    progressRef: RefObject<HTMLElement | null>;
    formRef: RefObject<HTMLElement | null>;
    barRef: RefObject<HTMLElement | null>;
    bodyRef: RefObject<HTMLElement | null>;
    successRef: RefObject<HTMLElement | null>;
  },
) {
  const { fieldId, progressRef, formRef, barRef, bodyRef, successRef } = refs;
  useEffect(() => {
    if (!request) return;
    const edges = stuckEdges(barRef.current);
    const behavior = scrollBehavior();

    if (request.target === 'field' || request.target === 'first') {
      const field =
        request.target === 'field' ? document.getElementById(fieldId(request.field)) : bodyRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      if (!field) return;
      field.focus({ preventScroll: true });
      if (request.target === 'field' && request.scroll === false) return;
      const section = field.closest('[data-form-field]') ?? field;
      window.scrollTo({ top: pageTop(section) - edges.bottom - SCROLL_GAP, behavior });
      return;
    }

    const form = formRef.current;
    if (form && form.getBoundingClientRect().top < edges.top) {
      window.scrollTo({ top: pageTop(form) - edges.top, behavior });
    }
    (request.target === 'success' ? successRef : progressRef).current?.focus({ preventScroll: true });
  }, [request, fieldId, progressRef, formRef, barRef, bodyRef, successRef]);
}

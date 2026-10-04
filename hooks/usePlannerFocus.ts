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

/** The first of these that's on the page and shown (the progress and its bar live in one of two places, by width). */
const shown = <T extends HTMLElement>(refs: readonly RefObject<T | null>[]) =>
  refs.map((ref) => ref.current).find((element) => element !== null && element.getClientRects().length > 0) ?? null;

/**
 * Scrolling and focus after a step change, a failed Next or an Edit (PRD #71), so components only
 * render. A field's section lands just below the header and the sticky bar (whichever is shown) and the
 * field takes focus. After a step change the form's top comes back into view if the visitor had
 * scrolled past it, and the progress heading (or the thank-you) takes focus. Smooth, or at once
 * with reduced motion. Each new request object runs once.
 */
export function usePlannerFocus(
  request: FocusRequest | null,
  refs: {
    fieldId: (field: string) => string;
    /** The progress heading: in the form column from 1100px, in the summary bar below it. */
    progressRefs: readonly RefObject<HTMLElement | null>[];
    formRef: RefObject<HTMLElement | null>;
    /** The sticky bar: the progress bar from 1100px, the summary bar below it. */
    barRefs: readonly RefObject<HTMLElement | null>[];
    bodyRef: RefObject<HTMLElement | null>;
    successRef: RefObject<HTMLElement | null>;
  },
) {
  const { fieldId, progressRefs, formRef, barRefs, bodyRef, successRef } = refs;
  useEffect(() => {
    if (!request) return;
    const bar = shown(barRefs);
    const edges = stuckEdges(bar);
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

    // The form's top lands under the bar: at the bar's top when the bar sticks inside the form
    // (from 1100px), below it when the bar sits above the form (the summary bar).
    const form = formRef.current;
    const under = form && bar && !form.contains(bar) ? edges.bottom : edges.top;
    if (form && form.getBoundingClientRect().top < under) {
      window.scrollTo({ top: pageTop(form) - under, behavior });
    }
    (request.target === 'success' ? successRef.current : shown(progressRefs))?.focus({ preventScroll: true });
  }, [request, fieldId, progressRefs, formRef, barRefs, bodyRef, successRef]);
}

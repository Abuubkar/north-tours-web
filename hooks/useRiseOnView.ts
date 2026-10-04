import { useEffect, type RefObject } from 'react';

/** How much of a card must be in view before it rises (as in the design). */
const THRESHOLD = 0.12;

/**
 * Cards rise (M4, DESIGN.md §10, ADR-0016): once, for the children of `listRef` that are still
 * below the fold when the page loads. Each gets `data-rise="below"` (its CSS offsets it), then
 * `data-rise="in"` the first time it comes into view, with its column in `--rise-column` for the stagger.
 * Cards in view at load are never touched, nor anything with reduced motion, so nothing is
 * hidden if the script fails. A list that settles after hydration (Tours, from its link) passes
 * `ready` once it has, so "below the fold" is judged on the cards it ends up showing, and counts
 * the visitor's `changes` to it: after a change, any card still waiting to rise is simply in place.
 */
export function useRiseOnView(listRef: RefObject<HTMLElement | null>, ready = true, changes = 0) {
  useEffect(() => {
    const list = listRef.current;
    if (!ready || !list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = [...list.children] as HTMLElement[];
    const below = cards.filter((card) => card.getBoundingClientRect().top > window.innerHeight);
    if (below.length === 0) return;
    // Cards in the first row share its top edge; that count is the number of columns.
    const columns = cards.filter((card) => card.offsetTop === cards[0].offsetTop).length;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.rise = 'in';
          observer.unobserve(entry.target);
        }
      },
      { threshold: THRESHOLD },
    );
    for (const card of below) {
      card.style.setProperty('--rise-column', String(cards.indexOf(card) % columns));
      card.dataset.rise = 'below';
      observer.observe(card);
    }
    return () => observer.disconnect();
  }, [listRef, ready]);

  useEffect(() => {
    if (changes === 0) return;
    for (const card of listRef.current?.querySelectorAll('[data-rise="below"]') ?? []) card.removeAttribute('data-rise');
  }, [listRef, changes]);
}

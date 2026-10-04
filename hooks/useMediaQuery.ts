import { useSyncExternalStore } from 'react';

export function useMediaQuery(query: string): boolean;
export function useMediaQuery(query: string, whileHydrating: null): boolean | null;

/**
 * Whether a media query matches, kept up to date as it changes. While hydrating it answers
 * `whileHydrating` (false by default), so the first render matches the built HTML; the browser's
 * answer follows straight after. Pass null to render for both answers until then (CSS picks).
 */
export function useMediaQuery(query: string, whileHydrating: boolean | null = false): boolean | null {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => whileHydrating,
  );
}

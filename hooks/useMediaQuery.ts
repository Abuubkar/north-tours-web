import { useSyncExternalStore } from 'react';

/**
 * Whether a media query matches, kept up to date as it changes. False while hydrating, so the
 * first render matches the built HTML; the browser's answer follows straight after.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

import { useCallback, useState } from 'react';
import { steppedIndex } from '@/lib/utils/guideProfile';

/**
 * Which guide's profile is shown on About (PRD #78), by their place in the grid, or null while
 * none is. Previous and next step through the team, wrapping at both ends; `stepped` says the
 * visitor has moved on from the guide they opened, so the new guide is announced.
 */
export function useGuideProfile(total: number) {
  const [shown, setShown] = useState<number | null>(null);
  const [stepped, setStepped] = useState(false);

  const open = useCallback((index: number) => {
    setShown(index);
    setStepped(false);
  }, []);

  const step = useCallback(
    (direction: 1 | -1) => {
      setShown((index) => (index === null ? index : steppedIndex(index, direction, total)));
      setStepped(true);
    },
    [total],
  );

  const close = useCallback(() => {
    setShown(null);
    setStepped(false);
  }, []);

  return { shown, stepped, open, step, close };
}

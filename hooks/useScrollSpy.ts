import { useEffect, useState } from 'react';
import { sectionInView, SPY_LINE } from '@/lib/utils/nav';

/**
 * Which of the sections with these ids is in view (lib/utils/nav `sectionInView`), updated as
 * the page scrolls. An IntersectionObserver watches the band above the line (40% of the
 * viewport unless given), so the work happens only when a section crosses it, not on every
 * scroll event. Null with no ids. `ids` must be a stable array (a constant, or memoised).
 */
export function useScrollSpy<T extends string>(ids: readonly T[], line: number = SPY_LINE): T | null {
  const [active, setActive] = useState<T | null>(null);

  useEffect(() => {
    const sections = ids.flatMap((id) => document.getElementById(id) ?? []);
    if (sections.length === 0) return;
    const update = () =>
      setActive(
        sectionInView(
          sections.map((section) => ({ id: section.id as T, top: section.getBoundingClientRect().top })),
          window.innerHeight,
          line,
        ),
      );
    // The root ends at the line: a section enters or leaves it as its top crosses the line.
    const observer = new IntersectionObserver(update, { rootMargin: `0px 0px -${(1 - line) * 100}% 0px` });
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [ids, line]);

  return ids.length === 0 ? null : active;
}

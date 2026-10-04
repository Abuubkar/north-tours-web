'use client';

import { useRef, useState } from 'react';
import { Chip } from '@/components/ui/Chip/Chip';
import { useHideOnScroll } from '@/hooks/useHideOnScroll';
import { useTourFilters } from '@/hooks/useTourFilters';
import { tripsCount } from '@/lib/utils/resultsText';
import { activeFilters } from '@/lib/utils/tourFilters';
import { FilterSheet } from '../FilterSheet/FilterSheet';
import { SortSheet } from '../SortSheet/SortSheet';
import type { MobileFilterBarProps } from './MobileFilterBar.types';
import styles from './MobileFilterBar.module.css';

/**
 * Below 820px: the count, "Filters" and "Sort" in a slim frosted bar under the header, opening
 * their bottom sheets. It steps out of the way while scrolling down, like the desktop bar.
 */
export function MobileFilterBar({ copy, labels }: MobileFilterBarProps) {
  const { filters, results, filtersButtonRef } = useTourFilters();
  const [sheet, setSheet] = useState<'filters' | 'sort' | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const hidden = useHideOnScroll(barRef);
  const picked = activeFilters(filters).length;

  return (
    <div ref={barRef} data-surface="dark" className={`${styles.bar} ${hidden ? styles.hidden : ''}`}>
      <p className={styles.count}>{tripsCount(results.length, copy.results.count)}</p>
      <div className={styles.actions}>
        <Chip
          ref={filtersButtonRef}
          variant="trigger"
          expanded={sheet === 'filters'}
          active={picked > 0}
          count={picked || undefined}
          aria-haspopup="dialog"
          onClick={() => setSheet('filters')}
        >
          {copy.mobile.filters}
        </Chip>
        <Chip variant="trigger" expanded={sheet === 'sort'} aria-haspopup="dialog" onClick={() => setSheet('sort')}>
          {copy.mobile.sort}
        </Chip>
      </div>
      <FilterSheet open={sheet === 'filters'} onClose={() => setSheet(null)} copy={copy} labels={labels} />
      <SortSheet open={sheet === 'sort'} onClose={() => setSheet(null)} title={copy.mobile.sortTitle} sorts={copy.sorts} />
    </div>
  );
}

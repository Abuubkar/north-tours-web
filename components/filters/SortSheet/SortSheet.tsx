'use client';

import { Sheet } from '@/components/ui/Sheet/Sheet';
import { useTourFilters } from '@/hooks/useTourFilters';
import { SORTS } from '@/lib/utils/tourFilters';
import { OptionRow } from '../OptionRow/OptionRow';
import type { SortSheetProps } from './SortSheet.types';
import styles from './SortSheet.module.css';

/** Below 820px, the four sorts in a bottom sheet; picking one sorts the trips and closes it. */
export function SortSheet({ open, onClose, title, sorts }: SortSheetProps) {
  const { filters, setSort } = useTourFilters();
  return (
    <Sheet open={open} onClose={onClose} title={title} handle>
      <ul className={styles.options}>
        {SORTS.map((sort) => (
          <li key={sort} className={styles.option}>
            <OptionRow
              label={sorts[sort]}
              pressed={filters.sort === sort}
              indicator="radio"
              size="sheet"
              onClick={() => {
                setSort(sort);
                onClose();
              }}
            />
          </li>
        ))}
      </ul>
    </Sheet>
  );
}

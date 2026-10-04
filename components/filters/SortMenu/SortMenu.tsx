'use client';

import { useImperativeHandle, useRef } from 'react';
import { Dropdown } from '@/components/ui/Dropdown/Dropdown';
import type { DropdownHandle } from '@/components/ui/Dropdown/Dropdown.types';
import { useTourFilters } from '@/hooks/useTourFilters';
import { SORTS } from '@/lib/utils/tourFilters';
import { OptionRow } from '../OptionRow/OptionRow';
import type { SortMenuProps } from './SortMenu.types';
import styles from './SortMenu.module.css';

/** "Sort: Soonest departure": a dropdown of the four sorts that closes as soon as one is picked. */
export function SortMenu({ label, sorts, ref }: SortMenuProps) {
  const { filters, setSort } = useTourFilters();
  const dropdown = useRef<DropdownHandle>(null);
  useImperativeHandle(ref, () => ({ close: () => dropdown.current?.close() }), []);

  return (
    <Dropdown
      ref={dropdown}
      label={
        <>
          <span className={styles.prefix}>{label}</span> {sorts[filters.sort]}
        </>
      }
    >
      <ul className={styles.options}>
        {SORTS.map((sort) => (
          <li key={sort}>
            <OptionRow
              label={sorts[sort]}
              pressed={filters.sort === sort}
              indicator="radio"
              onClick={() => {
                setSort(sort);
                dropdown.current?.close();
              }}
            />
          </li>
        ))}
      </ul>
    </Dropdown>
  );
}

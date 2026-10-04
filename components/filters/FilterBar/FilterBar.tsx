'use client';

import { useEffect, useRef } from 'react';
import type { DropdownHandle } from '@/components/ui/Dropdown/Dropdown.types';
import { useHideOnScroll } from '@/hooks/useHideOnScroll';
import { useTourFilters } from '@/hooks/useTourFilters';
import { activeFilters, LIST_GROUPS, type FilterGroupId } from '@/lib/utils/tourFilters';
import { ActiveFilterChips } from '../ActiveFilterChips/ActiveFilterChips';
import { FilterGroup } from '../FilterGroup/FilterGroup';
import { SortMenu } from '../SortMenu/SortMenu';
import type { FilterBarProps } from './FilterBar.types';
import styles from './FilterBar.module.css';

const GROUPS: FilterGroupId[] = [...LIST_GROUPS, 'month'];

/**
 * From 820px: the five filters, the picked ones as chips, and the sort, in a frosted bar that
 * sticks under the header. It steps out of the way while the visitor scrolls down and comes back
 * on the way up; hiding closes any open dropdown, and it stays shown while focus is inside it.
 */
export function FilterBar({ copy, labels }: FilterBarProps) {
  const { filters } = useTourFilters();
  const barRef = useRef<HTMLElement>(null);
  const hidden = useHideOnScroll(barRef);
  // Every dropdown on the bar (the filters by group, and the sort), so hiding can close the open one.
  const dropdowns = useRef(new Map<string, DropdownHandle | null>());

  useEffect(() => {
    if (hidden) for (const dropdown of dropdowns.current.values()) dropdown?.close();
  }, [hidden]);

  return (
    <section
      ref={barRef}
      aria-label={copy.filters.label}
      data-surface="dark"
      className={`${styles.bar} ${hidden ? styles.hidden : ''}`}
    >
      <div className={styles.row}>
        {GROUPS.map((group) => (
          <FilterGroup
            key={group}
            ref={(dropdown) => {
              dropdowns.current.set(group, dropdown);
            }}
            group={group}
            label={copy.filters.groups[group]}
            labels={labels}
            countWords={copy.results.count}
          />
        ))}
        {activeFilters(filters).length > 0 && <span className={styles.divider} aria-hidden="true" />}
        <ActiveFilterChips labels={labels} clearLabel={copy.filters.clearAll} />
        <div className={styles.sort}>
          <SortMenu
            ref={(dropdown) => {
              dropdowns.current.set('sort', dropdown);
            }}
            label={copy.sortLabel}
            sorts={copy.sorts}
          />
        </div>
      </div>
    </section>
  );
}

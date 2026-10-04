'use client';

import { useEffect, useRef } from 'react';
import { Chip } from '@/components/ui/Chip/Chip';
import { TextLink } from '@/components/ui/TextLink/TextLink';
import { useTourFilters } from '@/hooks/useTourFilters';
import { optionLabel } from '@/lib/utils/resultsText';
import { activeFilters } from '@/lib/utils/tourFilters';
import type { ActiveFilterChipsProps, FocusTarget } from './ActiveFilterChips.types';
import styles from './ActiveFilterChips.module.css';

/**
 * The picked filters as removable chips, then "Clear all" (the sort stays). Removing a chip moves
 * focus to the next chip, or the one before; when none are left, and after "Clear all", focus
 * moves to where the results start. Nothing shows with no filters picked.
 */
export function ActiveFilterChips({ labels, clearLabel }: ActiveFilterChipsProps) {
  const { filters, toggle, clearAll, focusResults } = useTourFilters();
  const chips = activeFilters(filters);
  const listRef = useRef<HTMLUListElement>(null);
  const focusAfter = useRef<FocusTarget>(null);

  // After the chips re-render: the chip that took the removed one's place, or the results.
  useEffect(() => {
    const target = focusAfter.current;
    if (target === null) return;
    focusAfter.current = null;
    if (target === 'results') focusResults();
    else listRef.current?.querySelectorAll('button')[target]?.focus();
  });

  if (chips.length === 0) return null;

  return (
    <div className={styles.chips}>
      <ul ref={listRef} className={styles.list}>
        {chips.map(({ group, id }, index) => (
          <li key={`${group}-${id}`}>
            <Chip
              variant="removable"
              onRemove={() => {
                // The next chip slides into this one's place; removing the last leaves the one before.
                focusAfter.current = chips.length === 1 ? 'results' : Math.min(index, chips.length - 2);
                toggle(group, id);
              }}
            >
              {optionLabel(labels, group, id)}
            </Chip>
          </li>
        ))}
      </ul>
      <TextLink
        variant="button"
        onClick={() => {
          focusAfter.current = 'results';
          clearAll();
        }}
      >
        {clearLabel}
      </TextLink>
    </div>
  );
}

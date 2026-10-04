'use client';

import { useId } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { Chip } from '@/components/ui/Chip/Chip';
import { Sheet } from '@/components/ui/Sheet/Sheet';
import { TextLink } from '@/components/ui/TextLink/TextLink';
import { useTourFilters } from '@/hooks/useTourFilters';
import { optionLabel, showTripsLabel, tripsCount } from '@/lib/utils/resultsText';
import { LIST_GROUPS, type FilterGroupId } from '@/lib/utils/tourFilters';
import type { FilterSheetProps } from './FilterSheet.types';
import styles from './FilterSheet.module.css';

const GROUPS: FilterGroupId[] = [...LIST_GROUPS, 'month'];

/**
 * Below 820px, the filters in a bottom sheet. Each tap applies at once: the results, the address
 * bar, the counts and the footer's button follow. "Show 2 trips" only closes the sheet; with
 * nothing matching it reads "No trips match" and still closes it (never a disabled look).
 */
export function FilterSheet({ open, onClose, copy, labels }: FilterSheetProps) {
  const { filters, options, counts, results, toggle, clearAll } = useTourFilters();
  const id = useId();
  const picked = (group: FilterGroupId): readonly string[] =>
    group === 'month' ? (filters.month ? [filters.month] : []) : filters[group];

  const footer = (
    <>
      <TextLink variant="button" onClick={clearAll}>{copy.filters.clearAll}</TextLink>
      <Button variant={results.length > 0 ? 'primary' : 'secondary'} className={styles.show} onClick={onClose}>
        {showTripsLabel(results.length, copy.mobile.show, copy.mobile.noMatch)}
      </Button>
    </>
  );

  return (
    <Sheet open={open} onClose={onClose} title={copy.mobile.filtersTitle} handle footer={footer}>
      {GROUPS.map((group) => (
        <div key={group} role="group" aria-labelledby={`${id}-${group}`} className={styles.group}>
          <p id={`${id}-${group}`} className={styles.label}>
            {copy.filters.groups[group]}
          </p>
          <div className={styles.options}>
            {options[group].map((option) => {
              const label = optionLabel(labels, group, option);
              const count = counts[group][option];
              return (
                <Chip
                  key={option}
                  variant="toggle"
                  pressed={picked(group).includes(option)}
                  count={count}
                  aria-label={`${label}, ${tripsCount(count, copy.results.count)}`}
                  onClick={() => toggle(group, option)}
                >
                  {label}
                </Chip>
              );
            })}
          </div>
        </div>
      ))}
    </Sheet>
  );
}

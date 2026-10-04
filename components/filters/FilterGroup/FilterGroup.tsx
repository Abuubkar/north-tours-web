'use client';

import { Dropdown } from '@/components/ui/Dropdown/Dropdown';
import { useTourFilters } from '@/hooks/useTourFilters';
import { optionLabel, tripsCount } from '@/lib/utils/resultsText';
import { OptionRow } from '../OptionRow/OptionRow';
import type { FilterGroupProps } from './FilterGroup.types';
import styles from './FilterGroup.module.css';

/**
 * One filter on the desktop bar: a dropdown of options, each with how many trips it would show.
 * It stays open while options are ticked. Month takes one at a time: another replaces it, and
 * picking it again clears it.
 */
export function FilterGroup({ group, label, labels, countWords, ref }: FilterGroupProps) {
  const { filters, options, counts, toggle } = useTourFilters();
  const picked: readonly string[] = group === 'month' ? (filters.month ? [filters.month] : []) : filters[group];

  return (
    <Dropdown ref={ref} label={label} active={picked.length > 0} count={picked.length || undefined}>
      <ul className={styles.options}>
        {options[group].map((id) => {
          const option = optionLabel(labels, group, id);
          const count = counts[group][id];
          return (
            <li key={id}>
              <OptionRow
                label={option}
                count={count}
                name={`${option}, ${tripsCount(count, countWords)}`}
                pressed={picked.includes(id)}
                indicator={group === 'month' ? 'radio' : 'check'}
                onClick={() => toggle(group, id)}
              />
            </li>
          );
        })}
      </ul>
    </Dropdown>
  );
}

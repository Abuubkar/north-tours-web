'use client';

import { useMemo } from 'react';
import { IconButton } from '@/components/ui/IconButton/IconButton';
import { Input } from '@/components/ui/Input/Input';
import { useHelp } from '@/hooks/useHelp';
import { matchingAnswers, resultLine, searchTerms } from '@/lib/utils/helpSearch';
import type { HelpSearchProps } from './HelpSearch.types';
import styles from './HelpSearch.module.css';

const FIELD_ID = 'help-search';

/**
 * Help's search, in the header: a search landmark with a hidden label, the 52px field and, while
 * there's a query, "Clear search" inside its end. Escape clears it too, and focus stays in the
 * field; Enter does nothing (there's no form). The result line under it is a polite live region
 * that settles once typing stops, so a screen reader hears the count once. Without JavaScript the
 * field is there and does nothing.
 */
export function HelpSearch({ copy }: HelpSearchProps) {
  const { query, setQuery, settledQuery, clear, inputRef, categories } = useHelp();
  const line = useMemo(() => {
    const terms = searchTerms(settledQuery);
    return terms.length === 0 ? '' : resultLine(copy.results, matchingAnswers(categories, terms).size, settledQuery);
  }, [settledQuery, categories, copy.results]);

  return (
    <div role="search" className={styles.search}>
      <label htmlFor={FIELD_ID} className={styles.label}>
        {copy.label}
      </label>
      <div className={styles.field}>
        <Input
          ref={inputRef}
          id={FIELD_ID}
          type="search"
          value={query}
          placeholder={copy.placeholder}
          autoComplete="off"
          className={styles.input}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Escape') return;
            event.preventDefault();
            clear();
          }}
        />
        {query !== '' && <IconButton icon="close" label={copy.clear} onClick={clear} className={styles.clear} />}
      </div>
      <p aria-live="polite" className={styles.result}>
        {line}
      </p>
    </div>
  );
}

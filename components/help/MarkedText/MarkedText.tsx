import { highlight } from '@/lib/utils/helpSearch';
import type { MarkedTextProps } from './MarkedText.types';
import styles from './MarkedText.module.css';

/** Text with each stretch the search matched in a <mark>, keeping its case and accents. */
export function MarkedText({ text, terms }: MarkedTextProps) {
  if (terms.length === 0) return text;
  return highlight(text, terms).map((part, i) =>
    part.mark ? (
      <mark key={i} className={styles.mark}>
        {part.text}
      </mark>
    ) : (
      part.text
    ),
  );
}

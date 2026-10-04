import { CheckboxIndicator } from '@/components/ui/CheckboxIndicator/CheckboxIndicator';
import type { OptionRowProps } from './OptionRow.types';
import styles from './OptionRow.module.css';

/**
 * A filter or sort option in a dropdown (or, on phones, the sort sheet): a toggle button (`aria-pressed`) with a decorative
 * checkbox or radio, the label and, for filters, its count.
 */
export function OptionRow({ label, count, name, pressed, indicator, onClick, size = 'menu' }: OptionRowProps) {
  return (
    <button type="button" aria-pressed={pressed} aria-label={name} className={`${styles.row} ${styles[size]}`} onClick={onClick}>
      {indicator === 'check' ? <CheckboxIndicator checked={pressed} /> : <span className={styles.radio} aria-hidden="true" />}
      <span className={styles.label}>{label}</span>
      {count !== undefined && <span className={styles.count}>{count}</span>}
    </button>
  );
}

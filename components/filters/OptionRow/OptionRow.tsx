import { Icon } from '@/components/ui/Icon/Icon';
import type { OptionRowProps } from './OptionRow.types';
import styles from './OptionRow.module.css';

const CHECK_SIZE = 12;

/**
 * A filter or sort option in a dropdown (or, on phones, the sort sheet): a toggle button (`aria-pressed`) with a decorative
 * checkbox or radio, the label and, for filters, its count.
 */
export function OptionRow({ label, count, name, pressed, indicator, onClick, size = 'menu' }: OptionRowProps) {
  return (
    <button type="button" aria-pressed={pressed} aria-label={name} className={`${styles.row} ${styles[size]}`} onClick={onClick}>
      <span className={`${styles.indicator} ${styles[indicator]}`} aria-hidden="true">
        {pressed && indicator === 'check' && <Icon name="check" size={CHECK_SIZE} />}
      </span>
      <span className={styles.label}>{label}</span>
      {count !== undefined && <span className={styles.count}>{count}</span>}
    </button>
  );
}

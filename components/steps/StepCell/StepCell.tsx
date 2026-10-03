import { Icon } from '@/components/ui/Icon/Icon';
import type { StepCellProps } from './StepCell.types';
import styles from './StepCell.module.css';

const ARROW_SIZE = 20;

/**
 * One step in an ordered list: the large numeral (a real sequence, but the list already numbers
 * it for screen readers, so it's hidden), a decorative arrow on to the next step, the title and text.
 */
export function StepCell({ number, title, text, arrow }: StepCellProps) {
  return (
    <li className={styles.step}>
      <div className={styles.top} aria-hidden="true">
        <span className={styles.numeral}>{String(number).padStart(2, '0')}</span>
        {arrow && <Icon name="arrowRight" size={ARROW_SIZE} className={styles.arrow} />}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
    </li>
  );
}

import { Icon } from '../Icon/Icon';
import type { CheckboxIndicatorProps } from './CheckboxIndicator.types';
import styles from './CheckboxIndicator.module.css';

const CHECK_SIZE = 12;

/**
 * The 18px checkbox square inside an option that is itself the control (a filter row, a planner
 * destination card): decorative, since the option's `aria-pressed` says whether it's on.
 */
export function CheckboxIndicator({ checked }: CheckboxIndicatorProps) {
  return (
    <span className={`${styles.indicator} ${checked ? styles.checked : ''}`} aria-hidden="true">
      {checked && <Icon name="check" size={CHECK_SIZE} />}
    </span>
  );
}

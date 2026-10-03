import { IconButton } from '../IconButton/IconButton';
import type { StepperProps } from './Stepper.types';
import styles from './Stepper.module.css';

/**
 * − value +, kept within min and max. At a limit the matching button is aria-disabled
 * rather than disabled, so keyboard focus stays on it instead of jumping to the page.
 */
export function Stepper({ label, value, min, max, onChange, decreaseLabel, increaseLabel }: StepperProps) {
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <div role="group" aria-label={label} className={styles.stepper}>
      <IconButton
        icon="minus"
        label={decreaseLabel}
        aria-disabled={atMin}
        onClick={() => !atMin && onChange(value - 1)}
      />
      <output aria-live="polite" className={styles.value}>
        {value}
      </output>
      <IconButton
        icon="plus"
        label={increaseLabel}
        aria-disabled={atMax}
        onClick={() => !atMax && onChange(value + 1)}
      />
    </div>
  );
}

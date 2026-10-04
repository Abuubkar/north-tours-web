import { Stepper } from '@/components/ui/Stepper/Stepper';
import type { CounterRowProps } from './CounterRow.types';
import styles from './CounterRow.module.css';

/** A count in "Group size": the label over its hint, and the stepper at the right (a group named by the label). */
export function CounterRow({ label, hint, value, min, max, onChange, decreaseLabel, increaseLabel }: CounterRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.text}>
        <span className={styles.label}>{label}</span>
        <span className={styles.hint}>{hint}</span>
      </div>
      <Stepper label={label} value={value} min={min} max={max} onChange={onChange} decreaseLabel={decreaseLabel} increaseLabel={increaseLabel} />
    </div>
  );
}

import { useId } from 'react';
import { Icon } from '../Icon/Icon';
import type { SelectProps } from './Select.types';
import styles from './Select.module.css';

const CARET_SIZE = 16;

/**
 * A native <select> with its label: the phone's own picker, keyboard and screen reader support.
 * The border strengthens on hover and once a value is chosen.
 */
export function Select({ label, placeholder, options, value, onChange, ref }: SelectProps) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.control}>
        <select
          ref={ref}
          id={id}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          className={`${styles.select} ${value ? styles.chosen : ''}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon name="caret" size={CARET_SIZE} className={styles.caret} />
      </div>
    </div>
  );
}

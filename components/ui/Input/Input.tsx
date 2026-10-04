import type { InputProps } from './Input.types';
import styles from './Input.module.css';

/**
 * A 52px text, phone or date field. Its border strengthens on hover and once filled, and takes
 * the error colour while invalid (#51's rule for `Select`). `FormField` names and describes it.
 */
export function Input({ type = 'text', invalid = false, className, ref, ...rest }: InputProps) {
  const filled = rest.value !== undefined && String(rest.value) !== '';
  const classes = [styles.input, filled && styles.filled, className].filter(Boolean).join(' ');
  return <input ref={ref} type={type} aria-invalid={invalid || undefined} className={classes} {...rest} />;
}

import type { FieldErrorProps } from './FieldError.types';
import styles from './FieldError.module.css';

/**
 * A field's error: the round "!" badge and the message, never colour alone (DESIGN.md §2). Plain
 * text, not an alert: focus moves to the field, which reads it through `aria-describedby`.
 */
export function FieldError({ id, message }: FieldErrorProps) {
  return (
    <p id={id} className={styles.error}>
      <span className={styles.badge} aria-hidden="true">
        !
      </span>
      {message}
    </p>
  );
}

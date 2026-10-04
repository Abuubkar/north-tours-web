import { FieldError } from '../FieldError/FieldError';
import type { FormFieldProps } from './FormField.types';
import styles from './FormField.module.css';

/**
 * A form field: its label (the step title role) and hint on one line, the control, and its
 * error. The control is named by the label and described by the hint and the error, and is
 * `aria-invalid` while wrong. A group (a <fieldset>) is named by its legend; the hint and error
 * describe the group, and its controls point to the error themselves.
 */
export function FormField({ id, label, hint, error, kind = 'field', errorAt = 'end', className, children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const control = children({ id, describedBy, errorId, invalid: Boolean(error) });
  const message = errorId && error ? <FieldError id={errorId} message={error} /> : null;
  const body = (
    <>
      {errorAt === 'start' && message}
      {control}
      {errorAt === 'end' && message}
    </>
  );

  if (kind === 'group') {
    return (
      <fieldset id={id} aria-describedby={describedBy} className={`${styles.field} ${styles.group} ${className ?? ''}`} data-form-field>
        {/* The hint sits beside the legend but isn't part of the group's name; it describes it instead. */}
        <legend className={styles.legend}>
          <span className={styles.label}>{label}</span>
          {hint && (
            <span id={hintId} className={styles.hint} aria-hidden="true">
              {hint}
            </span>
          )}
        </legend>
        <div className={styles.body}>{body}</div>
      </fieldset>
    );
  }

  return (
    <div className={`${styles.field} ${className ?? ''}`} data-form-field>
      <div className={styles.head}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        {hint && (
          <span id={hintId} className={styles.hint}>
            {hint}
          </span>
        )}
      </div>
      {body}
    </div>
  );
}

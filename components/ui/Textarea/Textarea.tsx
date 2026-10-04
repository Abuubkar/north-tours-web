import type { TextareaProps } from './Textarea.types';
import styles from './Textarea.module.css';

/** A multi-line field with `Input`'s borders and states, at least 128px tall and resized vertically. */
export function Textarea({ invalid = false, className, ...rest }: TextareaProps) {
  const filled = rest.value !== undefined && String(rest.value) !== '';
  const classes = [styles.textarea, filled && styles.filled, className].filter(Boolean).join(' ');
  return <textarea aria-invalid={invalid || undefined} className={classes} {...rest} />;
}

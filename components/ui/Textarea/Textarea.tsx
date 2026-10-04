import type { TextareaProps } from './Textarea.types';
import styles from './Textarea.module.css';

/**
 * A multi-line field with `Input`'s border, hover and focus, at least 128px tall and resized
 * vertically. Only the optional "Anything else?" uses it, so it has no error state yet.
 */
export function Textarea({ className, ...rest }: TextareaProps) {
  const filled = rest.value !== undefined && String(rest.value) !== '';
  const classes = [styles.textarea, filled && styles.filled, className].filter(Boolean).join(' ');
  return <textarea className={classes} {...rest} />;
}

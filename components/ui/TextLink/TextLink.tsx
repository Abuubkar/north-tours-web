import { Icon } from '../Icon/Icon';
import type { TextLinkProps } from './TextLink.types';
import styles from './TextLink.module.css';

const ARROW_SIZE = 16;

/**
 * An underlined link with an arrow, e.g. "Meet the team →". The arrow nudges right on hover.
 * A back link, "← All tours", has its arrow first and no underline. The button form is an action
 * with the underlined look and no arrow, e.g. "Clear all". The inline form sits in a sentence and
 * takes its size (docs/components.md §1.2 item 3).
 */
export function TextLink(props: TextLinkProps) {
  const { children } = props;
  if (props.variant === 'button') {
    return (
      <button type="button" aria-label={props.label} className={styles.textButton} onClick={props.onClick}>
        {children}
      </button>
    );
  }

  const { href, variant = 'arrow' } = props;
  if (variant === 'inline') {
    return (
      <a href={href} className={styles.inline}>
        {children}
      </a>
    );
  }

  if (variant === 'back') {
    return (
      <a href={href} className={styles.backLink}>
        <Icon name="arrowLeft" size={ARROW_SIZE} className={styles.arrow} />
        {children}
      </a>
    );
  }

  return (
    <a href={href} className={styles.textLink}>
      {children}
      <Icon name="arrowRight" size={ARROW_SIZE} className={styles.arrow} />
    </a>
  );
}

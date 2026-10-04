import { Icon } from '../Icon/Icon';
import type { TextLinkProps } from './TextLink.types';
import styles from './TextLink.module.css';

const ARROW_SIZE = 16;

/**
 * An underlined link with an arrow, e.g. "Meet the team →". The arrow nudges right on hover.
 * A back link, "← All tours", has its arrow first and no underline.
 */
export function TextLink({ href, children, variant = 'arrow' }: TextLinkProps) {
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

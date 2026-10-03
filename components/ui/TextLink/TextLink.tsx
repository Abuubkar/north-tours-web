import { Icon } from '../Icon/Icon';
import type { TextLinkProps } from './TextLink.types';
import styles from './TextLink.module.css';

const ARROW_SIZE = 16;

/** An underlined link with an arrow, e.g. "Meet the team →". The arrow nudges right on hover. */
export function TextLink({ href, children }: TextLinkProps) {
  return (
    <a href={href} className={styles.textLink}>
      {children}
      <Icon name="arrowRight" size={ARROW_SIZE} className={styles.arrow} />
    </a>
  );
}

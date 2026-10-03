import { Icon } from '../Icon/Icon';
import type { AccordionProps } from './Accordion.types';
import styles from './Accordion.module.css';

const ICON_SIZE = 20;

/**
 * Built on <details>: the browser handles opening, keyboard and the one-open-at-a-time group
 * (shared name), and content opens without JavaScript.
 */
export function Accordion({ items, marker = 'plus', name }: AccordionProps) {
  return (
    <div className={styles.accordion}>
      {items.map((item) => (
        <details key={item.id} id={item.id} name={name} open={item.defaultOpen} className={styles.item}>
          <summary className={styles.summary}>
            <span className={styles.question}>{item.summary}</span>
            <span className={`${styles.marker} ${styles[marker]}`} aria-hidden="true">
              <Icon name={marker === 'plus' ? 'plus' : 'caret'} size={ICON_SIZE} className={styles.glyph} />
            </span>
          </summary>
          <div className={styles.panel}>{item.content}</div>
        </details>
      ))}
    </div>
  );
}

import { Icon } from '../Icon/Icon';
import type { AccordionProps } from './Accordion.types';
import styles from './Accordion.module.css';

const ICON_SIZE = 20;

/**
 * Built on <details>: the browser handles opening, keyboard and the one-open-at-a-time group
 * (shared name), and content opens without JavaScript.
 */
export function Accordion({ items, marker = 'plus', name, size = 'default' }: AccordionProps) {
  const compact = size === 'compact';
  return (
    <div className={compact ? undefined : styles.accordion}>
      {items.map((item) => (
        <details key={item.id} name={name} open={item.defaultOpen} className={compact ? styles.compactItem : styles.item}>
          <summary className={compact ? styles.compactSummary : styles.summary}>
            <span className={compact ? styles.compactText : styles.summaryText}>{item.summary}</span>
            <span className={`${styles.marker} ${styles[marker]}`} aria-hidden="true">
              <Icon name={marker} size={ICON_SIZE} className={styles.glyph} />
            </span>
          </summary>
          <div className={compact ? undefined : styles.content}>{item.content}</div>
        </details>
      ))}
    </div>
  );
}

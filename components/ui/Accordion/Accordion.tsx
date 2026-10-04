import { Icon } from '../Icon/Icon';
import type { AccordionProps } from './Accordion.types';
import styles from './Accordion.module.css';

const ICON_SIZE = 20;

/** Each size's classes: the list, an item, its summary, the summary's text, the marker and the content. */
const sizes = {
  default: { list: styles.accordion, item: styles.item, summary: styles.summary, text: styles.summaryText, marker: styles.marker, content: styles.content },
  compact: { list: undefined, item: styles.compactItem, summary: styles.compactSummary, text: styles.compactText, marker: styles.marker, content: undefined },
  link: { list: undefined, item: styles.linkItem, summary: styles.linkSummary, text: styles.linkText, marker: styles.linkMarker, content: styles.linkContent },
};

/**
 * Built on <details>: the browser handles opening, keyboard and the one-open-at-a-time group
 * (shared name), and content opens without JavaScript.
 */
export function Accordion({ items, marker = 'plus', name, size = 'default', onToggle }: AccordionProps) {
  const look = sizes[size];
  return (
    <div className={look.list}>
      {items.map((item) => (
        <details
          key={item.id}
          id={item.anchor}
          name={name}
          open={item.open ?? item.defaultOpen}
          onToggle={onToggle && ((event) => onToggle(item.id, event.currentTarget.open))}
          className={look.item}
        >
          <summary className={look.summary}>
            {item.openSummary ? (
              <>
                <span className={`${look.text} ${styles.whenClosed}`}>{item.summary}</span>
                <span className={`${look.text} ${styles.whenOpen}`}>{item.openSummary}</span>
              </>
            ) : (
              <span className={look.text}>{item.summary}</span>
            )}
            <span className={`${look.marker} ${styles[marker]}`} aria-hidden="true">
              <Icon name={marker} size={ICON_SIZE} className={styles.glyph} />
            </span>
          </summary>
          <div className={look.content}>{item.content}</div>
        </details>
      ))}
    </div>
  );
}

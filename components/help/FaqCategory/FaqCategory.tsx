import type { MouseEvent } from 'react';
import { Accordion } from '@/components/ui/Accordion/Accordion';
import { helpCategoryAnchor, routes } from '@/lib/routes';
import { fillTokens } from '@/lib/utils/tokens';
import type { FaqCategoryProps } from './FaqCategory.types';
import styles from './FaqCategory.module.css';

/** A plain click (or Enter): not one that opens the link in a new tab or window. */
const plainClick = (event: MouseEvent) => event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

/**
 * One of Help's categories: its name as an <h2> (the category list's links land on it), then its
 * questions, none open at first. Each answer carries its anchor and ends with a link to itself,
 * which keeps it open and puts the link in the address bar without a page jump or a history
 * entry (a new tab or window opens as usual).
 */
export function FaqCategory({ id, title, questions, linkLabel, group, openIds, onToggle, onAnswerLink }: FaqCategoryProps) {
  return (
    <div className={styles.category}>
      <h2 id={helpCategoryAnchor(id)} className={styles.title}>
        {title}
      </h2>
      <Accordion
        name={group}
        onToggle={onToggle}
        items={questions.map((faq) => {
          const path = routes.helpAnswer(faq.id);
          return {
            id: faq.id,
            anchor: faq.id,
            open: openIds.has(faq.id),
            summary: faq.question,
            content: (
              <div className={styles.answer}>
                <p>{faq.answer}</p>
                <a
                  href={path}
                  className={styles.link}
                  onClick={(event) => {
                    if (!plainClick(event)) return;
                    event.preventDefault();
                    onAnswerLink(faq.id);
                  }}
                >
                  {fillTokens(linkLabel, { path })}
                </a>
              </div>
            ),
          };
        })}
      />
    </div>
  );
}

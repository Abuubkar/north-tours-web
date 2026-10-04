import { Accordion } from '@/components/ui/Accordion/Accordion';
import { helpCategoryAnchor, routes } from '@/lib/routes';
import { isPlainClick } from '@/lib/utils/clicks';
import { fillTokens } from '@/lib/utils/tokens';
import { MarkedText } from '../MarkedText/MarkedText';
import type { FaqCategoryProps } from './FaqCategory.types';
import styles from './FaqCategory.module.css';

/**
 * One of Help's categories: its name as an <h2> (the category list's links land on it), then its
 * questions, none open at first; during a search, the matching ones with the words marked. Each
 * answer carries its anchor and ends with a link to itself, which keeps it open and puts the link
 * in the address bar without a page jump or a history entry (a new tab or window opens as usual).
 */
export function FaqCategory({ id, title, questions, linkLabel, group, terms, openIds, onToggle, onAnswerLink }: FaqCategoryProps) {
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
            summary: <MarkedText text={faq.question} terms={terms} />,
            content: (
              <div className={styles.answer}>
                <p>
                  <MarkedText text={faq.answer} terms={terms} />
                </p>
                <a
                  href={path}
                  className={styles.link}
                  onClick={(event) => {
                    if (!isPlainClick(event)) return;
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

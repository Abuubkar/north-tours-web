import { Accordion } from '@/components/ui/Accordion/Accordion';
import { helpCategoryAnchor, routes } from '@/lib/routes';
import { fillTokens } from '@/lib/utils/tokens';
import type { FaqCategoryProps } from './FaqCategory.types';
import styles from './FaqCategory.module.css';

/**
 * One of Help's categories: its name as an <h2> (the category list's links land on it), then its
 * questions, none open. Each answer carries its anchor and ends with a link to itself.
 */
export function FaqCategory({ id, title, questions, linkLabel, group }: FaqCategoryProps) {
  return (
    <div className={styles.category}>
      <h2 id={helpCategoryAnchor(id)} className={styles.title}>
        {title}
      </h2>
      <Accordion
        name={group}
        items={questions.map((faq) => {
          const path = routes.helpAnswer(faq.id);
          return {
            id: faq.id,
            anchor: faq.id,
            summary: faq.question,
            content: (
              <div className={styles.answer}>
                <p>{faq.answer}</p>
                <a href={path} className={styles.link}>
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
